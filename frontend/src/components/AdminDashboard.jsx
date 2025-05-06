import React, { useState, useEffect } from 'react';
import api from '../api';
import '../styles/AdminDashboard.css';
import LoadingIndicator from './LoadingIndicator';

function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionInProgress, setActionInProgress] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await api.get('/letrajato/admin/users/');
      
// Add this single clear debug statement
      console.log("Raw API response:", JSON.stringify(response.data));
      
      // Simplified handling - ensure users is always an array
      const userData = Array.isArray(response.data) ? response.data : [];
      console.log("Using users data:", userData);
      setUsers(userData);
      setError(null);
    } catch (error) {
      console.error('Error fetching users:', error);
      setError('Você não tem permissão para acessar esta página ou ocorreu um erro ao buscar os usuários.');
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const handleUserAction = async (userId, action) => {
    if (actionInProgress) return;
    
    try {
      setActionInProgress(true);
      await api.post('/letrajato/admin/users/', {
        user_id: userId,
        action: action
      });
      
      // Update the users list
      fetchUsers();
      
      // Show success message
      alert(action === 'approve' ? 'Usuário aprovado com sucesso!' : 'Usuário rejeitado com sucesso!');
    } catch (error) {
      setError(`Erro ao ${action === 'approve' ? 'aprovar' : 'rejeitar'} o usuário.`);
      console.error(`Error ${action}ing user:`, error);
    } finally {
      setActionInProgress(false);
    }
  };

  if (loading) {
    return <LoadingIndicator />;
  }

  if (error) {
    return (
      <div className="admin-dashboard error-container">
        <h2>Erro</h2>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      <h2>Painel Administrativo</h2>
      <div className="dashboard-header">
        <h3>Usuários Pendentes de Verificação</h3>
        <button 
          className="refresh-button" 
          onClick={fetchUsers}
          disabled={actionInProgress}
        >
          Atualizar
        </button>
      </div>
      
      {users.length === 0 ? (
        <div className="no-users">
          <p>Não há usuários pendentes de verificação.</p>
        </div>
      ) : (
        <div className="users-table-container">
          <table className="users-table">
            <thead>
              <tr>
                <th>Usuário</th>
                <th>Email</th>
                <th>Empresa</th>
                <th>CNPJ</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user.id}>
                  <td>{user.username}</td>
                  <td>{user.email}</td>
                  <td>{user.nome_empresa}</td>
                  <td>{user.cnpj}</td>
                  <td className="action-buttons">
                    <button 
                      className="approve-button" 
                      onClick={() => handleUserAction(user.id, 'approve')}
                      disabled={actionInProgress}
                    >
                      Aprovar
                    </button>
                    <button 
                      className="deny-button" 
                      onClick={() => handleUserAction(user.id, 'deny')}
                      disabled={actionInProgress}
                    >
                      Rejeitar
                    </button>
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

export default AdminDashboard;