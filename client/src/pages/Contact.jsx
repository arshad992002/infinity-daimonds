import React, { useState } from 'react';
import api from '../api';
import './Contact.css';

const Contact = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: ''
    });
    const [status, setStatus] = useState(''); // '', 'submitting', 'success', 'error'

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus('submitting');
        try {
            await api.post('/messages', formData);
            setStatus('success');
            setFormData({ name: '', email: '', message: '' });
        } catch (err) {
            console.error(err);
            setStatus('error');
        }
    };

    return (
        <div className="contact-page">
            <div className="contact-container">
                <div className="contact-info-section">
                    <h1 className="contact-title">Contact Us</h1>
                    <p className="contact-desc">
                        We would love to hear from you. Please fill out the form below or contact us directly.
                    </p>

                    <div className="info-items">
                        <div className="info-item">
                            <h4>Visit Us</h4>
                            <p>123 Jewelry Lane<br />New York, NY 10012</p>
                        </div>
                        <div className="info-item">
                            <h4>Email</h4>
                            <p>contact@maisonlumiere.com</p>
                        </div>
                        <div className="info-item">
                            <h4>Call</h4>
                            <p>+1 (555) 123-4567</p>
                        </div>
                    </div>
                </div>

                <div className="contact-form-section">
                    <form onSubmit={handleSubmit} className="contact-form">
                        <div className="form-group">
                            <label>Name</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Email</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Message</label>
                            <textarea
                                name="message"
                                value={formData.message}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <button type="submit" className="submit-btn" disabled={status === 'submitting'}>
                            {status === 'submitting' ? 'Sending...' : 'Send Message'}
                        </button>

                        {status === 'success' && (
                            <div className="status-msg success">
                                Thank you! Your message has been sent. We will get back to you shortly.
                            </div>
                        )}
                        {status === 'error' && (
                            <div className="status-msg error">
                                Something went wrong. Please try again later.
                            </div>
                        )}
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Contact;
