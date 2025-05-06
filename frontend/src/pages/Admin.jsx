import React from 'react';
import NavBar from '../components/NavBar';
import AdminDashboard from '../components/AdminDashboard';

function Admin() {
  return (
    <div className="admin-page">
      <NavBar />
      <AdminDashboard />
    </div>
  );
}

export default Admin;