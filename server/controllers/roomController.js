const Room = require('../models/Room');
const Booking = require('../models/Booking');

// @desc    Get all rooms with filtering, search, sorting & availability checking
// @route   GET /api/rooms
// @access  Public
const getRooms = async (req, res, next) => {
  try {
    const {
      search,
      type,
      capacity,
      minPrice,
      maxPrice,
      checkInDate,
      checkOutDate,
      sortBy,
      featured,
    } = req.query;

    let query = {};

    // Keyword search
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { roomNumber: { $regex: search, $options: 'i' } },
      ];
    }

    // Filter by type
    if (type && type !== 'All') {
      query.type = type;
    }

    // Filter by capacity
    if (capacity) {
      query.capacity = { $gte: Number(capacity) };
    }

    // Filter by price range
    if (minPrice || maxPrice) {
      query.pricePerNight = {};
      if (minPrice) query.pricePerNight.$gte = Number(minPrice);
      if (maxPrice) query.pricePerNight.$lte = Number(maxPrice);
    }

    // Featured rooms filter
    if (featured === 'true') {
      query.featured = true;
    }

    // Check date availability: exclude rooms that have overlapping active bookings
    if (checkInDate && checkOutDate) {
      const checkIn = new Date(checkInDate);
      const checkOut = new Date(checkOutDate);

      const conflictingBookings = await Booking.find({
        status: { $in: ['Pending', 'Confirmed', 'CheckedIn'] },
        $or: [
          { checkInDate: { $lt: checkOut }, checkOutDate: { $gt: checkIn } },
        ],
      }).select('room');

      const bookedRoomIds = conflictingBookings.map((b) => b.room);
      query._id = { $nin: bookedRoomIds };
      query.status = { $ne: 'Maintenance' };
    }

    // Sorting
    let sortOptions = { createdAt: -1 };
    if (sortBy === 'price_asc') sortOptions = { pricePerNight: 1 };
    if (sortBy === 'price_desc') sortOptions = { pricePerNight: -1 };
    if (sortBy === 'capacity') sortOptions = { capacity: -1 };

    const rooms = await Room.find(query).sort(sortOptions);

    res.status(200).json({
      success: true,
      count: rooms.length,
      data: rooms,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single room by ID
// @route   GET /api/rooms/:id
// @access  Public
const getRoomById = async (req, res, next) => {
  try {
    const room = await Room.findById(req.params.id);
    if (!room) {
      return res.status(404).json({ success: false, message: 'Room not found' });
    }
    res.status(200).json({ success: true, data: room });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new room
// @route   POST /api/rooms
// @access  Private (Admin, Staff)
const createRoom = async (req, res, next) => {
  try {
    const existingRoom = await Room.findOne({ roomNumber: req.body.roomNumber });
    if (existingRoom) {
      return res.status(400).json({
        success: false,
        message: `Room number ${req.body.roomNumber} already exists.`,
      });
    }

    const room = await Room.create(req.body);
    res.status(201).json({ success: true, data: room });
  } catch (error) {
    next(error);
  }
};

// @desc    Update room details
// @route   PUT /api/rooms/:id
// @access  Private (Admin, Staff)
const updateRoom = async (req, res, next) => {
  try {
    let room = await Room.findById(req.params.id);
    if (!room) {
      return res.status(404).json({ success: false, message: 'Room not found' });
    }

    // If changing room number, verify no collision
    if (req.body.roomNumber && req.body.roomNumber !== room.roomNumber) {
      const exists = await Room.findOne({ roomNumber: req.body.roomNumber });
      if (exists) {
        return res.status(400).json({
          success: false,
          message: `Room number ${req.body.roomNumber} is already in use.`,
        });
      }
    }

    room = await Room.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({ success: true, data: room });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a room
// @route   DELETE /api/rooms/:id
// @access  Private (Admin)
const deleteRoom = async (req, res, next) => {
  try {
    const room = await Room.findById(req.params.id);
    if (!room) {
      return res.status(404).json({ success: false, message: 'Room not found' });
    }

    // Check if there are active bookings
    const activeBookings = await Booking.countDocuments({
      room: req.params.id,
      status: { $in: ['Pending', 'Confirmed', 'CheckedIn'] },
    });

    if (activeBookings > 0) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete room with active reservations. Cancel or complete bookings first.',
      });
    }

    await Room.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: 'Room successfully deleted' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getRooms,
  getRoomById,
  createRoom,
  updateRoom,
  deleteRoom,
};
