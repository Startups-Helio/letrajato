import React, { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";
import api from "../api";
import "../styles/NavBar.css";

function NavBar() {
  const { isAuthenticated, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);
  const [isRevendedor, setIsRevendedor] = useState(false);
  const [verified, setVerified] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      checkAdminStatus();
      checkUserStatus();
    }
  }, [isAuthenticated]);

  const checkAdminStatus = async () => {
    try {
      const response = await api.get('/letrajato/check-admin/');
      setIsAdmin(response.data.is_admin);
    } catch (error) {
      console.error("Failed to check admin status", error);
    }
  };

  const checkUserStatus = async () => {
    try {
      const response = await api.get('/letrajato/verify-status/');
      if (response.status === 200) {
        setIsRevendedor(response.data.is_revendedor);
        setVerified(response.data.verificado);
      }
    } catch (error) {
      console.error('Error checking user status:', error);
    }
  };

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
        <Link to="/home" className="nav-link">Início</Link>
        {/*<Link to="/faq" className="nav-link admin-link">FAQ</Link>*/}
        {isAuthenticated ? (
          <>
            {(isRevendedor || isAdmin) && (
              <Link to="/orcamento" className="nav-link">Orçamento</Link>
            )}
            {(!isAdmin) && (
              <Link to="/support" className="nav-link">Suporte</Link>
            )}
            {isAdmin && (
              <Link to="/admin" className="nav-link admin-link">Admin Dashboard</Link>
            )}
            <button onClick={handleLogout} className="nav-bar-button">Sair</button>
          </>
        ) : (
          <>
            <Link to="/login" className="nav-link">Entrar</Link>
            <Link to="/register" className="nav-bar-button">Registrar</Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default NavBar;