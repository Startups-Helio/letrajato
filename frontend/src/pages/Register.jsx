import Form from "../components/RegisterForm"
import NavBar from "../components/NavBar"

function Register(){
  return <div>
          <NavBar/>
          <RegisterForm route="/letrajato/user/register/" method="register"/>
        </div>
}

export default Register
