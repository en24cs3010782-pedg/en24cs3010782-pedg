import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState('guest');
  const [errorMsg, setErrorMsg] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (password.length < 6) {
      setErrorMsg('Password must be at least 6 characters long.');
      return;
    }

    setSubmitting(true);
    try {
      await register({ name, email, password, phone, role });
      navigate(role === 'guest' ? '/rooms' : '/admin');
    } catch (err) {
      setErrorMsg(
        err.response && err.response.data && err.response.data.message
          ? err.response.data.message
          : 'Registration failed. Please check your input.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-8 col-lg-6">
          <div className="card shadow-lg border-0 rounded-4 p-4 p-md-5 bg-white">
            <div className="text-center mb-4">
              <div className="fs-1 text-primary mb-2">
                <i className="bi bi-person-plus-fill"></i>
              </div>
              <h3 className="fw-extrabold text-dark">Join HotelPro</h3>
              <p className="text-muted small">
                Create your account to book stays and access guest privileges
              </p>
            </div>

            {errorMsg && (
              <div className="alert alert-danger py-2 small rounded-3" role="alert">
                <i className="bi bi-exclamation-circle-fill me-2"></i>
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label small fw-semibold text-muted">Full Name</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. Eleanor Vance"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label small fw-semibold text-muted">Email Address</label>
                <input
                  type="email"
                  className="form-control"
                  placeholder="eleanor@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="row g-2 mb-3">
                <div className="col-md-6">
                  <label className="form-label small fw-semibold text-muted">Phone Number</label>
                  <input
                    type="tel"
                    className="form-control"
                    placeholder="+1 (555) 000-0000"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label small fw-semibold text-muted">Account Type</label>
                  <select
                    className="form-select"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                  >
                    <option value="guest">Guest / Traveler</option>
                    <option value="staff">Hotel Staff</option>
                  </select>
                </div>
              </div>

              <div className="mb-4">
                <label className="form-label small fw-semibold text-muted">Password (min 6 chars)</label>
                <input
                  type="password"
                  className="form-control"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="btn btn-primary-hotel w-100 py-2 fw-semibold rounded-3 mb-3"
              >
                {submitting ? (
                  <span className="spinner-border spinner-border-sm me-2"></span>
                ) : (
                  <i className="bi bi-check2-circle me-2"></i>
                )}
                Create Account
              </button>
            </form>

            <div className="text-center mt-3">
              <small className="text-muted">
                Already have an account?{' '}
                <Link to="/login" className="fw-semibold text-primary text-decoration-none">
                  Sign In
                </Link>
              </small>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
