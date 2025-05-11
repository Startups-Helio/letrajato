import React, { useState } from 'react';
import NavBar from '../components/NavBar';
import SupportTicketForm from '../components/SupportTicketForm';
import UserTicketsList from '../components/UserTicketsList';
import '../styles/Support.css';

function Support() {
  const [showNewTicketForm, setShowNewTicketForm] = useState(false);
  
  const handleTicketCreated = () => {
    setShowNewTicketForm(false);
  };
  
  return (
    <div>
      <NavBar />
      <div className="support-container">
        <h2>Central de Suporte</h2>
        
        <div className="support-actions">
          {!showNewTicketForm ? (
            <button 
              className="new-ticket-button" 
              onClick={() => setShowNewTicketForm(true)}
            >
              Abrir Novo Ticket
            </button>
          ) : (
            <button 
              className="cancel-button" 
              onClick={() => setShowNewTicketForm(false)}
            >
              Cancelar
            </button>
          )}
        </div>
        
        {showNewTicketForm ? (
          <SupportTicketForm onTicketCreated={handleTicketCreated} />
        ) : (
          <UserTicketsList />
        )}
      </div>
    </div>
  );
}

export default Support;