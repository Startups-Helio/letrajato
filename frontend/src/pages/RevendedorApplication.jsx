import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import NavBar from "../components/NavBar";
import LoadingIndicator from "../components/LoadingIndicator";
import "../styles/RevendedorApplication.css";

function RevendedorApplication() {
  const [cnpj, setCnpj] = useState("");
  const [nomeEmpresa, setNomeEmpresa] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [verifiedCnpj, setVerifiedCnpj] = useState(false);
  const [consulta, setConsulta] = useState(null);
  const [error, setError] = useState("");
  const [userData, setUserData] = useState(null);
  const [pageLoading, setPageLoading] = useState(true);
  
  const navigate = useNavigate();

  useEffect(() => {
    checkUserStatus();
  }, []);

  // Check if user can apply to be a revendedor
  const checkUserStatus = async () => {
    try {
      const response = await api.get("/letrajato/verify-status/");
      setUserData(response.data);
      
      // Redirect if already a revendedor
      if (response.data.is_revendedor) {
        if (response.data.verificado) {
          navigate("/home");
        } else {
          navigate("/verification-pending");
        }
      }
      
    } catch (error) {
      console.error("Error checking user status:", error);
      setError("Erro ao verificar o status do usuário.");
    } finally {
      setPageLoading(false);
    }
  };

  const validateCnpj = async () => {
    if (cnpj.length === 14) {
      setLoading(true);
      setError("");
      
      try {
        const response = await api.get(`/letrajato/cnpj/${cnpj}/`);
        const data = response.data;
        
        setConsulta(data);
        
        if (data.error) {
          setVerifiedCnpj(false);
          setError(`Erro ao consultar CNPJ: ${data.error}`);
        } else {
          setNomeEmpresa(data.nome);
          setVerifiedCnpj(true);
        }
      } catch (error) {
        setVerifiedCnpj(false);
        setError("Erro ao consultar CNPJ. Verifique e tente novamente.");
        console.error("Error validating CNPJ:", error);
      } finally {
        setLoading(false);
      }
    } else {
      setVerifiedCnpj(false);
    }
  };

  useEffect(() => {
    if (cnpj.length === 14) {
      validateCnpj();
    } else {
      setVerifiedCnpj(false);
    }
  }, [cnpj]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!verifiedCnpj) {
      setError("Por favor, verifique o CNPJ antes de prosseguir.");
      return;
    }
    
    if (!nomeEmpresa) {
      setError("Por favor, informe o nome da empresa.");
      return;
    }
    
    setSubmitting(true);
    setError("");
    
    try {
      const response = await api.post("/letrajato/apply-revendedor/", {
        cnpj,
        nome_empresa: nomeEmpresa,
        consulta_data: consulta
      });
      
      if (response.status === 201) {
        navigate("/verification-pending");
      }
    } catch (error) {
      console.error("Error applying for revendedor:", error);
      setError(error.response?.data?.error || "Erro ao enviar solicitação. Tente novamente.");
    } finally {
      setSubmitting(false);
    }
  };

  if (pageLoading) {
    return (
      <div className="page-loader">
        <div className="loader"></div>
        <p>Carregando...</p>
      </div>
    );
  }

  return (
    <>
      <NavBar />
      <div className="revendedor-application-container">
        <div className="revendedor-application-content">
          <h1>Solicitar Cadastro como Revendedor</h1>
          
          <div className="application-info">
            <p>
              Como revendedor Letrajato, você terá acesso a funcionalidades exclusivas e preços diferenciados.
              Complete o formulário abaixo para enviar sua solicitação.
            </p>
            <p>
              Nossa equipe irá analisar seus dados e responderá em breve.
            </p>
          </div>
          
          {error && <div className="error-message">{error}</div>}
          
          <form onSubmit={handleSubmit} className="application-form">
            <div className="form-group">
              <label htmlFor="cnpj">CNPJ da Empresa</label>
              <div className="input-wrapper">
                <input
                  id="cnpj"
                  type="text"
                  value={cnpj}
                  onChange={(e) => {
                    const newValue = e.target.value.replace(/\D/g, '');
                    if (newValue.length <= 14) {
                      setCnpj(newValue);
                    }
                  }}
                  placeholder="Digite apenas os números"
                  maxLength="14"
                  required
                  disabled={submitting}
                />
                <span className={cnpj.length === 14 ? (verifiedCnpj ? "status-verified" : "status-error") : "status-pending"}>
                  {cnpj.length === 14 ? (verifiedCnpj ? "✓" : "✗") : "●"}
                </span>
              </div>
              <small className="form-helper">
                {loading ? "Verificando CNPJ..." : (verifiedCnpj ? "CNPJ válido" : "Digite um CNPJ válido com 14 dígitos")}
              </small>
            </div>
            
            <div className="form-group">
              <label htmlFor="nome-empresa">Nome da Empresa</label>
              <input
                id="nome-empresa"
                type="text"
                value={nomeEmpresa}
                onChange={(e) => setNomeEmpresa(e.target.value)}
                placeholder="Nome oficial da empresa"
                required
                disabled={submitting}
              />
            </div>
            
            {loading && <LoadingIndicator />}
            
            <div className="form-actions">
              <button
                type="submit"
                className="submit-button"
                disabled={submitting || loading || !verifiedCnpj || !nomeEmpresa}
              >
                {submitting ? "Enviando..." : "Enviar Solicitação"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default RevendedorApplication;