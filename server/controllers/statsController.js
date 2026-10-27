const Room = require('../models/Room');
const Booking = require('../models/Booking');
const User = require('../models/User');

// @desc    Get Admin Dashboard KPI metrics & statistics
// @route   GET /api/stats/dashboard
// @access  Private (Admin, Staff)
const getDashboardStats = async (req, res, next) => {
  try {
    const totalRooms = await Room.countDocuments();
    const availableRooms = await Room.countDocuments({ status: 'Available' });
    const maintenanceRooms = await Room.countDocuments({ status: 'Maintenance' });

    const totalBookings = await Booking.countDocuments();
    const activeBookings = await Booking.countDocuments({
      status: { $in: ['Confirmed', 'CheckedIn'] },
    });
    const totalGuests = await User.countDocuments({ role: 'guest' });

    // Calculate total revenue from non-cancelled bookings
    const revenueAgg = await Booking.aggregate([
      { $match: { status: { $ne: 'Cancelled' }, paymentStatus: 'Paid' } },
      { $group: { _id: null, totalRevenue: { $sum: '$totalPrice' } } },
    ]);
    const totalRevenue = revenueAgg.length > 0 ? revenueAgg[0].totalRevenue : 0;

    // Recent 5 bookings
    const recentBookings = await Booking.find()
      .populate('room', 'roomNumber title type pricePerNight')
      .populate('user', 'name email')
      .sort({ createdAt: -1 })
      .limit(5);

    // Room count by type
    const roomTypeCounts = await Room.aggregate([
      { $group: { _id: '$type', count: { $sum: 1 } } },
    ]);

    res.status(200).json({
      success: true,
      data: {
        totalRooms,
        availableRooms,
        occupiedRooms: totalRooms - availableRooms - maintenanceRooms,
        maintenanceRooms,
        totalBookings,
        activeBookings,
        totalGuests,
        totalRevenue,
        recentBookings,
        roomTypeCounts,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getDashboardStats };
