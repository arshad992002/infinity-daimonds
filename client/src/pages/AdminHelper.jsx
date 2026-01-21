import React, { useState, useEffect } from 'react';
import api from '../api';
import './Admin.css';

// Sub-components (could be in separate files)
const Login = ({ onLogin }) => {
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (password === 'admin') { // Simple hardcoded auth
            onLogin();
        } else {
            setError('Invalid password');
        }
    };

    return (
        <div className="admin-login">
            <div className="login-card">
                <h2>Admin Access</h2>
                <form onSubmit={handleSubmit}>
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <button type="submit">Login</button>
                    {error && <p className="error">{error}</p>}
                </form>
            </div>
        </div>
    );
};

// File Upload Component
const FileUpload = ({ onUpload, label }) => {
    const [uploading, setUploading] = useState(false);

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setUploading(true);
        const formData = new FormData();
        formData.append('file', file);

        try {
            console.log('Uploading file...');
            const res = await api.post('/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            console.log('Upload success:', res.data);
            onUpload(res.data.url);
            setUploading(false);
        } catch (err) {
            console.error('Upload failed details:', err.response?.data || err.message);
            setUploading(false);
            alert('Upload failed. Check console for details.');
        }
    };

    return (
        <div className="form-group">
            <label>{label}</label>
            <input type="file" onChange={handleFileChange} disabled={uploading} />
            {uploading && <p style={{ fontSize: '0.8rem', color: '#666' }}>Uploading...</p>}
        </div>
    );
};

const Dashboard = () => {
    // Stats placeholder
    return (
        <div className="admin-section">
            <h2>Dashboard Overview</h2>
            <div className="admin-stats">
                <div className="stat-card">
                    <h3>Products</h3>
                    <p>Coming soon...</p>
                </div>
                <div className="stat-card">
                    <h3>Messages</h3>
                    <p>Coming soon...</p>
                </div>
            </div>
        </div>
    );
};

const ContentManager = () => {
    const [content, setContent] = useState(null);
    const [status, setStatus] = useState('');

    useEffect(() => {
        api.get('/content').then(res => setContent(res.data));
    }, []);

    const handleChange = (section, field, value) => {
        setContent(prev => ({
            ...prev,
            [section]: {
                ...prev[section],
                [field]: value
            }
        }));
    };

    const handleSave = async () => {
        setStatus('saving');
        try {
            await api.post('/content', content);
            setStatus('saved');
            setTimeout(() => setStatus(''), 2000);
        } catch (err) {
            setStatus('error');
        }
    };

    if (!content) return <div>Loading...</div>;

    return (
        <div className="admin-section">
            <div className="section-header">
                <h2>Content Manager</h2>
                <button onClick={handleSave} className="save-btn" disabled={status === 'saving'}>
                    {status === 'saving' ? 'Saving...' : status === 'saved' ? 'Saved!' : 'Save Changes'}
                </button>
            </div>

            <div className="form-section">
                <h3>Hero Section</h3>
                <div className="form-group">
                    <label>Title</label>
                    <input
                        value={content.hero.title}
                        onChange={e => handleChange('hero', 'title', e.target.value)}
                    />
                </div>
                <div className="form-group">
                    <label>Subtitle</label>
                    <input
                        value={content.hero.subtitle}
                        onChange={e => handleChange('hero', 'subtitle', e.target.value)}
                    />
                </div>
                <div className="form-group">
                    <label>Video URL</label>
                    <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                        <input
                            value={content.hero.videoUrl}
                            onChange={e => handleChange('hero', 'videoUrl', e.target.value)}
                            placeholder="Or enter URL manually"
                        />
                    </div>
                    <FileUpload label="Upload Header Video" onUpload={(url) => handleChange('hero', 'videoUrl', url)} />
                </div>
            </div>
        </div>
    );
};

