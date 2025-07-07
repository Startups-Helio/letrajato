import React, { useState, useEffect } from 'react';
import NavBar from '../components/NewNavBar';
import '../styles/Marketplace.css';
import { useParams, Link } from 'react-router-dom';
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
    <div style={{ background: '#fff', minHeight: '100vh' }}>
      <NavBar />
      <section style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '80vh',
        padding: '0 5vw',
        gap: '4vw',
      }}>
        {/* Left: Text and Features */}
        <div style={{ flex: 1, maxWidth: 540 }}>
          <h1 style={{ fontSize: '3em', fontWeight: 700, marginBottom: 24, color: '#111', lineHeight: 1.1 }}>
            {product.title || ''}
          </h1>
          <p style={{ fontSize: '1.25em', color: '#222', marginBottom: 36, lineHeight: 1.7 }}>
            {product.description || ''}
          </p>
          <Link to={`/produtos/${productId}/comprar`} style={{
            display: 'inline-block',
            padding: '12px 32px',
            border: '2px solid #222',
            borderRadius: 8,
            background: '#fff',
            color: '#222',
            fontWeight: 600,
            fontSize: '1.1em',
            textDecoration: 'none',
            transition: 'background 0.2s, color 0.2s',
            marginTop: 12
          }}>
            Comprar agora
          </Link>
          <ul style={{
            marginTop: 32,
            marginLeft: 0,
            paddingLeft: 0,
            listStyle: 'none',
            fontSize: '1.1em',
            color: '#444',
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '16px'
          }}>
            {[
              { label: 'Volume de Impressão', value: product.build_volume },
              { label: 'Status', value: product.status },
              { label: 'Velocidade de Impressão', value: product.print_speed },
              { label: 'Diâmetro do Bico', value: product.nozzle_diameter },
              { label: 'Materiais Suportados', value: product.supported_materials },
              { label: 'Marca', value: product.brand },
              { label: 'Dimensões', value: product.dimensions }
            ].map((item, index) => (
              <li key={index} style={{
                padding: '12px 16px',
                backgroundColor: '#f8f8f8',
                borderRadius: '8px',
                boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
              }}>
                <span style={{ 
                  display: 'block',
                  fontSize: '0.85em',
                  color: '#666',
                  marginBottom: '4px'
                }}>
                  {item.label}
                </span>
                <span style={{
                  fontWeight: 500,
                  color: '#222'
                }}>
                  {item.value || 'N/A'}
                </span>
              </li>
            ))}
          </ul>
        </div>
        {/* Right: Product Image */}
        <div style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
          <img
            src={product.image}
            alt={product.title}
            style={{ maxWidth: 420, width: '100%', height: 'auto', borderRadius: 16, boxShadow: '0 4px 32px rgba(0,0,0,0.07)' }}
          />
        </div>
      </section>
    </div>
  );
}

export default PrintPage;