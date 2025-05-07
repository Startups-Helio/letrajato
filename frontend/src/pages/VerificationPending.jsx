import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api";
import NavBar from "../components/NavBar";
import "../styles/VerificationPending.css";

function VerificationPending() {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    checkVerificationStatus();
  }, []);

  const checkVerificationStatus = async () => {
    try {
      const response = await api.get("/letrajato/verify-status/");
      setUserData(response.data);

      if (response.data.verificado || !response.data.is_revendedor) {
        navigate("/home");
      }
    } catch (error) {
      console.error("Error checking verification status:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading-container">Loading...</div>;
  }

  return (
    <>
      <NavBar />
      <div className="verification-pending-container">
        <div className="verification-pending-content">
          <h1>Verificação Pendente</h1>

          <div className="verification-status">
            <p>
              Olá <strong>{userData?.username}</strong>,
            </p>
            <p>
              Seu cadastro como revendedor está sendo analisado por nossa equipe.
            </p>
            <p>
              Você receberá um email quando sua solicitação for processada.
            </p>
          </div>

          <div className="company-info">
            <h3>Dados da Empresa:</h3>
            <p>
              <strong>Nome:</strong> {userData?.nome_empresa}
            </p>
            <p>
              <strong>CNPJ:</strong> {userData?.cnpj}
            </p>
          </div>

          <div className="action-buttons">
            <Link to="/home" className="home-button">
              Ir para a Página Inicial
            </Link>
            <button
              className="logout-button"
              onClick={() => {
                localStorage.removeItem("token");
                navigate("/login");
              }}
            >
              Sair
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default VerificationPending;