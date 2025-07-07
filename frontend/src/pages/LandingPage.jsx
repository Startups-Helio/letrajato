import React, { useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import "../styles/LandingPage.css";
import backgroundVideo from "../assets/lj8080.mp4";
import NewNavBar from "../components/NewNavBar";
import Carousel from "../components/Carousel";
import CardGrid from "../components/CardGrid";

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
  backgroundImage: '/src/assets/image5.jpeg',
  content: (
    <div className="carousel-slide-content">
      <span className="carousel-promo">Promoção imperdível</span>
      <h1 className="carousel-title">Letrajato A1 mini</h1>
      <p className="carousel-subtitle">O melhor de todos os tempos em impressoras 3D de nível básico</p>
      <div className="carousel-buttons">
        <Link className="carousel-buy-now" to="/products/1">Comprar agora</Link>
        <button className="carousel-learn-more">Saiba mais</button>
      </div>
    </div>
  )
},
  {
  backgroundImage: '/src/assets/image3.jpeg',
  content: (
    <div className="carousel-slide-content">
      <span className="carousel-promo">Promoção imperdível</span>
      <h1 className="carousel-title">Letrajato A1 mini</h1>
      <p className="carousel-subtitle">O melhor de todos os tempos em impressoras 3D de nível básico</p>
      <div className="carousel-buttons">
        <button className="carousel-buy-now">Comprar agora</button>
        <button className="carousel-learn-more">Saiba mais</button>
      </div>
    </div>
  )
},
  ];

  return (
    <div className="landing-wrapper">
      <NewNavBar />
      <Carousel slides={features} autoPlayInterval={6000}/>
      <CardGrid />
    </div>
  );
}

export default LandingPage;