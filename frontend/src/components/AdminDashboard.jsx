import React, { useState, useEffect } from 'react';
import api from '../api';
import '../styles/AdminDashboard.css';
import LoadingIndicator from './LoadingIndicator';

function AdminDashboard() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [actionInProgress, setActionInProgress] = useState(false);
    
    useEffect(() => {
        loadUsers();
    }, []);
    
    const loadUsers = async () => {
        try {
            const response = await api.get('/letrajato/admin/users/');
            setUsers(response.data);
        } catch (error) {
            console.error('Error loading users:', error);
        } finally {
            setLoading(false);
        }
    };
    
    const handleUserAction = async (userId, action) => {
        if (actionInProgress) return;
        
        setActionInProgress(true);
        try {
            await api.post('/letrajato/admin/users/', {
                user_id: userId,
                action: action // 'approve' or 'deny'
            });
            
            // Refresh the user list
            loadUsers();
            
        } catch (error) {
            console.error(`Error ${action}ing user:`, error);
            alert(`Failed to ${action} user. Please try again.`);
        } finally {
            setActionInProgress(false);
        }
    };
    
    if (loading) {
        return <LoadingIndicator />;
    }
    
    return (
        <div className="admin-dashboard">
            <h2>Painel Administrativo</h2>
            <div className="dashboard-header">
                <h3>Usuários Pendentes de Verificação</h3>
                <button 
                    className="refresh-button" 
                    onClick={loadUsers}
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