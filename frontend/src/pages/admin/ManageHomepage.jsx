import React, { useState, useEffect } from 'react';
import api from '../../utils/api';
import Alert from '../../components/Alert';

export default function ManageHomepage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [toggling, setToggling] = useState(null); // track which product is being toggled

  const fetchProducts = async () => {
    try {
      const { data } = await api.get('/products');
      setProducts(data.data);
    } catch (err) {
      setError('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const toggleFeatured = async (productId, currentFeatured) => {
    setToggling(productId);
    try {
      const formData = new FormData();
      formData.append('featured', !currentFeatured);

      await api.put(`/products/${productId}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      setProducts(prev =>
        prev.map(p =>
          p._id === productId ? { ...p, featured: !currentFeatured } : p
        )
      );
      setSuccess(`Product ${!currentFeatured ? 'featured' : 'unfeatured'} successfully`);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update featured status');
    } finally {
      setToggling(null);
    }
  };

  const featuredCount = products.filter(p => p.featured).length;

  if (loading) {
    return <div className="animate-fade-in"><p>Loading products...</p></div>;
  }

  return (
    <div className="animate-fade-in">
      <h2 style={{ marginBottom: '0.5rem' }}>Homepage Manager</h2>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
        Toggle which products appear in the Featured section on the homepage.
      </p>

      <Alert type="error" message={error} onClose={() => setError(null)} />
      <Alert type="success" message={success} onClose={() => setSuccess(null)} />

      {/* Stats */}
      <div style={{
        display: 'flex', gap: '1rem', marginBottom: '2rem', flexWrap: 'wrap'
      }}>
        <div className="glass-card" style={{ padding: '1rem 1.5rem', borderRadius: '10px', textAlign: 'center', flex: '1 1 150px' }}>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '1px' }}>Total Products</div>
          <div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--primary-color)' }}>{products.length}</div>
        </div>
        <div className="glass-card" style={{ padding: '1rem 1.5rem', borderRadius: '10px', textAlign: 'center', flex: '1 1 150px' }}>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '1px' }}>Featured</div>
          <div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--accent-color)' }}>{featuredCount}</div>
        </div>
      </div>

      {/* Product List */}
      {products.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)' }}>
          No products available. Create some products first.
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {products.map(prod => {
            const imgUrl = prod.image?.startsWith('http') ? prod.image : `http://localhost:5000${prod.image}`;
            const isToggling = toggling === prod._id;

            return (
              <div
                key={prod._id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem',
                  padding: '1rem',
                  background: prod.featured ? 'rgba(236, 72, 153, 0.08)' : 'rgba(0,0,0,0.2)',
                  borderRadius: '10px',
                  border: prod.featured ? '1px solid rgba(236, 72, 153, 0.3)' : '1px solid transparent',
                  transition: 'var(--transition)'
                }}
              >
                <img
                  src={imgUrl}
                  alt={prod.name}
                  style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '8px', flexShrink: 0 }}
                  onError={(e) => { e.target.onerror = null; e.target.src = 'https://via.placeholder.com/50x50?text=N/A'; }}
                />
                <div style={{ flex: 1, overflow: 'hidden' }}>
                  <div style={{ fontWeight: 600, whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>{prod.name}</div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                    {prod.category?.name || 'Uncategorized'} · {prod.brand} · {prod.modelNumber}
                  </div>
                </div>

                {/* Featured Toggle */}
                <div
                  onClick={() => !isToggling && toggleFeatured(prod._id, prod.featured)}
                  style={{
                    width: '52px',
                    height: '28px',
                    borderRadius: '14px',
                    background: prod.featured ? 'linear-gradient(135deg, var(--primary-color), var(--accent-color))' : 'rgba(255,255,255,0.15)',
                    cursor: isToggling ? 'wait' : 'pointer',
                    position: 'relative',
                    transition: 'background 0.3s ease',
                    flexShrink: 0,
                    opacity: isToggling ? 0.5 : 1
                  }}
                >
                  <div style={{
                    width: '22px',
                    height: '22px',
                    borderRadius: '50%',
                    background: '#fff',
                    position: 'absolute',
                    top: '3px',
                    left: prod.featured ? '27px' : '3px',
                    transition: 'left 0.3s ease',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.3)'
                  }} />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
