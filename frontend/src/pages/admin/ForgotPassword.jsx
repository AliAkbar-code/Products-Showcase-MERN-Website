import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../utils/api';
import Alert from '../../components/Alert';

export default function ForgotPassword() {
  const [username, setUsername] = useState('');
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);
  const [resetToken, setResetToken] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleForgot = async (e) => {
    e.preventDefault();
    if (!username) {
      setError('Please fill in your username');
      return;
    }

    setLoading(true);
    setError(null);
    setMessage(null);

    try {
      const { data } = await api.post('/admin/forgot-password', {
        username
      });
      setMessage(data.message);
      if (data.data) {
        setResetToken(data.data);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to request reset');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container animate-fade-in" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
      <div className="glass-card" style={{ width: '100%', maxWidth: '400px', padding: '2rem' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '2rem', color: 'var(--text-primary)' }}>Forgot Password</h2>
        
        {error && <Alert type="error" message={error} onClose={() => setError(null)} />}
        {message && <Alert type="success" message={message} onClose={() => setMessage(null)} />}
        
        {!resetToken ? (
          <form onSubmit={handleForgot}>
            <div className="form-group">
              <label className="form-label">Username</label>
              <input 
                type="text" 
                className="form-input" 
                value={username}
                onChange={e => setUsername(e.target.value)}
                placeholder="Enter your username"
              />
            </div>
            <button 
              type="submit" 
              className="btn btn-primary" 
              style={{ width: '100%', marginTop: '1rem', height: '48px' }}
              disabled={loading}
            >
              {loading ? 'Requesting...' : 'Request Password Reset'}
            </button>
            <div style={{ textAlign: 'center', marginTop: '1rem' }}>
               <span 
                 onClick={() => navigate('/login')} 
                 style={{ cursor: 'pointer', color: 'var(--primary)', fontSize: '0.9rem' }}
               >
                 Back to Login
               </span>
            </div>
          </form>
        ) : (
          <div style={{ textAlign: 'center', marginTop: '1rem' }}>
             <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }}>Your reset token has been generated. Normally this would be emailed to you.</p>
             <button 
               onClick={() => navigate(`/reset-password/${resetToken}`)} 
               className="btn btn-primary" 
               style={{ width: '100%', height: '48px' }}
             >
               Proceed to Reset Password
             </button>
          </div>
        )}
      </div>
    </div>
  );
}
