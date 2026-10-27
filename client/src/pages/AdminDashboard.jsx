import React, { useState, useEffect } from 'react';
import API from '../services/api';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState(null);
  const [rooms, setRooms] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  // Add/Edit Room Modal state
  const [showRoomModal, setShowRoomModal] = useState(false);
  const [editingRoomId, setEditingRoomId] = useState(null);
  const [roomFormData, setRoomFormData] = useState({
    roomNumber: '',
    title: '',
    type: 'Deluxe',
    pricePerNight: '',
    capacity: 2,
    amenities: 'High-speed Wi-Fi, Air Conditioning, TV, Mini Bar',
    images: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1200&q=80',
    description: 'Luxurious suite featuring premium furnishings and skyline views.',
    status: 'available'
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const [statsRes, roomsRes, bookingsRes] = await Promise.all([
        API.get('/stats'),
        API.get('/rooms'),
        API.get('/bookings')
      ]);

      if (statsRes.data.success) setStats(statsRes.data.stats);
      if (roomsRes.data.success) setRooms(roomsRes.data.rooms);
      if (bookingsRes.data.success) setBookings(bookingsRes.data.bookings);
    } catch (err) {
      console.error('Error fetching admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleStatusChange = async (bookingId, newStatus) => {
    try {
      const res = await API.put(`/bookings/${bookingId}/status`, { status: newStatus });
      if (res.data.success) {
        setMessage(`Booking status updated to ${newStatus}`);
        fetchData();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Error updating status');
    }
  };

  const handleDeleteRoom = async (roomId) => {
    if (!window.confirm('Are you sure you want to delete this room?')) return;
    try {
      const res = await API.delete(`/rooms/${roomId}`);
      if (res.data.success) {
        setMessage('Room successfully removed');
        fetchData();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete room');
    }
  };

  const handleOpenAddRoom = () => {
    setEditingRoomId(null);
    setRoomFormData({
      roomNumber: '',
      title: '',
      type: 'Deluxe',
      pricePerNight: '',
      capacity: 2,
      amenities: 'High-speed Wi-Fi, Air Conditioning, Smart TV, Room Service',
      images: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1200&q=80',
      description: 'Luxurious room equipped with modern hotel amenities.',
      status: 'available'
    });
    setShowRoomModal(true);
  };

  const handleOpenEditRoom = (room) => {
    setEditingRoomId(room._id);
    setRoomFormData({
      roomNumber: room.roomNumber,
      title: room.title,
      type: room.type,
      pricePerNight: room.pricePerNight,
      capacity: room.capacity,
      amenities: Array.isArray(room.amenities) ? room.amenities.join(', ') : room.amenities,
      images: room.images?.[0] || '',
      description: room.description,
      status: room.status
    });
    setShowRoomModal(true);
  };

  const handleSaveRoom = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...roomFormData,
        pricePerNight: Number(roomFormData.pricePerNight),
        capacity: Number(roomFormData.capacity),
        images: [roomFormData.images]
      };

      if (editingRoomId) {
        await API.put(`/rooms/${editingRoomId}`, payload);
        setMessage('Room updated successfully');
      } else {
        await API.post('/rooms', payload);
        setMessage('New room created successfully');
      }

      setShowRoomModal(false);
      fetchData();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to save room details');
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-50">
        <div className="spinner-border text-primary" role="status"></div>
      </div>
    );
  }

  return (
    <div className="container-fluid py-4 px-md-5">
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 pb-3 border-bottom gap-3">
        <div>
          <span className="badge bg-warning text-dark px-3 py-1 mb-1">Executive Administration</span>
          <h1 className="fw-bold font-display mb-0">Hotel Operations Portal</h1>
        </div>
        <div className="d-flex gap-2">
          <button onClick={handleOpenAddRoom} className="btn btn-primary btn-sm rounded-pill px-3 fw-semibold">
            <i className="bi bi-plus-circle me-1"></i> Add New Room
          </button>
          <button onClick={fetchData} className="btn btn-outline-secondary btn-sm rounded-pill px-3">
            <i className="bi bi-arrow-clockwise me-1"></i> Refresh
          </button>
        </div>
      </div>

      {message && (
        <div className="alert alert-success alert-dismissible fade show" role="alert">
          {message}
          <button type="button" className="btn-close" onClick={() => setMessage('')}></button>
        </div>
      )}

      {/* Navigation Tabs */}
      <ul className="nav nav-pills mb-4 gap-2">
        <li className="nav-item">
          <button
            className={`nav-link rounded-pill px-4 ${activeTab === 'overview' ? 'active' : 'text-dark'}`}
            onClick={() => setActiveTab('overview')}
          >
            <i className="bi bi-speedometer2 me-1"></i> Overview & Metrics
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link rounded-pill px-4 ${activeTab === 'bookings' ? 'active' : 'text-dark'}`}
            onClick={() => setActiveTab('bookings')}
          >
            <i className="bi bi-calendar-check me-1"></i> Reservations ({bookings.length})
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link rounded-pill px-4 ${activeTab === 'rooms' ? 'active' : 'text-dark'}`}
            onClick={() => setActiveTab('rooms')}
          >
            <i className="bi bi-door-open me-1"></i> Room Inventory ({rooms.length})
          </button>
        </li>
      </ul>

      {/* TAB 1: OVERVIEW METRICS */}
      {activeTab === 'overview' && (
        <div>
          <div className="row g-4 mb-4">
            <div className="col-sm-6 col-xl-3">
              <div className="card border-0 shadow-sm p-4 rounded-4 bg-primary text-white">
                <span className="text-white-50 small fw-bold text-uppercase">Total Revenue</span>
                <h2 className="display-6 fw-bold my-2">${stats?.totalRevenue?.toLocaleString() || 0}</h2>
                <span className="small text-white-50"><i className="bi bi-graph-up-arrow me-1"></i> From confirmed stays</span>
              </div>
            </div>

            <div className="col-sm-6 col-xl-3">
              <div className="card border-0 shadow-sm p-4 rounded-4 bg-navy text-white">
                <span className="text-white-50 small fw-bold text-uppercase">Total Bookings</span>
                <h2 className="display-6 fw-bold my-2">{stats?.totalBookings || 0}</h2>
                <span className="small text-warning"><i className="bi bi-clock-history me-1"></i> {stats?.activeBookings || 0} Active / Checked-in</span>
              </div>
            </div>

            <div className="col-sm-6 col-xl-3">
              <div className="card border-0 shadow-sm p-4 rounded-4 bg-white border">
                <span className="text-muted small fw-bold text-uppercase">Occupancy Rate</span>
                <h2 className="display-6 fw-bold my-2 text-success">{stats?.occupancyRate || '0%'}</h2>
                <span className="small text-muted"><i className="bi bi-pie-chart me-1"></i> Current live capacity</span>
              </div>
            </div>

            <div className="col-sm-6 col-xl-3">
              <div className="card border-0 shadow-sm p-4 rounded-4 bg-white border">
                <span className="text-muted small fw-bold text-uppercase">Room Inventory</span>
                <h2 className="display-6 fw-bold my-2 text-dark">{stats?.totalRooms || 0}</h2>
                <span className="small text-muted"><i className="bi bi-door-closed me-1"></i> Active listings</span>
              </div>
            </div>
          </div>

          {/* Recent Bookings Table */}
          <div className="card border-0 shadow-sm rounded-4 p-4">
            <h5 className="fw-bold mb-3">Recent Reservations Activity</h5>
            <div className="table-responsive">
              <table className="table align-middle table-hover">
                <thead className="table-light small">
                  <tr>
                    <th>GUEST</th>
                    <th>ROOM</th>
                    <th>DATES</th>
                    <th>TOTAL</th>
                    <th>STATUS</th>
                  </tr>
                </thead>
                <tbody>
                  {stats?.recentBookings?.map((b) => (
                    <tr key={b._id}>
                      <td>
                        <strong>{b.user?.name || 'Guest'}</strong>
                        <div className="text-muted small">{b.user?.email}</div>
                      </td>
                      <td>
                        <span className="badge bg-light text-dark border me-1">#{b.room?.roomNumber}</span>
                        {b.room?.title}
                      </td>
                      <td className="small">
                        {new Date(b.checkInDate).toLocaleDateString()} → {new Date(b.checkOutDate).toLocaleDateString()}
                      </td>
                      <td className="fw-bold text-primary">${b.totalAmount}</td>
                      <td>
                        <span className="badge bg-success-subtle text-success border border-success px-2 py-1 text-capitalize">
                          {b.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: BOOKINGS MANAGEMENT */}
      {activeTab === 'bookings' && (
        <div className="card border-0 shadow-sm rounded-4 p-4">
          <h5 className="fw-bold mb-3">All Guest Reservations</h5>
          <div className="table-responsive">
            <table className="table align-middle table-hover">
              <thead className="table-light small">
                <tr>
                  <th>REF #</th>
                  <th>GUEST</th>
                  <th>ROOM</th>
                  <th>CHECK-IN / OUT</th>
                  <th>AMOUNT</th>
                  <th>STATUS</th>
                  <th>ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((b) => (
                  <tr key={b._id}>
                    <td className="fw-bold small text-muted">#{b._id.slice(-6).toUpperCase()}</td>
                    <td>
                      <div className="fw-bold">{b.guestDetails?.fullName || b.user?.name}</div>
                      <div className="text-muted small">{b.guestDetails?.phone || b.user?.phone || b.user?.email}</div>
                    </td>
                    <td>
                      <span className="badge bg-light text-dark border">Room #{b.room?.roomNumber}</span>
                      <div className="small text-truncate" style={{ maxWidth: 180 }}>{b.room?.title}</div>
                    </td>
                    <td className="small">
                      <div>In: {new Date(b.checkInDate).toLocaleDateString()}</div>
                      <div className="text-muted">Out: {new Date(b.checkOutDate).toLocaleDateString()} ({b.totalNights} nights)</div>
                    </td>
                    <td>
                      <div className="fw-bold text-primary">${b.totalAmount}</div>
                      <span className="badge bg-light text-success border" style={{ fontSize: '0.7rem' }}>
                        {b.paymentStatus?.toUpperCase()}
                      </span>
                    </td>
                    <td>
                      <span className={`badge text-capitalize px-2 py-1 ${
                        b.status === 'confirmed' ? 'bg-success' :
                        b.status === 'checked-in' ? 'bg-primary' :
                        b.status === 'checked-out' ? 'bg-secondary' : 'bg-danger'
                      }`}>
                        {b.status}
                      </span>
                    </td>
                    <td>
                      <div className="dropdown">
                        <button className="btn btn-sm btn-outline-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown">
                          Update Status
                        </button>
                        <ul className="dropdown-menu">
                          <li><button className="dropdown-item" onClick={() => handleStatusChange(b._id, 'confirmed')}>Mark Confirmed</button></li>
                          <li><button className="dropdown-item" onClick={() => handleStatusChange(b._id, 'checked-in')}>Check-In Guest</button></li>
                          <li><button className="dropdown-item" onClick={() => handleStatusChange(b._id, 'checked-out')}>Check-Out Guest</button></li>
                          <li><hr className="dropdown-divider" /></li>
                          <li><button className="dropdown-item text-danger" onClick={() => handleStatusChange(b._id, 'cancelled')}>Cancel Booking</button></li>
                        </ul>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: ROOMS INVENTORY */}
      {activeTab === 'rooms' && (
        <div className="card border-0 shadow-sm rounded-4 p-4">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h5 className="fw-bold mb-0">Room Inventory List</h5>
            <button onClick={handleOpenAddRoom} className="btn btn-primary btn-sm rounded-pill px-3">
              <i className="bi bi-plus-lg me-1"></i> Add Room
            </button>
          </div>

          <div className="table-responsive">
            <table className="table align-middle table-hover">
              <thead className="table-light small">
                <tr>
                  <th>ROOM #</th>
                  <th>PHOTO</th>
                  <th>TITLE & TYPE</th>
                  <th>PRICE / NIGHT</th>
                  <th>CAPACITY</th>
                  <th>STATUS</th>
                  <th>ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {rooms.map((room) => (
                  <tr key={room._id}>
                    <td className="fw-bold fs-6">#{room.roomNumber}</td>
                    <td>
                      <img
                        src={room.images?.[0]}
                        alt={room.title}
                        className="rounded-3 object-fit-cover"
                        style={{ width: 60, height: 45 }}
                      />
                    </td>
                    <td>
                      <div className="fw-bold">{room.title}</div>
                      <span className="badge bg-light text-primary border small">{room.type}</span>
                    </td>
                    <td className="fw-bold text-primary">${room.pricePerNight}</td>
                    <td><i className="bi bi-people me-1"></i> {room.capacity} Guests</td>
                    <td>
                      <span className={`badge px-2 py-1 ${room.status === 'available' ? 'bg-success' : 'bg-warning text-dark'}`}>
                        {room.status}
                      </span>
                    </td>
                    <td>
                      <div className="d-flex gap-2">
                        <button onClick={() => handleOpenEditRoom(room)} className="btn btn-sm btn-outline-primary">
                          <i className="bi bi-pencil"></i>
                        </button>
                        <button onClick={() => handleDeleteRoom(room._id)} className="btn btn-sm btn-outline-danger">
                          <i className="bi bi-trash"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ADD/EDIT ROOM MODAL */}
      {showRoomModal && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }} tabIndex="-1">
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content rounded-4 border-0 shadow">
              <div className="modal-header bg-navy text-white">
                <h5 className="modal-title fw-bold">
                  {editingRoomId ? 'Edit Room Information' : 'Add New Hotel Room'}
                </h5>
                <button type="button" className="btn-close btn-close-white" onClick={() => setShowRoomModal(false)}></button>
              </div>
              <form onSubmit={handleSaveRoom}>
                <div className="modal-body p-4">
                  <div className="row g-3">
                    <div className="col-md-4">
                      <label className="form-label small fw-bold">Room Number</label>
                      <input
                        type="text"
                        className="form-control"
                        required
                        placeholder="e.g. 401"
                        value={roomFormData.roomNumber}
                        onChange={(e) => setRoomFormData({ ...roomFormData, roomNumber: e.target.value })}
                      />
                    </div>
                    <div className="col-md-8">
                      <label className="form-label small fw-bold">Room Title</label>
                      <input
                        type="text"
                        className="form-control"
                        required
                        placeholder="e.g. Royal Horizon Ocean Penthouse"
                        value={roomFormData.title}
                        onChange={(e) => setRoomFormData({ ...roomFormData, title: e.target.value })}
                      />
                    </div>
                    <div className="col-md-4">
                      <label className="form-label small fw-bold">Room Type</label>
                      <select
                        className="form-select"
                        value={roomFormData.type}
                        onChange={(e) => setRoomFormData({ ...roomFormData, type: e.target.value })}
                      >
                        <option value="Single">Single</option>
                        <option value="Double">Double</option>
                        <option value="Deluxe">Deluxe</option>
                        <option value="Suite">Suite</option>
                        <option value="Family Suite">Family Suite</option>
                      </select>
                    </div>
                    <div className="col-md-4">
                      <label className="form-label small fw-bold">Price Per Night ($)</label>
                      <input
                        type="number"
                        className="form-control"
                        required
                        placeholder="e.g. 249"
                        value={roomFormData.pricePerNight}
                        onChange={(e) => setRoomFormData({ ...roomFormData, pricePerNight: e.target.value })}
                      />
                    </div>
                    <div className="col-md-4">
                      <label className="form-label small fw-bold">Guest Capacity</label>
                      <input
                        type="number"
                        className="form-control"
                        required
                        min="1"
                        value={roomFormData.capacity}
                        onChange={(e) => setRoomFormData({ ...roomFormData, capacity: e.target.value })}
                      />
                    </div>
                    <div className="col-md-12">
                      <label className="form-label small fw-bold">Image URL</label>
                      <input
                        type="url"
                        className="form-control"
                        required
                        value={roomFormData.images}
                        onChange={(e) => setRoomFormData({ ...roomFormData, images: e.target.value })}
                      />
                    </div>
                    <div className="col-md-12">
                      <label className="form-label small fw-bold">Amenities (comma separated)</label>
                      <input
                        type="text"
                        className="form-control"
                        value={roomFormData.amenities}
                        onChange={(e) => setRoomFormData({ ...roomFormData, amenities: e.target.value })}
                      />
                    </div>
                    <div className="col-md-12">
                      <label className="form-label small fw-bold">Room Description</label>
                      <textarea
                        className="form-control"
                        rows="3"
                        required
                        value={roomFormData.description}
                        onChange={(e) => setRoomFormData({ ...roomFormData, description: e.target.value })}
                      ></textarea>
                    </div>
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-light rounded-pill px-4" onClick={() => setShowRoomModal(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary rounded-pill px-4 fw-bold">
                    {editingRoomId ? 'Save Changes' : 'Create Room'}
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
