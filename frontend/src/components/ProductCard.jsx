import React from 'react';
import { Link } from 'react-router-dom';

function ProductCard({ id, name, image, description, features, badge, link, index }) {
  return (
    <div className="cs-card" style={{ animationDelay: `${index * 0.1}s` }}>
      <div className="cs-image-container">
        <img src={image} alt={name} className="cs-image" />
        {badge && (
          <span className={`cs-badge ${badge.color}`}>{badge.text}</span>
        )}
      </div>
      <div className="cs-content">
        <h3 className="cs-title">{name}</h3>
        <p className="cs-description">{description}</p>
        {features && features.length > 0 && (
          <ul className="cs-features">
            {features.map((feature, idx) => (
              <li key={idx} className="cs-feature-item">{feature}</li>
            ))}
          </ul>
        )}
        <Link to={`/products/${id}`} className="cs-link">
          Saiba mais &rarr;
        </Link>
      </div>
    </div>
  );
}

export default ProductCard;