const ProductsManager = () => {
    const [products, setProducts] = useState([]);
    const [newItem, setNewItem] = useState({ name: '', description: '', specs: '', imageUrl: '', category: 'Signature' });
    const [editingId, setEditingId] = useState(null);

    useEffect(() => {
        loadProducts();
    }, []);

    const loadProducts = () => api.get('/products').then(res => setProducts(res.data));

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingId) {
                await api.put(`/products/${editingId}`, newItem);
                setEditingId(null);
            } else {
                await api.post('/products', newItem);
            }
            setNewItem({ name: '', description: '', specs: '', imageUrl: '', category: 'Signature' });
            loadProducts();
        } catch (err) {
            console.error(err);
        }
    };

    const handleEdit = (product) => {
        setNewItem(product);
        setEditingId(product.id);
    };

    const handleCancel = () => {
        setNewItem({ name: '', description: '', specs: '', imageUrl: '', category: 'Signature' });
        setEditingId(null);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure?')) {
            await api.delete(`/products/${id}`);
            loadProducts();
        }
    };

    return (
        <div className="admin-section">
            <h2>Products Manager</h2>

            <div className="admin-grid">
                <div className="add-product-form">
                    <h3>{editingId ? 'Edit Product' : 'Add New Product'}</h3>
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label>Name</label>
                            <input value={newItem.name} onChange={e => setNewItem({ ...newItem, name: e.target.value })} required />
                        </div>
                        <div className="form-group">
                            <label>Category</label>
                            <select value={newItem.category} onChange={e => setNewItem({ ...newItem, category: e.target.value })} style={{ width: '100%', padding: '0.8rem' }}>
                                <option value="Signature">Signature</option>
                                <option value="Diamonds">Diamonds Collection</option>
                                <option value="Gemstones">Gemstones Collection</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label>Image URL</label>
                            <input value={newItem.imageUrl} onChange={e => setNewItem({ ...newItem, imageUrl: e.target.value })} required />
                            <div style={{ marginTop: '10px' }}>
                                <FileUpload label="Or Upload Image" onUpload={(url) => setNewItem(prev => ({ ...prev, imageUrl: url }))} />
                            </div>
                        </div>
                        <div className="form-group">
                            <label>Description</label>
                            <textarea value={newItem.description} onChange={e => setNewItem({ ...newItem, description: e.target.value })} required />
                        </div>
                        <div className="form-group">
                            <label>Specs</label>
                            <input value={newItem.specs} onChange={e => setNewItem({ ...newItem, specs: e.target.value })} required />
                        </div>
                        <div style={{ display: 'flex', gap: '10px' }}>
                            <button type="submit" className="save-btn">{editingId ? 'Update Product' : 'Add Product'}</button>
                            {editingId && <button type="button" onClick={handleCancel} className="delete-btn" style={{ background: '#666' }}>Cancel</button>}
                        </div>
                    </form>
                </div>

                <div className="product-list">
                    <h3>Existing Products</h3>
                    <div className="list-container">
                        {products.map(p => (
                            <div key={p.id} className="list-item">
                                <img src={p.imageUrl} alt={p.name} className="item-thumb" />
                                <div className="item-details">
                                    <h4>{p.name}</h4>
                                    <span className="badge">{p.category}</span>
                                </div>
                                <div style={{ display: 'flex', gap: '5px' }}>
                                    <button onClick={() => handleEdit(p)} className="save-btn" style={{ padding: '0.5rem', fontSize: '0.8rem' }}>Edit</button>
                                    <button onClick={() => handleDelete(p.id)} className="delete-btn">Delete</button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

const Inbox = () => {
    const [messages, setMessages] = useState([]);

    useEffect(() => {
        api.get('/messages').then(res => setMessages(res.data.reverse()));
    }, []);

    return (
        <div className="admin-section">
            <h2>Inbox ({messages.length})</h2>
            <div className="messages-list">
                {messages.length === 0 && <p>No messages yet.</p>}
                {messages.map((msg, idx) => (
                    <div key={idx} className="message-card">
                        <div className="msg-header">
                            <h4>{msg.name}</h4>
                            <span className="date">{new Date(msg.date).toLocaleDateString()}</span>
                        </div>
                        <div className="msg-email">{msg.email}</div>
                        <p className="msg-body">{msg.message}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

const Admin = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [activeTab, setActiveTab] = useState('dashboard');

    if (!isAuthenticated) return <Login onLogin={() => setIsAuthenticated(true)} />;

    return (
        <div className="admin-layout">
            <aside className="sidebar">
                <h3>Admin Panel</h3>
                <ul>
                    <li className={activeTab === 'dashboard' ? 'active' : ''} onClick={() => setActiveTab('dashboard')}>Dashboard</li>
                    <li className={activeTab === 'content' ? 'active' : ''} onClick={() => setActiveTab('content')}>Content</li>
                    <li className={activeTab === 'products' ? 'active' : ''} onClick={() => setActiveTab('products')}>Products</li>
                    <li className={activeTab === 'inbox' ? 'active' : ''} onClick={() => setActiveTab('inbox')}>Inbox</li>
                    <li className="logout" onClick={() => setIsAuthenticated(false)}>Logout</li>
                </ul>
            </aside>
            <main className="admin-main">
                {activeTab === 'dashboard' && <Dashboard />}
                {activeTab === 'content' && <ContentManager />}
                {activeTab === 'products' && <ProductsManager />}
                {activeTab === 'inbox' && <Inbox />}
            </main>
        </div>
    );
};

export default Admin;
