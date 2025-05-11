import React from 'react';
import NavBar from '../components/NavBar';
import AdminTicketsDashboard from '../components/AdminTicketsDashboard';

function AdminSupport() {
  return (
    <div>
      <NavBar />
      <div className="admin-support-container">
        <h2>Central de Suporte - Administração</h2>
        <AdminTicketsDashboard />
      </div>
    </div>
  );
}

export default AdminSupport;