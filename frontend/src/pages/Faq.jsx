import React from 'react';
import "../styles/Faq.css";
import NavBar from '../components/NavBar';
import { Link } from 'react-router-dom';

function Faq() {
  return (
    <div className="suport-container">
        <NavBar />
        <section className="gray-section">
            <div className="gray-text">
                <h1>FAQs</h1>
                <p>
                Alguma pergunta? Aqui você encontrará as respostas mais valorizadas pelos nossos parceiros, além de instruções passo a passo e suporte.
                </p>
            </div>
            <div className="gray-image">
                <img src="src/assets/suporte_image.png" loading="lazy" />
            </div>
        </section>
        <section className="white-section">
            <div className="inner">
                <div className="white-links">
                    <Link to="/*">FAQs</Link>
                    <Link to="/*">About us</Link>
                    <Link to="/support">Ticket Support</Link> {/*!--- cuidado e /ticket ---*/}
                    <Link to="/*">Enter in contact</Link>
                    <Link to="/*">Become verified</Link>
                </div>
                <div className="white-questions">
                    
                </div>
            </div>
        </section>
    </div>
  );
}

export default Faq;