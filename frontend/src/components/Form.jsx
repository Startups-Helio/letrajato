import React, { useState, useContext } from 'react';
import api from '../api';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import '../styles/Form.css';

function Form({ route, method, onSuccess }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const res = await api.post(route, { username, password });
      if (method === 'login') {
        // usa função de contexto para armazenar tokens
        await login(username, password);
        navigate('/home');
      } else {
        // método register ou outros
        navigate('/login');
      }
      if (onSuccess) onSuccess({ username, password });
    } catch (err) {
      setError('Credenciais inválidas. Tente novamente.');
    }
  };

  return (
    <form className="form-container" onSubmit={handleSubmit}>
      {error && <p className="error">{error}</p>}
      <label htmlFor="username">Usuário</label>
      <input
        id="username"
        className="form-input"
        type="text"
        value={username}
        onChange={e => setUsername(e.target.value)}
        required
      />

      <label htmlFor="password">Senha</label>
      <input
        id="password"
        className="form-input"
        type="password"
        value={password}
        onChange={e => setPassword(e.target.value)}
        required
      />

      <button type="submit" className="form-button">
        {method === 'login' ? 'Entrar' : 'Registrar'}
      </button>
    </form>
  );
}

export default Form;