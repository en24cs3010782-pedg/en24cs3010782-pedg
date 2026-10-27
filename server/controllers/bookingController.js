const Booking = require('../models/Booking');
const Room = require('../models/Room');

// Helper to calculate days between dates
const calculateNights = (checkIn, checkOut) => {
  const inDate = new Date(checkIn);
  const outDate = new Date(checkOut);
  const diffTime = Math.abs(outDate - inDate);
  const nights = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return nights > 0 ? nights : 1;
};

// @desc    Create a new booking
// @route   POST /api/bookings
// @access  Private (Guest/Staff/Admin)
const createBooking = async (req, res, next) => {
  try {
    const {
      roomId,
      checkInDate,
      checkOutDate,
      guestsCount,
      specialRequests,
      paymentMethod,
      guestName,
      guestEmail,
      guestPhone,
    } = req.body;

    if (!roomId || !checkInDate || !checkOutDate) {
      return res.status(400).json({
        success: false,
        message: 'Please provide roomId, checkInDate, and checkOutDate',
      });
    }

    const checkIn = new Date(checkInDate);
    const checkOut = new Date(checkOutDate);

    if (checkOut <= checkIn) {
      return res.status(400).json({
        success: false,
        message: 'Check-out date must be after check-in date.',
      });
    }

    const room = await Room.findById(roomId);
    if (!room) {
      return res.status(404).json({ success: false, message: 'Room not found.' });
    }

    if (room.status === 'Maintenance') {
      return res.status(400).json({
        success: false,
        message: 'This room is currently under maintenance and cannot be booked.',
      });
    }

    // Check capacity
    const numGuests = Number(guestsCount) || 1;
    if (numGuests > room.capacity) {
      return res.status(400).json({
        success: false,
        message: `This room accommodates up to ${room.capacity} guests only.`,
      });
    }

    // Collision check: verify no overlapping active bookings
    const overlapping = await Booking.findOne({
      room: roomId,
      status: { $in: ['Pending', 'Confirmed', 'CheckedIn'] },
      $or: [
        {
          checkInDate: { $lt: checkOut },
          checkOutDate: { $gt: checkIn },
        },
      ],
    });

    if (overlapping) {
      return res.status(400).json({
        success: false,
        message: 'Sorry, this room is already booked for the selected dates.',
      });
    }

    const totalNights = calculateNights(checkIn, checkOut);
    const totalPrice = totalNights * room.pricePerNight;

    const booking = await Booking.create({
      user: req.user._id,
      room: roomId,
      checkInDate: checkIn,
      checkOutDate: checkOut,
      guestsCount: numGuests,
      totalNights,
      totalPrice,
      specialRequests: specialRequests || '',
      paymentMethod: paymentMethod || 'Credit Card',
      paymentStatus: 'Paid',
      status: 'Confirmed',
      guestDetails: {
        name: guestName || req.user.name,
        email: guestEmail || req.user.email,
        phone: guestPhone || req.user.phone || '',
      },
    });

    const populatedBooking = await Booking.findById(booking._id).populate('room');

    res.status(201).json({
      success: true,
      message: 'Booking successfully confirmed!',
      data: populatedBooking,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get bookings of logged in user
// @route   GET /api/bookings/my-bookings
// @access  Private
const getMyBookings = async (req, res, next) => {
  try {
    const bookings = await Booking.find({ user: req.user._id })
      .populate('room')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: bookings.length,
      data: bookings,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all bookings (Admin/Staff)
// @route   GET /api/bookings
// @access  Private (Admin, Staff)
const getAllBookings = async (req, res, next) => {
  try {
    const { status, search } = req.query;
    let query = {};

    if (status && status !== 'All') {
      query.status = status;
    }

    if (search) {
      query.$or = [
        { 'guestDetails.name': { $regex: search, $options: 'i' } },
        { 'guestDetails.email': { $regex: search, $options: 'i' } },
      ];
    }

    const bookings = await Booking.find(query)
      .populate('room')
      .populate('user', 'name email')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: bookings.length,
      data: bookings,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single booking by ID
// @route   GET /api/bookings/:id
// @access  Private
const getBookingById = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('room')
      .populate('user', 'name email');

    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    // Ensure only the booker or staff/admin can access
    if (
      booking.user._id.toString() !== req.user._id.toString() &&
      !['admin', 'staff'].includes(req.user.role)
    ) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this booking.',
      });
    }

    res.status(200).json({ success: true, data: booking });
  } catch (error) {
    next(error);
  }
};

// @desc    Update booking status (Check-in, Check-out, etc.)
// @route   PUT /api/bookings/:id/status
// @access  Private (Admin, Staff)
const updateBookingStatus = async (req, res, next) => {
  try {
    const { status, paymentStatus } = req.body;
    let booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    if (status) booking.status = status;
    if (paymentStatus) booking.paymentStatus = paymentStatus;

    await booking.save();

    const updated = await Booking.findById(booking._id).populate('room');
    res.status(200).json({
      success: true,
      message: `Booking status updated to ${booking.status}`,
      data: updated,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Cancel a booking
// @route   PUT /api/bookings/:id/cancel
// @access  Private
const cancelBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    // Verify ownership or staff role
    if (
      booking.user.toString() !== req.user._id.toString() &&
      !['admin', 'staff'].includes(req.user.role)
    ) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to cancel this booking.',
      });
    }

    if (booking.status === 'CheckedIn' || booking.status === 'CheckedOut') {
      return res.status(400).json({
        success: false,
        message: `Cannot cancel a booking that is currently ${booking.status}.`,
      });
    }

    booking.status = 'Cancelled';
    booking.paymentStatus = 'Refunded';
    await booking.save();

    res.status(200).json({
      success: true,
      message: 'Booking cancelled and refund initiated.',
      data: booking,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createBooking,
  getMyBookings,
  getAllBookings,
  getBookingById,
  updateBookingStatus,
  cancelBooking,
};
