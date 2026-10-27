import React from 'react';
import { useLocation, Link, Navigate } from 'react-router-dom';

const BookingConfirmation = () => {
  const location = useLocation();
  const booking = location.state?.booking;

  if (!booking) {
    return <Navigate to="/my-bookings" replace />;
  }

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="container py-5">
      <div className="card border-0 shadow-lg mx-auto rounded-4 overflow-hidden" style={{ maxWidth: 680 }}>
        <div className="bg-success text-white text-center py-4 px-3">
          <div className="display-4 mb-2"><i className="bi bi-check-circle-fill"></i></div>
          <h3 className="fw-bold mb-1">Reservation Confirmed!</h3>
          <p className="small mb-0 opacity-75">Thank you for choosing HotelPro. A confirmation has been sent to your email.</p>
        </div>

        <div className="p-4 p-md-5">
          <div className="d-flex justify-content-between align-items-center mb-4 pb-3 border-bottom">
            <div>
              <span className="text-muted small">Booking Reference</span>
              <h5 className="fw-bold mb-0 text-primary">#{booking._id.slice(-8).toUpperCase()}</h5>
            </div>
            <span className="badge bg-success-subtle text-success border border-success px-3 py-2 text-uppercase">
              {booking.status}
            </span>
          </div>

          <div className="row g-3 mb-4">
            <div className="col-sm-6">
              <label className="text-muted small d-block">Room Reserved</label>
              <strong>{booking.room?.title || 'Luxury Suite'}</strong>
              <div className="text-muted small">Room #{booking.room?.roomNumber} ({booking.room?.type})</div>
            </div>

            <div className="col-sm-6">
              <label className="text-muted small d-block">Guests</label>
              <strong>{booking.guestsCount} Guest(s)</strong>
              <div className="text-muted small">{booking.totalNights} Night(s) Stay</div>
            </div>

            <div className="col-sm-6">
              <label className="text-muted small d-block">Check-In</label>
              <strong>{new Date(booking.checkInDate).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}</strong>
              <div className="text-muted small">From 3:00 PM</div>
            </div>

            <div className="col-sm-6">
              <label className="text-muted small d-block">Check-Out</label>
              <strong>{new Date(booking.checkOutDate).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}</strong>
              <div className="text-muted small">Until 11:00 AM</div>
            </div>
          </div>

          {/* Guest Info */}
          <div className="bg-light p-3 rounded-3 mb-4 small">
            <div className="fw-bold mb-2">Guest & Payment Summary</div>
            <div className="d-flex justify-content-between mb-1">
              <span className="text-muted">Primary Guest:</span>
              <span>{booking.guestDetails?.fullName}</span>
            </div>
            <div className="d-flex justify-content-between mb-1">
              <span className="text-muted">Payment Method:</span>
              <span>{booking.paymentMethod}</span>
            </div>
            <div className="d-flex justify-content-between mb-1">
              <span className="text-muted">Payment Status:</span>
              <span className="badge bg-success">{booking.paymentStatus?.toUpperCase()}</span>
            </div>
            <div className="d-flex justify-content-between pt-2 border-top fw-bold fs-6">
              <span>Total Paid:</span>
              <span className="text-success">${booking.totalAmount}</span>
            </div>
          </div>

          <div className="d-flex flex-wrap gap-2 justify-content-between pt-2">
            <button onClick={handlePrint} className="btn btn-outline-dark btn-sm rounded-pill px-3">
              <i className="bi bi-printer me-1"></i> Print Voucher
            </button>
            <div className="d-flex gap-2">
              <Link to="/my-bookings" className="btn btn-primary btn-sm rounded-pill px-4">
                View My Bookings
              </Link>
              <Link to="/" className="btn btn-light btn-sm rounded-pill px-3 border">
                Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingConfirmation;
