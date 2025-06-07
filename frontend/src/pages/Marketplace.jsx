import React from 'react';
import NavBar from '../components/NavBar';
import ProductCard from '../components/ProductCard';
import Carousel from '../components/Carousel';
import { Link } from 'react-router-dom';
import '../styles/Marketplace.css';

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

const products = [
  {
    id: 1,
    name: 'Esgotado',
    image: '/src/assets/image5.jpeg',
    description: 'Impressora premium com velocidade excepcional e qualidade profissional',
    features: ['Velocidade até 500mm/s', 'Auto-calibração', 'Multi-filamentos'],
    badge: { text: 'Profissional', color: 'cs-badge-blue' },
    link: '/produtos/lj12080',
  },
  {
    id: 2,
    name: 'Esgotado',
    image: '/src/assets/image3.jpeg',
    description: 'Compacta e inteligente, perfeita para iniciantes e espaços pequenos',
    features: ['Fácil configuração', 'Auto-nivelamento', 'Design compacto'],
    badge: { text: 'Iniciante', color: 'cs-badge-green' },
    link: '/produtos/lj8080',
  },
];

function Marketplace() {
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
        {products.map((product, idx) => (
          <ProductCard key={product.id} {...product} index={idx} />
        ))}
      </section>
    </div>
  );
}

export default Marketplace;