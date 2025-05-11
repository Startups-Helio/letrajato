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

  const truncateText = (text, maxLength = 30) => {
    return text && text.length > maxLength 
      ? text.substring(0, maxLength) + '...' 
      : text;
  };

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
    return <div className="loading-spinner">Carregando tickets...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  if (tickets.length === 0) {
    return (
      <div className="tickets-list-container">
        <div className="tickets-header">
          <h3>Meus Tickets de Suporte</h3>
          <button onClick={loadTickets} className="refresh-button">Atualizar</button>
        </div>
        <div className="no-tickets">
          <p>Você ainda não abriu nenhum ticket de suporte.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="tickets-list-container">
      <div className="tickets-header">
        <h3>Meus Tickets de Suporte</h3>
        <button onClick={loadTickets} className="refresh-button">Atualizar</button>
      </div>
      
      <table className="tickets-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Título</th>
            <th>Status</th>
            <th>Criado em</th>
            <th>Última Atualização</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {tickets.map((ticket) => (
            <tr key={ticket.id}>
              <td>#{ticket.id}</td>
              <td title={ticket.title}>{truncateText(ticket.title)}</td>
              <td>
                <span className={`status-badge ${getStatusClass(ticket.status)}`}>
                  {ticket.status_display}
                </span>
              </td>
              <td>{formatDate(ticket.created_at)}</td>
              <td>{formatDate(ticket.updated_at)}</td>
              <td>
                <Link to={`/support/ticket/${ticket.id}`} className="view-ticket-button">
                  Detalhes
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default UserTicketsList;