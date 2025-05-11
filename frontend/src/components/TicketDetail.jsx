import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api';
import '../styles/TicketDetail.css';

function TicketDetail({ isAdmin = false }) {
  const { ticketId } = useParams();
  const navigate = useNavigate();
  const [ticket, setTicket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState(null);
  const messagesEndRef = useRef(null);

  const loadTicketData = async () => {
    try {
      setLoading(true);
      const ticketResponse = await api.get(`/letrajato/tickets/${ticketId}/`);
      setTicket(ticketResponse.data);
      
      const messagesResponse = await api.get(`/letrajato/tickets/${ticketId}/messages/`);
      setMessages(messagesResponse.data);
      
      setError(null);
    } catch (err) {
      setError('Erro ao carregar os detalhes do ticket.');
      console.error('Error loading ticket details:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTicketData();
  }, [ticketId]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || sending) return;
    
    try {
      setSending(true);
      await api.post(`/letrajato/tickets/${ticketId}/messages/`, {
        message: newMessage
      });
      
      setNewMessage('');
      loadTicketData();
    } catch (err) {
      setError('Erro ao enviar mensagem. Por favor, tente novamente.');
      console.error('Error sending message:', err);
    } finally {
      setSending(false);
    }
  };

  const handleCloseTicket = async () => {
    if (!isAdmin || !window.confirm('Tem certeza que deseja encerrar este ticket?')) return;
    
    try {
      await api.patch(`/letrajato/tickets/${ticketId}/`, {
        status: 'closed'
      });
      loadTicketData();
    } catch (err) {
      setError('Erro ao encerrar o ticket.');
      console.error('Error closing ticket:', err);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('pt-BR');
  };

  const getStatusClass = (status) => {
    switch (status) {
      case 'open': return 'status-open';
      case 'in_progress': return 'status-in-progress';
      case 'closed': return 'status-closed';
      default: return '';
    }
  };

  if (loading) {
    return <div className="loading-container">Carregando detalhes do ticket...</div>;
  }

  if (error) {
    return <div className="error-container">{error}</div>;
  }

  if (!ticket) {
    return <div className="error-container">Ticket não encontrado.</div>;
  }

  return (
    <div className="ticket-detail-container">
      <div className="ticket-header">
        <button 
          onClick={() => navigate(isAdmin ? '/admin' : '/support')}
          className="back-button"
        >
          &larr; Voltar
        </button>
        <h2>Ticket #{ticket.id}: {ticket.title}</h2>
        <div className="ticket-meta">
          <span className={`status-badge ${getStatusClass(ticket.status)}`}>
            {ticket.status_display}
          </span>
          <span className="ticket-date">
            Criado em: {formatDate(ticket.created_at)}
          </span>
        </div>
      </div>

      <div className="ticket-chat">
        <div className="messages-container">
          {messages.length === 0 ? (
            <div className="no-messages">Nenhuma mensagem neste ticket ainda.</div>
          ) : (
            messages.map((msg) => (
              <div 
                key={msg.id} 
                className={`message ${msg.is_from_admin ? 'admin-message' : 'user-message'}`}
              >
                <div className="message-header">
                  <span className="sender-name">{msg.sender_name}</span>
                  <span className="message-time">{formatDate(msg.created_at)}</span>
                </div>
                <div className="message-content">{msg.message}</div>
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>

        {ticket.status !== 'closed' ? (
          <form onSubmit={handleSendMessage} className="message-form">
            <textarea
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Digite sua mensagem..."
              className="message-input"
              required
            />
            <div className="form-actions">
              <button 
                type="submit" 
                className="send-button"
                disabled={sending || !newMessage.trim()}
              >
                {sending ? 'Enviando...' : 'Enviar'}
              </button>
              {isAdmin && (
                <button 
                  type="button"
                  onClick={handleCloseTicket}
                  className="close-ticket-button"
                >
                  Encerrar Ticket
                </button>
              )}
            </div>
          </form>
        ) : (
          <div className="ticket-closed-message">
            Este ticket foi encerrado em {formatDate(ticket.closed_at)}.
          </div>
        )}
      </div>
    </div>
  );
}

export default TicketDetail;