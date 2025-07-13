import React, { useState } from "react";
import "../styles/Faq.css";
import NavBar from "../components/NavBar";
import { Link } from "react-router-dom";
import faqData from "../assets/jsons/faq.json";

function Faq() {
  const INCREMENT = 4;
  const [visibleCount, setVisibleCount] = useState(INCREMENT);
  const visibleFaqs = faqData.slice(0, visibleCount);
  const hasMore = visibleCount < faqData.length;

  return (
    <div className="suport-container">
      <NavBar />
      <section className="gray-section">
        <div className="gray-text">
          <h1>FAQs</h1>
          <p>
            Alguma pergunta? Aqui você encontrará as respostas mais valorizadas
            pelos nossos parceiros, além de instruções passo a passo e suporte.
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
            <Link to="/support">Ticket Support</Link>{" "} {/*!--- cuidado é /ticket ---*/}
            <Link to="/*">Enter in contact</Link>
            <Link to="/*">Become verified</Link>
          </div>
          <div className="white-questions">
            {visibleFaqs.map((item, idx) => (
              <details key={idx}>
                <summary>{item.question}</summary>
                <p>{item.answer}</p>
              </details>
            ))}

            {hasMore && (
              <button
                className="see-more"
                onClick={() => setVisibleCount((c) => c + INCREMENT)}
              >
                See More…
              </button>
            )}

            {!hasMore && (
              <button
                className="see-more"
                onClick={() => setVisibleCount(INCREMENT)}
              >
                Close Questions
              </button>
            )}
          </div>
        </div>
      </section>
      <section className="white-section">
        <div className="zaia-chat-bot">
          <iframe
            id="widget-iframe"
            title="Zaia Chat"
            src="https://platform.zaia.app/embed/chat/30857"
            loading="lazy"
          ></iframe>
        </div>
      </section>
    </div>
  );
}

export default Faq;
