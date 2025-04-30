import Form from "../components/Form"
import NavBar from "../components/NavBar"

function Login(){
  
  return<div class name="login-container">
    <NavBar />
    <Form route="/letrajato/token/" method="login"/>
  </div>
}

export default Login

