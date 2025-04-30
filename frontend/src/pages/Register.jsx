import Form from "../components/Form"
import NavBar from "../components/NavBar"

function Register(){
  return <div>
          <NavBar/>
          <Form route="/letrajato/user/register/" method="register"/>
        </div>
}

export default Register
