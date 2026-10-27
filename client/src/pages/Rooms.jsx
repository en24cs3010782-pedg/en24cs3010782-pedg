import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import API from '../services/api';
import RoomCard from '../components/RoomCard';

const Rooms = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filter States initialized from URL or defaults
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [type, setType] = useState(searchParams.get('type') || 'All');
  const [maxPrice, setMaxPrice] = useState(searchParams.get('maxPrice') || '500');
  const [capacity, setCapacity] = useState(searchParams.get('capacity') || '');
  const [checkIn, setCheckIn] = useState(searchParams.get('checkIn') || '');
  const [checkOut, setCheckOut] = useState(searchParams.get('checkOut') || '');

  const fetchFilteredRooms = async () => {
    setLoading(true);
    try {
      const params = {};
      if (search) params.search = search;
      if (type && type !== 'All') params.type = type;
      if (maxPrice) params.maxPrice = maxPrice;
      if (capacity) params.capacity = capacity;
      if (checkIn) params.checkIn = checkIn;
      if (checkOut) params.checkOut = checkOut;

      const res = await API.get('/rooms', { params });
      if (res.data.success) {
        setRooms(res.data.rooms);
      }
    } catch (err) {
      console.error('Error fetching rooms:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFilteredRooms();
  }, [type, maxPrice, capacity, checkIn, checkOut]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchFilteredRooms();
  };

  const handleReset = () => {
    setSearch('');
    setType('All');
    setMaxPrice('500');
    setCapacity('');
    setCheckIn('');
    setCheckOut('');
    setSearchParams({});
    setTimeout(() => {
      API.get('/rooms').then((res) => {
        if (res.data.success) setRooms(res.data.rooms);
      });
    }, 50);
  };

  return (
    <div className="container py-5">
      {/* Title Header */}
      <div className="mb-4">
        <h1 className="fw-bold font-display">Accommodations & Suites</h1>
        <p className="text-muted">Explore our curated collection of luxury rooms, suites, and private villas.</p>
      </div>

      <div className="row g-4">
        {/* Filters Sidebar */}
        <div className="col-lg-3">
          <div className="card border-0 shadow-sm p-4 rounded-4 sticky-top" style={{ top: 90, zIndex: 10 }}>
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h5 className="fw-bold mb-0">
                <i className="bi bi-funnel me-1 text-primary"></i> Filters
              </h5>
              <button onClick={handleReset} className="btn btn-sm btn-link text-decoration-none p-0 text-muted">
                Reset All
              </button>
            </div>

            {/* Keyword Search */}
            <form onSubmit={handleSearchSubmit} className="mb-3">
              <label className="form-label small fw-semibold text-muted">Keyword Search</label>
              <div className="input-group">
                <input
                  type="text"
                  className="form-control form-control-sm"
                  placeholder="e.g. Deluxe, Ocean, Jacuzzi..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
                <button type="submit" className="btn btn-sm btn-primary">
                  <i className="bi bi-search"></i>
                </button>
              </div>
            </form>

            {/* Dates for Availability */}
            <div className="mb-3">
              <label className="form-label small fw-semibold text-muted">Availability Dates</label>
              <input
                type="date"
                className="form-control form-control-sm mb-2"
                placeholder="Check-in"
                value={checkIn}
                onChange={(e) => setCheckIn(e.target.value)}
              />
              <input
                type="date"
                className="form-control form-control-sm"
                placeholder="Check-out"
                value={checkOut}
                onChange={(e) => setCheckOut(e.target.value)}
              />
            </div>

            {/* Room Type */}
            <div className="mb-3">
              <label className="form-label small fw-semibold text-muted">Room Category</label>
              <select className="form-select form-select-sm" value={type} onChange={(e) => setType(e.target.value)}>
                <option value="All">All Categories</option>
                <option value="Single">Single Room</option>
                <option value="Double">Double Room</option>
                <option value="Deluxe">Deluxe Suite</option>
                <option value="Suite">Presidential Suite</option>
                <option value="Family Suite">Family Suite</option>
              </select>
            </div>

            {/* Price Slider */}
            <div className="mb-3">
              <div className="d-flex justify-content-between small fw-semibold mb-1">
                <span className="text-muted">Max Price:</span>
                <span className="text-primary fw-bold">${maxPrice} / night</span>
              </div>
              <input
                type="range"
                className="form-range"
                min="50"
                max="600"
                step="25"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
              />
            </div>

            {/* Capacity */}
            <div className="mb-3">
              <label className="form-label small fw-semibold text-muted">Minimum Guests</label>
              <select className="form-select form-select-sm" value={capacity} onChange={(e) => setCapacity(e.target.value)}>
                <option value="">Any Capacity</option>
                <option value="1">1+ Guest</option>
                <option value="2">2+ Guests</option>
                <option value="3">3+ Guests</option>
                <option value="4">4+ Guests</option>
              </select>
            </div>
          </div>
        </div>

        {/* Room Listings Grid */}
        <div className="col-lg-9">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <span className="text-muted small">
              Showing <strong>{rooms.length}</strong> available rooms
            </span>
          </div>

          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status"></div>
            </div>
          ) : rooms.length === 0 ? (
            <div className="card border-0 shadow-sm p-5 text-center rounded-4">
              <i className="bi bi-search text-muted display-4 mb-3"></i>
              <h5 className="fw-bold">No rooms found</h5>
              <p className="text-muted small mb-3">Try adjusting your filters or selecting different travel dates.</p>
              <div>
                <button onClick={handleReset} className="btn btn-outline-primary btn-sm rounded-pill px-4">
                  Reset Filters
                </button>
              </div>
            </div>
          ) : (
            <div className="row g-4">
              {rooms.map((room) => (
                <div key={room._id} className="col-md-6">
                  <RoomCard room={room} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Rooms;
