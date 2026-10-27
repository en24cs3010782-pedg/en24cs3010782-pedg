const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Room = require('./models/Room');
const Booking = require('./models/Booking');

dotenv.config();

const sampleUsers = [
  {
    name: 'Admin Manager',
    email: 'admin@hotelpro.com',
    password: 'password123',
    role: 'admin',
    phone: '+1 555-0199',
  },
  {
    name: 'Frontdesk Staff',
    email: 'staff@hotelpro.com',
    password: 'password123',
    role: 'staff',
    phone: '+1 555-0188',
  },
  {
    name: 'John Doe (Guest)',
    email: 'guest@hotelpro.com',
    password: 'password123',
    role: 'guest',
    phone: '+1 555-0144',
  },
];

const sampleRooms = [
  {
    roomNumber: '101',
    title: 'Standard Single Room',
    type: 'Single',
    pricePerNight: 85,
    capacity: 1,
    bedType: 'Single',
    amenities: ['Free Wi-Fi', 'Air Conditioning', 'Flat-screen TV', 'Work Desk'],
    images: [
      'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1000&q=80',
    ],
    description:
      'Cozy, elegant single room equipped with a modern workspace, high-speed Wi-Fi, and plush bedding for solo travelers and business professionals.',
    status: 'Available',
    featured: false,
  },
  {
    roomNumber: '201',
    title: 'Deluxe Queen Room',
    type: 'Double',
    pricePerNight: 145,
    capacity: 2,
    bedType: 'Queen',
    amenities: [
      'Free Wi-Fi',
      'Air Conditioning',
      'Flat-screen TV',
      'Mini Bar',
      'Coffee Maker',
      'Balcony',
    ],
    images: [
      'https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1591088398332-8a7791972843?auto=format&fit=crop&w=1000&q=80',
    ],
    description:
      'Spacious deluxe room featuring a comfortable queen-size bed, private balcony overlooking the city skyline, and premium bathroom amenities.',
    status: 'Available',
    featured: true,
  },
  {
    roomNumber: '301',
    title: 'Executive King Suite',
    type: 'Suite',
    pricePerNight: 260,
    capacity: 3,
    bedType: 'King',
    amenities: [
      'Free Wi-Fi',
      'Air Conditioning',
      'Flat-screen TV',
      'Jacuzzi',
      'Mini Bar',
      'Balcony',
      'Complimentary Breakfast',
      'Room Service',
    ],
    images: [
      'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1590490359683-658d3d23f972?auto=format&fit=crop&w=1000&q=80',
    ],
    description:
      'Luxurious executive suite offering a private living area, jacuzzi tub, stunning panoramic views, and 24/7 dedicated room service.',
    status: 'Available',
    featured: true,
  },
  {
    roomNumber: '401',
    title: 'Presidential Deluxe Penthouse',
    type: 'Deluxe',
    pricePerNight: 420,
    capacity: 4,
    bedType: 'King',
    amenities: [
      'Free Wi-Fi',
      'Air Conditioning',
      'Flat-screen TV',
      'Jacuzzi',
      'Mini Bar',
      'Kitchenette',
      'Private Terrace',
      'Butler Service',
    ],
    images: [
      'https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=1000&q=80',
    ],
    description:
      'The crown jewel of HotelPro. Features a sprawling private terrace, king master bedroom, premium sound system, and top-tier hospitality services.',
    status: 'Available',
    featured: true,
  },
  {
    roomNumber: '105',
    title: 'Family Comfort Suite',
    type: 'Family',
    pricePerNight: 195,
    capacity: 5,
    bedType: 'Double',
    amenities: [
      'Free Wi-Fi',
      'Air Conditioning',
      'Flat-screen TV',
      'Mini Fridge',
      'Children Play Corner',
      'Connecting Rooms',
    ],
    images: [
      'https://images.unsplash.com/photo-1595576508898-0ad5c879a061?auto=format&fit=crop&w=1000&q=80',
    ],
    description:
      'Generously proportioned family suite designed for relaxation with two double beds, entertainment systems, and child-friendly layout.',
    status: 'Available',
    featured: false,
  },
  {
    roomNumber: '206',
    title: 'Classic Double Garden View',
    type: 'Double',
    pricePerNight: 130,
    capacity: 2,
    bedType: 'Twin',
    amenities: ['Free Wi-Fi', 'Air Conditioning', 'Flat-screen TV', 'Garden View', 'Tea Maker'],
    images: [
      'https://images.unsplash.com/photo-1568495248636-6432b97bd949?auto=format&fit=crop&w=1000&q=80',
    ],
    description:
      'A serene getaway featuring twin beds and peaceful views of the landscaped courtyard gardens.',
    status: 'Available',
    featured: false,
  },
];

const seedData = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/hotelpro';
    await mongoose.connect(mongoUri);
    console.log('[Seeder] Connected to MongoDB...');

    // Clear existing collections
    await User.deleteMany();
    await Room.deleteMany();
    await Booking.deleteMany();
    console.log('[Seeder] Cleared existing Users, Rooms, and Bookings.');

    // Create Users (password hashing handled by pre-save hook)
    const createdUsers = [];
    for (const u of sampleUsers) {
      const user = await User.create(u);
      createdUsers.push(user);
    }
    console.log(`[Seeder] Seeded ${createdUsers.length} users (Admin, Staff, Guest).`);

    // Create Rooms
    const createdRooms = await Room.insertMany(sampleRooms);
    console.log(`[Seeder] Seeded ${createdRooms.length} rooms.`);

    // Create a Sample Booking for demo guest
    const guestUser = createdUsers.find((u) => u.role === 'guest');
    const bookedRoom = createdRooms[1]; // Deluxe Queen

    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const checkout = new Date();
    checkout.setDate(checkout.getDate() + 4);

    await Booking.create({
      user: guestUser._id,
      room: bookedRoom._id,
      checkInDate: tomorrow,
      checkOutDate: checkout,
      guestsCount: 2,
      totalNights: 3,
      totalPrice: bookedRoom.pricePerNight * 3,
      specialRequests: 'Quiet room near elevator please.',
      status: 'Confirmed',
      paymentStatus: 'Paid',
      paymentMethod: 'Credit Card',
      guestDetails: {
        name: guestUser.name,
        email: guestUser.email,
        phone: guestUser.phone,
      },
    });
    console.log('[Seeder] Seeded 1 demo booking.');

    console.log('\n=============================================');
    console.log('✅ DATABASE SEEDING COMPLETED SUCCESSFULLY!');
    console.log('=============================================');
    console.log('Demo Credentials:');
    console.log('  Admin : admin@hotelpro.com / password123');
    console.log('  Staff : staff@hotelpro.com / password123');
    console.log('  Guest : guest@hotelpro.com / password123');
    console.log('=============================================\n');

    process.exit(0);
  } catch (error) {
    console.error(`[Seeder Error] ${error.message}`);
    process.exit(1);
  }
};

seedData();
