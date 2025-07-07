import React, { useContext, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";
import api from "../api";
import "../styles/NewNavBar.css";

function NewNavBar() {
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
      <ul className="navbar-menu">
        <Link className="navbar-item" to="/marketplace">Produtos</Link>
        <li className="navbar-item">FAQs</li>
        <li className="navbar-item">Serviços</li>
      </ul>
      <div className="navbar-actions">
        <Link to="/home" className="nav-link">Início</Link>
        {isAuthenticated ? (
          <>
            {(isRevendedor || isAdmin) && (
              <Link to="/orcamento" className="navbar-buy">Orçamento</Link>
            )}
            {(!isAdmin) && (
              <Link to="/support" className="navbar-buy">Suporte</Link>
            )}
            {isAdmin && (
              <Link to="/admin" className="navbar-buy">Admin Dashboard</Link>
            )}
            <Link className="navbar-buy" onClick={handleLogout}>Sair</Link>
          </>
        ) : (
          <>
            <Link to="/login" className="navbar-buy">Entrar</Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default NewNavBar;