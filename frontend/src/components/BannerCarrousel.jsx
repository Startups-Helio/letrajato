import React, { useState, useEffect } from "react";
import "../styles/BannerCarrousel.css";

const slides = [
  {
    bg: "url('/src/assets/image1.jpeg')",
    promo: "Promoção imperdível",
    title: "Letrajato A1 mini",
    subtitle: "O melhor de todos os tempos em impressoras 3D de nível básico"
  },
  {
    bg: "url('/src/assets/image2.jpeg')",
    promo: "Filamentos em oferta",
    title: "Filamentos Premium",
    subtitle: "Materiais de alta qualidade para impressões perfeitas"
  },
  {
    bg: "url('/src/assets/image4.jpeg')",
    promo: "Serviços",
    title: "Imprimimos Para Você",
    subtitle: "Orçamento e produção de letras exclusiva para revendedores!"
  }
];

function BannerCarrousel() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 4000); // Change every 4 seconds
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="banner-carrousel" style={{ backgroundImage: slides[current].bg }}>
      <div className="banner-content">
        <span className="promo">{slides[current].promo}</span>
        <h1 className="title">{slides[current].title}</h1>
        <p className="subtitle">{slides[current].subtitle}</p>
        <div className="banner-buttons">
          <button className="buy-now">Comprar agora</button>
          <button className="learn-more">Saiba mais</button>
        </div>
        <div className="carousel-indicators">
          {slides.map((_, idx) => (
            <span
              key={idx}
              className={"indicator" + (idx === current ? " active" : "")}
              onClick={() => setCurrent(idx)}
            ></span>
          ))}
        </div>
      </div>
    </section>
  );
}

export default BannerCarrousel;