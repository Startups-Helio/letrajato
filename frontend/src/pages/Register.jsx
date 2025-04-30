<<<<<<< HEAD
import RegisterForm from "../components/RegisterForm"

function Register(){
  return <RegisterForm route="/letrajato/user/register/" method="register"/>
=======
import Form from "../components/Form"
import NavBar from "../components/NavBar"

function Register(){
  return <div>
          <NavBar/>
          <Form route="/letrajato/user/register/" method="register"/>
        </div>
>>>>>>> main
}

export default Register
