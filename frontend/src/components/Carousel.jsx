import React, { useState, useEffect } from 'react';
import '../styles/Carousel.css';

const Carousel = ({ slides, autoPlayInterval = 5000, showControls = true, showIndicators = true }) => {
  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    if (autoPlayInterval > 0) {
      const interval = setInterval(() => {
        setActiveSlide((prev) => (prev + 1) % slides.length);
      }, autoPlayInterval);
      
      return () => clearInterval(interval);
    }
  }, [slides.length, autoPlayInterval]);

  const goToSlide = (index) => {
    setActiveSlide(index);
  };

  const goToPrevSlide = () => {
    setActiveSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  const goToNextSlide = () => {
    setActiveSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="mk-carousel">
      <div 
        className="mk-carousel-container" 
        style={{ transform: `translateX(-${activeSlide * 100}%)` }}
      >
        {slides.map((slide, index) => (
          <div 
            key={index} 
            className="mk-carousel-slide"
            style={slide.backgroundImage ? { backgroundImage: `url(${slide.backgroundImage})` } : {}}
          >
            {slide.content}
          </div>
        ))}
      </div>
      
      {showIndicators && (
        <div className="mk-carousel-indicators">
          {slides.map((_, index) => (
            <button 
              key={index} 
              className={`mk-carousel-indicator ${index === activeSlide ? 'mk-active' : ''}`}
              onClick={() => goToSlide(index)}
              aria-label={`Ir para slide ${index + 1}`}
            />
          ))}
        </div>
      )}
      
      {showControls && (
        <>
          <button 
            className="mk-carousel-control mk-carousel-prev" 
            onClick={goToPrevSlide}
            aria-label="Slide anterior"
          >
            &#10094;
          </button>
          <button 
            className="mk-carousel-control mk-carousel-next" 
            onClick={goToNextSlide}
            aria-label="Próximo slide"
          >
            &#10095;
          </button>
        </>
      )}
    </div>
  );
};

export default Carousel;