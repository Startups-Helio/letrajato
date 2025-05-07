import React, { useState, useContext } from 'react';
import api from '../api';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import '../styles/Form.css';

function Form({ route, method, onSuccess }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const res = await api.post(route, { email, password });
      // usa função de contexto para armazenar tokens
      await login(email, password);
      navigate('/home');
      if (onSuccess) onSuccess({ email, password });
    } catch (err) {
      setError('Credenciais inválidas. Tente novamente.');

    }
  };

  return (
    <form className="form-container" onSubmit={handleSubmit}>
      {error && <p className="error">{error}</p>}
      <h1>Entrar</h1>
      <input
        id="email"
        className="form-input"
        type="email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        placeholder="Email"
        required
      />

      <input
        id="password"
        className="form-input"
        type="password"
        value={password}
        onChange={e => setPassword(e.target.value)}
        placeholder="Senha"
        required
      />
      <button type="submit" className="form-button">
        Login
      </button>
      <Link to="/register" className="redirect-form">Não possui cadastro? Registre-se</Link>
    </form>
  );
}

export default Form;
