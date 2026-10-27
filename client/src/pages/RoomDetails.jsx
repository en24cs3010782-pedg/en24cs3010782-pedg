import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import API from '../services/api';
import { useAuth } from '../context/AuthContext';

const RoomDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [bookingLoading, setBookingLoading] = useState(false);

  // Booking Form State
  const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];
  const dayAfter = new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0];

  const [checkInDate, setCheckInDate] = useState(tomorrow);
  const [checkOutDate, setCheckOutDate] = useState(dayAfter);
  const [guestsCount, setGuestsCount] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState('Credit/Debit Card');
  const [fullName, setFullName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [specialRequests, setSpecialRequests] = useState('');

  useEffect(() => {
    const fetchRoom = async () => {
      try {
        const res = await API.get(`/rooms/${id}`);
        if (res.data.success) {
          setRoom(res.data.room);
        }
      } catch (err) {
        setError('Room not found or server error');
      } finally {
        setLoading(false);
      }
    };

    fetchRoom();
  }, [id]);

  useEffect(() => {
    if (user) {
      if (!fullName) setFullName(user.name);
      if (!email) setEmail(user.email);
      if (!phone && user.phone) setPhone(user.phone);
    }
  }, [user]);

  // Calculate nights and total price
  const calculateTotals = () => {
    if (!checkInDate || !checkOutDate) return { nights: 1, subtotal: room?.pricePerNight || 0, taxes: 0, total: 0 };
    const inDate = new Date(checkInDate);
    const outDate = new Date(checkOutDate);
    const diffTime = outDate - inDate;
    const nights = Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
    const subtotal = nights * (room?.pricePerNight || 0);
    const taxes = Math.round(subtotal * 0.12); // 12% hotel tax
    const total = subtotal + taxes;
    return { nights, subtotal, taxes, total };
  };

  const { nights, subtotal, taxes, total } = calculateTotals();

  const handleBooking = async (e) => {
    e.preventDefault();
    setError('');

    if (!user) {
      navigate('/login', { state: { from: `/rooms/${id}` } });
      return;
    }

    if (new Date(checkInDate) >= new Date(checkOutDate)) {
      setError('Check-out date must be strictly after check-in date');
      return;
    }

    setBookingLoading(true);

    try {
      const res = await API.post('/bookings', {
        roomId: room._id,
        checkInDate,
        checkOutDate,
        guestsCount: Number(guestsCount),
        paymentMethod,
        guestDetails: {
          fullName,
          email,
          phone,
          specialRequests
        }
      });

      if (res.data.success) {
        navigate('/booking-success', { state: { booking: res.data.booking } });
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to complete reservation. Please try again.');
    } finally {
      setBookingLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-50">
        <div className="spinner-border text-primary" role="status"></div>
      </div>
    );
  }

  if (error && !room) {
    return (
      <div className="container py-5 text-center">
        <div className="alert alert-danger mx-auto" style={{ maxWidth: 500 }}>
          {error}
        </div>
        <Link to="/rooms" className="btn btn-primary">Return to Rooms</Link>
      </div>
    );
  }

  return (
    <div className="container py-5">
      {/* Breadcrumb */}
      <nav aria-label="breadcrumb" className="mb-4">
        <ol className="breadcrumb small">
          <li className="breadcrumb-item"><Link to="/" className="text-decoration-none">Home</Link></li>
          <li className="breadcrumb-item"><Link to="/rooms" className="text-decoration-none">Rooms</Link></li>
          <li className="breadcrumb-item active" aria-current="page">{room.title}</li>
        </ol>
      </nav>

      <div className="row g-5">
        {/* Left Column: Room Details & Gallery */}
        <div className="col-lg-7">
          <div className="rounded-4 overflow-hidden shadow-sm mb-4" style={{ maxHeight: 440 }}>
            <img
              src={room.images?.[0] || 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1200&q=80'}
              alt={room.title}
              className="w-100 h-100 object-fit-cover"
            />
          </div>

          <div className="d-flex align-items-center gap-2 mb-2">
            <span className="badge bg-primary px-3 py-2 text-uppercase">{room.type}</span>
            <span className="badge bg-light text-dark border px-3 py-2">
              <i className="bi bi-door-closed me-1"></i> Room #{room.roomNumber}
            </span>
            <span className="badge bg-warning text-dark px-3 py-2">
              <i className="bi bi-star-fill me-1"></i> {room.rating || 4.9} Rating
            </span>
          </div>

          <h2 className="display-6 fw-bold font-display mb-3">{room.title}</h2>

          <div className="d-flex gap-4 text-muted small mb-4 py-2 border-top border-bottom">
            <div><i className="bi bi-people me-1 text-primary"></i> <strong>{room.capacity}</strong> Guests Allowed</div>
            <div><i className="bi bi-arrows-fullscreen me-1 text-primary"></i> <strong>580</strong> sq. ft.</div>
            <div><i className="bi bi-eye me-1 text-primary"></i> Panoramic Skyline View</div>
          </div>

          <h5 className="fw-bold mb-3">Room Overview</h5>
          <p className="text-muted lh-lg mb-4">{room.description}</p>

          <h5 className="fw-bold mb-3">Included Amenities & Services</h5>
          <div className="row g-2 mb-5">
            {room.amenities?.map((amenity, idx) => (
              <div key={idx} className="col-sm-6">
                <div className="p-2 border rounded-3 d-flex align-items-center gap-2 bg-white">
                  <i className="bi bi-check-circle-fill text-success fs-5"></i>
                  <span className="small fw-medium">{amenity}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Hotel Policies */}
          <div className="card bg-light border-0 p-4 rounded-4">
            <h6 className="fw-bold mb-3"><i className="bi bi-info-circle me-2 text-primary"></i> Hotel Policies & Notice</h6>
            <ul className="small text-muted mb-0 ps-3 d-flex flex-column gap-2">
              <li>Check-in: 3:00 PM | Check-out: 11:00 AM</li>
              <li>Free cancellation up to 24 hours prior to arrival.</li>
              <li>Government-issued photo identification required upon arrival.</li>
            </ul>
          </div>
        </div>

        {/* Right Column: Reservation & Pricing Card */}
        <div className="col-lg-5">
          <div className="card border-0 shadow-lg p-4 rounded-4 sticky-top" style={{ top: 90 }}>
            <div className="d-flex justify-content-between align-items-baseline mb-4">
              <div>
                <span className="display-6 fw-bold text-primary">${room.pricePerNight}</span>
                <span className="text-muted"> / night</span>
              </div>
              <span className="badge bg-success-subtle text-success border border-success px-3 py-2">
                Available Now
              </span>
            </div>

            {error && (
              <div className="alert alert-danger small py-2 mb-3">
                <i className="bi bi-exclamation-triangle-fill me-1"></i> {error}
              </div>
            )}

            <form onSubmit={handleBooking}>
              <div className="row g-2 mb-3">
                <div className="col-6">
                  <label className="form-label small fw-bold text-muted">Check-In</label>
                  <input
                    type="date"
                    className="form-control form-control-sm"
                    required
                    value={checkInDate}
                    onChange={(e) => setCheckInDate(e.target.value)}
                  />
                </div>
                <div className="col-6">
                  <label className="form-label small fw-bold text-muted">Check-Out</label>
                  <input
                    type="date"
                    className="form-control form-control-sm"
                    required
                    value={checkOutDate}
                    onChange={(e) => setCheckOutDate(e.target.value)}
                  />
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label small fw-bold text-muted">Guests</label>
                <select
                  className="form-select form-select-sm"
                  value={guestsCount}
                  onChange={(e) => setGuestsCount(e.target.value)}
                >
                  {[...Array(room.capacity)].map((_, i) => (
                    <option key={i + 1} value={i + 1}>
                      {i + 1} {i === 0 ? 'Guest' : 'Guests'}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mb-3">
                <label className="form-label small fw-bold text-muted">Guest Full Name</label>
                <input
                  type="text"
                  className="form-control form-control-sm"
                  required
                  placeholder="e.g. John Doe"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                />
              </div>

              <div className="row g-2 mb-3">
                <div className="col-6">
                  <label className="form-label small fw-bold text-muted">Email</label>
                  <input
                    type="email"
                    className="form-control form-control-sm"
                    required
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="col-6">
                  <label className="form-label small fw-bold text-muted">Phone</label>
                  <input
                    type="text"
                    className="form-control form-control-sm"
                    placeholder="+1 555-0192"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label small fw-bold text-muted">Payment Method</label>
                <select
                  className="form-select form-select-sm"
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                >
                  <option value="Credit/Debit Card">Credit/Debit Card (Instant)</option>
                  <option value="UPI">UPI / Google Pay / PhonePe</option>
                  <option value="Net Banking">Net Banking</option>
                  <option value="Cash on Arrival">Cash on Arrival at Reception</option>
                </select>
              </div>

              <div className="mb-3">
                <label className="form-label small fw-bold text-muted">Special Requests (Optional)</label>
                <textarea
                  className="form-control form-control-sm"
                  rows="2"
                  placeholder="e.g. Quiet floor, extra towels, early check-in"
                  value={specialRequests}
                  onChange={(e) => setSpecialRequests(e.target.value)}
                ></textarea>
              </div>

              {/* Price Breakdown */}
              <div className="bg-light p-3 rounded-3 mb-4 small">
                <div className="d-flex justify-content-between mb-1">
                  <span className="text-muted">${room.pricePerNight} × {nights} Nights</span>
                  <span>${subtotal}</span>
                </div>
                <div className="d-flex justify-content-between mb-1">
                  <span className="text-muted">Hospitality Taxes (12%)</span>
                  <span>${taxes}</span>
                </div>
                <div className="d-flex justify-content-between pt-2 border-top fw-bold fs-6">
                  <span>Total Amount</span>
                  <span className="text-primary">${total}</span>
                </div>
              </div>

              <button
                type="submit"
                disabled={bookingLoading}
                className="btn btn-primary w-100 py-3 fw-bold rounded-3 shadow-sm"
              >
                {bookingLoading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2"></span>
                    Processing Reservation...
                  </>
                ) : (
                  <>
                    <i className="bi bi-lock-fill me-1"></i>
                    {user ? 'Confirm & Reserve Now' : 'Sign in to Reserve'}
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoomDetails;
