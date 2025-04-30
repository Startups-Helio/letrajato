import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import "../styles/NavBar.css";

function NavBar() {
  const location = useLocation();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  
  useEffect(() => {
    // Verifica se o usuário está logado (tem token de acesso)
    const token = localStorage.getItem("access_token");
    setIsLoggedIn(!!token);
  }, [location]);

  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <Link to="/">Letrajato</Link>
      </div>
      <div className="navbar-links">
        <Link to="/" className="nav-link">Início</Link>
        
        {isLoggedIn ? (
          <>
            <Link to="/home" className="nav-link">Dashboard</Link>
            <Link to="/notes" className="nav-link">Notas</Link>
            <Link to="/logout" className="nav-link">Sair</Link>
          </>
        ) : (
          <>
            <Link to="/login" className="nav-link">Entrar</Link>
            <Link to="/register" className="nav-button">Registrar</Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default NavBar;