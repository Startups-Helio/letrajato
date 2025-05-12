import React, { useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import "../styles/LandingPage.css";
import backgroundVideo from "../assets/lj8080.mp4";
import FeatureCard from "../components/FeatureCard";
import NavBar from "../components/NavBar";

function LandingPage() {
  const videoRef = useRef(null);
  
  useEffect(() => {
    const leftButton = document.querySelector('.left-button');
    const video = videoRef.current;
    
    if (leftButton && video) {
      leftButton.addEventListener('mouseenter', () => {
        video.play();
      });
      
      leftButton.addEventListener('mouseleave', () => {
        video.pause();
        // Optionally reset video to beginning
        // video.currentTime = 0;
      });
    }
    
    return () => {
      if (leftButton && video) {
        leftButton.removeEventListener('mouseenter', () => video.play());
        leftButton.removeEventListener('mouseleave', () => video.pause());
      }
    };
  }, []);

  // Array de features para facilitar a manutenção
  const features = [
    {
      icon: "🖨️",
      title: "Máquinas 3D de Alta Precisão",
      description: "Equipamentos de última geração com tecnologia avançada para impressões 3D de alta qualidade e precisão."
    },
    {
      icon: "💰",
      title: "Orçamento Inteligente",
      description: "Sistema automatizado que calcula o melhor custo-benefício para seus projetos de impressão 3D."
    },
    {
      icon: "🛒",
      title: "Portal para Revendedores",
      description: "Área exclusiva para revendedores fazerem pedidos, acompanhar entregas e gerenciar estoque."
    }
  ];

  return (
    <div className="landing-container">
      <NavBar />

      <main>
        <section className="hero-section">
          <div className="hero-buttons-container">
            <div className="left-button">
              <video 
                ref={videoRef}
                className="background-video" 
                muted 
                loop
              >
                <source src={backgroundVideo} type="video/mp4" />
                Seu navegador não suporta vídeos.
              </video>
              <div className="button-content">
                <h2>Nossas Máquinas</h2>
                <p>Conheça nossa linha de equipamentos de alta performance</p>
                <Link to="https://loja.infinitepay.io/letrajato3d/ugz3594-impressora-3d-lj8080-letrajato" className="button-link">LJ8080</Link>
              </div>
            </div>
            <div className="right-button">
              <div className="button-content">
                <h2>Área do Cliente</h2>
                <p>Acesse sua conta para gerenciar seus serviços</p>
                <Link to="/login" className="button-link">Fazer Login</Link>
              </div>
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