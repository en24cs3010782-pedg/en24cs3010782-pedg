import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../services/api';

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  const [message, setMessage] = useState('');

  const fetchBookings = async () => {
    try {
      const res = await API.get('/bookings/my-bookings');
      if (res.data.success) {
        setBookings(res.data.bookings);
      }
    } catch (err) {
      console.error('Error fetching bookings:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleCancel = async (bookingId) => {
    if (!window.confirm('Are you sure you want to cancel this reservation?')) return;
    setActionLoading(bookingId);
    try {
      const res = await API.put(`/bookings/${bookingId}/cancel`);
      if (res.data.success) {
        setMessage('Booking successfully cancelled. Refund processed.');
        fetchBookings();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to cancel booking');
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <div className="container py-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 className="fw-bold font-display">My Reservations</h1>
          <p className="text-muted mb-0">Track and manage your upcoming hotel stays and booking history.</p>
        </div>
        <Link to="/rooms" className="btn btn-primary rounded-pill px-4 btn-sm fw-semibold">
          <i className="bi bi-plus-lg me-1"></i> Book New Room
        </Link>
      </div>

      {message && (
        <div className="alert alert-info alert-dismissible fade show" role="alert">
          {message}
          <button type="button" className="btn-close" onClick={() => setMessage('')}></button>
        </div>
      )}

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status"></div>
        </div>
      ) : bookings.length === 0 ? (
        <div className="card border-0 shadow-sm p-5 text-center rounded-4">
          <i className="bi bi-calendar-x text-muted display-4 mb-3"></i>
          <h5 className="fw-bold">No reservations found</h5>
          <p className="text-muted small mb-4">You have not booked any stays yet. Discover our luxurious rooms today!</p>
          <div>
            <Link to="/rooms" className="btn btn-primary rounded-pill px-4">
              Explore Rooms
            </Link>
          </div>
        </div>
      ) : (
        <div className="d-flex flex-column gap-4">
          {bookings.map((b) => (
            <div key={b._id} className="card border-0 shadow-sm rounded-4 overflow-hidden">
              <div className="row g-0">
                <div className="col-md-3">
                  <img
                    src={b.room?.images?.[0] || 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=600&q=80'}
                    alt={b.room?.title}
                    className="w-100 h-100 object-fit-cover"
                    style={{ minHeight: 180 }}
                  />
                </div>

                <div className="col-md-9 p-4 d-flex flex-column justify-content-between">
                  <div>
                    <div className="d-flex justify-content-between align-items-start mb-2">
                      <div>
                        <span className="badge bg-light text-muted border me-2">Room #{b.room?.roomNumber}</span>
                        <span className="badge bg-primary text-uppercase">{b.room?.type}</span>
                        <h5 className="fw-bold mt-2 mb-0">{b.room?.title || 'Luxury Room'}</h5>
                      </div>
                      <span className={`badge px-3 py-2 text-capitalize ${
                        b.status === 'confirmed' ? 'bg-success' :
                        b.status === 'checked-in' ? 'bg-primary' :
                        b.status === 'checked-out' ? 'bg-secondary' : 'bg-danger'
                      }`}>
                        {b.status}
                      </span>
                    </div>

                    <div className="row g-3 small text-muted my-2">
                      <div className="col-sm-4">
                        <i className="bi bi-calendar-event me-1 text-primary"></i>
                        <strong>Check-In:</strong> {new Date(b.checkInDate).toLocaleDateString()}
                      </div>
                      <div className="col-sm-4">
                        <i className="bi bi-calendar-check me-1 text-primary"></i>
                        <strong>Check-Out:</strong> {new Date(b.checkOutDate).toLocaleDateString()}
                      </div>
                      <div className="col-sm-4">
                        <i className="bi bi-people me-1 text-primary"></i>
                        <strong>Guests:</strong> {b.guestsCount} ({b.totalNights} Nights)
                      </div>
                    </div>
                  </div>

                  <div className="d-flex justify-content-between align-items-center pt-3 border-top mt-3">
                    <div>
                      <span className="text-muted small">Total Paid: </span>
                      <strong className="fs-5 text-primary">${b.totalAmount}</strong>
                      <span className="badge bg-light text-secondary border ms-2 small">{b.paymentMethod}</span>
                    </div>

                    <div className="d-flex gap-2">
                      {['confirmed', 'pending'].includes(b.status) && (
                        <button
                          onClick={() => handleCancel(b._id)}
                          disabled={actionLoading === b._id}
                          className="btn btn-outline-danger btn-sm rounded-pill px-3"
                        >
                          {actionLoading === b._id ? 'Cancelling...' : 'Cancel Reservation'}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyBookings;
