import React from "react";
import "../styles/Sobre.css";
import NavBar from "../components/NavBar";
import { Link } from "react-router-dom";

function Sobre() {
  return (
    <div className="sobre-bg">
      <NavBar />
      <div className="sobre-container">
        <h2 className="sobre-title">Sobre a Letrajato</h2>
        <p className="sobre-desc">
          A <span className="sobre-highlight">Letrajato</span> é pioneira no Brasil em impressão 3D para comunicação visual, oferecendo soluções inovadoras, sustentáveis e de alta performance para empresas que buscam modernizar seus processos e se destacar no mercado.
        </p>
        <p className="sobre-desc">
          Nossa equipe é formada por profissionais experientes e apaixonados por tecnologia, sempre prontos para entregar excelência e inovação em cada projeto.
        </p>
        <div className="sobre-diferenciais">
          <h3>Diferenciais:</h3>
          <ul>
            <li>Primeira fabricante nacional de impressoras 3D para comunicação visual</li>
            <li>Equipamentos de grande porte e alta precisão</li>
            <li>Foco em sustentabilidade e redução de resíduos</li>
            <li>Equipe especializada e suporte técnico dedicado</li>
            <li>Inovação contínua e pioneirismo brasileiro</li>
          </ul>
        </div>
        <div className="sobre-social">
          <h4>Redes Sociais</h4>
          <div className="social-links">
            <a href="#" className="social-icon" title="Instagram" target="_blank" rel="noopener noreferrer">Instagram</a>
            <a href="#" className="social-icon" title="Facebook" target="_blank" rel="noopener noreferrer">Facebook</a>
            <a href="#" className="social-icon" title="LinkedIn" target="_blank" rel="noopener noreferrer">LinkedIn</a>
          </div>
        </div>
        <div className="sobre-actions">
          <Link to="/produtos" className="sobre-btn sobre-btn-produtos">Veja nossos produtos</Link>
          <Link to="/contato" className="sobre-btn sobre-btn-contato">Solicite um orçamento</Link>
        </div>
      </div>
    </div>
  );
}

export default Sobre;
