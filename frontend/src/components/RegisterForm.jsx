import {useState} from "react"
import api from "../api"
import {useNavigate} from "react-router-dom"
import {ACCESS_TOKEN, REFRESH_TOKEN} from "../constants"
import "../styles/Form.css"
import LoadingIndicator from "./LoadingIndicator"

function RegisterForm({route, method}){
  const [username, setUsername] = useState("")
  const [nome_empresa, setNomeEmpresa] = useState("")
  const [password, setPassword] = useState("")
  const [cnpj, setCnpj] = useState("")
  const [loading, setLoading] = useState(false)
  const [verified_cnpj, setVerifiedCNPJ] = useState(false)
  const [consulta, setConsulta] = useState(null)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    setLoading(true);
    e.preventDefault();

    try {
      api
      .get(`/letrajato/cnpj/${cnpj}/`)
      .then((res) => res.data)
      .then((data) => {setConsulta(data); alert(data.nome);setVerifiedCNPJ(true)})
      .catch((err) => alert(err));
    } catch (error) {
      alert(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="form-container">
      <h1>Register</h1> {/* Replace {name} with a valid string */}
      <input
        className="form-input"
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="Username"
      />
      <input
        className="form-input"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
      />
      <input
        className="form-input"
        type="text"
        value={cnpj}
        onChange={(e) => setCnpj(e.target.value)}
        placeholder="CNPJ"
      />
      {verified_cnpj &&
        <input
          className="form-input"
          type="text"
          value={nome_empresa}
          onChange={(e) => setNomeEmpresa(e.target.value)}
          placeholder="Nome Empresa"
        />
      }
      {loading && <LoadingIndicator />}
      <button className="form-button" type="submit">
        Submit
      </button> {/* Replace {name} with a valid string */}
    </form>
  );
}

export default RegisterForm
