import React, { useState, useEffect } from 'react';
import NavBar from '../components/NavBar';
import '../styles/Marketplace.css';
import { useParams } from 'react-router-dom';
import api from "../api";

function PrintPage() {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadProductData = async () => {
    try {
      setLoading(true);
      const productResponse = await api.get(`/letrajato/products/${productId}/`);
      setProduct(productResponse.data);
  
      setError(null);
    } catch (err) {
      setError('Erro ao carregar os detalhes do produto.');
      console.error('Error loading product details:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProductData();
  }, [productId]);

  if (loading) {
    return <div>Loading...</div>;
  }
  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div>
      <NavBar />
      <section className="cs-product-detail">
        <img src="/src/assets/image5.jpeg" alt="X1 Carbon" className="cs-product-detail-image" />
        <div className="cs-product-detail-info">
          <h1>{product.title}</h1>
          <span className="cs-badge cs-badge-blue">Profissional</span>
          <p className="cs-product-detail-desc">{product.description}</p>
          <ul className="cs-product-detail-features">
            <li>{product.build_volume}</li>
            <li>{product.layer_resolution}</li>
            <li>{product.print_speed}</li>
            <li>{product.nozzle_diameter}</li>
            <li>{product.supported_materials}</li>
            <li>{product.connectivity}</li>
            <li>{product.dimensions}</li>
          </ul>
        </div>
      </section>  
    </div>
  );

}

export default PrintPage;