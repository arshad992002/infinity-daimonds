import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import api from '../api';
import './Products.css';

const Products = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const location = useLocation();

    // Parse query params for filtering
    const searchParams = new URLSearchParams(location.search);
    const category = searchParams.get('cat');

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const res = await api.get('/products');
                if (category) {
                    // Simple filter based on collection ID or category
                    // In a real app, backend filtering is better
                    // Mapping simple IDs to names or checking properties
                    const filtered = res.data.filter(p =>
                        p.category.toLowerCase().includes(category.toLowerCase()) ||
                        (p.collectionId && p.collectionId === category)
                    );
                    setProducts(filtered.length ? filtered : res.data);
                } else {
                    setProducts(res.data);
                }
                setLoading(false);
            } catch (err) {
                console.error(err);
                setLoading(false);
            }
        };
        fetchProducts();
    }, [category]);

    if (loading) return <div className="loading-screen">Loading Collection...</div>;

    return (
        <div className="products-page">
            <h1 className="section-title">{category ? `${category.charAt(0).toUpperCase() + category.slice(1)} Collection` : 'All Products'}</h1>

            {products.length === 0 ? (
                <div className="no-products">
                    <p>No products found in this collection.</p>
                </div>
            ) : (
                <div className="products-grid">
                    {products.map(product => (
                        <div className="product-card" key={product.id}>
                            <div className="product-image">
                                <img src={product.imageUrl} alt={product.name} />
                            </div>
                            <div className="product-info">
                                <h3>{product.name}</h3>
                                <p className="desc">{product.description}</p>
                                <p className="specs">{product.specs}</p>
                                {/* <button className="inquire-btn">Inquire</button> */}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Products;
