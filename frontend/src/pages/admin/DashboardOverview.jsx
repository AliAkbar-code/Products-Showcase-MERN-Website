import React, { useState, useEffect } from 'react';
import api from '../../utils/api';
import Alert from '../../components/Alert';
import { Link } from 'react-router-dom';

export default function DashboardOverview() {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalCategories: 0,
    featuredProducts: 0,
    outOfStock: 0,
    recentProducts: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [prodRes, catRes] = await Promise.all([
          api.get('/products'),
          api.get('/categories')
        ]);
        
        const products = prodRes.data.data;
        const categories = catRes.data.data;
        
        // Sort products by createdAt descending for recent items
        const recentProd = [...products]
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          .slice(0, 5);

        setStats({
          totalProducts: products.length,
          totalCategories: categories.length,
          featuredProducts: products.filter(p => p.featured).length,
          outOfStock: products.filter(p => p.stock === 0).length,
          recentProducts: recentProd
        });
      } catch (err) {
        console.error('Dashboard data fetch error:', err);
        setError('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return <div className="animate-fade-in"><p>Loading dashboard...</p></div>;
  }

  return (
    <div className="animate-fade-in">
      <h2 style={{ marginBottom: '1.5rem' }}>Dashboard Overview</h2>
      
      <Alert type="error" message={error} onClose={() => setError(null)} />

      {/* Stat Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1.5rem', marginBottom: '2.5rem' }}>
        <div className="glass-card" style={{ padding: '1.5rem', textAlign: 'center', borderRadius: '12px' }}>
          <h3 style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', textTransform: 'uppercase', marginBottom: '0.5rem', letterSpacing: '1px' }}>Total Products</h3>
          <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: 'var(--primary-color)' }}>{stats.totalProducts}</div>
        </div>
        
        <div className="glass-card" style={{ padding: '1.5rem', textAlign: 'center', borderRadius: '12px' }}>
          <h3 style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', textTransform: 'uppercase', marginBottom: '0.5rem', letterSpacing: '1px' }}>Categories</h3>
          <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: 'var(--secondary-color)' }}>{stats.totalCategories}</div>
        </div>
        
        <div className="glass-card" style={{ padding: '1.5rem', textAlign: 'center', borderRadius: '12px' }}>
          <h3 style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', textTransform: 'uppercase', marginBottom: '0.5rem', letterSpacing: '1px' }}>Featured</h3>
          <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: 'var(--accent-color)' }}>{stats.featuredProducts}</div>
        </div>
        
        <div className="glass-card" style={{ padding: '1.5rem', textAlign: 'center', borderRadius: '12px' }}>
          <h3 style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', textTransform: 'uppercase', marginBottom: '0.5rem', letterSpacing: '1px' }}>Out of Stock</h3>
          <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: stats.outOfStock > 0 ? 'var(--danger)' : 'var(--success)' }}>{stats.outOfStock}</div>
        </div>
      </div>

      {/* Quick Actions */}
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '2.5rem', flexWrap: 'wrap' }}>
        {/* Blue - Add Product */}
        <Link 
          to="/admin/products" 
          className="btn btn-primary" 
          style={{ 
            padding: '10px 20px', 
            display: 'flex', 
            alignItems: 'center', 
            gap: '0.5rem',
            textDecoration: 'none'
          }}
        >
          📦 Add Product
        </Link>
        
        {/* Purple - Add Category */}
        <Link 
          to="/admin/categories" 
          className="btn" 
          style={{ 
            padding: '10px 20px', 
            background: 'rgba(168, 85, 247, 0.15)', 
            color: '#a855f7', 
            border: '1px solid rgba(168, 85, 247, 0.3)', 
            display: 'flex', 
            alignItems: 'center', 
            gap: '0.5rem',
            textDecoration: 'none',
            borderRadius: '8px'
          }}
        >
          🏷️ Add Category
        </Link>
        
        {/* Gray - Site Settings */}
        <Link 
          to="/admin/site-settings" 
          className="btn" 
          style={{ 
            padding: '10px 20px', 
            background: 'rgba(148, 163, 184, 0.15)', 
            color: '#94a3b8', 
            border: '1px solid rgba(148, 163, 184, 0.3)', 
            display: 'flex', 
            alignItems: 'center', 
            gap: '0.5rem',
            textDecoration: 'none',
            borderRadius: '8px'
          }}
        >
          ⚙️ Site Settings
        </Link>
        
        {/* Pink - Manage Homepage */}
        <Link 
          to="/admin/homepage" 
          className="btn" 
          style={{ 
            padding: '10px 20px', 
            background: 'rgba(236, 72, 153, 0.15)', 
            color: 'var(--accent-color)', 
            border: '1px solid rgba(236, 72, 153, 0.3)', 
            display: 'flex', 
            alignItems: 'center', 
            gap: '0.5rem',
            textDecoration: 'none',
            borderRadius: '8px'
          }}
        >
          🏠 Manage Homepage
        </Link>
      </div>

      {/* Recent Products */}
      <div className="glass-card" style={{ padding: '2rem', borderRadius: '12px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h3 style={{ margin: 0 }}>Recently Added Products</h3>
          <Link to="/admin/products" className="btn btn-primary" style={{ padding: '0.5rem 1rem' }}>View All</Link>
        </div>
        
        {stats.recentProducts.length === 0 ? (
          <p style={{ color: 'var(--text-secondary)' }}>No products found. Start by adding your first product.</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {stats.recentProducts.map(prod => {
              const imgUrl = prod.image?.startsWith('http') ? prod.image : `http://localhost:5000${prod.image}`;
              return (
                <div key={prod._id} style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem', background: 'rgba(0,0,0,0.2)', borderRadius: '8px' }}>
                  <img src={imgUrl} alt={prod.name} style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '8px' }}
                    onError={(e) => { e.target.onerror = null; e.target.src = 'https://via.placeholder.com/60x60?text=N/A'; }}
                  />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600 }}>{prod.name}</div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                      {prod.category?.name || 'Uncategorized'} · {prod.brand} · {prod.price > 0 ? `$${prod.price}` : 'Call for Price'}
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem', flexShrink: 0 }}>
                    {prod.featured && (
                      <span style={{ padding: '2px 8px', background: 'rgba(236, 72, 153, 0.2)', color: 'var(--accent-color)', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 600 }}>Featured</span>
                    )}
                    {prod.stock === 0 && (
                      <span style={{ padding: '2px 8px', background: 'rgba(239, 68, 68, 0.2)', color: 'var(--danger)', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 600 }}>No Stock</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}