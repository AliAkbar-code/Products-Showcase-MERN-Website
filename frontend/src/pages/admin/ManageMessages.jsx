import React, { useState, useEffect } from 'react';
import api from '../../utils/api';
import Alert from '../../components/Alert';

export default function ManageMessages() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const fetchMessages = async () => {
    try {
      const { data } = await api.get('/messages');
      setMessages(data.data);
    } catch (err) {
      setError('Failed to load messages');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this message?')) return;
    
    try {
      await api.delete(`/messages/${id}`);
      setSuccess('Message deleted successfully');
      fetchMessages();
    } catch (err) {
      setError(err.response?.data?.message || 'Deletion failed');
    }
  };

  const handleStatusToggle = async (id, currentStatus) => {
    const newStatus = currentStatus === 'unread' ? 'read' : 'unread';
    try {
      await api.put(`/messages/${id}`, { status: newStatus });
      fetchMessages();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update status');
    }
  };

  return (
    <div className="animate-fade-in">
      <h2 style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        Manage Messages
      </h2>

      <Alert type="error" message={error} onClose={() => setError(null)} />
      <Alert type="success" message={success} onClose={() => setSuccess(null)} />

      {/* Messages List */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-secondary)' }}>Loading...</div>
      ) : (
        <div>
          <h4 style={{ marginBottom: '1rem', color: 'var(--text-primary)' }}>
            All Messages ({messages.length})
          </h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {messages.map(msg => (
              <div 
                key={msg._id} 
                className="glass-card" 
                style={{ 
                  padding: '1.5rem', 
                  borderLeft: `4px solid ${msg.status === 'unread' ? 'var(--primary-color)' : 'var(--border-color)'}`,
                  background: msg.status === 'unread' ? 'rgba(37, 99, 235, 0.02)' : 'var(--bg-white)',
                  transition: 'all 0.3s ease'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem', flexWrap: 'wrap', gap: '1rem' }}>
                  <div>
                    <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.25rem' }}>
                      {msg.subject}
                    </h3>
                    <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                      From: <strong>{msg.name}</strong> ({msg.email}) {msg.phone && `| Phone: ${msg.phone}`}
                    </p>
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                    <span style={{ 
                      fontSize: '0.8rem', 
                      color: 'var(--text-muted)',
                      marginRight: '1rem'
                    }}>
                      {new Date(msg.createdAt).toLocaleString('en-US', { 
                        year: 'numeric', month: 'short', day: 'numeric',
                        hour: '2-digit', minute: '2-digit'
                      })}
                    </span>
                    <button 
                      onClick={() => handleStatusToggle(msg._id, msg.status)} 
                      className="btn" 
                      style={{ 
                        color: msg.status === 'unread' ? 'var(--primary-color)' : 'var(--text-secondary)', 
                        padding: '6px 12px', 
                        background: msg.status === 'unread' ? 'rgba(37, 99, 235, 0.1)' : 'var(--bg-light)',
                        border: '1px solid var(--border-light)',
                        fontSize: '0.85rem',
                        borderRadius: '6px'
                      }}
                    >
                      {msg.status === 'unread' ? 'Mark Read' : 'Mark Unread'}
                    </button>
                    <button 
                      onClick={() => handleDelete(msg._id)} 
                      className="btn btn-danger" 
                      style={{ 
                        padding: '6px 12px',
                        fontSize: '0.85rem',
                        borderRadius: '6px'
                      }}
                    >
                      Delete
                    </button>
                  </div>
                </div>
                
                <div style={{ 
                  background: 'var(--bg-light)', 
                  padding: '1rem', 
                  borderRadius: '8px',
                  color: 'var(--text-primary)',
                  fontSize: '0.95rem',
                  lineHeight: '1.6',
                  whiteSpace: 'pre-wrap'
                }}>
                  {msg.message}
                </div>
              </div>
            ))}
            {messages.length === 0 && (
              <div style={{ 
                textAlign: 'center', 
                padding: '3rem', 
                color: 'var(--text-secondary)',
                background: 'var(--bg-light)',
                borderRadius: '12px',
                border: '1px dashed var(--border-color)'
              }}>
                No messages found.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
