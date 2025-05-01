import {useState, useEffect} from "react"
import api from "../api"
import {useNavigate} from "react-router-dom"
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
    setLoading(true);
    e.preventDefault();
  
    if (!username || !email || !password) {
      alert("Por favor preencha todos os campos obrigatórios.");
      setLoading(false);
      return;
    }
  
    try {
      if (!verified_cnpj) {
        await validateCNPJ();
      } else {
        const response = await api.post(route, {
          email,
          username,
          password,
          cnpj,
          nome_empresa
        });
        
        if (response.status === 201) {
          alert("Registro realizado com sucesso!");
          navigate("/login");
        }
      }
    } catch (error) {
      alert(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="form-container">
      <h1>Registre-se</h1>
      <input
        className="form-input"
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="Nome de Usuário"
      />
      <input
        className="form-input"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
      />
      <input
        className="form-input"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Senha"
      />
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
        placeholder="CNPJ"
        maxLength="14"
      />
      {verified_cnpj &&
        <input
          className="form-input"
          type="text"
          value={nome_empresa}
          onChange={(e) => setNomeEmpresa(e.target.value)}
          placeholder="Nome da Empresa" 
        />
      }
      {loading && <LoadingIndicator />}
      <button className="form-button" type="submit">
        Registrar
      </button>
    </form>
  );
}

export default RegisterForm
