import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import api from '../services/api';
import RoomCard from '../components/RoomCard';

const Rooms = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);

  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters state
  const [search, setSearch] = useState('');
  const [selectedType, setSelectedType] = useState(queryParams.get('type') || 'All');
  const [capacity, setCapacity] = useState(queryParams.get('capacity') || '');
  const [maxPrice, setMaxPrice] = useState(500);
  const [sortBy, setSortBy] = useState('recommended');

  const fetchRooms = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (selectedType && selectedType !== 'All') params.append('type', selectedType);
      if (capacity) params.append('capacity', capacity);
      if (maxPrice < 500) params.append('maxPrice', maxPrice);

      if (sortBy === 'price_asc') params.append('sortBy', 'price_asc');
      if (sortBy === 'price_desc') params.append('sortBy', 'price_desc');
      if (sortBy === 'capacity') params.append('sortBy', 'capacity');

      const res = await api.get(`/rooms?${params.toString()}`);
      if (res.data.success) {
        setRooms(res.data.data);
      }
    } catch (err) {
      console.error('Failed to load rooms:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRooms();
  }, [selectedType, sortBy]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchRooms();
  };

  const handleResetFilters = () => {
    setSearch('');
    setSelectedType('All');
    setCapacity('');
    setMaxPrice(500);
    setSortBy('recommended');
  };

  const roomTypes = ['All', 'Single', 'Double', 'Suite', 'Deluxe', 'Family'];

  return (
    <div className="container py-4">
      {/* Header */}
      <div className="mb-4">
        <h1 className="fw-bold text-dark">Explore Our Rooms & Suites</h1>
        <p className="text-muted">
          Browse luxury rooms, executive suites, and family spaces designed for unforgettable stays.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="card shadow-sm border-0 mb-4 p-3 bg-white rounded-3">
        <form onSubmit={handleSearchSubmit} className="row g-3 align-items-center">
          <div className="col-lg-4 col-md-6">
            <div className="input-group">
              <span className="input-group-text bg-light border-end-0">
                <i className="bi bi-search text-muted"></i>
              </span>
              <input
                type="text"
                className="form-control border-start-0"
                placeholder="Search by title, number, or amenity..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>

          <div className="col-lg-3 col-md-6">
            <div className="d-flex align-items-center gap-2">
              <label className="text-muted small fw-semibold text-nowrap">
                Max Price: ${maxPrice}
              </label>
              <input
                type="range"
                className="form-range"
                min="50"
                max="500"
                step="10"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
              />
            </div>
          </div>

          <div className="col-lg-2 col-md-4">
            <select
              className="form-select form-select-sm"
              value={capacity}
              onChange={(e) => setCapacity(e.target.value)}
            >
              <option value="">Any Guests</option>
              <option value="1">1+ Guest</option>
              <option value="2">2+ Guests</option>
              <option value="3">3+ Guests</option>
              <option value="4">4+ Guests</option>
            </select>
          </div>

          <div className="col-lg-2 col-md-4">
            <select
              className="form-select form-select-sm"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="recommended">Sort: Default</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="capacity">Capacity</option>
            </select>
          </div>

          <div className="col-lg-1 col-md-4 d-flex gap-1">
            <button type="submit" className="btn btn-primary btn-sm w-100">
              Apply
            </button>
            <button
              type="button"
              onClick={handleResetFilters}
              className="btn btn-outline-secondary btn-sm"
              title="Reset Filters"
            >
              <i className="bi bi-arrow-counterclockwise"></i>
            </button>
          </div>
        </form>

        {/* Type Filter Pills */}
        <div className="d-flex flex-wrap gap-2 mt-3 pt-2 border-top">
          <span className="text-muted small fw-semibold align-self-center me-2">Type:</span>
          {roomTypes.map((type) => (
            <button
              key={type}
              type="button"
              className={`btn btn-sm rounded-pill px-3 ${
                selectedType === type ? 'btn-primary' : 'btn-outline-secondary'
              }`}
              onClick={() => setSelectedType(type)}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* Results Section */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <span className="text-muted small">
          Showing <strong>{rooms.length}</strong> available accommodation(s)
        </span>
      </div>

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading Rooms...</span>
          </div>
        </div>
      ) : rooms.length === 0 ? (
        <div className="card text-center p-5 border-0 shadow-sm bg-white">
          <i className="bi bi-building-exclamation fs-1 text-muted mb-3"></i>
          <h4 className="fw-bold">No Rooms Match Your Criteria</h4>
          <p className="text-muted">
            Try resetting your price range, guest count, or selecting "All" room types.
          </p>
          <button
            onClick={handleResetFilters}
            className="btn btn-primary mx-auto px-4 rounded-pill mt-2"
          >
            Reset All Filters
          </button>
        </div>
      ) : (
        <div className="row g-4">
          {rooms.map((room) => (
            <div className="col-lg-4 col-md-6" key={room._id}>
              <RoomCard room={room} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Rooms;
