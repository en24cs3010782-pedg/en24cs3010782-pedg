const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema(
  {
    roomNumber: {
      type: String,
      required: [true, 'Please provide room number'],
      unique: true,
      trim: true,
    },
    title: {
      type: String,
      required: [true, 'Please provide room title/name'],
      trim: true,
    },
    type: {
      type: String,
      required: [true, 'Please provide room type'],
      enum: ['Single', 'Double', 'Suite', 'Deluxe', 'Family'],
      default: 'Deluxe',
    },
    pricePerNight: {
      type: Number,
      required: [true, 'Please provide price per night'],
      min: [0, 'Price must be positive'],
    },
    capacity: {
      type: Number,
      required: [true, 'Please provide guest capacity'],
      min: [1, 'Capacity must be at least 1'],
      default: 2,
    },
    bedType: {
      type: String,
      enum: ['Single', 'Twin', 'Queen', 'King'],
      default: 'King',
    },
    amenities: {
      type: [String],
      default: ['Free Wi-Fi', 'Air Conditioning', 'Flat-screen TV', 'Room Service'],
    },
    images: {
      type: [String],
      default: [
        'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80',
      ],
    },
    description: {
      type: String,
      required: [true, 'Please add description for room'],
    },
    status: {
      type: String,
      enum: ['Available', 'Booked', 'Maintenance'],
      default: 'Available',
    },
    featured: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Room', roomSchema);
