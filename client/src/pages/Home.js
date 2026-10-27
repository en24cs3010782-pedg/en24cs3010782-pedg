import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import RoomCard from '../components/RoomCard';

const Home = () => {
  const navigate = useNavigate();
  const [featuredRooms, setFeaturedRooms] = useState([]);
  const [loading, setLoading] = useState(true);

  // Search Bar States
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [roomType, setRoomType] = useState('All');
  const [guests, setGuests] = useState('1');

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const res = await api.get('/rooms?featured=true');
        if (res.data.success) {
          setFeaturedRooms(res.data.data.slice(0, 3));
        }
      } catch (err) {
        console.error('Failed to load featured rooms:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchFeatured();
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (checkIn) params.append('checkInDate', checkIn);
    if (checkOut) params.append('checkOutDate', checkOut);
    if (roomType !== 'All') params.append('type', roomType);
    if (guests) params.append('capacity', guests);
    navigate(`/rooms?${params.toString()}`);
  };

  return (
    <div>
      {/* Hero Section */}
      <section className="hero-section text-center">
        <div className="container py-4">
          <span className="badge bg-warning text-dark px-3 py-2 rounded-pill fw-bold mb-3 shadow-sm">
            ✨ Premium Luxury & Smart Hospitality
          </span>
          <h1 className="display-4 fw-extrabold mb-3">
            Effortless Hotel Booking & Management
          </h1>
          <p className="lead text-light opacity-90 mx-auto" style={{ maxWidth: '720px' }}>
            Experience world-class hospitality with real-time room availability, instant reservations, transparent pricing, and comprehensive guest management.
          </p>
        </div>
      </section>

      {/* Floating Search Bar */}
      <div className="container">
        <div className="search-box-card">
          <form onSubmit={handleSearchSubmit} className="row g-3 align-items-end">
            <div className="col-lg-3 col-md-6">
              <label className="form-label fw-semibold small text-muted">
                <i className="bi bi-calendar-event me-1 text-primary"></i> Check-in Date
              </label>
              <input
                type="date"
                className="form-control form-control-lg fs-6"
                value={checkIn}
                onChange={(e) => setCheckIn(e.target.value)}
              />
            </div>

            <div className="col-lg-3 col-md-6">
              <label className="form-label fw-semibold small text-muted">
                <i className="bi bi-calendar-check me-1 text-primary"></i> Check-out Date
              </label>
              <input
                type="date"
                className="form-control form-control-lg fs-6"
                value={checkOut}
                onChange={(e) => setCheckOut(e.target.value)}
              />
            </div>

            <div className="col-lg-2 col-md-4">
              <label className="form-label fw-semibold small text-muted">
                <i className="bi bi-door-open me-1 text-primary"></i> Room Type
              </label>
              <select
                className="form-select form-select-lg fs-6"
                value={roomType}
                onChange={(e) => setRoomType(e.target.value)}
              >
                <option value="All">All Types</option>
                <option value="Single">Single Room</option>
                <option value="Double">Double Room</option>
                <option value="Suite">Suite</option>
                <option value="Deluxe">Deluxe Room</option>
                <option value="Family">Family Room</option>
              </select>
            </div>

            <div className="col-lg-2 col-md-4">
              <label className="form-label fw-semibold small text-muted">
                <i className="bi bi-people me-1 text-primary"></i> Guests
              </label>
              <select
                className="form-select form-select-lg fs-6"
                value={guests}
                onChange={(e) => setGuests(e.target.value)}
              >
                <option value="1">1 Guest</option>
                <option value="2">2 Guests</option>
                <option value="3">3 Guests</option>
                <option value="4">4+ Guests</option>
              </select>
            </div>

            <div className="col-lg-2 col-md-4">
              <button
                type="submit"
                className="btn btn-primary-hotel btn-lg w-100 d-flex justify-content-center align-items-center gap-2"
              >
                <i className="bi bi-search"></i>
                <span>Search</span>
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Highlights / Features */}
      <section className="container mt-5 pt-4">
        <div className="row g-4 text-center">
          <div className="col-md-3">
            <div className="p-4 bg-white rounded-3 shadow-sm h-100 border">
              <div className="fs-1 text-primary mb-2">
                <i className="bi bi-lightning-charge-fill"></i>
              </div>
              <h5 className="fw-bold">Instant Confirmation</h5>
              <p className="text-muted small mb-0">
                Direct automated reservation with conflict-free scheduling and real-time database locks.
              </p>
            </div>
          </div>

          <div className="col-md-3">
            <div className="p-4 bg-white rounded-3 shadow-sm h-100 border">
              <div className="fs-1 text-primary mb-2">
                <i className="bi bi-shield-check"></i>
              </div>
              <h5 className="fw-bold">Secure Authentication</h5>
              <p className="text-muted small mb-0">
                JWT encrypted authorization with dedicated roles for Guests, Staff, and Administrators.
              </p>
            </div>
          </div>

          <div className="col-md-3">
            <div className="p-4 bg-white rounded-3 shadow-sm h-100 border">
              <div className="fs-1 text-primary mb-2">
                <i className="bi bi-tags-fill"></i>
              </div>
              <h5 className="fw-bold">Best Price Guarantee</h5>
              <p className="text-muted small mb-0">
                Transparent night-based billing with no hidden fees or surprise surcharges.
              </p>
            </div>
          </div>

          <div className="col-md-3">
            <div className="p-4 bg-white rounded-3 shadow-sm h-100 border">
              <div className="fs-1 text-primary mb-2">
                <i className="bi bi-headset"></i>
              </div>
              <h5 className="fw-bold">24/7 Frontdesk Portal</h5>
              <p className="text-muted small mb-0">
                Reception staff can easily manage check-ins, check-outs, and maintenance status.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Rooms */}
      <section className="container mt-5 pt-4">
        <div className="d-flex justify-content-between align-items-end mb-4">
          <div>
            <span className="text-primary fw-bold text-uppercase small tracking-wide">
              Handpicked Accommodations
            </span>
            <h2 className="fw-bold text-dark mb-0">Featured Rooms & Suites</h2>
          </div>
          <button
            onClick={() => navigate('/rooms')}
            className="btn btn-outline-primary rounded-pill px-4"
          >
            View All Rooms <i className="bi bi-arrow-right ms-1"></i>
          </button>
        </div>

        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status"></div>
          </div>
        ) : (
          <div className="row g-4">
            {featuredRooms.map((room) => (
              <div className="col-lg-4 col-md-6" key={room._id}>
                <RoomCard room={room} />
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default Home;
