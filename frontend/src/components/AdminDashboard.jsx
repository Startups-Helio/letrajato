import React, { useState, useEffect } from "react";
import { Link } from 'react-router-dom';
import api from "../api";
import AdminTicketsDashboard from './AdminTicketsDashboard';
import ProductManagement from './ProductManagement';
import "../styles/AdminDashboard.css";

function AdminDashboard() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [actionInProgress, setActionInProgress] = useState(false);
    const [expandedUser, setExpandedUser] = useState(null);
    const [activeTab, setActiveTab] = useState('users'); // 'users', 'support', or 'products'
    
    useEffect(() => {
        if (activeTab === 'users') {
            loadUsers();
        }
    }, [activeTab]);
    
    const loadUsers = async () => {
        try {
            setLoading(true);
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
            alert(`Falha ao ${action === 'approve' ? 'aprovar' : 'rejeitar'} usuário. Tente novamente.`);
        } finally {
            setActionInProgress(false);
        }
    };
    
    const toggleUserExpand = (userId) => {
        if (expandedUser === userId) {
            setExpandedUser(null);
        } else {
            setExpandedUser(userId);
        }
    };
    
    const renderCNPJData = (cnpjData) => {
        if (!cnpjData) return <div className="no-cnpj-data">Sem dados de CNPJ disponíveis</div>;
        
        // Check for error in the CNPJ data
        if (cnpjData.error) {
            return <div className="cnpj-error">Erro: {cnpjData.error}</div>;
        }
        
        const importantFields = [
            { key: 'nome', label: 'Nome oficial' },
            { key: 'fantasia', label: 'Nome fantasia' },
            { key: 'situacao', label: 'Situação' },
            { key: 'tipo', label: 'Tipo' },
            { key: 'abertura', label: 'Data de abertura' },
            { key: 'capital_social', label: 'Capital social' },
            { key: 'natureza_juridica', label: 'Natureza jurídica' },
            { key: 'porte', label: 'Porte' }
        ];
        
        const addressFields = [
            { key: 'logradouro', label: 'Endereço' },
            { key: 'numero', label: 'Número' },
            { key: 'complemento', label: 'Complemento' },
            { key: 'bairro', label: 'Bairro' },
            { key: 'municipio', label: 'Município' },
            { key: 'uf', label: 'UF' },
            { key: 'cep', label: 'CEP' }
        ];
        
        const contactFields = [
            { key: 'telefone', label: 'Telefone' },
            { key: 'email', label: 'Email' }
        ];
        
        return (
            <div className="cnpj-data">
                <div className="cnpj-section">
                    <h4>Dados básicos da empresa</h4>
                    <table>
                        <tbody>
                            {importantFields.map(field => 
                                cnpjData[field.key] ? (
                                    <tr key={field.key}>
                                        <td className="field-label">{field.label}:</td>
                                        <td className="field-value">{cnpjData[field.key]}</td>
                                    </tr>
                                ) : null
                            )}
                        </tbody>
                    </table>
                </div>
                
                <div className="cnpj-section">
                    <h4>Endereço</h4>
                    <table>
                        <tbody>
                            {addressFields.map(field => 
                                cnpjData[field.key] ? (
                                    <tr key={field.key}>
                                        <td className="field-label">{field.label}:</td>
                                        <td className="field-value">{cnpjData[field.key]}</td>
                                    </tr>
                                ) : null
                            )}
                        </tbody>
                    </table>
                </div>
                
                <div className="cnpj-section">
                    <h4>Contato</h4>
                    <table>
                        <tbody>
                            {contactFields.map(field => 
                                cnpjData[field.key] ? (
                                    <tr key={field.key}>
                                        <td className="field-label">{field.label}:</td>
                                        <td className="field-value">{cnpjData[field.key]}</td>
                                    </tr>
                                ) : null
                            )}
                        </tbody>
                    </table>
                </div>
                
                {/* Atividade Principal Section */}
                {cnpjData.atividade_principal && cnpjData.atividade_principal.length > 0 && (
                    <div className="cnpj-section">
                        <h4>Atividade Principal</h4>
                        <ul>
                            {cnpjData.atividade_principal.map((atividade, index) => (
                                <li key={index}>{atividade.text}</li>
                            ))}
                        </ul>
                    </div>
                )}
                
                {/* Atividades Secundárias Section */}
                {cnpjData.atividades_secundarias && cnpjData.atividades_secundarias.length > 0 && (
                    <div className="cnpj-section">
                        <h4>Atividades Secundárias</h4>
                        <ul>
                            {cnpjData.atividades_secundarias.map((atividade, index) => (
                                <li key={index}>{atividade.text}</li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
        );
    };
    
    const renderActiveTab = () => {
        if (activeTab === 'support') {
            return <AdminTicketsDashboard />;
        }
        
        if (activeTab === 'products') {
            return <ProductManagement />;
        }
        
        // Users tab content
        if (loading) {
            return <div className="loading-container">Carregando...</div>;
        }
        
        return (
            <>
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
                                    <th>Info</th>
                                    <th>Usuário</th>
                                    <th>Email</th>
                                    <th>Empresa</th>
                                    <th>CNPJ</th>
                                    <th>Ações</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map(user => (
                                    <React.Fragment key={user.id}>
                                        <tr className={expandedUser === user.id ? "expanded-row" : ""}>
                                            <td>
                                                <button 
                                                    className="toggle-button"
                                                    onClick={() => toggleUserExpand(user.id)}
                                                    aria-label={expandedUser === user.id ? "Esconder detalhes" : "Mostrar detalhes"}
                                                >
                                                    {expandedUser === user.id ? "▼" : "►"}
                                                </button>
                                            </td>
                                            <td>{user.username}</td>
                                            <td>{user.email}</td>
                                            <td>{user.nome_empresa}</td>
                                            <td>
                                                {user.cnpj.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, "$1.$2.$3/$4-$5")}
                                            </td>
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
                                        {expandedUser === user.id && (
                                            <tr className="cnpj-details-row">
                                                <td colSpan="6">
                                                    <div className="cnpj-details-container">
                                                        {renderCNPJData(user.cnpj_data)}
                                                    </div>
                                                </td>
                                            </tr>
                                        )}
                                    </React.Fragment>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </>
        );
    };
    
    return (
        <div className="admin-dashboard">
            <h2>Painel Administrativo</h2>
            
            <div className="admin-tabs">
                <button 
                    className={`tab-button ${activeTab === 'users' ? 'active' : ''}`}
                    onClick={() => setActiveTab('users')}
                >
                    Usuários
                </button>
                <button 
                    className={`tab-button ${activeTab === 'support' ? 'active' : ''}`}
                    onClick={() => setActiveTab('support')}
                >
                    Central de Suporte
                </button>
                <button 
                    className={`tab-button ${activeTab === 'products' ? 'active' : ''}`}
                    onClick={() => setActiveTab('products')}
                >
                    Produtos
                </button>
            </div>
            
            <div className="tab-content">
                {renderActiveTab()}
            </div>
        </div>
    );
}

export default AdminDashboard;