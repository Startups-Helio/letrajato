import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";
import "../styles/NavBar.css";

function NavBar() {
  const { isAuthenticated, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <Link to="/">Letrajato</Link>
      </div>
      <div className="navbar-links">
        <Link to="/" className="nav-link">Início</Link>
        {isAuthenticated ? (
          <>
            <Link to="/orcamento" className="nav-link">Orçamento</Link>
            <button onClick={handleLogout} className="nav-button">Sair</button>
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