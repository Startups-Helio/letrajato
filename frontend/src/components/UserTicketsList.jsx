import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';
import '../styles/SupportTicket.css';

function UserTicketsList() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadTickets = async () => {
    try {
      setLoading(true);
      const response = await api.get('/letrajato/tickets/');
      setTickets(response.data);
      setError(null);
    } catch (err) {
      setError('Erro ao carregar tickets. Por favor, recarregue a página.');
      console.error('Error loading tickets:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTickets();
  }, []);

  const getStatusClass = (status) => {
    switch (status) {
      case 'open': return 'status-open';
      case 'in_progress': return 'status-in-progress';
      case 'closed': return 'status-closed';
      default: return '';
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('pt-BR');
  };

  if (loading) {
    return <div className="loading-container">Carregando tickets...</div>;
  }

  if (error) {
    return <div className="error-container">{error}</div>;
  }

  return (
    <div className="tickets-list-container">
      <div className="tickets-header">
        <h3>Meus Tickets de Suporte</h3>
        <button onClick={loadTickets} className="refresh-button">Atualizar</button>
      </div>

      {tickets.length === 0 ? (
        <div className="no-tickets">
          <p>Você não possui nenhum ticket de suporte aberto.</p>
        </div>
      ) : (
        <table className="tickets-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Título</th>
              <th>Status</th>
              <th>Prioridade</th>
              <th>Criado em</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {tickets.map((ticket) => (
              <tr key={ticket.id}>
                <td>#{ticket.id}</td>
                <td>{ticket.title}</td>
                <td>
                  <span className={`status-badge ${getStatusClass(ticket.status)}`}>
                    {ticket.status_display}
                  </span>
                </td>
                <td>{ticket.priority_display}</td>
                <td>{formatDate(ticket.created_at)}</td>
                <td>
                  <Link to={`/support/ticket/${ticket.id}`} className="view-ticket-button">
                    Ver Detalhes
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default UserTicketsList;