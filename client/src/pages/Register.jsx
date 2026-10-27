import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    try {
      await register({ name, email, phone, password });
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-5">
      <div className="card border-0 shadow-lg mx-auto rounded-4 overflow-hidden" style={{ maxWidth: 520 }}>
        <div className="bg-navy text-white text-center py-4 px-3">
          <div className="fs-1 text-primary mb-2"><i className="bi bi-person-plus"></i></div>
          <h3 className="fw-bold mb-1">Create an Account</h3>
          <p className="small text-white-50 mb-0">Join HotelPro for member-exclusive rates & fast reservations</p>
        </div>

        <div className="p-4 p-md-5">
          {error && (
            <div className="alert alert-danger small py-2 mb-3">
              <i className="bi bi-exclamation-circle me-1"></i> {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label small fw-bold text-muted">Full Name</label>
              <input
                type="text"
                className="form-control"
                placeholder="e.g. Alexander Hamilton"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className="mb-3">
              <label className="form-label small fw-bold text-muted">Email Address</label>
              <input
                type="email"
                className="form-control"
                placeholder="name@domain.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="mb-3">
              <label className="form-label small fw-bold text-muted">Phone Number</label>
              <input
                type="text"
                className="form-control"
                placeholder="+1 555-0192"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>

            <div className="row g-2 mb-4">
              <div className="col-6">
                <label className="form-label small fw-bold text-muted">Password</label>
                <input
                  type="password"
                  className="form-control"
                  placeholder="Min 6 chars"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <div className="col-6">
                <label className="form-label small fw-bold text-muted">Confirm Password</label>
                <input
                  type="password"
                  className="form-control"
                  placeholder="Re-enter password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary w-100 py-2 fw-bold rounded-3 mb-3"
            >
              {loading ? 'Creating Account...' : 'Complete Registration'}
            </button>
          </form>

          <div className="text-center small text-muted">
            Already have an account?{' '}
            <Link to="/login" className="fw-semibold text-primary text-decoration-none">
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
