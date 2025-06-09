import React, { useEffect, useState } from 'react';
import NavBar from '../components/NavBar';
import ProductCard from '../components/ProductCard';
import Carousel from '../components/Carousel';
import { Link } from 'react-router-dom';
import '../styles/Marketplace.css';
import api from '../api';

const carouselSlides = [
  {
    backgroundImage: '/src/assets/image5.jpeg',
    content: (
      <div className="mk-hero-content">
        <h1>Bem-vindo à TechPrint3D</h1>
        <p>As melhores impressoras 3D para todos os perfis: do iniciante ao profissional.</p>
      </div>
    ),
  },
  {
    backgroundImage: '/src/assets/image3.jpeg',
    content: (
      <div className="mk-hero-content">
        <h1>Alta Performance</h1>
        <p>Impressoras rápidas, precisas e confiáveis para o seu negócio.</p>
      </div>
    ),
  },
];

function Marketplace() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getProducts();
  }, []);
 
  const getProducts = async () => {
    try {
      const res = await api.get('/letrajato/products/');
      setProducts(res.data);
      setLoading(false);
    }
    catch (error) {
      setError('Erro ao carregar produtos.');
      setLoading(false);
    }
  };
  return (
    <div className="cs-marketplace-container">
      <NavBar />
      <section className="mk-hero-section">
        <Carousel slides={carouselSlides} autoPlayInterval={6000} />
      </section>
      <header className="cs-header">
        <h1 className="cs-title">Impressoras 3D</h1>
        <p className="cs-subtitle">Descubra nossa linha completa de impressoras 3D, desde modelos para iniciantes até soluções profissionais de alta performance.</p>
      </header>
      <section className="cs-products-grid">
        {loading && <p>Carregando produtos...</p>}
        {error && <p style={{color: 'red'}}>{error}</p>}
        {!loading && !error && products.length === 0 && <p>Nenhum produto encontrado.</p>}
        {!loading && !error && products.map((product, idx) => (
          <ProductCard key={product.id} {...product} index={idx} />
        ))}
      </section>
    </div>
  );
}

export default Marketplace;