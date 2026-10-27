# 🏨 HotelPro - Complete Hotel Booking & Management Solution

A full-stack, enterprise-grade hotel reservation and operations management system developed with the **MERN Stack** (MongoDB, Express.js, React.js, Node.js), styled with **Bootstrap 5**, and secured using **JSON Web Tokens (JWT)**.

---

## 📑 Project Structure (6 Epics & 19 Tasks)

```
hotelpro/
├── client/                     # React Frontend Application
│   ├── public/
│   │   └── index.html          # HTML5 Template with Bootstrap & Icons
│   ├── src/
│   │   ├── components/         # Reusable UI Components
│   │   │   ├── Navbar.js       # Navigation bar with role badges & dropdown
│   │   │   ├── Footer.js       # Information & quick links footer
│   │   │   ├── RoomCard.js     # Responsive room presentation card
│   │   │   └── ProtectedRoute.js # RBAC Route Guard
│   │   ├── context/
│   │   │   └── AuthContext.js  # JWT Auth State & Session Management
│   │   ├── pages/
│   │   │   ├── Home.js         # Landing page with instant availability search
│   │   │   ├── Rooms.js        # Catalog with search, filters, and price slider
│   │   │   ├── RoomDetail.js   # Room specs & live nights/pricing calculator
│   │   │   ├── Login.js        # Auth login with 1-Click quick fill demo logins
│   │   │   ├── Register.js     # Account creation (Guest / Staff)
│   │   │   ├── UserDashboard.js# Guest reservation management & cancellation
│   │   │   └── AdminDashboard.js# Ops management (CRUD rooms & bookings)
│   │   ├── services/
│   │   │   └── api.js          # Axios client with auto Bearer token interceptor
│   │   ├── App.js              # Client routes
│   │   └── index.js
│   └── package.json
│
├── server/                     # Express.js REST API Backend
│   ├── config/
│   │   └── db.js               # MongoDB Mongoose connection
│   ├── controllers/
│   │   ├── authController.js   # User registration, login & profile
│   │   ├── roomController.js   # Room CRUD, date conflict filters, search
│   │   ├── bookingController.js# Double-booking guard, reservations & refunds
│   │   └── statsController.js  # Operations analytics & KPI aggregator
│   ├── middleware/
│   │   ├── authMiddleware.js   # JWT validation & Role-Based Access Control
│   │   └── errorMiddleware.js  # Mongoose & Express error handlers
│   ├── models/
│   │   ├── User.js             # User Schema (Guest, Staff, Admin) + bcrypt
│   │   ├── Room.js             # Room Schema (Types, amenities, pricing)
│   │   └── Booking.js          # Booking Schema (Dates, nights, status)
│   ├── routes/
│   │   ├── authRoutes.js       # /api/auth endpoints
│   │   ├── roomRoutes.js       # /api/rooms endpoints
│   │   ├── bookingRoutes.js    # /api/bookings endpoints
│   │   └── statsRoutes.js      # /api/stats endpoints
│   ├── .env                    # Environment config (PORT, MONGO_URI, JWT)
│   ├── seeder.js               # Database seeding script (Rooms & accounts)
│   ├── server.js               # Main entry point & middleware mounting
│   └── package.json
│
├── package.json                # Root package for coordinated execution
└── README.md
```

---

## ⚡ Epic 1: Project Architecture

### 1. Technical Architecture
The application adheres to a decoupled 3-tier client-server architecture:
- **Client Tier**: React.js SPA managing state, dynamic routing (`react-router-dom`), and interactive UI components styled using Bootstrap 5.
- **Application Tier**: Node.js & Express.js RESTful web service handling business logic, authentication token generation/verification, request validation, and query dispatch.
- **Database Tier**: MongoDB document database modeled through Mongoose schemas ensuring data integrity, indexing, and referential checks.

### 2. ER Diagram
- `User` (1) ──── (M) `Booking`
- `Room` (1) ──── (M) `Booking`

### 3. Roles and Responsibilities
- **Guest / Customer**: Browse rooms, check date availability, make instant bookings, review booking history, cancel bookings.
- **Staff (Front Desk)**: Manage daily check-ins and check-outs, update reservation statuses, inspect room maintenance.
- **Admin (Hotel Manager)**: Full inventory CRUD (add new rooms, modify prices, remove rooms), view business KPIs and gross revenue.

### 4. MVC Pattern Implementation
- **Model**: `User.js`, `Room.js`, `Booking.js` encapsulate data structure, validation rules, and schema methods.
- **View**: Modern React components rendering clean interfaces for guests and management.
- **Controller**: `authController.js`, `roomController.js`, `bookingController.js`, `statsController.js` isolate request processing from database queries.

---

## 🛠️ Epic 2: Project Setup and Configuration

### Requirements
- **Node.js**: v18 or above
- **MongoDB**: Local Community Server running at `mongodb://127.0.0.1:27017` or MongoDB Atlas cloud URI
- **npm**: v8 or above

### Installation Commands

1. **Install Server Dependencies**:
   ```bash
   cd server
   npm install
   ```

2. **Install Client Dependencies**:
   ```bash
   cd ../client
   npm install
   ```

---

## 🗄️ Epic 4: Database Development & Seeding

1. Configure your MongoDB connection string in [server/.env](file:///c:/Users/HP/Downloads/skill%20wallet%20prokect%20of%20hotel%20management/server/.env):
   ```env
   PORT=5000
   MONGO_URI=mongodb://127.0.0.1:27017/hotelpro
   JWT_SECRET=hotelpro_super_secret_jwt_key_2026_xyz
   ```

2. Seed the database with sample rooms, default users, and sample bookings:
   ```bash
   cd server
   npm run seed
   ```

### Pre-configured Login Accounts
| Role | Email | Password |
|---|---|---|
| **Admin** | `admin@hotelpro.com` | `password123` |
| **Staff** | `staff@hotelpro.com` | `password123` |
| **Guest** | `guest@hotelpro.com` | `password123` |

*(Note: The login page includes 1-Click quick fill buttons for instant evaluation!)*

---

## 🚀 Epic 6: Project Execution

### Step 1: Start the Backend Server
```bash
cd server
npm run dev
# Server starts on http://localhost:5000
```

### Step 2: Start the React Frontend
In a new terminal window:
```bash
cd client
npm start
# Client opens in browser at http://localhost:3000
```

---

## 📡 REST API Endpoints Overview

### Authentication (`/api/auth`)
- `POST /api/auth/register` - Create new user account
- `POST /api/auth/login` - Authenticate user & retrieve JWT token
- `GET /api/auth/profile` - Get logged-in user profile

### Rooms (`/api/rooms`)
- `GET /api/rooms` - Query rooms with filters (type, capacity, dates, price)
- `GET /api/rooms/:id` - Fetch detailed specifications of a room
- `POST /api/rooms` - Add room *(Admin & Staff)*
- `PUT /api/rooms/:id` - Update room details *(Admin & Staff)*
- `DELETE /api/rooms/:id` - Delete room *(Admin only)*

### Bookings (`/api/bookings`)
- `POST /api/bookings` - Create reservation with overlap date checking
- `GET /api/bookings/my-bookings` - Fetch current user's reservations
- `GET /api/bookings` - Fetch all hotel bookings *(Staff & Admin)*
- `PUT /api/bookings/:id/status` - Update check-in / check-out status *(Staff & Admin)*
- `PUT /api/bookings/:id/cancel` - Cancel reservation & issue refund *(Guest / Staff)*

### Analytics (`/api/stats`)
- `GET /api/stats/dashboard` - Get total rooms, available rooms, total revenue & active bookings *(Staff & Admin)*
