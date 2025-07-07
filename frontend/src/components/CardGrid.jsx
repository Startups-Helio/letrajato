import React from "react";
import "../styles/CardGrid.css";
import { Link } from "react-router-dom";

const cards = [
  {
    title: "Impressoras 3D",
    subtitle: "Ferramentas poderosas ",
    links: [
      { label: "Comprar agora", to: "/produtos/impressoras" },
      { label: "Comparar tudo", to: "/produtos/impressoras/comparar" }
    ],
    image: "/images/card-impressora.jpg",
    alt: "Impressora 3D profissional",
    soon: false
  },
  {
    title: "Filamentos",
    subtitle: "Materiais de impressão 3D de alta qualidade",
    links: [
      { label: "Comprar agora", to: "/produtos/filamentos" },
      { label: "Explorar", to: "/produtos/filamentos/explorar" }
    ],
    image: "/images/card-filamento.jpg",
    alt: "Bobinas de filamento coloridas",
    soon: false
  },
  {
    title: "MakerWorld",
    subtitle: "Descarregar modelos premium",
    links: [
      { label: "Saiba mais", to: "/makerworld" }
    ],
    image: "/images/card-makerworld.jpg",
    alt: "Coleção de objetos impressos e smartphone",
    soon: false
  },
  {
    title: "Serviços",
    subtitle: "Orçamento e produção de letras exclusiva para revendedores!",
    links: [],
    image: "/images/card-criadores.jpg",
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