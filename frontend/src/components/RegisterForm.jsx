import {useState, useEffect} from "react"
import api from "../api"
import {useNavigate, Link} from "react-router-dom"
import {ACCESS_TOKEN, REFRESH_TOKEN} from "../constants"
import "../styles/Form.css"
import LoadingIndicator from "./LoadingIndicator"

function RegisterForm({route, method}){
  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [nome_empresa, setNomeEmpresa] = useState("")
  const [password, setPassword] = useState("")
  const [cnpj, setCnpj] = useState("")
  const [loading, setLoading] = useState(false)
  const [verified_cnpj, setVerifiedCNPJ] = useState(false)
  const [consulta, setConsulta] = useState(null)
  const navigate = useNavigate()

  const validateCNPJ = async () => {
    if (cnpj.length === 14) {
      setLoading(true);
      try {
        const response = await api.get(`/letrajato/cnpj/${cnpj}/`);
        const data = response.data;
        setConsulta(data);
        setNomeEmpresa(data.nome);
        setVerifiedCNPJ(true);
      } catch (error) {
        alert("Error validating CNPJ: " + error);
      } finally {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    if (cnpj.length === 14) {
      validateCNPJ();
    }
  }, [cnpj]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Check if all required fields are filled
    if (!username) {
      alert("Por favor, preencha o nome de usuário.");
      return;
    }
    
    if (!email) {
      alert("Por favor, preencha o email.");
      return;
    }
    
    if (!password) {
      alert("Por favor, preencha a senha.");
      return;
    }
    
    if (!cnpj || cnpj.length !== 14) {
      alert("Por favor, informe um CNPJ válido com 14 dígitos.");
      return;
    }

    if (!verified_cnpj) {
      alert("Por favor, verifique o CNPJ antes de prosseguir.");
      validateCNPJ();
      return;
    }
    
    if (!nome_empresa) {
      alert("Por favor, preencha o nome da empresa.");
      return;
    }
  
    setLoading(true);
    
    try {
      const response = await api.post(route, {
        email,
        username,
        password,
        cnpj,
        nome_empresa,
        consulta_data: consulta
      });
      
      if (response.status === 201) {
        alert("Registro realizado com sucesso!");
        navigate("/login");
      }
    } catch (error) {
      alert(error.response?.data?.message || "Erro ao registrar. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="form-container">
      <h1>Registre-se</h1>
      
      <div className="input-wrapper">
      <input
        className="form-input"
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="Nome de Usuário"
        required
      />
      <span className={username?"field-status":"field-status-required"}>{username ? "✓" : "*"}</span>
      </div>

      <div className="input-wrapper">
      <input
        className="form-input"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        required
      />
      <span className={email?"field-status":"field-status-required"}>{email ? "✓" : "*"}</span>
      </div>

      <div className="input-wrapper">
      <input
        className="form-input"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Senha"
        required
      />
      <span className={password?"field-status":"field-status-required"}>{password ? "✓" : "*"}</span>
      </div>

      <div className="input-wrapper">
      <input
        className="form-input"
        type="text"
        value={cnpj}
        onChange={(e) => {
          const newValue = e.target.value.replace(/\D/g, '');
          if (newValue.length <= 14) {
            setCnpj(newValue);
          }
        }}
        placeholder="CNPJ (apenas números)"
        maxLength="14"
        required
      />
      <span className={cnpj?"field-status":"field-status-required"}>{cnpj ? "✓" : "*"}</span>
      </div>

      {verified_cnpj &&
      <div className="input-wrapper">
      <input
        className="form-input"
        type="text"
        value={nome_empresa}
        onChange={(e) => setNomeEmpresa(e.target.value)}
        placeholder="Nome da Empresa"
        required
      />
      <span className={nome_empresa?"field-status":"field-status-required"}>{nome_empresa ? "✓" : "*"}</span>
      </div>
      }
      
      {loading && <LoadingIndicator />}
      <button 
        className="form-button" 
        type="submit"
      >
        {loading ? "Processando..." : "Registrar"}
      </button>
      <Link to="/login" className="redirect-form">Já possui login?</Link>
    </form>
  );
}

export default RegisterForm