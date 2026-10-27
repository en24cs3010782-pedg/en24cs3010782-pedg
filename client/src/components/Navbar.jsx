import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-navy sticky-top py-3 shadow-sm">
      <div className="container">
        <Link className="navbar-brand d-flex align-items-center gap-2 fw-bold fs-4" to="/">
          <span className="p-2 bg-primary rounded text-white d-inline-flex align-items-center justify-content-center" style={{ width: 36, height: 36 }}>
            <i className="bi bi-building"></i>
          </span>
          <span>Hotel<span className="text-warning">Pro</span></span>
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#hotelNavbar"
          aria-controls="hotelNavbar"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="hotelNavbar">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0 ms-lg-4 gap-lg-3">
            <li className="nav-item">
              <Link className="nav-link text-white-50 hover-text-white fw-medium" to="/">
                <i className="bi bi-house-door me-1"></i> Home
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link text-white-50 hover-text-white fw-medium" to="/rooms">
                <i className="bi bi-door-open me-1"></i> Rooms & Suites
              </Link>
            </li>
            {user && (
              <li className="nav-item">
                <Link className="nav-link text-white-50 hover-text-white fw-medium" to="/my-bookings">
                  <i className="bi bi-calendar-check me-1"></i> My Bookings
                </Link>
              </li>
            )}
            {isAdmin && (
              <li className="nav-item">
                <Link className="nav-link text-warning fw-semibold" to="/admin">
                  <i className="bi bi-speedometer2 me-1"></i> Admin Portal
                </Link>
              </li>
            )}
          </ul>

          <div className="d-flex align-items-center gap-3">
            {user ? (
              <div className="d-flex align-items-center gap-3">
                <div className="text-end d-none d-sm-block text-white">
                  <div className="fw-semibold small">{user.name}</div>
                  <div className="text-white-50 text-capitalize" style={{ fontSize: '0.75rem' }}>
                    <i className="bi bi-shield-check text-warning me-1"></i>{user.role}
                  </div>
                </div>
                <button onClick={handleLogout} className="btn btn-outline-light btn-sm px-3 rounded-pill">
                  <i className="bi bi-box-arrow-right me-1"></i> Logout
                </button>
              </div>
            ) : (
              <div className="d-flex gap-2">
                <Link to="/login" className="btn btn-outline-light btn-sm px-3 rounded-pill fw-medium">
                  Login
                </Link>
                <Link to="/register" className="btn btn-primary btn-sm px-3 rounded-pill fw-semibold">
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
