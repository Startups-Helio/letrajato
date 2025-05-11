import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';
import '../styles/AdminTickets.css';

function AdminTicketsDashboard() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');

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

  // Function to truncate text if it exceeds maxLength
  const truncateText = (text, maxLength = 30) => {
    return text && text.length > maxLength 
      ? text.substring(0, maxLength) + '...' 
      : text;
  };

  const filteredTickets = tickets.filter(ticket => {
    if (filter === 'all') return true;
    return ticket.status === filter;
  });

  if (loading) {
    return <div className="loading-container">Carregando tickets...</div>;
  }

  if (error) {
    return <div className="error-container">{error}</div>;
  }

  return (
    <div className="admin-tickets-container">
      <div className="dashboard-header">
        <h3>Tickets de Suporte</h3>
        <div className="filter-controls">
          <select 
            value={filter} 
            onChange={(e) => setFilter(e.target.value)}
            className="filter-dropdown"
          >
            <option value="all">Todos os Tickets</option>
            <option value="open">Abertos</option>
            <option value="in_progress">Em Andamento</option>
            <option value="closed">Fechados</option>
          </select>
          <button onClick={loadTickets} className="refresh-button">
            Atualizar
          </button>
        </div>
      </div>

      {filteredTickets.length === 0 ? (
        <div className="no-tickets">
          <p>Não há tickets de suporte {filter !== 'all' ? 'com este status' : ''} no momento.</p>
        </div>
      ) : (
        <div className="tickets-table-container">
          <table className="tickets-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Usuário</th>
                <th>Título</th>
                <th>Status</th>
                <th>Criado em</th>
                <th>Última Atualização</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {filteredTickets.map((ticket) => (
                <tr key={ticket.id}>
                  <td>#{ticket.id}</td>
                  <td>{ticket.user ? ticket.user.username : (ticket.username || "-")}</td>
                  <td title={ticket.title}>{truncateText(ticket.title)}</td>
                  <td>
                    <span className={`status-badge ${getStatusClass(ticket.status)}`}>
                      {ticket.status_display}
                    </span>
                  </td>
                  <td>{formatDate(ticket.created_at)}</td>
                  <td>{formatDate(ticket.updated_at)}</td>
                  <td>
                    <Link to={`/admin/support/ticket/${ticket.id}`} className="view-ticket-button">
                      {ticket.status !== 'closed' ? 'Responder':'Detalhes'}
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default AdminTicketsDashboard;