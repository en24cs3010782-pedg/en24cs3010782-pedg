import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

const AdminDashboard = () => {
  const { user, isAdmin } = useAuth();

  // Navigation tab: 'rooms' | 'bookings'
  const [activeTab, setActiveTab] = useState('rooms');

  // Stats
  const [stats, setStats] = useState({
    totalRooms: 0,
    availableRooms: 0,
    occupiedRooms: 0,
    totalBookings: 0,
    activeBookings: 0,
    totalRevenue: 0,
  });

  // Rooms Data
  const [rooms, setRooms] = useState([]);
  const [roomsLoading, setRoomsLoading] = useState(true);

  // Bookings Data
  const [bookings, setBookings] = useState([]);
  const [bookingsLoading, setBookingsLoading] = useState(true);

  // Modal / Form state for Add/Edit Room
  const [showRoomModal, setShowRoomModal] = useState(false);
  const [editingRoomId, setEditingRoomId] = useState(null);
  const [roomFormData, setRoomFormData] = useState({
    roomNumber: '',
    title: '',
    type: 'Deluxe',
    pricePerNight: '',
    capacity: 2,
    bedType: 'King',
    status: 'Available',
    description: '',
    amenities: 'Free Wi-Fi, Air Conditioning, Flat-screen TV',
    image: '',
  });

  const [feedback, setFeedback] = useState({ type: '', text: '' });

  // Fetch Dashboard Stats
  const fetchStats = async () => {
    try {
      const res = await api.get('/stats/dashboard');
      if (res.data.success) {
        setStats(res.data.data);
      }
    } catch (err) {
      console.error('Failed to load stats:', err);
    }
  };

  // Fetch Rooms
  const fetchRooms = async () => {
    setRoomsLoading(true);
    try {
      const res = await api.get('/rooms');
      if (res.data.success) {
        setRooms(res.data.data);
      }
    } catch (err) {
      console.error('Failed to load rooms:', err);
    } finally {
      setRoomsLoading(false);
    }
  };

  // Fetch All Bookings
  const fetchBookings = async () => {
    setBookingsLoading(true);
    try {
      const res = await api.get('/bookings');
      if (res.data.success) {
        setBookings(res.data.data);
      }
    } catch (err) {
      console.error('Failed to load bookings:', err);
    } finally {
      setBookingsLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
    fetchRooms();
    fetchBookings();
  }, []);

  // Handle Room Form
  const handleOpenAddModal = () => {
    setEditingRoomId(null);
    setRoomFormData({
      roomNumber: '',
      title: '',
      type: 'Deluxe',
      pricePerNight: '',
      capacity: 2,
      bedType: 'King',
      status: 'Available',
      description: '',
      amenities: 'Free Wi-Fi, Air Conditioning, Flat-screen TV',
      image: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80',
    });
    setShowRoomModal(true);
  };

  const handleOpenEditModal = (room) => {
    setEditingRoomId(room._id);
    setRoomFormData({
      roomNumber: room.roomNumber,
      title: room.title,
      type: room.type,
      pricePerNight: room.pricePerNight,
      capacity: room.capacity,
      bedType: room.bedType || 'King',
      status: room.status,
      description: room.description,
      amenities: room.amenities ? room.amenities.join(', ') : '',
      image: room.images && room.images[0] ? room.images[0] : '',
    });
    setShowRoomModal(true);
  };

  const handleSaveRoom = async (e) => {
    e.preventDefault();
    setFeedback({ type: '', text: '' });
    try {
      const payload = {
        roomNumber: roomFormData.roomNumber,
        title: roomFormData.title,
        type: roomFormData.type,
        pricePerNight: Number(roomFormData.pricePerNight),
        capacity: Number(roomFormData.capacity),
        bedType: roomFormData.bedType,
        status: roomFormData.status,
        description: roomFormData.description,
        amenities: roomFormData.amenities.split(',').map((a) => a.trim()).filter(Boolean),
        images: roomFormData.image ? [roomFormData.image] : [],
      };

      if (editingRoomId) {
        await api.put(`/rooms/${editingRoomId}`, payload);
        setFeedback({ type: 'success', text: `Room #${payload.roomNumber} updated successfully!` });
      } else {
        await api.post('/rooms', payload);
        setFeedback({ type: 'success', text: `Room #${payload.roomNumber} created successfully!` });
      }

      setShowRoomModal(false);
      fetchRooms();
      fetchStats();
    } catch (err) {
      setFeedback({
        type: 'danger',
        text: err.response?.data?.message || 'Error saving room information.',
      });
    }
  };

  const handleDeleteRoom = async (id, num) => {
    if (!window.confirm(`Are you sure you want to delete Room #${num}?`)) return;
    try {
      await api.delete(`/rooms/${id}`);
      setFeedback({ type: 'success', text: `Room #${num} removed from system.` });
      fetchRooms();
      fetchStats();
    } catch (err) {
      setFeedback({
        type: 'danger',
        text: err.response?.data?.message || 'Failed to delete room.',
      });
    }
  };

  // Handle Booking Status Update (Check-in, Check-out, etc.)
  const handleUpdateBookingStatus = async (bookingId, newStatus) => {
    try {
      await api.put(`/bookings/${bookingId}/status`, { status: newStatus });
      setFeedback({ type: 'success', text: `Booking marked as ${newStatus}!` });
      fetchBookings();
      fetchStats();
    } catch (err) {
      setFeedback({
        type: 'danger',
        text: err.response?.data?.message || 'Failed to update reservation status.',
      });
    }
  };

  return (
    <div className="container-fluid py-4 px-lg-5">
      {/* Top Banner */}
      <div className="d-flex flex-wrap justify-content-between align-items-center mb-4 pb-2 border-bottom">
        <div>
          <h2 className="fw-bold text-dark mb-1">
            <i className="bi bi-buildings-fill text-primary me-2"></i>
            HotelPro Operations & Management
          </h2>
          <span className="text-muted small">
            Logged in as: <strong>{user?.name}</strong> ({user?.role?.toUpperCase()})
          </span>
        </div>

        <div className="d-flex gap-2">
          <button
            className={`btn rounded-pill px-4 ${activeTab === 'rooms' ? 'btn-primary' : 'btn-outline-secondary'}`}
            onClick={() => setActiveTab('rooms')}
          >
            <i className="bi bi-door-closed me-1"></i> Rooms Inventory
          </button>
          <button
            className={`btn rounded-pill px-4 ${activeTab === 'bookings' ? 'btn-primary' : 'btn-outline-secondary'}`}
            onClick={() => setActiveTab('bookings')}
          >
            <i className="bi bi-calendar-week me-1"></i> All Bookings
          </button>
        </div>
      </div>

      {feedback.text && (
        <div className={`alert alert-${feedback.type} alert-dismissible fade show rounded-3`} role="alert">
          {feedback.text}
          <button
            type="button"
            className="btn-close"
            onClick={() => setFeedback({ type: '', text: '' })}
          ></button>
        </div>
      )}

      {/* KPI Cards Row */}
      <div className="row g-3 mb-4">
        <div className="col-xl-3 col-md-6">
          <div className="card stat-card bg-white border-start border-4 border-primary">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <span className="text-muted small fw-semibold">TOTAL ROOMS</span>
                <h3 className="fw-bold text-dark mb-0 mt-1">{stats.totalRooms}</h3>
              </div>
              <div className="fs-1 text-primary opacity-75">
                <i className="bi bi-door-open"></i>
              </div>
            </div>
          </div>
        </div>

        <div className="col-xl-3 col-md-6">
          <div className="card stat-card bg-white border-start border-4 border-success">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <span className="text-muted small fw-semibold">AVAILABLE ROOMS</span>
                <h3 className="fw-bold text-success mb-0 mt-1">{stats.availableRooms}</h3>
              </div>
              <div className="fs-1 text-success opacity-75">
                <i className="bi bi-check-circle"></i>
              </div>
            </div>
          </div>
        </div>

        <div className="col-xl-3 col-md-6">
          <div className="card stat-card bg-white border-start border-4 border-warning">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <span className="text-muted small fw-semibold">ACTIVE RESERVATIONS</span>
                <h3 className="fw-bold text-warning mb-0 mt-1">{stats.activeBookings}</h3>
              </div>
              <div className="fs-1 text-warning opacity-75">
                <i className="bi bi-calendar2-check"></i>
              </div>
            </div>
          </div>
        </div>

        <div className="col-xl-3 col-md-6">
          <div className="card stat-card bg-white border-start border-4 border-info">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <span className="text-muted small fw-semibold">TOTAL REVENUE</span>
                <h3 className="fw-bold text-info mb-0 mt-1">${stats.totalRevenue}</h3>
              </div>
              <div className="fs-1 text-info opacity-75">
                <i className="bi bi-currency-dollar"></i>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* TAB 1: ROOMS INVENTORY MANAGEMENT */}
      {activeTab === 'rooms' && (
        <div className="card border-0 shadow-sm rounded-4 p-4 bg-white">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h4 className="fw-bold mb-0">Rooms Catalog ({rooms.length})</h4>
            <button
              onClick={handleOpenAddModal}
              className="btn btn-primary-hotel rounded-pill px-4"
            >
              <i className="bi bi-plus-lg me-1"></i> Add New Room
            </button>
          </div>

          {roomsLoading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status"></div>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover align-middle">
                <thead className="table-light">
                  <tr>
                    <th>Room #</th>
                    <th>Title & Type</th>
                    <th>Price/Night</th>
                    <th>Capacity</th>
                    <th>Bed</th>
                    <th>Status</th>
                    <th className="text-end">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {rooms.map((room) => (
                    <tr key={room._id}>
                      <td>
                        <span className="fw-bold badge bg-dark text-white px-3 py-2">
                          #{room.roomNumber}
                        </span>
                      </td>
                      <td>
                        <div className="fw-semibold text-dark">{room.title}</div>
                        <small className="text-muted">{room.type}</small>
                      </td>
                      <td>
                        <span className="fw-bold text-primary">${room.pricePerNight}</span>
                      </td>
                      <td>{room.capacity} Guests</td>
                      <td>{room.bedType || 'King'}</td>
                      <td>
                        <span
                          className={`badge rounded-pill px-3 py-1 ${
                            room.status === 'Available'
                              ? 'bg-success-subtle text-success'
                              : room.status === 'Booked'
                              ? 'bg-danger-subtle text-danger'
                              : 'bg-warning-subtle text-warning'
                          }`}
                        >
                          {room.status}
                        </span>
                      </td>
                      <td className="text-end">
                        <button
                          onClick={() => handleOpenEditModal(room)}
                          className="btn btn-outline-primary btn-sm rounded-pill px-3 me-2"
                        >
                          <i className="bi bi-pencil-square me-1"></i> Edit
                        </button>
                        {isAdmin && (
                          <button
                            onClick={() => handleDeleteRoom(room._id, room.roomNumber)}
                            className="btn btn-outline-danger btn-sm rounded-pill px-3"
                          >
                            <i className="bi bi-trash"></i>
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: RESERVATIONS MANAGEMENT */}
      {activeTab === 'bookings' && (
        <div className="card border-0 shadow-sm rounded-4 p-4 bg-white">
          <h4 className="fw-bold mb-3">Guest Reservations Management ({bookings.length})</h4>

          {bookingsLoading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status"></div>
            </div>
          ) : bookings.length === 0 ? (
            <p className="text-muted">No reservations recorded yet.</p>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover align-middle">
                <thead className="table-light">
                  <tr>
                    <th>Booking ID</th>
                    <th>Guest Details</th>
                    <th>Room</th>
                    <th>Stay Dates</th>
                    <th>Amount</th>
                    <th>Status</th>
                    <th className="text-end">Front Desk Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.map((b) => (
                    <tr key={b._id}>
                      <td>
                        <code className="small">{b._id.substring(b._id.length - 8)}</code>
                      </td>
                      <td>
                        <div className="fw-bold text-dark">{b.guestDetails?.name || 'Guest'}</div>
                        <small className="text-muted d-block">{b.guestDetails?.email}</small>
                        <small className="text-muted">{b.guestDetails?.phone || 'No phone'}</small>
                      </td>
                      <td>
                        <span className="fw-semibold">Room #{b.room?.roomNumber || 'N/A'}</span>
                        <small className="text-muted d-block">{b.room?.title || 'Unknown'}</small>
                      </td>
                      <td>
                        <div className="small">
                          <strong>In:</strong> {new Date(b.checkInDate).toLocaleDateString()}
                        </div>
                        <div className="small">
                          <strong>Out:</strong> {new Date(b.checkOutDate).toLocaleDateString()}
                        </div>
                        <span className="badge bg-light text-muted border mt-1">
                          {b.totalNights} night(s)
                        </span>
                      </td>
                      <td>
                        <span className="fw-bold text-primary">${b.totalPrice}</span>
                        <div className="small text-success">{b.paymentStatus}</div>
                      </td>
                      <td>
                        <span
                          className={`badge rounded-pill px-3 py-1 ${
                            b.status === 'Confirmed'
                              ? 'bg-primary-subtle text-primary'
                              : b.status === 'CheckedIn'
                              ? 'bg-success-subtle text-success'
                              : b.status === 'CheckedOut'
                              ? 'bg-secondary-subtle text-secondary'
                              : 'bg-danger-subtle text-danger'
                          }`}
                        >
                          {b.status}
                        </span>
                      </td>
                      <td className="text-end">
                        <div className="btn-group">
                          {b.status === 'Confirmed' && (
                            <button
                              onClick={() => handleUpdateBookingStatus(b._id, 'CheckedIn')}
                              className="btn btn-success btn-sm"
                            >
                              <i className="bi bi-box-arrow-in-right me-1"></i> Check In
                            </button>
                          )}
                          {b.status === 'CheckedIn' && (
                            <button
                              onClick={() => handleUpdateBookingStatus(b._id, 'CheckedOut')}
                              className="btn btn-secondary btn-sm"
                            >
                              <i className="bi bi-box-arrow-right me-1"></i> Check Out
                            </button>
                          )}
                          {b.status !== 'Cancelled' && b.status !== 'CheckedOut' && (
                            <button
                              onClick={() => handleUpdateBookingStatus(b._id, 'Cancelled')}
                              className="btn btn-outline-danger btn-sm"
                            >
                              Cancel
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* ADD / EDIT ROOM MODAL */}
      {showRoomModal && (
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content rounded-4 border-0 shadow-lg">
              <div className="modal-header">
                <h5 className="modal-title fw-bold">
                  {editingRoomId ? 'Edit Room Details' : 'Add New Hotel Room'}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowRoomModal(false)}
                ></button>
              </div>
              <form onSubmit={handleSaveRoom}>
                <div className="modal-body p-4">
                  <div className="row g-3">
                    <div className="col-md-4">
                      <label className="form-label small fw-semibold">Room Number</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="e.g. 302"
                        value={roomFormData.roomNumber}
                        onChange={(e) =>
                          setRoomFormData({ ...roomFormData, roomNumber: e.target.value })
                        }
                        required
                      />
                    </div>
                    <div className="col-md-8">
                      <label className="form-label small fw-semibold">Room Title</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="e.g. Executive Ocean View Suite"
                        value={roomFormData.title}
                        onChange={(e) =>
                          setRoomFormData({ ...roomFormData, title: e.target.value })
                        }
                        required
                      />
                    </div>

                    <div className="col-md-4">
                      <label className="form-label small fw-semibold">Category Type</label>
                      <select
                        className="form-select"
                        value={roomFormData.type}
                        onChange={(e) =>
                          setRoomFormData({ ...roomFormData, type: e.target.value })
                        }
                      >
                        <option value="Single">Single</option>
                        <option value="Double">Double</option>
                        <option value="Suite">Suite</option>
                        <option value="Deluxe">Deluxe</option>
                        <option value="Family">Family</option>
                      </select>
                    </div>

                    <div className="col-md-4">
                      <label className="form-label small fw-semibold">Price per Night ($)</label>
                      <input
                        type="number"
                        className="form-control"
                        placeholder="150"
                        value={roomFormData.pricePerNight}
                        onChange={(e) =>
                          setRoomFormData({ ...roomFormData, pricePerNight: e.target.value })
                        }
                        required
                      />
                    </div>

                    <div className="col-md-4">
                      <label className="form-label small fw-semibold">Max Guests</label>
                      <input
                        type="number"
                        min="1"
                        max="10"
                        className="form-control"
                        value={roomFormData.capacity}
                        onChange={(e) =>
                          setRoomFormData({ ...roomFormData, capacity: e.target.value })
                        }
                        required
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label small fw-semibold">Bed Configuration</label>
                      <select
                        className="form-select"
                        value={roomFormData.bedType}
                        onChange={(e) =>
                          setRoomFormData({ ...roomFormData, bedType: e.target.value })
                        }
                      >
                        <option value="Single">Single Bed</option>
                        <option value="Twin">Twin Beds</option>
                        <option value="Queen">Queen Bed</option>
                        <option value="King">King Bed</option>
                      </select>
                    </div>

                    <div className="col-md-6">
                      <label className="form-label small fw-semibold">Operational Status</label>
                      <select
                        className="form-select"
                        value={roomFormData.status}
                        onChange={(e) =>
                          setRoomFormData({ ...roomFormData, status: e.target.value })
                        }
                      >
                        <option value="Available">Available</option>
                        <option value="Booked">Booked</option>
                        <option value="Maintenance">Maintenance</option>
                      </select>
                    </div>

                    <div className="col-12">
                      <label className="form-label small fw-semibold">Photo Image URL</label>
                      <input
                        type="url"
                        className="form-control"
                        placeholder="https://..."
                        value={roomFormData.image}
                        onChange={(e) =>
                          setRoomFormData({ ...roomFormData, image: e.target.value })
                        }
                      />
                    </div>

                    <div className="col-12">
                      <label className="form-label small fw-semibold">
                        Amenities (comma separated)
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Free Wi-Fi, Air Conditioning, Balcony"
                        value={roomFormData.amenities}
                        onChange={(e) =>
                          setRoomFormData({ ...roomFormData, amenities: e.target.value })
                        }
                      />
                    </div>

                    <div className="col-12">
                      <label className="form-label small fw-semibold">Room Description</label>
                      <textarea
                        className="form-control"
                        rows="3"
                        placeholder="Detailed room features..."
                        value={roomFormData.description}
                        onChange={(e) =>
                          setRoomFormData({ ...roomFormData, description: e.target.value })
                        }
                        required
                      ></textarea>
                    </div>
                  </div>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-light rounded-pill px-4"
                    onClick={() => setShowRoomModal(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary-hotel rounded-pill px-4"
                  >
                    Save Room
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
