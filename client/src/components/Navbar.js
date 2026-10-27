import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout, isStaff, isAdmin } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-custom sticky-top">
      <div className="container">
        <Link className="navbar-brand brand-logo" to="/">
          <i className="bi bi-building-fill-check text-primary"></i>
          <span>HotelPro</span>
        </Link>

        <button
          className="navbar-toggler border-0 shadow-none"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarContent"
          aria-controls="navbarContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarContent">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0 ms-lg-3">
            <li className="nav-item">
              <Link className="nav-link fw-medium text-dark" to="/">
                Home
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link fw-medium text-dark" to="/rooms">
                Explore Rooms
              </Link>
            </li>
            {user && (
              <li className="nav-item">
                <Link className="nav-link fw-medium text-dark" to="/dashboard">
                  My Bookings
                </Link>
              </li>
            )}
            {isStaff && (
              <li className="nav-item">
                <Link className="nav-link fw-bold text-primary" to="/admin">
                  <i className="bi bi-speedometer2 me-1"></i> Management Portal
                </Link>
              </li>
            )}
          </ul>

          <div className="d-flex align-items-center gap-2">
            {user ? (
              <div className="dropdown">
                <button
                  className="btn btn-outline-secondary dropdown-toggle d-flex align-items-center gap-2 rounded-pill px-3 py-1"
                  type="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  <i className="bi bi-person-circle fs-5 text-primary"></i>
                  <span className="fw-semibold">{user.name}</span>
                  <span
                    className={`badge ms-1 ${
                      isAdmin
                        ? 'bg-danger'
                        : isStaff
                        ? 'bg-warning text-dark'
                        : 'bg-info text-dark'
                    }`}
                  >
                    {user.role}
                  </span>
                </button>
                <ul className="dropdown-menu dropdown-menu-end shadow border-0 mt-2">
                  <li>
                    <Link className="dropdown-item py-2" to="/dashboard">
                      <i className="bi bi-calendar-check me-2"></i> My Bookings
                    </Link>
                  </li>
                  {isStaff && (
                    <li>
                      <Link className="dropdown-item py-2" to="/admin">
                        <i className="bi bi-gear-wide-connected me-2"></i> Management
                      </Link>
                    </li>
                  )}
                  <li>
                    <hr className="dropdown-divider" />
                  </li>
                  <li>
                    <button
                      className="dropdown-item text-danger py-2"
                      onClick={handleLogout}
                    >
                      <i className="bi bi-box-arrow-right me-2"></i> Sign Out
                    </button>
                  </li>
                </ul>
              </div>
            ) : (
              <div className="d-flex gap-2">
                <Link to="/login" className="btn btn-outline-primary px-3 rounded-pill fw-semibold">
                  Sign In
                </Link>
                <Link to="/register" className="btn btn-primary px-3 rounded-pill fw-semibold">
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
