import {useState} from "react"
import api from "../api"
import {useNavigate} from "react-router-dom"
import {ACCESS_TOKEN, REFRESH_TOKEN} from "../constants"
import "../styles/Form.css"
import LoadingIndicator from "./LoadingIndicator"

function Form({route, method}){
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    setLoading(true);
    e.preventDefault();

    try{
      const res = await api.post(route, {email, password})
      localStorage.setItem(ACCESS_TOKEN, res.data.access);
      localStorage.setItem(REFRESH_TOKEN, res.data.refresh);
      navigate("/home")
    }
    catch(error){
      alert(error)
    }
    finally{
      setLoading(false)
    }
  }

  return <form onSubmit={handleSubmit} className="form-container">
  <h1>Login</h1>
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
      placeholder="Password"
    />
    {loading && <LoadingIndicator />}
    <button className="form-button" type="submit">
      Login
    </button>
  </form>
}

export default Form
