import React from "react";
import "../styles/CardGrid.css";
import { Link } from "react-router-dom";

const cards = [
  {
    title: "Impressoras 3D",
    subtitle: "Veja nossas impressoras 3D profissionais",
    links: [
      { label: "Loja", to: "/marketplace" }
    ],
    image: "/printer_icon.png",
    alt: "Impressora 3D profissional",
    soon: false
  },
  {
    title: "Filamentos",
    subtitle: "Materiais de impressão 3D de alta qualidade",
    links: [],
    image: "/filment_icon.png",
    alt: "Bobinas de filamento coloridas",
    soon: true
  },
  {
    title: "Suporte Personalizado",
    subtitle: "Contato direto com nossa equipe de suporte",
    links: [
      { label: "Apenas para compradores", to: "/" }
    ],
    image: "/suport_icon.png",
    alt: "Coleção de objetos impressos e smartphone",
    soon: false
  },
  {
    title: "Serviços",
    subtitle: "Orçamento e produção de letras exclusivas",
    links: [],
    image: "/service_icon.png",
    alt: "Mouse, componentes eletrônicos, acessórios",
    soon: true
  }
];

function CardGrid() {
  return (
    <section className="cardgrid-bg">
      <div className="cardgrid">
        {cards.map((card, idx) => (
          <div className="cardgrid-card" key={idx}>
            <img src={card.image} alt={card.alt} className="cardgrid-img" />
            <div className="cardgrid-content">
              <h3 className="cardgrid-title">{card.title}</h3>
              <p className="cardgrid-subtitle">{card.subtitle}</p>
              <div className="cardgrid-links">
                {card.links.map((link, i) => (
                  <Link to={link.to} className="cardgrid-link" key={i}>{link.label} &gt;</Link>
                ))}
                {card.soon && <span className="cardgrid-soon">Em breve</span>}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default CardGrid;