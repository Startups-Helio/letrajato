import React, { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import NavBar from '../components/NavBar';
import Form from '../components/Form';

function Login() {
  const { login } = useContext(AuthContext);

  return (
    <div className="login-container">
      <NavBar />
      <Form route="/letrajato/token/" method="login" onSuccess={(data) => login(data.email, data.password)} />
    </div>
  );
}

export default Login;