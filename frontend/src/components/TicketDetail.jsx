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
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [fileError, setFileError] = useState(null);
  const [downloadingAttachments, setDownloadingAttachments] = useState({});
  const [fileInputKey, setFileInputKey] = useState(Date.now());
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

  const handleFileChange = (e) => {
    // Get newly selected files
    const newFiles = Array.from(e.target.files);
    
    // Check if total combined files would exceed 5
    if (newFiles.length + selectedFiles.length > 5) {
      setFileError("Você pode anexar no máximo 5 arquivos por mensagem.");
      return;
    }
    
    // Combine existing files with new files
    setFileError(null);
    setSelectedFiles(prevFiles => [...prevFiles, ...newFiles]);
    
    // Reset the file input so the same file can be selected again if needed
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleRemoveFile = (indexToRemove) => {
    setSelectedFiles(prev => prev.filter((_, index) => index !== indexToRemove));
  };

  // Reset the file input by recreating it
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if ((!newMessage.trim() && selectedFiles.length === 0) || sending) return;
    
    try {
      setSending(true);
      
      const formData = new FormData();
      // Make sure to include the message field, even if empty
      formData.append('message', newMessage || ''); 
      
      // Add each file with the correct field name
      selectedFiles.forEach(file => {
        formData.append('uploaded_files', file);
      });
      
      // Debug the request
      console.log("Sending FormData with:", {
        message: newMessage,
        filesCount: selectedFiles.length
      });
      
      const response = await api.post(`/letrajato/tickets/${ticketId}/messages/`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      console.log("Response:", response.data);
      
      setNewMessage('');
      setSelectedFiles([]);
      setFileInputKey(Date.now());
      
      loadTicketData();
    } catch (err) {
      console.error('Error sending message:', err);
      // Show more details about the error
      if (err.response) {
        console.error('Error response:', err.response.data);
        setError(`Erro ao enviar mensagem: ${JSON.stringify(err.response.data)}`);
      } else {
        setError('Erro ao enviar mensagem. Por favor, tente novamente.');
      }
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

  const handleDownload = async (fileUrl, fileName, attachmentId) => {
    // Prevent downloading if already in progress
    if (downloadingAttachments[attachmentId]) return;
    
    try {
      // Set downloading state for this attachment
      setDownloadingAttachments(prev => ({ ...prev, [attachmentId]: true }));
      
      // Extract the file path from the URL - we just need the path after /media/
      const filePath = fileUrl.includes('/media/') 
        ? fileUrl.split('/media/')[1] 
        : fileUrl;
      
      // Use your API to proxy the file download to avoid CORS
      const response = await api.get(`/letrajato/download-attachment/${attachmentId}/`, {
        responseType: 'blob',
      });
      
      // Create download link and trigger download
      const blob = new Blob([response.data]);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', fileName);
      document.body.appendChild(link);
      link.click();
      link.remove();
      
      // Release the URL object
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading file:', error);
      setError('Erro ao baixar o anexo. Por favor, tente novamente.');
    } finally {
      // Clear downloading state
      setDownloadingAttachments(prev => ({ ...prev, [attachmentId]: false }));
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
                
                {/* Show attachments if available */}
                {msg.attachments && msg.attachments.length > 0 && (
                  <div className="attachments-container">
                    <div className="attachments-header">Anexos ({msg.attachments.length})</div>
                    {msg.attachments.map(attachment => (
                      <div 
                        key={attachment.id}
                        onClick={() => handleDownload(attachment.file, attachment.filename, attachment.id)}
                        className="attachment-link"
                        style={{ cursor: 'pointer' }}
                      >
                        <div className="attachment-icon">
                          {downloadingAttachments[attachment.id] ? '⏳' : getFileIcon(attachment.filename)}
                        </div>
                        <div className="attachment-info">
                          <span className="attachment-name">
                            {attachment.filename}
                          </span>
                          <span className="attachment-action">
                            {downloadingAttachments[attachment.id] ? 'Baixando...' : 'Baixar anexo'}
                          </span>
                        </div>
                      </div>
                    ))}
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
            
            <div className="file-upload-section">
              <label htmlFor="file-upload" className="file-upload-label">
                <span className="attachment-icon">📎</span>
                {selectedFiles.length > 0 
                  ? `Adicionar mais arquivos (${selectedFiles.length}/5)` 
                  : 'Anexar arquivos (máx. 5)'}
              </label>
              <input 
                type="file" 
                id="file-upload"
                ref={fileInputRef}
                multiple
                onChange={handleFileChange}
                className="file-input" 
              />
              
              {selectedFiles.length > 0 && (
                <div className="selected-files">
                  <p>Arquivos selecionados: {selectedFiles.length}/5</p>
                  <ul>
                    {selectedFiles.map((file, index) => (
                      <li key={index} className="selected-file-item">
                        <span>{file.name} ({formatFileSize(file.size)})</span>
                        <button 
                          type="button"
                          className="remove-file-btn"
                          onClick={() => handleRemoveFile(index)}
                        >
                          ✕
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {fileError && <p className="file-error">{fileError}</p>}
            </div>
            
            <div className="form-actions">
              <button 
                type="submit" 
                className="send-button"
                disabled={sending || (!newMessage.trim() && selectedFiles.length === 0)}
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

const getFileIcon = (filename) => {
  const extension = filename.split('.').pop().toLowerCase();
  
  switch (extension) {
    case 'pdf':
      return '📄';
    case 'doc':
    case 'docx':
      return '📝';
    case 'xls':
    case 'xlsx':
      return '📊';
    case 'jpg':
    case 'jpeg':
    case 'png':
    case 'gif':
      return '🖼️';
    case 'zip':
    case 'rar':
      return '📦';
    default:
      return '📎';
  }
};

export default TicketDetail;