import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
    return (
        <nav className="navbar">
            <div className="logo">
                <Link to="/">
                    <img
                        src="/logo.png"
                        alt="Maison Lumière"
                        style={{ maxHeight: '60px', width: 'auto' }}
                        onError={(e) => { e.target.style.display = 'none'; e.target.parentElement.innerText = 'Maison Lumière'; }}
                    />
                </Link>
            </div>
            <ul className="nav-links">
                <li><Link to="/" className="nav-link">Home</Link></li>
                <li><Link to="/products" className="nav-link">Products</Link></li>
                <li><Link to="/gallery" className="nav-link">Gallery</Link></li>
                <li><Link to="/contact" className="nav-link">Contact Us</Link></li>
            </ul>
        </nav>
    );
};

export default Navbar;
