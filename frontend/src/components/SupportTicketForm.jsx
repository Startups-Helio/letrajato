import React, { useState } from 'react';
import api from '../api';
import '../styles/SupportTicket.css';

function SupportTicketForm({ onTicketCreated }) {
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await api.post('/letrajato/tickets/', {
        title,
        message
      });

      setTitle('');
      setMessage('');
      
      if (onTicketCreated) {
        onTicketCreated(response.data);
      }
    } catch (err) {
      setError('Erro ao criar ticket. Por favor, tente novamente.');
      console.error('Error creating ticket:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="ticket-form-container">
      <h3>Abrir Novo Ticket de Suporte</h3>
      {error && <div className="error-message">{error}</div>}
      
      <form onSubmit={handleSubmit} className="ticket-form">
        <div className="form-group">
          <label htmlFor="ticket-title">Título</label>
          <input
            id="ticket-title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            placeholder="Resumo do seu problema"
            className="form-control"
          />
        </div>

        {/* 
        <div className="form-group">
          <label htmlFor="ticket-priority">Prioridade</label>
          <select
            id="ticket-priority"
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            className="form-control"
          >
            <option value="low">Baixa</option>
            <option value="medium">Média</option>
            <option value="high">Alta</option>
          </select>
        </div>
        */}

        <div className="form-group">
          <label htmlFor="ticket-message">Mensagem</label>
          <textarea
            id="ticket-message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
            placeholder="Descreva seu problema em detalhes"
            className="form-control"
            rows={5}
          />
        </div>

        <button 
          type="submit" 
          className="submit-button"
          disabled={loading}
        >
          {loading ? 'Enviando...' : 'Enviar Ticket'}
        </button>
      </form>
    </div>
  );
}

export default SupportTicketForm;