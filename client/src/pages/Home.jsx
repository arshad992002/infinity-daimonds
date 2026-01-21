import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';
import './Home.css';

const Home = () => {
    const [content, setContent] = useState(null);
    const [collections, setCollections] = useState([]);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

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
            // Filter specifically for "Signature" pieces or just take first 3
            const sigs = prodRes.data.filter(p => p.category === 'Signature').slice(0, 3);
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
    if (error) return (
        <div className="error-container" style={{ padding: '100px', textAlign: 'center' }}>
            <h2>Error Loading Content</h2>
            <p>{error}</p>
            <button onClick={fetchData} style={{ marginTop: '20px', padding: '10px 20px', cursor: 'pointer' }}>Retry</button>
        </div>
    );
    if (!content) return <div>Error loading content.</div>;

    // Helper to format newlines
    const renderTitle = (title) => {
        // Simple replace for <br> if needed, logic borrowed from original HTML structure
        return { __html: title.replace('\n', '<br>') };
    };

    return (
        <div className="home">
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
                        <Link to={`/products?cat=${col.id}`} key={col.id} className="collection-card">
                            <img src={col.imageUrl} alt={col.name} />
                            <div className="collection-overlay">
                                <h3>{col.name}</h3>
                                <p>{col.tagline}</p>
                            </div>
                        </Link>
                    ))}
                </div>
            </section>

            {/* Signature Pieces Section */}
            <section className="signature">
                <h2 className="section-title">Signature Pieces</h2>
                <div className="signature-grid">
                    {products.map(product => (
                        <div className="signature-piece" key={product.id}>
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
