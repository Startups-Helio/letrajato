import React from "react";
import "../styles/Banner.css";

function Banner({ title, subtitle, image }) {
  return (
    <div className="banner" style={image ? { backgroundImage: `url(${image})` } : {}}>
      <div className="banner-overlay"></div>
      <div className="banner-content">
        <h1>{title || "Bem-vindo ao Letrajato"}</h1>
        <p>{subtitle || "Sua plataforma para gerenciamento de notas e documentos"}</p>
      </div>
    </div>
  );
}

export default Banner;