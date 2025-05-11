import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../api";
import NavBar from "../components/NavBar";
import "../styles/Home.css";

function Home() {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [services, setServices] = useState([]);

  useEffect(() => {
    getUserInfo();
    
    setServices([
      {
        id: 1,
        title: "Orçamento 3D",
        icon: "📏",
        description: "Calcule o custo de suas peças personalizadas",
        link: "/orcamento",
        requiresVerification: true
      },
      {
        id: 2,
        title: "Materiais",
        icon: "🧪",
        description: "Explore nossa linha de materiais premium",
        link: "https://loja.infinitepay.io/letrajato3d",
        external: true
      },
      {
        id: 3,
        title: "Suporte",
        icon: "🛠️",
        description: "Entre em contato com nossa equipe técnica",
        link: "/support"
      }
    ]);
  }, []);

  const getUserInfo = async () => {
    try {
      const response = await api.get("/letrajato/verify-status/");
      setUserData(response.data);
    } catch (error) {
      console.error("Erro ao obter informações do usuário:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="page-loader">
        <div className="loader"></div>
        <p>Carregando...</p>
      </div>
    );
  }

  const canAccessService = (service) => {
    if (!service.requiresVerification) return true;
    return userData.is_staff || (userData?.verificado && userData?.is_revendedor);
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Bom dia";
    if (hour < 18) return "Boa tarde";
    return "Boa noite";
  };

  return (
    <div className="home-container">
      <NavBar />
      
      <div className="home-banner">
        <div className="banner-content">
          <h1>
            <span className="welcome-text">{getGreeting()}!</span>
            <span className="user-name">{userData? userData.username : "Usuário"}</span>
          </h1>
          <p className="banner-tagline">
            Bem-vindo à central do usuário Letrajato
          </p>
        </div>
      </div>
      
      <div className="dashboard-container">
        <div className="account-status-card">
          <h2>Status da Conta</h2>
          <div className="status-info">
            <div className="status-item">
              <span className="status-label">Tipo de conta:</span>
              <span className="status-value">
                {userData?.is_staff ? "Administrador" : (userData?.is_revendedor ? "Revendedor" : "Cliente")}
              </span>
            </div>
            
            {userData?.is_revendedor && (
              <>
                <div className="status-item">
                  <span className="status-label">Status:</span>
                  <span className={`status-value ${userData?.verificado ? "status-verified" : "status-pending"}`}>
                    {userData?.verificado ? "Verificado" : "Pendente"}
                  </span>
                </div>
                
                <div className="status-item">
                  <span className="status-label">Empresa:</span>
                  <span className="status-value">{userData?.nome_empresa}</span>
                </div>
              </>
            )}
            
            {!userData?.verificado && userData?.is_revendedor && (
              <div className="verification-message">
                <p>Aguardando verificação da sua conta. Logo você terá acesso a todos os recursos!</p>
                <Link to="/verification-pending" className="check-status-button">
                  Verificar status
                </Link>
              </div>
            )}
          </div>
        </div>

        <h2 className="section-title">Serviços disponíveis</h2>
        <div className="services-grid">
          {services.map((service) => (
            <div 
              key={service.id} 
              className={`service-card ${!canAccessService(service) ? "service-disabled" : ""}`}
            >
              <div className="service-icon">{service.icon}</div>
              <h3>{service.title}</h3>
              <p>{service.description}</p>
              {canAccessService(service) ? (
                service.external ? (
                  <a href={service.link} className="service-link" target="_blank" rel="noopener noreferrer">
                    Acessar
                  </a>
                ) : (
                  <Link to={service.link} className="service-link">
                    Acessar
                  </Link>
                )
              ) : (
                <span className="service-restricted">
                  {userData?.is_revendedor ? 'Requer verificação' : 'Apenas para revendedores'}
                </span>
              )}
            </div>
          ))}
        </div>
        
        <div className="news-section">
          <h2 className="section-title">Novidades</h2>
          <div className="news-card">
            <div className="news-header">
              <h3>Nova impressora LJ8080</h3>
              <span className="news-date">02/05/2025</span>
            </div>
            <p>Veja nossa impressora 3D LJ8080!</p>
            <a href="https://loja.infinitepay.io/letrajato3d/ugz3594-impressora-3d-lj8080-letrajato" className="news-link" target="_blank" rel="noopener noreferrer">
              Saiba mais
            </a>
          </div>

        </div>
      </div>
    </div>
  );
}

export default Home;
