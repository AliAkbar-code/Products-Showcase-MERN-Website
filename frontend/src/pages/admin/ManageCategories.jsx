import React, { useState, useEffect, useRef } from 'react';
import api from '../../utils/api';
import Alert from '../../components/Alert';

export default function ManageCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Form State
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [editingId, setEditingId] = useState(null);

  const fileInputRef = useRef(null);

  const fetchCategories = async () => {
    try {
      const { data } = await api.get('/categories');
      setCategories(data.data);
    } catch (err) {
      setError('Failed to load categories');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      const allowed = ['image/jpeg', 'image/png', 'image/webp'];
      if (!allowed.includes(file.type)) {
        setError('Only JPG, PNG or WEBP images are allowed.');
        return;
      }
      // Validate file size (2MB)
      if (file.size > 2 * 1024 * 1024) {
        setError('Image file must be less than 2MB.');
        return;
      }
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (name.trim().length < 2) {
      setError('Category name must be at least 2 characters');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('description', description);
      if (imageFile) {
        formData.append('image', imageFile);
      }

      const config = {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      };

      if (editingId) {
        await api.put(`/categories/${editingId}`, formData, config);
        setSuccess('Category updated successfully');
      } else {
        await api.post('/categories', formData, config);
        setSuccess('Category created successfully');
      }
      
      resetForm();
      setError(null);
      fetchCategories();
    } catch (err) {
      setError(err.response?.data?.message || 'Operation failed');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this category?')) return;
    
    try {
      await api.delete(`/categories/${id}`);
      setSuccess('Category deleted successfully');
      fetchCategories();
    } catch (err) {
      setError(err.response?.data?.message || 'Deletion failed');
    }
  };

  const startEdit = (cat) => {
    setName(cat.name);
    setDescription(cat.description || '');
    setEditingId(cat._id);
    setImageFile(null);
    setImagePreview(cat.image || null);
    if (fileInputRef.current) fileInputRef.current.value = "";
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const resetForm = () => {
    setName('');
    setDescription('');
    setEditingId(null);
    setImageFile(null);
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const cancelEdit = () => {
    resetForm();
  };

  return (
    <div className="animate-fade-in">
      <h2 style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        Manage Categories
      </h2>

      <Alert type="error" message={error} onClose={() => setError(null)} />
      <Alert type="success" message={success} onClose={() => setSuccess(null)} />

      {/* Form */}
      <div style={{ background: 'var(--bg-light)', border: '1px solid var(--border-color)', padding: '1.5rem', borderRadius: '12px', marginBottom: '2rem' }}>
        <h4 style={{ marginBottom: '1rem', color: 'var(--text-primary)' }}>{editingId ? 'Edit Category' : 'Add New Category'}</h4>
        <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '1.25rem', gridTemplateColumns: '1fr 1fr' }}>
          
          {/* Category Name */}
          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label">Category Name *</label>
            <input 
              type="text" 
              className="form-input" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="E.g., Printers, Photocopiers"
              maxLength={50}
            />
          </div>

          {/* Image Upload */}
          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label">Category Image</label>
            <input 
              type="file" 
              className="form-input" 
              accept=".jpg,.jpeg,.png,.webp"
              ref={fileInputRef}
              onChange={handleImageChange}
              style={{ padding: '10px 16px' }}
            />
            {editingId && !imageFile && <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '4px', display: 'block' }}>Leave empty to keep current image</span>}
          </div>

          {/* Description */}
          <div className="form-group" style={{ margin: 0, gridColumn: 'span 2' }}>
            <label className="form-label">Description</label>
            <textarea 
              className="form-input" 
              rows="3"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief description of this category..."
              maxLength={500}
              style={{ resize: 'vertical' }}
            ></textarea>
          </div>

          {/* Image Preview */}
          {imagePreview && (
            <div style={{ gridColumn: 'span 2' }}>
              <label className="form-label" style={{ marginBottom: '8px' }}>Image Preview</label>
              <div style={{ 
                position: 'relative', 
                width: '160px', 
                height: '120px', 
                borderRadius: '10px', 
                overflow: 'hidden', 
                border: '2px solid var(--border-color)',
                background: 'var(--bg-white)'
              }}>
                <img 
                  src={imagePreview} 
                  alt="Preview" 
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                />
                <button 
                  type="button"
                  onClick={() => {
                    setImageFile(null);
                    setImagePreview(null);
                    if (fileInputRef.current) fileInputRef.current.value = "";
                  }}
                  style={{
                    position: 'absolute',
                    top: '4px',
                    right: '4px',
                    width: '24px',
                    height: '24px',
                    borderRadius: '50%',
                    background: 'rgba(239, 68, 68, 0.9)',
                    color: 'white',
                    fontSize: '14px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    lineHeight: 1
                  }}
                >
                  ✕
                </button>
              </div>
            </div>
          )}

          {/* Buttons */}
          <div style={{ gridColumn: 'span 2', display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
            <button type="submit" className="btn btn-primary" style={{ height: '48px', minWidth: '140px' }}>
              {editingId ? 'Update Category' : 'Create Category'}
            </button>
            {editingId && (
              <button type="button" onClick={cancelEdit} className="btn" style={{ height: '48px', background: 'var(--bg-white)', border: '1px solid var(--border-color)', color: 'var(--text-secondary)' }}>
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Category Cards */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-secondary)' }}>Loading...</div>
      ) : (
        <div>
          <h4 style={{ marginBottom: '1rem', color: 'var(--text-primary)' }}>
            All Categories ({categories.length})
          </h4>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1rem' }}>
            {categories.map(cat => (
              <div 
                key={cat._id} 
                className="glass-card" 
                style={{ 
                  padding: '0', 
                  overflow: 'hidden',
                  display: 'flex',
                  flexDirection: 'column'
                }}
              >
                {/* Category Image */}
                <div style={{ 
                  width: '100%', 
                  height: '160px', 
                  background: cat.image 
                    ? `url(${cat.image.startsWith('http') ? cat.image : `http://localhost:5000${cat.image}`}) center/cover no-repeat` 
                    : 'linear-gradient(135deg, var(--primary-bg), var(--bg-light))',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'relative'
                }}>
                  {!cat.image && (
                    <div style={{ 
                      fontSize: '3rem', 
                      opacity: 0.3, 
                      color: 'var(--primary-color)'
                    }}>
                      📁
                    </div>
                  )}
                </div>

                {/* Category Info */}
                <div style={{ padding: '1rem 1.25rem' }}>
                  <h3 style={{ 
                    fontSize: '1.15rem', 
                    fontWeight: 600, 
                    marginBottom: '0.5rem',
                    color: 'var(--text-primary)'
                  }}>
                    {cat.name}
                  </h3>
                  
                  {cat.description && (
                    <p style={{ 
                      fontSize: '0.9rem', 
                      color: 'var(--text-secondary)', 
                      marginBottom: '0.75rem',
                      lineHeight: '1.5',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden'
                    }}>
                      {cat.description}
                    </p>
                  )}

                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    paddingTop: '0.75rem',
                    borderTop: '1px solid var(--border-light)'
                  }}>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      {new Date(cat.createdAt).toLocaleDateString('en-US', { 
                        year: 'numeric', 
                        month: 'short', 
                        day: 'numeric' 
                      })}
                    </span>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button 
                        onClick={() => startEdit(cat)} 
                        className="btn" 
                        style={{ 
                          color: 'var(--warning)', 
                          padding: '6px 14px', 
                          background: 'rgba(245, 158, 11, 0.1)',
                          fontSize: '0.85rem',
                          borderRadius: '6px'
                        }}
                      >
                        Edit
                      </button>
                      <button 
                        onClick={() => handleDelete(cat._id)} 
                        className="btn btn-danger" 
                        style={{ 
                          padding: '6px 14px',
                          fontSize: '0.85rem',
                          borderRadius: '6px'
                        }}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            {categories.length === 0 && (
              <div style={{ 
                gridColumn: '1 / -1',
                textAlign: 'center', 
                padding: '3rem', 
                color: 'var(--text-secondary)',
                background: 'var(--bg-light)',
                borderRadius: '12px',
                border: '1px dashed var(--border-color)'
              }}>
                No categories found. Create your first category above.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
