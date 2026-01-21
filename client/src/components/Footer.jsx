import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
    return (
        <footer>
            <div className="footer-content">
                <div className="footer-section">
                    <h4>Maison Lumière</h4>
                    <p>Where heritage meets artistry. Creating timeless jewelry for life's most precious moments.</p>
                </div>
                <div className="footer-section">
                    <h4>Collections</h4>
                    <Link to="/products?cat=diamonds">Eternal Diamonds</Link>
                    <Link to="/products?cat=gemstones">Precious Gemstones</Link>
                    <Link to="/products?cat=gold">Heritage Gold</Link>
                </div>
                <div className="footer-section">
                    <h4>Contact</h4>
                    <p>123 Jewelry Lane, New York, NY</p>
                    <p>contact@maisonlumiere.com</p>
                    <p>+1 (555) 123-4567</p>
                </div>
            </div>
            <div className="footer-bottom">
                <p>&copy; {new Date().getFullYear()} Maison Lumière. All rights reserved.</p>
            </div>
        </footer>
    );
};

export default Footer;
