import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="footer-custom">
      <div className="container">
        <div className="row g-4">
          <div className="col-lg-4 col-md-6">
            <h5 className="text-white fw-bold mb-3 d-flex align-items-center gap-2">
              <i className="bi bi-building-fill text-warning"></i> HotelPro
            </h5>
            <p className="small text-muted mb-3">
              Your complete hotel booking and management solution. Streamlining operations with secure, scalable backend, real-time availability tracking, and effortless guest management.
            </p>
            <div className="d-flex gap-3 fs-5">
              <a href="#facebook" className="text-secondary"><i className="bi bi-facebook"></i></a>
              <a href="#twitter" className="text-secondary"><i className="bi bi-twitter-x"></i></a>
              <a href="#instagram" className="text-secondary"><i className="bi bi-instagram"></i></a>
              <a href="#linkedin" className="text-secondary"><i className="bi bi-linkedin"></i></a>
            </div>
          </div>

          <div className="col-lg-2 col-md-6">
            <h6 className="text-white fw-semibold mb-3">Quick Navigation</h6>
            <ul className="list-unstyled small d-flex flex-column gap-2">
              <li><Link to="/" className="text-decoration-none text-muted">Home</Link></li>
              <li><Link to="/rooms" className="text-decoration-none text-muted">Explore Rooms</Link></li>
              <li><Link to="/dashboard" className="text-decoration-none text-muted">Guest Dashboard</Link></li>
              <li><Link to="/admin" className="text-decoration-none text-muted">Admin Portal</Link></li>
            </ul>
          </div>

          <div className="col-lg-3 col-md-6">
            <h6 className="text-white fw-semibold mb-3">Room Categories</h6>
            <ul className="list-unstyled small d-flex flex-column gap-2 text-muted">
              <li>Presidential Suite</li>
              <li>Deluxe Queen Room</li>
              <li>Executive King Suite</li>
              <li>Family Comfort Suites</li>
              <li>Standard Single Rooms</li>
            </ul>
          </div>

          <div className="col-lg-3 col-md-6">
            <h6 className="text-white fw-semibold mb-3">24/7 Frontdesk Support</h6>
            <p className="small text-muted mb-1"><i className="bi bi-geo-alt-fill text-warning me-2"></i> 100 Hospitality Way, Grand Bay</p>
            <p className="small text-muted mb-1"><i className="bi bi-telephone-fill text-warning me-2"></i> +1 (800) 555-HOTEL</p>
            <p className="small text-muted mb-0"><i className="bi bi-envelope-fill text-warning me-2"></i> reservations@hotelpro.com</p>
          </div>
        </div>

        <hr className="my-4 border-secondary opacity-25" />

        <div className="d-flex flex-wrap justify-content-between align-items-center small text-muted">
          <span>&copy; {new Date().getFullYear()} HotelPro Management System. All rights reserved.</span>
          <span>Developed for Skill Wallet Project Submission</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
