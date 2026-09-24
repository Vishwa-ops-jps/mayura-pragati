import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Footer.css';

const Footer = () => {
  return (
    <footer className="footer" id="contact-us">
      <div className="footer-container">
        <div className="footer-section">
          <Link to="/" className="footer-brand" aria-label="Mayura Regalia home"><img src="/LOGO_Mayura_Regalia.png" alt="Mayura Regalia" className="footer-logo" /></Link>
          <p>Jewellery that celebrates your elegance.</p>
        </div>

        <div className="footer-section">
          <h4>Shop</h4>
          <ul>
            <li>
              <Link to="/earrings">Earrings</Link>
            </li>
            <li>
              <Link to="/necklaces">Necklaces</Link>
            </li>
            <li>
              <Link to="/bangles">Bangles</Link>
            </li>
            <li>
              <Link to="/rings">Rings</Link>
            </li>
            <li>
              <Link to="/bridal jewellery">Bridal</Link>
            </li>
          </ul>
        </div>

        <div className="footer-section">
          <h4>Customer Care</h4>
          <ul>
            <li>
              <a href="tel:8951084668">Call us: 8951084668</a>
            </li>
            <li>
              <a href="/">Shipping</a>
            </li>
            <li>
              <a href="/">Returns</a>
            </li>
            <li>
              <Link to="/#faq">FAQ</Link>
            </li>
          </ul>
        </div>

        <div className="footer-section">
          <h4>Follow Us</h4>
          <div className="social-links">
            <a href="https://www.instagram.com/mayura_regalia/" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <rect x="3" y="3" width="18" height="18" rx="5" />
                <circle cx="12" cy="12" r="4" />
                <circle cx="17.5" cy="6.5" r="1.1" fill="currentColor" stroke="none" />
              </svg>
            </a>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p>&copy; 2026 MAYURA REGALIA. All Rights Reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
