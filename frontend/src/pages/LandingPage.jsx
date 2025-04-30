import React from "react";
import { Link } from "react-router-dom";
import "../styles/LandingPage.css";
import landingImage from "../assets/a.png";
import Banner from "../components/Banner";
import FeatureCard from "../components/FeatureCard";
import NavBar from "../components/NavBar";

function LandingPage() {
  // Array de features para facilitar a manutenção
  const features = [
    {
      icon: "📝",
      title: "Notas Organizadas",
      description: "Crie, edite e organize suas notas de forma simples e eficiente."
    },
    {
      icon: "🔒",
      title: "Segurança Garantida",
      description: "Seus dados estão protegidos com nossa tecnologia de criptografia."
    },
    {
      icon: "📱",
      title: "Acesso em Qualquer Lugar",
      description: "Acesse suas notas de qualquer dispositivo, a qualquer momento."
    }
  ];

  return (
    <div className="landing-container">
      <NavBar />

      <main>
        <section className="hero-section">
          <div className="hero-content">
            <h1>Bem-vindo ao Letrajato</h1>
            <p className="hero-subtitle">
              Sua plataforma completa para gerenciamento de notas e documentos
            </p>
            <div className="cta-buttons">
              <Link to="/register" className="cta-button primary">Começar Agora</Link>
              <Link to="/login" className="cta-button secondary">Já tenho uma conta</Link>
            </div>
          </div>
        </section>

        <section className="features-section">
          <h2>Recursos Principais</h2>
          <div className="features-grid">
            {features.map((feature, index) => (
              <FeatureCard 
                key={index}
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
              />
            ))}
          </div>
        </section>

        <section className="testimonials-section">
          <h2>O que nossos usuários dizem</h2>
          <div className="testimonials-grid">
            <div className="testimonial-card">
              <p className="testimonial-text">"O Letrajato revolucionou a forma como organizo minhas ideias. Simplesmente incrível!"</p>
              <p className="testimonial-author">- Maria Silva</p>
            </div>
            <div className="testimonial-card">
              <p className="testimonial-text">"Interface intuitiva e recursos poderosos. Recomendo para todos os profissionais."</p>
              <p className="testimonial-author">- João Santos</p>
            </div>
          </div>
        </section>
      </main>

      <footer className="landing-footer">
        <div className="footer-content">
          <div className="footer-logo">Letrajato</div>
          <div className="footer-links">
            <a href="#" className="footer-link">Sobre Nós</a>
            <a href="#" className="footer-link">Termos de Uso</a>
            <a href="#" className="footer-link">Privacidade</a>
            <a href="#" className="footer-link">Contato</a>
          </div>
          <div className="footer-copyright">
            &copy; 2023 Letrajato. Todos os direitos reservados.
          </div>
        </div>
      </footer>
    </div>
  );
}

export default LandingPage;