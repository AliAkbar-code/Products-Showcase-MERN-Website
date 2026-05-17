import React, { useState, useEffect } from 'react';
import api from '../../utils/api';
import Alert from '../../components/Alert';

export default function AdminSettings() {
  const [profile, setProfile] = useState(null);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get('/admin/profile');
        setProfile(res.data.data);
      } catch (err) {
        // Handle error implicitly
      } finally {
        setFetching(false);
      }
    };
    fetchProfile();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setError('New passwords do not match');
      return;
    }
    
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      await api.put('/admin/change-password', {
        currentPassword,
        newPassword
      });
      setSuccess('Password changed successfully');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to change password');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return <div className="animate-fade-in"><p>Loading settings...</p></div>;
  }

  return (
    <div className="animate-fade-in">
      <h2 style={{ marginBottom: '1.5rem' }}>Admin Settings</h2>

      <Alert type="error" message={error} onClose={() => setError(null)} />
      <Alert type="success" message={success} onClose={() => setSuccess(null)} />

      <div style={{ display: 'grid', gap: '2rem', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' }}>
        
        {/* Profile Info */}
        <div className="glass-card" style={{ padding: '2rem', borderRadius: '12px', height: 'fit-content' }}>
          <h3 style={{ marginBottom: '1.5rem' }}>Profile Information</h3>
          {profile ? (
            <div>
              <p style={{ marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Username</p>
              <div style={{ fontSize: '1.1rem', fontWeight: 600, background: 'rgba(0,0,0,0.2)', padding: '10px 15px', borderRadius: '8px' }}>
                {profile.username}
              </div>
            </div>
          ) : (
            <p style={{ color: 'var(--text-secondary)' }}>Failed to load profile details.</p>
          )}
        </div>

        {/* Change Password */}
        <div className="glass-card" style={{ padding: '2rem', borderRadius: '12px' }}>
          <h3 style={{ marginBottom: '1.5rem' }}>Change Password</h3>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label">Current Password *</label>
              <input 
                type="password" 
                className="form-input" 
                value={currentPassword} 
                onChange={e => setCurrentPassword(e.target.value)} 
                required
              />
            </div>

            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label">New Password *</label>
              <input 
                type="password" 
                className="form-input" 
                value={newPassword} 
                onChange={e => setNewPassword(e.target.value)} 
                required
                minLength={6}
              />
            </div>

            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label">Confirm New Password *</label>
              <input 
                type="password" 
                className="form-input" 
                value={confirmPassword} 
                onChange={e => setConfirmPassword(e.target.value)} 
                required
                minLength={6}
              />
            </div>

            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Updating...' : 'Update Password'}
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}
