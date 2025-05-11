import NavBar from '../components/NavBar';
import "../styles/NotFound.css";
import React from 'react';

function NotFound(){
  return (
    <div className="not-found-page">
      <NavBar />
      <div className="not-found-container">
        <h1>404 Not Found</h1>
        <p>A página que você procurou não existe ou esta em desenvolvimento!</p>
      </div>
    </div>
  )
}

export default NotFound

