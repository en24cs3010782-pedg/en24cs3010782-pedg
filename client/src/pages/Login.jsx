import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from || '/';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const data = await login(email, password);
      if (data.user.role === 'admin') {
        navigate('/admin');
      } else {
        navigate(from);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid credentials. Please verify your email and password.');
    } finally {
      setLoading(false);
    }
  };

  const setAdminDemo = () => {
    setEmail('admin@hotelpro.com');
    setPassword('admin123');
  };

  const setGuestDemo = () => {
    setEmail('guest@hotelpro.com');
    setPassword('guest123');
  };

  return (
    <div className="container py-5">
      <div className="card border-0 shadow-lg mx-auto rounded-4 overflow-hidden" style={{ maxWidth: 480 }}>
        <div className="bg-navy text-white text-center py-4 px-3">
          <div className="fs-1 text-warning mb-2"><i className="bi bi-shield-lock"></i></div>
          <h3 className="fw-bold mb-1">Welcome Back</h3>
          <p className="small text-white-50 mb-0">Sign in to manage your bookings or hotel operations</p>
        </div>

        <div className="p-4 p-md-5">
          {error && (
            <div className="alert alert-danger small py-2 mb-3">
              <i className="bi bi-exclamation-circle me-1"></i> {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label small fw-bold text-muted">Email Address</label>
              <div className="input-group">
                <span className="input-group-text bg-light text-muted"><i className="bi bi-envelope"></i></span>
                <input
                  type="email"
                  className="form-control"
                  placeholder="name@hotelpro.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="mb-4">
              <label className="form-label small fw-bold text-muted">Password</label>
              <div className="input-group">
                <span className="input-group-text bg-light text-muted"><i className="bi bi-key"></i></span>
                <input
                  type="password"
                  className="form-control"
                  placeholder="••••••••"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary w-100 py-2 fw-bold rounded-3 mb-3"
            >
              {loading ? 'Authenticating...' : 'Sign In'}
            </button>
          </form>

          {/* Demo Credentials Helper for Quick Evaluation */}
          <div className="p-3 bg-light rounded-3 mb-3 border">
            <span className="small fw-bold text-muted d-block mb-2 text-center">
              <i className="bi bi-magic me-1 text-warning"></i> Quick Fill Demo Accounts
            </span>
            <div className="d-flex gap-2">
              <button
                type="button"
                onClick={setAdminDemo}
                className="btn btn-outline-dark btn-sm flex-fill"
              >
                Admin Demo
              </button>
              <button
                type="button"
                onClick={setGuestDemo}
                className="btn btn-outline-primary btn-sm flex-fill"
              >
                Guest Demo
              </button>
            </div>
          </div>

          <div className="text-center small text-muted">
            Don't have an account yet?{' '}
            <Link to="/register" className="fw-semibold text-primary text-decoration-none">
              Register here
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
