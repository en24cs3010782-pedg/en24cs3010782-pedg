import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../services/api';
import RoomCard from '../components/RoomCard';

const Home = () => {
  const navigate = useNavigate();
  const [featuredRooms, setFeaturedRooms] = useState([]);
  const [loading, setLoading] = useState(true);

  // Search parameters
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [type, setType] = useState('All');
  const [capacity, setCapacity] = useState('1');

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const res = await API.get('/rooms');
        if (res.data.success) {
          // Take first 3 for featured display
          setFeaturedRooms(res.data.rooms.slice(0, 3));
        }
      } catch (err) {
        console.error('Failed to load featured rooms:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchRooms();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    const query = new URLSearchParams();
    if (checkIn) query.append('checkIn', checkIn);
    if (checkOut) query.append('checkOut', checkOut);
    if (type !== 'All') query.append('type', type);
    if (capacity) query.append('capacity', capacity);
    navigate(`/rooms?${query.toString()}`);
  };

  return (
    <div>
      {/* Hero Section */}
      <div
        className="position-relative text-white d-flex align-items-center"
        style={{
          minHeight: '75vh',
          backgroundImage: 'linear-gradient(rgba(15, 23, 42, 0.7), rgba(15, 23, 42, 0.85)), url(https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1920&q=80)',
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        <div className="container py-5 text-center">
          <span className="badge bg-warning text-dark px-3 py-2 mb-3 rounded-pill fw-semibold text-uppercase tracking-wider">
            ★ 5-Star Luxury Resort & Sanctuary
          </span>
          <h1 className="display-3 fw-bold mb-3 font-display">
            Experience Unrivaled Comfort & Elegance
          </h1>
          <p className="lead text-white-50 mx-auto mb-5" style={{ maxWidth: 700 }}>
            Immerse yourself in timeless luxury, world-class amenities, and personalized hospitality at HotelPro. Book your dream stay today.
          </p>

          {/* Quick Search Widget */}
          <div className="card shadow-lg p-3 p-md-4 border-0 mx-auto" style={{ maxWidth: 980, borderRadius: 16, backgroundColor: 'rgba(255, 255, 255, 0.95)' }}>
            <form onSubmit={handleSearch} className="row g-3 text-dark text-start align-items-end">
              <div className="col-md-3">
                <label className="form-label small fw-bold text-muted">
                  <i className="bi bi-calendar-event me-1 text-primary"></i> Check-in Date
                </label>
                <input
                  type="date"
                  className="form-control"
                  value={checkIn}
                  onChange={(e) => setCheckIn(e.target.value)}
                />
              </div>

              <div className="col-md-3">
                <label className="form-label small fw-bold text-muted">
                  <i className="bi bi-calendar2-check me-1 text-primary"></i> Check-out Date
                </label>
                <input
                  type="date"
                  className="form-control"
                  value={checkOut}
                  onChange={(e) => setCheckOut(e.target.value)}
                />
              </div>

              <div className="col-md-2">
                <label className="form-label small fw-bold text-muted">
                  <i className="bi bi-tag me-1 text-primary"></i> Room Type
                </label>
                <select className="form-select" value={type} onChange={(e) => setType(e.target.value)}>
                  <option value="All">All Types</option>
                  <option value="Single">Single</option>
                  <option value="Double">Double</option>
                  <option value="Deluxe">Deluxe</option>
                  <option value="Suite">Suite</option>
                  <option value="Family Suite">Family Suite</option>
                </select>
              </div>

              <div className="col-md-2">
                <label className="form-label small fw-bold text-muted">
                  <i className="bi bi-people me-1 text-primary"></i> Guests
                </label>
                <select className="form-select" value={capacity} onChange={(e) => setCapacity(e.target.value)}>
                  <option value="1">1 Guest</option>
                  <option value="2">2 Guests</option>
                  <option value="3">3 Guests</option>
                  <option value="4">4+ Guests</option>
                </select>
              </div>

              <div className="col-md-2">
                <button type="submit" className="btn btn-primary w-100 py-2 fw-semibold">
                  <i className="bi bi-search me-1"></i> Search
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Featured Rooms Section */}
      <section className="py-5 my-3 container">
        <div className="text-center mb-5">
          <span className="text-primary fw-bold text-uppercase small letter-spacing">Handpicked Accommodations</span>
          <h2 className="display-6 fw-bold mt-1 font-display">Featured Suites & Rooms</h2>
          <p className="text-muted mx-auto" style={{ maxWidth: 600 }}>
            Each room is thoughtfully designed with plush furnishings, state-of-the-art tech, and panoramic views.
          </p>
        </div>

        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status"></div>
          </div>
        ) : (
          <div className="row g-4">
            {featuredRooms.map((room) => (
              <div key={room._id} className="col-md-6 col-lg-4">
                <RoomCard room={room} />
              </div>
            ))}
          </div>
        )}

        <div className="text-center mt-5">
          <Link to="/rooms" className="btn btn-outline-dark px-4 py-2 rounded-pill fw-semibold">
            View All Rooms & Suites <i className="bi bi-arrow-right ms-2"></i>
          </Link>
        </div>
      </section>

      {/* Hotel Amenities & Experiences */}
      <section className="py-5 bg-white border-top border-bottom">
        <div className="container">
          <div className="text-center mb-5">
            <span className="text-primary fw-bold text-uppercase small">Pure Indulgence</span>
            <h2 className="display-6 fw-bold mt-1 font-display">World-Class Hotel Amenities</h2>
          </div>

          <div className="row g-4 text-center">
            <div className="col-6 col-md-3">
              <div className="p-4 rounded-4 bg-light h-100">
                <div className="fs-1 text-primary mb-3"><i className="bi bi-water"></i></div>
                <h5 className="fw-bold">Infinity Pool</h5>
                <p className="text-muted small mb-0">Heated rooftop horizon pool overlooking the bay.</p>
              </div>
            </div>

            <div className="col-6 col-md-3">
              <div className="p-4 rounded-4 bg-light h-100">
                <div className="fs-1 text-primary mb-3"><i className="bi bi-cup-hot"></i></div>
                <h5 className="fw-bold">Gourmet Dining</h5>
                <p className="text-muted small mb-0">Three Michelin-star culinary experiences and 24/7 service.</p>
              </div>
            </div>

            <div className="col-6 col-md-3">
              <div className="p-4 rounded-4 bg-light h-100">
                <div className="fs-1 text-primary mb-3"><i className="bi bi-heart-pulse"></i></div>
                <h5 className="fw-bold">Wellness Spa</h5>
                <p className="text-muted small mb-0">Holistic therapies, steam saunas, and organic treatments.</p>
              </div>
            </div>

            <div className="col-6 col-md-3">
              <div className="p-4 rounded-4 bg-light h-100">
                <div className="fs-1 text-primary mb-3"><i className="bi bi-car-front"></i></div>
                <h5 className="fw-bold">Valet & Chauffeur</h5>
                <p className="text-muted small mb-0">Airport transfers in luxury electric fleet vehicles.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Guest Reviews Section */}
      <section className="py-5 container">
        <div className="text-center mb-5">
          <span className="text-primary fw-bold text-uppercase small">Guest Stories</span>
          <h2 className="display-6 fw-bold mt-1 font-display">What Our Guests Say</h2>
        </div>

        <div className="row g-4">
          <div className="col-md-4">
            <div className="card h-100 p-4 border-0 shadow-sm rounded-4">
              <div className="text-warning mb-2">★★★★★</div>
              <p className="text-muted fst-italic small mb-3">
                "Our stay in the Grand Presidential Ocean Suite was pure bliss. The staff catered to our every whim and the views are unmatched."
              </p>
              <div className="fw-bold small">— Sarah Jenkins</div>
              <div className="text-muted" style={{ fontSize: '0.75rem' }}>Verified Booking • London, UK</div>
            </div>
          </div>

          <div className="col-md-4">
            <div className="card h-100 p-4 border-0 shadow-sm rounded-4">
              <div className="text-warning mb-2">★★★★★</div>
              <p className="text-muted fst-italic small mb-3">
                "Fast check-in, pristine rooms, and the rooftop breakfast was the highlight of our family holiday. HotelPro made booking effortless!"
              </p>
              <div className="fw-bold small">— Michael & Elena Vance</div>
              <div className="text-muted" style={{ fontSize: '0.75rem' }}>Verified Booking • Toronto, Canada</div>
            </div>
          </div>

          <div className="col-md-4">
            <div className="card h-100 p-4 border-0 shadow-sm rounded-4">
              <div className="text-warning mb-2">★★★★★</div>
              <p className="text-muted fst-italic small mb-3">
                "As a frequent business traveler, the fast Wi-Fi and quiet Executive room was everything I needed. Highly recommend!"
              </p>
              <div className="fw-bold small">— David Kim</div>
              <div className="text-muted" style={{ fontSize: '0.75rem' }}>Verified Booking • San Francisco, USA</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
