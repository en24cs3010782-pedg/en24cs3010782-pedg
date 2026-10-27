import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-navy text-white-50 pt-5 pb-4 mt-5 border-top border-secondary">
      <div className="container">
        <div className="row g-4">
          <div className="col-lg-4 col-md-6">
            <h5 className="text-white fw-bold mb-3 d-flex align-items-center gap-2">
              <i className="bi bi-building text-primary"></i> Hotel<span className="text-warning">Pro</span>
            </h5>
            <p className="small lh-lg">
              HotelPro is an end-to-end hotel booking and operations management suite. From real-time room reservations to front-desk management and executive reporting, we redefine hospitality experiences.
            </p>
            <div className="d-flex gap-3 mt-3">
              <a href="#" className="text-white-50 fs-5"><i className="bi bi-facebook"></i></a>
              <a href="#" className="text-white-50 fs-5"><i className="bi bi-instagram"></i></a>
              <a href="#" className="text-white-50 fs-5"><i className="bi bi-twitter-x"></i></a>
              <a href="#" className="text-white-50 fs-5"><i className="bi bi-linkedin"></i></a>
            </div>
          </div>

          <div className="col-lg-2 col-md-6">
            <h6 className="text-white fw-semibold mb-3">Quick Links</h6>
            <ul className="list-unstyled small d-flex flex-column gap-2">
              <li><Link to="/" className="text-decoration-none text-white-50 hover-text-white">Home</Link></li>
              <li><Link to="/rooms" className="text-decoration-none text-white-50 hover-text-white">All Rooms & Suites</Link></li>
              <li><Link to="/login" className="text-decoration-none text-white-50 hover-text-white">Guest Sign In</Link></li>
              <li><Link to="/register" className="text-decoration-none text-white-50 hover-text-white">Create Account</Link></li>
            </ul>
          </div>

          <div className="col-lg-3 col-md-6">
            <h6 className="text-white fw-semibold mb-3">Room Categories</h6>
            <ul className="list-unstyled small d-flex flex-column gap-2">
              <li><Link to="/rooms?type=Deluxe" className="text-decoration-none text-white-50">Executive Deluxe</Link></li>
              <li><Link to="/rooms?type=Suite" className="text-decoration-none text-white-50">Presidential Suite</Link></li>
              <li><Link to="/rooms?type=Family Suite" className="text-decoration-none text-white-50">Family Garden Villa</Link></li>
              <li><Link to="/rooms?type=Double" className="text-decoration-none text-white-50">Modern Classic Double</Link></li>
            </ul>
          </div>

          <div className="col-lg-3 col-md-6">
            <h6 className="text-white fw-semibold mb-3">Contact Concierge</h6>
            <ul className="list-unstyled small d-flex flex-column gap-2">
              <li><i className="bi bi-geo-alt me-2 text-warning"></i> 742 Ocean Boulevard, Grand Marina</li>
              <li><i className="bi bi-telephone me-2 text-warning"></i> +1 (800) 468-3577</li>
              <li><i className="bi bi-envelope me-2 text-warning"></i> reservations@hotelpro.com</li>
              <li><i className="bi bi-clock me-2 text-warning"></i> 24/7 Front Desk & Concierge</li>
            </ul>
          </div>
        </div>

        <hr className="my-4 border-secondary opacity-50" />

        <div className="d-flex flex-column flex-sm-row justify-content-between align-items-center small">
          <p className="mb-0">© {new Date().getFullYear()} HotelPro Management System. All rights reserved.</p>
          <p className="mb-0 text-white-50">Developed for Skill Wallet Evaluation</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
