import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

const UserDashboard = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionMsg, setActionMsg] = useState({ type: '', text: '' });
  const [cancellingId, setCancellingId] = useState(null);

  const fetchMyBookings = async () => {
    try {
      const res = await api.get('/bookings/my-bookings');
      if (res.data.success) {
        setBookings(res.data.data);
      }
    } catch (err) {
      console.error('Failed to load user bookings:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyBookings();
  }, []);

  const handleCancelBooking = async (id) => {
    if (!window.confirm('Are you sure you want to cancel this reservation? Refund will be processed.')) {
      return;
    }
    setCancellingId(id);
    setActionMsg({ type: '', text: '' });
    try {
      const res = await api.put(`/bookings/${id}/cancel`);
      if (res.data.success) {
        setActionMsg({ type: 'success', text: 'Reservation successfully cancelled.' });
        fetchMyBookings();
      }
    } catch (err) {
      setActionMsg({
        type: 'danger',
        text: err.response?.data?.message || 'Failed to cancel reservation.',
      });
    } finally {
      setCancellingId(null);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Confirmed':
        return 'bg-primary-subtle text-primary border border-primary-subtle';
      case 'CheckedIn':
        return 'bg-success-subtle text-success border border-success-subtle';
      case 'CheckedOut':
        return 'bg-secondary-subtle text-secondary border border-secondary-subtle';
      case 'Cancelled':
        return 'bg-danger-subtle text-danger border border-danger-subtle';
      default:
        return 'bg-light text-dark';
    }
  };

  return (
    <div className="container py-4">
      {/* Welcome Banner */}
      <div className="card shadow-sm border-0 rounded-4 p-4 bg-white mb-4">
        <div className="d-flex flex-wrap justify-content-between align-items-center gap-3">
          <div>
            <span className="badge bg-light text-primary border px-3 py-1 mb-2">
              Guest Portal
            </span>
            <h2 className="fw-bold mb-1">Hello, {user?.name}! 👋</h2>
            <p className="text-muted small mb-0">
              Manage your upcoming stays, review booking receipts, and track reservation statuses.
            </p>
          </div>
          <Link to="/rooms" className="btn btn-primary-hotel px-4 rounded-pill">
            <i className="bi bi-plus-lg me-1"></i> Book New Room
          </Link>
        </div>
      </div>

      {actionMsg.text && (
        <div className={`alert alert-${actionMsg.type} shadow-sm rounded-3 mb-4`} role="alert">
          {actionMsg.type === 'success' ? (
            <i className="bi bi-check-circle-fill me-2"></i>
          ) : (
            <i className="bi bi-exclamation-triangle-fill me-2"></i>
          )}
          {actionMsg.text}
        </div>
      )}

      {/* Bookings Section */}
      <h4 className="fw-bold text-dark mb-3">Your Reservations ({bookings.length})</h4>

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status"></div>
        </div>
      ) : bookings.length === 0 ? (
        <div className="card border-0 shadow-sm text-center p-5 bg-white rounded-4">
          <i className="bi bi-calendar-x fs-1 text-muted mb-3"></i>
          <h5 className="fw-bold">No Reservations Found</h5>
          <p className="text-muted small">You haven't reserved any hotel rooms yet.</p>
          <Link to="/rooms" className="btn btn-outline-primary mx-auto rounded-pill px-4">
            Browse Available Rooms
          </Link>
        </div>
      ) : (
        <div className="row g-4">
          {bookings.map((booking) => {
            const room = booking.room || {};
            const checkInFormatted = new Date(booking.checkInDate).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
            });
            const checkOutFormatted = new Date(booking.checkOutDate).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
            });

            return (
              <div className="col-lg-6" key={booking._id}>
                <div className="card border-0 shadow-sm rounded-4 overflow-hidden h-100 bg-white">
                  <div className="row g-0 h-100">
                    <div className="col-md-5">
                      <img
                        src={
                          room.images && room.images[0]
                            ? room.images[0]
                            : 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=600&q=80'
                        }
                        alt={room.title || 'Room'}
                        className="img-fluid h-100 w-100"
                        style={{ objectFit: 'cover', minHeight: '200px' }}
                      />
                    </div>
                    <div className="col-md-7 d-flex flex-column p-4">
                      <div className="d-flex justify-content-between align-items-start mb-2">
                        <span className={`badge rounded-pill px-3 py-1 ${getStatusBadge(booking.status)}`}>
                          {booking.status}
                        </span>
                        <span className="small text-muted">
                          Room #{room.roomNumber || 'N/A'}
                        </span>
                      </div>

                      <h5 className="fw-bold mb-1 text-dark">{room.title || 'Hotel Room'}</h5>
                      <span className="small text-muted mb-3">{room.type || 'Standard'} Category</span>

                      <div className="small text-muted mb-2">
                        <i className="bi bi-calendar3 me-2 text-primary"></i>
                        <strong>{checkInFormatted}</strong> — <strong>{checkOutFormatted}</strong>
                      </div>

                      <div className="small text-muted mb-3">
                        <i className="bi bi-moon-stars me-2 text-primary"></i>
                        {booking.totalNights} Night(s) &bull; {booking.guestsCount} Guest(s)
                      </div>

                      <div className="d-flex justify-content-between align-items-center mt-auto pt-3 border-top">
                        <div>
                          <span className="fw-bold fs-5 text-primary">${booking.totalPrice}</span>
                          <span className="badge bg-success-subtle text-success ms-2">
                            {booking.paymentStatus}
                          </span>
                        </div>

                        {booking.status !== 'Cancelled' && booking.status !== 'CheckedOut' && (
                          <button
                            onClick={() => handleCancelBooking(booking._id)}
                            disabled={cancellingId === booking._id}
                            className="btn btn-outline-danger btn-sm rounded-pill px-3"
                          >
                            {cancellingId === booking._id ? (
                              <span className="spinner-border spinner-border-sm"></span>
                            ) : (
                              'Cancel'
                            )}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default UserDashboard;
