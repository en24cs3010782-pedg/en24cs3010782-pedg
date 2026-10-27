import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

const RoomDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [bookingLoading, setBookingLoading] = useState(false);
  const [successBooking, setSuccessBooking] = useState(null);

  // Booking Form State
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const defaultCheckIn = tomorrow.toISOString().split('T')[0];

  const fourDays = new Date();
  fourDays.setDate(fourDays.getDate() + 4);
  const defaultCheckOut = fourDays.toISOString().split('T')[0];

  const [checkInDate, setCheckInDate] = useState(defaultCheckIn);
  const [checkOutDate, setCheckOutDate] = useState(defaultCheckOut);
  const [guestsCount, setGuestsCount] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState('Credit Card');
  const [specialRequests, setSpecialRequests] = useState('');
  const [guestName, setGuestName] = useState(user ? user.name : '');
  const [guestEmail, setGuestEmail] = useState(user ? user.email : '');
  const [guestPhone, setGuestPhone] = useState(user && user.phone ? user.phone : '');

  useEffect(() => {
    const fetchRoom = async () => {
      try {
        const res = await api.get(`/rooms/${id}`);
        if (res.data.success) {
          setRoom(res.data.data);
          setGuestsCount(1);
        }
      } catch (err) {
        setErrorMsg('Failed to load room details. It may not exist.');
      } finally {
        setLoading(false);
      }
    };
    fetchRoom();
  }, [id]);

  useEffect(() => {
    if (user) {
      if (!guestName) setGuestName(user.name);
      if (!guestEmail) setGuestEmail(user.email);
      if (!guestPhone && user.phone) setGuestPhone(user.phone);
    }
  }, [user]);

  // Calculations
  const calculateNights = () => {
    if (!checkInDate || !checkOutDate) return 1;
    const inDate = new Date(checkInDate);
    const outDate = new Date(checkOutDate);
    const diffTime = outDate - inDate;
    const nights = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return nights > 0 ? nights : 1;
  };

  const nights = calculateNights();
  const subtotal = room ? nights * room.pricePerNight : 0;
  const taxes = Math.round(subtotal * 0.1);
  const grandTotal = subtotal + taxes;

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!isAuthenticated) {
      navigate('/login', { state: { from: `/rooms/${id}` } });
      return;
    }

    if (new Date(checkOutDate) <= new Date(checkInDate)) {
      setErrorMsg('Check-out date must be strictly after the check-in date.');
      return;
    }

    setBookingLoading(true);
    try {
      const payload = {
        roomId: room._id,
        checkInDate,
        checkOutDate,
        guestsCount: Number(guestsCount),
        paymentMethod,
        specialRequests,
        guestName,
        guestEmail,
        guestPhone,
      };

      const res = await api.post('/bookings', payload);
      if (res.data.success) {
        setSuccessBooking(res.data.data);
      }
    } catch (err) {
      setErrorMsg(
        err.response && err.response.data && err.response.data.message
          ? err.response.data.message
          : 'Failed to process booking reservation.'
      );
    } finally {
      setBookingLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary" role="status"></div>
      </div>
    );
  }

  if (!room) {
    return (
      <div className="container py-5 text-center">
        <h3>Room Not Found</h3>
        <p className="text-muted">{errorMsg || 'The requested room could not be loaded.'}</p>
        <Link to="/rooms" className="btn btn-primary rounded-pill px-4 mt-2">
          Back to Rooms
        </Link>
      </div>
    );
  }

  return (
    <div className="container py-4">
      {/* Breadcrumb */}
      <nav aria-label="breadcrumb" className="mb-3">
        <ol className="breadcrumb">
          <li className="breadcrumb-item"><Link to="/">Home</Link></li>
          <li className="breadcrumb-item"><Link to="/rooms">Rooms</Link></li>
          <li className="breadcrumb-item active" aria-current="page">{room.title}</li>
        </ol>
      </nav>

      {/* Success Booking Modal / Alert */}
      {successBooking && (
        <div className="alert alert-success shadow-sm rounded-3 p-4 mb-4 border-0">
          <div className="d-flex align-items-center gap-3">
            <i className="bi bi-check-circle-fill fs-1 text-success"></i>
            <div>
              <h4 className="alert-heading fw-bold mb-1">Booking Confirmed Successfully!</h4>
              <p className="mb-2">
                Your reservation for <strong>{room.title}</strong> has been secured. Booking ID: <code>{successBooking._id}</code>.
              </p>
              <div className="d-flex gap-2">
                <Link to="/dashboard" className="btn btn-success rounded-pill px-3 fw-semibold">
                  View in My Bookings
                </Link>
                <Link to="/rooms" className="btn btn-outline-secondary rounded-pill px-3">
                  Explore More Rooms
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {errorMsg && (
        <div className="alert alert-danger shadow-sm rounded-3 mb-4">
          <i className="bi bi-exclamation-triangle-fill me-2"></i>
          {errorMsg}
        </div>
      )}

      <div className="row g-4">
        {/* Left Column: Room Details & Gallery */}
        <div className="col-lg-7">
          <div className="card border-0 shadow-sm rounded-3 overflow-hidden mb-4">
            <img
              src={room.images && room.images[0] ? room.images[0] : 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1000&q=80'}
              alt={room.title}
              className="img-fluid w-100"
              style={{ maxHeight: '420px', objectFit: 'cover' }}
            />
            {room.images && room.images.length > 1 && (
              <div className="d-flex gap-2 p-3 bg-light border-top">
                {room.images.map((img, i) => (
                  <img
                    key={i}
                    src={img}
                    alt={`${room.title}-${i}`}
                    style={{ width: '80px', height: '60px', objectFit: 'cover', borderRadius: '6px' }}
                  />
                ))}
              </div>
            )}
          </div>

          <div className="card border-0 shadow-sm rounded-3 p-4 bg-white mb-4">
            <div className="d-flex justify-content-between align-items-start mb-3">
              <div>
                <span className="badge bg-primary-subtle text-primary border border-primary-subtle px-3 py-1 mb-2">
                  {room.type} Suite
                </span>
                <h2 className="fw-bold text-dark mb-1">{room.title}</h2>
                <span className="text-muted">Room #{room.roomNumber}</span>
              </div>
              <div className="text-end">
                <h2 className="fw-bold text-primary mb-0">${room.pricePerNight}</h2>
                <small className="text-muted">per night</small>
              </div>
            </div>

            <hr className="my-3" />

            <h5 className="fw-bold mb-2">Description</h5>
            <p className="text-muted lh-base">{room.description}</p>

            <h5 className="fw-bold mt-4 mb-3">Room Features & Specifications</h5>
            <div className="row g-3 mb-4">
              <div className="col-6 col-md-3">
                <div className="p-3 bg-light rounded text-center">
                  <i className="bi bi-people fs-4 text-primary d-block mb-1"></i>
                  <span className="small text-muted d-block">Capacity</span>
                  <strong>{room.capacity} Guests</strong>
                </div>
              </div>
              <div className="col-6 col-md-3">
                <div className="p-3 bg-light rounded text-center">
                  <i className="bi bi-moon-stars fs-4 text-primary d-block mb-1"></i>
                  <span className="small text-muted d-block">Bed Type</span>
                  <strong>{room.bedType} Bed</strong>
                </div>
              </div>
              <div className="col-6 col-md-3">
                <div className="p-3 bg-light rounded text-center">
                  <i className="bi bi-check2-circle fs-4 text-primary d-block mb-1"></i>
                  <span className="small text-muted d-block">Status</span>
                  <strong>{room.status}</strong>
                </div>
              </div>
              <div className="col-6 col-md-3">
                <div className="p-3 bg-light rounded text-center">
                  <i className="bi bi-shield-check fs-4 text-primary d-block mb-1"></i>
                  <span className="small text-muted d-block">Sanitized</span>
                  <strong>Daily</strong>
                </div>
              </div>
            </div>

            <h5 className="fw-bold mt-2 mb-3">Included Amenities</h5>
            <div className="d-flex flex-wrap gap-2">
              {room.amenities &&
                room.amenities.map((amenity, idx) => (
                  <span key={idx} className="badge bg-light text-dark border p-2 px-3 fs-6 fw-normal">
                    <i className="bi bi-check text-success me-1"></i> {amenity}
                  </span>
                ))}
            </div>
          </div>
        </div>

        {/* Right Column: Reservation & Pricing Card */}
        <div className="col-lg-5">
          <div className="card border-0 shadow-md rounded-3 p-4 bg-white sticky-top" style={{ top: '90px' }}>
            <h4 className="fw-bold text-dark mb-3">Book Your Stay</h4>

            <form onSubmit={handleBookingSubmit}>
              <div className="row g-3 mb-3">
                <div className="col-6">
                  <label className="form-label small fw-semibold text-muted">Check-In</label>
                  <input
                    type="date"
                    className="form-control"
                    value={checkInDate}
                    onChange={(e) => setCheckInDate(e.target.value)}
                    required
                  />
                </div>
                <div className="col-6">
                  <label className="form-label small fw-semibold text-muted">Check-Out</label>
                  <input
                    type="date"
                    className="form-control"
                    value={checkOutDate}
                    onChange={(e) => setCheckOutDate(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label small fw-semibold text-muted">Number of Guests</label>
                <select
                  className="form-select"
                  value={guestsCount}
                  onChange={(e) => setGuestsCount(e.target.value)}
                >
                  {[...Array(room.capacity)].map((_, i) => (
                    <option key={i + 1} value={i + 1}>
                      {i + 1} {i === 0 ? 'Guest' : 'Guests'} (Max {room.capacity})
                    </option>
                  ))}
                </select>
              </div>

              <div className="mb-3">
                <label className="form-label small fw-semibold text-muted">Guest Full Name</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. John Doe"
                  value={guestName}
                  onChange={(e) => setGuestName(e.target.value)}
                  required
                />
              </div>

              <div className="row g-2 mb-3">
                <div className="col-6">
                  <label className="form-label small fw-semibold text-muted">Contact Email</label>
                  <input
                    type="email"
                    className="form-control"
                    placeholder="email@example.com"
                    value={guestEmail}
                    onChange={(e) => setGuestEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="col-6">
                  <label className="form-label small fw-semibold text-muted">Phone Number</label>
                  <input
                    type="tel"
                    className="form-control"
                    placeholder="+1 555-0123"
                    value={guestPhone}
                    onChange={(e) => setGuestPhone(e.target.value)}
                  />
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label small fw-semibold text-muted">Payment Method</label>
                <select
                  className="form-select"
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                >
                  <option value="Credit Card">Credit Card (Simulated)</option>
                  <option value="Debit Card">Debit Card</option>
                  <option value="UPI">UPI / Digital Wallet</option>
                  <option value="Cash">Pay at Front Desk</option>
                </select>
              </div>

              <div className="mb-3">
                <label className="form-label small fw-semibold text-muted">Special Requests (Optional)</label>
                <textarea
                  className="form-control"
                  rows="2"
                  placeholder="Early check-in, dietary preferences, high floor..."
                  value={specialRequests}
                  onChange={(e) => setSpecialRequests(e.target.value)}
                ></textarea>
              </div>

              {/* Price Breakdown Calculation */}
              <div className="bg-light p-3 rounded-3 mb-4">
                <div className="d-flex justify-content-between small text-muted mb-2">
                  <span>${room.pricePerNight} × {nights} night(s)</span>
                  <span>${subtotal}</span>
                </div>
                <div className="d-flex justify-content-between small text-muted mb-2">
                  <span>Taxes & Service Fees (10%)</span>
                  <span>${taxes}</span>
                </div>
                <hr className="my-2" />
                <div className="d-flex justify-content-between fw-bold fs-5 text-dark">
                  <span>Total Amount</span>
                  <span className="text-primary">${grandTotal}</span>
                </div>
              </div>

              <button
                type="submit"
                disabled={bookingLoading || room.status === 'Maintenance'}
                className="btn btn-primary-hotel btn-lg w-100 fw-bold shadow-sm"
              >
                {bookingLoading ? (
                  <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                ) : (
                  <i className="bi bi-lock-fill me-2"></i>
                )}
                {isAuthenticated ? 'Confirm & Reserve Now' : 'Sign In to Reserve'}
              </button>

              <div className="text-center mt-3">
                <small className="text-muted">
                  <i className="bi bi-shield-check text-success me-1"></i> Free cancellation up to 24h before check-in
                </small>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoomDetail;
