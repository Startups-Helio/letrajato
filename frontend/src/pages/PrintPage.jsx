import React from 'react';
import NavBar from '../components/NavBar';
import '../styles/Marketplace.css';

function PrintPage() {
  return (
    <div className="cs-marketplace-container">
      <NavBar />
      <section className="cs-product-detail">
        <img src="/src/assets/image5.jpeg" alt="X1 Carbon" className="cs-product-detail-image" />
        <div className="cs-product-detail-info">
          <h1>LJ12080</h1>
          <span className="cs-badge cs-badge-blue">Profissional</span>
          <p className="cs-product-detail-desc">Impressora premium com velocidade excepcional e qualidade profissional.</p>
          <ul className="cs-product-detail-features">
            <li>Velocidade até 500mm/s</li>
            <li>Auto-calibração</li>
            <li>Multi-filamentos</li>
            <li>Estrutura em alumínio reforçado</li>
            <li>Tela touchscreen de 7"</li>
            <li>Conectividade Wi-Fi e USB</li>
            <li>Compatível com diversos materiais</li>
          </ul>
          <a href="https://loja.infinitepay.io/letrajato3d/ugz3594-impressora-3d-lj8080-letrajato" className="cs-btn cs-btn-primary">Comprar agora</a>
        </div>
      </section>
    </div>
  );
}

export default PrintPage;