import React, { useEffect, useState } from 'react';
import api from '../api';
import './Gallery.css';

const Gallery = () => {
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchGallery = async () => {
            // In a real app, this would be /api/gallery
            // For now, we might use products images as a placeholder if gallery is empty
            try {
                const res = await api.get('/gallery'); // Assuming we created this endpoint
                if (res.data && res.data.length > 0) {
                    setImages(res.data);
                } else {
                    // Fallback to products if empty, for demo
                    const prodRes = await api.get('/products');
                    setImages(prodRes.data.map(p => ({ id: p.id, url: p.imageUrl, caption: p.name })));
                }
                setLoading(false);
            } catch (err) {
                console.error(err);
                setLoading(false);
            }
        };
        fetchGallery();
    }, []);

    if (loading) return <div className="loading-screen">Loading Gallery...</div>;

    return (
        <div className="gallery-page">
            <h1 className="section-title">Photo Gallery</h1>
            <div className="gallery-grid">
                {images.map((img, idx) => (
                    <div className="gallery-item" key={img.id || idx}>
                        <img src={img.url || img.imageUrl} alt={img.caption || 'Gallery Image'} />
                        <div className="gallery-overlay">
                            <p>{img.caption}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Gallery;
