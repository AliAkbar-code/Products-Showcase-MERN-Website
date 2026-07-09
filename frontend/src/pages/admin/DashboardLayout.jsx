import React, { useContext, useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../App';

const sidebarLinks = [
  { to: '/admin/overview', icon: '📊', label: 'Overview' },
  { to: '/admin/products', icon: '📦', label: 'Products' },
  { to: '/admin/categories', icon: '🏷️', label: 'Categories' },
  { to: '/admin/homepage', icon: '🏠', label: 'Homepage' },
  { to: '/admin/reviews', icon: '⭐', label: 'Reviews' }, // Added reviews link
  { to: '/admin/messages', icon: '✉️', label: 'Messages' },
  { to: '/admin/site-settings', icon: '⚙️', label: 'Site Settings' },
  { to: '/admin/settings', icon: '👤', label: 'Account' },
];

export default function DashboardLayout() {
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="container animate-fade-in" style={{ display: 'flex', gap: '2rem', padding: '2rem 20px', minHeight: '70vh' }}>
      
      {/* Mobile sidebar toggle */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="btn"
        style={{
          display: 'none',
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          zIndex: 200,
          background: 'linear-gradient(135deg, var(--primary-color), var(--secondary-color))',
          color: '#fff',
          width: '50px',
          height: '50px',
          borderRadius: '50%',
          fontSize: '1.5rem',
          padding: 0,
          boxShadow: '0 4px 15px rgba(99, 102, 241, 0.5)',
          alignItems: 'center',
          justifyContent: 'center'
        }}
        id="sidebar-toggle"
      >
        {sidebarOpen ? '✕' : '☰'}
      </button>

      {/* Sidebar */}
      <aside
        className="glass-card"
        style={{
          width: '250px',
          flexShrink: 0,
          alignSelf: 'flex-start',
          position: 'sticky',
          top: '90px'
        }}
        id="admin-sidebar"
      >
        <h3 style={{ padding: '0 10px', marginBottom: '1rem', color: 'var(--text-secondary)', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '1px' }}>
          Admin Panel
        </h3>
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
          {sidebarLinks.map(link => (
            <NavLink 
              key={link.to}
              to={link.to}
              className={({ isActive }) => `btn ${isActive ? 'btn-primary' : ''}`}
              style={({ isActive }) => ({
                textAlign: 'left',
                background: isActive ? '' : 'transparent',
                color: isActive ? '#fff' : 'var(--text-primary)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.6rem',
                padding: '10px 14px',
                fontSize: '0.95rem'
              })}
            >
              <span>{link.icon}</span>
              <span>{link.label}</span>
            </NavLink>
          ))}
        </nav>
        
        <div style={{ marginTop: '1.5rem', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '1rem' }}>
          <button 
            onClick={handleLogout}
            className="btn" 
            style={{ width: '100%', textAlign: 'left', background: 'transparent', color: 'var(--danger)', display: 'flex', alignItems: 'center', gap: '0.6rem', padding: '10px 14px' }}
          >
            <span>🚪</span>
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="glass-card" style={{ flex: 1, overflowX: 'auto', padding: '2rem' }}>
        <Outlet />
      </div>
      
      <style>{`
        @media (max-width: 768px) {
          #sidebar-toggle {
            display: flex !important;
          }
          #admin-sidebar {
            position: fixed !important;
            top: 0 !important;
            left: ${sidebarOpen ? '0' : '-300px'};
            width: 260px !important;
            height: 100vh;
            z-index: 150;
            border-radius: 0 16px 16px 0 !important;
            transition: left 0.3s ease;
            overflow-y: auto;
            padding-top: 2rem !important;
          }
        }
      `}</style>
    </div>
  );
}