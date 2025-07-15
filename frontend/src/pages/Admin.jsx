import React from 'react';
import NavBar from '../components/NewNavBar';
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