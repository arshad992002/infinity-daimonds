import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';
import './Home.css';

// Product Popup Component
const ProductModal = ({ product, onClose }) => {
    const [activeImage, setActiveImage] = useState(0);
    const images = product.images || [product.imageUrl];

    if (!product) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
                <button className="close-btn" onClick={onClose}>&times;</button>
                <div className="modal-grid">
                    <div className="modal-gallery">
                        <img src={images[activeImage]} alt={product.name} className="main-image" />
                        {images.length > 1 && (
                            <div className="thumbnail-row">
                                {images.map((img, idx) => (
                                    <img
                                        key={idx}
                                        src={img}
                                        className={`thumb ${activeImage === idx ? 'active' : ''}`}
                                        onClick={() => setActiveImage(idx)}
                                        alt={`View ${idx + 1}`}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                    <div className="modal-details">
                        <h3>{product.name}</h3>
                        <p className="modal-category">{product.category}</p>
                        <p className="modal-desc">{product.description}</p>
                        <p className="modal-specs"><strong>Specs:</strong> {product.specs}</p>
                        <button className="inquire-btn">Inquire About This Piece</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

const Home = () => {
    const [content, setContent] = useState(null);
    const [collections, setCollections] = useState([]);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedProduct, setSelectedProduct] = useState(null);

    const [error, setError] = useState(null);

    const fetchData = async () => {
        setLoading(true);
        setError(null);
        try {
            // Fetch all initial data in parallel
            const [contentRes, collecRes, prodRes] = await Promise.all([
                api.get('/content'),
                api.get('/collections'),
                api.get('/products')
            ]);

            setContent(contentRes.data);
            setCollections(collecRes.data || []);
            // Filter specifically for "Signature" pieces
            const sigs = prodRes.data.filter(p => p.category === 'Signature');
            setProducts(sigs.length > 0 ? sigs : prodRes.data.slice(0, 3));
            setLoading(false);
        } catch (err) {
            console.error("Failed to fetch data", err);
            setError(err.message || "Failed to load content");
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    if (loading) return <div className="loading-screen">Loading Maison Lumière...</div>;
    if (!content) return <div>Error loading content.</div>;

    return (
        <div className="home">
            {selectedProduct && <ProductModal product={selectedProduct} onClose={() => setSelectedProduct(null)} />}

            {/* Hero Section */}
            <section className="hero" id="home">
                <video className="hero-video" autoPlay muted loop playsInline>
                    <source src={content.hero.videoUrl} type="video/mp4" />
                    Your browser does not support the video tag.
                </video>
                <div className="hero-overlay"></div>
                <div className="hero-content">
                    <h1>{content.hero.title}</h1>
                    <p className="tagline">{content.hero.subtitle}</p>
                    <Link to="/products" className="cta-button">Explore Collections</Link>
                </div>
            </section>

            {/* About Section */}
            <section className="about" id="about">
                <div className="about-text">
                    <h2>{content.about.title}</h2>
                    {content.about.text.map((paragraph, index) => (
                        <p key={index}>{paragraph}</p>
                    ))}
                </div>
                <div className="about-image">
                    <img src={content.about.imageUrl} alt="Fine Jewelry Craftsmanship" />
                </div>
            </section>

            {/* Collections Section */}
            <section className="collections" id="collections">
                <h2 className="section-title">Our Collections</h2>
                <div className="collections-grid">
                    {collections.map(col => (
                        <div key={col.id} className="collection-card">
                            <img src={col.imageUrl} alt={col.name} />
                            <div className="collection-overlay">
                                <h3>{col.name}</h3>
                                <p>{col.tagline}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Signature Pieces Section */}
            <section className="signature">
                <h2 className="section-title">Signature Pieces</h2>
                <div className="signature-grid">
                    {products.map(product => (
                        <div className="signature-piece" key={product.id} onClick={() => setSelectedProduct(product)} style={{ cursor: 'pointer' }}>
                            <img src={product.imageUrl} alt={product.name} />
                            <div className="signature-info">
                                <h4>{product.name}</h4>
                                <p>{product.description}</p>
                                <p className="specs">{product.specs}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Craftsmanship Section */}
            <section className="craftsmanship" id="craftsmanship">
                <div className="craftsmanship-content">
                    <h2>{content.craftsmanship?.title || "The Art of Perfection"}</h2>
                    <p>{content.craftsmanship?.text || "Every Maison Lumière piece begins with a sketch and ends with a masterpiece."}</p>

                    <div className="stats">
                        {content.craftsmanship?.stats.map((stat, index) => (
                            <div className="stat" key={index}>
                                <div className="stat-number">{stat.number}</div>
                                <div className="stat-label">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;
