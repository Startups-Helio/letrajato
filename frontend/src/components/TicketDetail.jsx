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
  const [attachment, setAttachment] = useState(null);
  const [downloadingAttachments, setDownloadingAttachments] = useState({});
  const fileInputRef = useRef(null);
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

  const handleAttachmentChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        alert("O arquivo é muito grande. O limite é de 10MB.");
        fileInputRef.current.value = '';
        return;
      }
      setAttachment(file);
    }
  };

  const handleRemoveAttachment = () => {
    setAttachment(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if ((!newMessage.trim() && !attachment) || sending) return;
    
    try {
      setSending(true);
      
      const formData = new FormData();
      if (newMessage.trim()) {
        formData.append('message', newMessage);
      }
      if (attachment) {
        formData.append('attachment', attachment);
      }
      
      await api.post(`/letrajato/tickets/${ticketId}/messages/`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      setNewMessage('');
      setAttachment(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
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

  const handleDownload = async (attachmentUrl, fileName, attachmentId) => {
    try {
      setDownloadingAttachments(prev => ({...prev, [attachmentId]: true}));
      
      const url = api.defaults.baseURL + attachmentUrl.replace(/^\/media/, "/media");
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`Failed to download: ${response.statusText}`);
      }
      
      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      console.error("Download error:", error);
      alert("Erro ao baixar o arquivo. Tente novamente mais tarde.");
    } finally {
      setDownloadingAttachments(prev => ({...prev, [attachmentId]: false}));
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

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + ' bytes';
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    else return (bytes / 1048576).toFixed(1) + ' MB';
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
                
                {msg.attachment_url && (
                  <div className="attachment-container">
                    <div 
                      onClick={() => handleDownload(msg.attachment_url, msg.attachment_name, msg.id)}
                      className="attachment-link"
                      style={{ cursor: 'pointer' }}
                    >
                      <div className="attachment-icon">
                        {downloadingAttachments[msg.id] ? '⏳' : getFileIcon(msg.attachment_name)}
                      </div>
                      <div className="attachment-info">
                        <span className="attachment-name">
                          {msg.attachment_name}
                        </span>
                        <span className="attachment-action">
                          {downloadingAttachments[msg.id] ? 'Baixando...' : 'Baixar anexo'}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
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
            />
            
            <div className="attachment-section">
              <input 
                type="file" 
                ref={fileInputRef}
                onChange={handleAttachmentChange}
                id="attachment-input"
                className="attachment-input"
              />
              <label htmlFor="attachment-input" className="attachment-button">
                <span className="attachment-icon">📎</span>
                Anexar arquivo
              </label>
              {attachment && (
                <div className="selected-attachment">
                  <span>{attachment.name} ({formatFileSize(attachment.size)})</span>
                  <button 
                    type="button" 
                    className="remove-attachment-btn" 
                    onClick={handleRemoveAttachment}
                  >
                    ✕
                  </button>
                </div>
              )}
            </div>
            
            <div className="form-actions">
              <button 
                type="submit" 
                className="send-button"
                disabled={sending || (!newMessage.trim() && !attachment)}
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

function getFileIcon(filename) {
  if (!filename) return '📄';
  
  const extension = filename.split('.').pop().toLowerCase();
  switch (extension) {
    case 'pdf': return '📄';
    case 'jpg': 
    case 'jpeg':
    case 'png':
    case 'gif': return '🖼️';
    case 'doc':
    case 'docx': return '📝';
    case 'xls':
    case 'xlsx': return '📊';
    case 'zip':
    case 'rar': return '🗜️';
    default: return '📄';
  }
}

export default TicketDetail;