import React from "react";
import "../styles/Sobre.css";
import NavBar from "../components/NewNavBar";
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
            <Link className="social-icon" to="https://www.instagram.com/letrajato?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==">
              <img 
                src="\src\assets\Instagram_icon.png" 
                alt="Instagram"
                style={{ width: '24px', height: '24px' }} 
              />
              Instagram
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Sobre;
