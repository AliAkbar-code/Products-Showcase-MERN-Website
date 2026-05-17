import React, { useState, useEffect, useRef } from 'react';
import api from '../../utils/api';
import Alert from '../../components/Alert';

// Required fields for validation
const REQUIRED_FIELDS = ['name', 'description', 'category', 'brand', 'modelNumber', 'type', 'condition'];

export default function ManageProducts() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Track which fields have validation errors
  const [fieldErrors, setFieldErrors] = useState({});
  // Track if form has been submitted (to show errors)
  const [submitted, setSubmitted] = useState(false);

  // Form State
  const [id, setId] = useState(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('0');
  const [category, setCategory] = useState('');
  const [featured, setFeatured] = useState(false);
  const [imageFile, setImageFile] = useState(null);

  // Specific details
  const [brand, setBrand] = useState('');
  const [modelNumber, setModelNumber] = useState('');
  const [type, setType] = useState('');
  const [colorSupport, setColorSupport] = useState(false);
  const [printSpeed, setPrintSpeed] = useState('');
  const [paperSizeSupported, setPaperSizeSupported] = useState('');
  const [connectivity, setConnectivity] = useState('');
  const [condition, setCondition] = useState('');
  const [warranty, setWarranty] = useState('');
  const [duplexPrinting, setDuplexPrinting] = useState(false);
  const [adf, setAdf] = useState(false);
  const [trolley, setTrolley] = useState(false);
  const [extraTray, setExtraTray] = useState(false);
  const [monthlyDutyCycle, setMonthlyDutyCycle] = useState('0');
  const [stock, setStock] = useState('0');

  const fileInputRef = useRef(null);

  // ─── helpers ────────────────────────────────────────────────────────────────

  const getFieldValues = () => ({
    name,
    description,
    category,
    brand,
    modelNumber,
    type,
    condition,
  });

  /** Returns an object of { fieldName: true } for every required field that is empty */
  const computeFieldErrors = (imageRequired) => {
    const values = getFieldValues();
    const errors = {};
    REQUIRED_FIELDS.forEach((f) => {
      if (!values[f] || !String(values[f]).trim()) {
        errors[f] = true;
      }
    });
    if (imageRequired && !imageFile) {
      errors.image = true;
    }
    return errors;
  };

  /** Returns inline style for a field — red border when it has an error */
  const fieldStyle = (fieldName) => ({
    margin: 0,
    ...(submitted && fieldErrors[fieldName]
      ? { border: '1.5px solid rgba(239, 68, 68, 0.8)', borderRadius: '8px' }
      : {}),
  });

  // Clear a single field error as user fixes it
  const clearFieldError = (fieldName) => {
    if (fieldErrors[fieldName]) {
      setFieldErrors((prev) => {
        const next = { ...prev };
        delete next[fieldName];
        return next;
      });
    }
  };

  // ─── data fetching ───────────────────────────────────────────────────────────

  const fetchData = async () => {
    try {
      const [prodRes, catRes] = await Promise.all([
        api.get('/products'),
        api.get('/categories'),
      ]);
      setProducts(prodRes.data.data);
      setCategories(catRes.data.data);
    } catch (err) {
      setError('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // ─── form actions ────────────────────────────────────────────────────────────

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitted(true);

    // Validate
    const imageRequired = !id;
    const errors = computeFieldErrors(imageRequired);

    if (imageFile && imageFile.size > 2 * 1024 * 1024) {
      errors.image = true;
      setError('Image file must be less than 2MB.');
      setFieldErrors(errors);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    if (imageFile) {
      const allowed = ['image/jpeg', 'image/png', 'image/webp'];
      if (!allowed.includes(imageFile.type)) {
        errors.image = true;
        setError('Only JPG, PNG or WEBP images are allowed.');
        setFieldErrors(errors);
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      setError('Please fill in all required fields.');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    // All good — submit
    setFieldErrors({});
    try {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('description', description);
      formData.append('price', price || 0);
      formData.append('category', category);
      formData.append('brand', brand);
      formData.append('modelNumber', modelNumber);
      formData.append('type', type);
      formData.append('colorSupport', colorSupport);
      formData.append('condition', condition);

      if (printSpeed) formData.append('printSpeed', printSpeed);
      if (paperSizeSupported) formData.append('paperSizeSupported', paperSizeSupported);
      if (connectivity) formData.append('connectivity', connectivity);
      if (warranty) formData.append('warranty', warranty);

      formData.append('duplexPrinting', duplexPrinting);
      formData.append('adf', adf);
      formData.append('trolley', trolley);
      formData.append('extraTray', extraTray);
      formData.append('monthlyDutyCycle', monthlyDutyCycle || 0);
      formData.append('stock', stock || 0);
      formData.append('featured', featured);

      if (imageFile) {
        formData.append('image', imageFile);
      }

      const config = { headers: { 'Content-Type': 'multipart/form-data' } };

      if (id) {
        await api.put(`/products/${id}`, formData, config);
        setSuccess('Product updated successfully!');
      } else {
        await api.post('/products', formData, config);
        setSuccess('Product created successfully!');
      }

      resetForm();
      fetchData();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      setError(err.response?.data?.message || 'Operation failed. Please try again.');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleDelete = async (prodId) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    try {
      await api.delete(`/products/${prodId}`);
      setSuccess('Product deleted successfully!');
      fetchData();
    } catch (err) {
      setError(err.response?.data?.message || 'Deletion failed. Please try again.');
    }
  };

  const startEdit = (prod) => {
    setId(prod._id);
    setName(prod.name);
    setDescription(prod.description);
    setPrice(prod.price || '0');
    setCategory(prod.category?._id || '');
    setBrand(prod.brand || '');
    setModelNumber(prod.modelNumber || '');
    setType(prod.type || '');
    setColorSupport(prod.colorSupport || false);
    setPrintSpeed(prod.printSpeed || '');
    setDuplexPrinting(prod.duplexPrinting || false);
    setAdf(prod.adf || false);
    setTrolley(prod.trolley || false);
    setExtraTray(prod.extraTray || false);
    setMonthlyDutyCycle(prod.monthlyDutyCycle || '0');
    setStock(prod.stock || '0');

    const ps = Array.isArray(prod.paperSizeSupported)
      ? prod.paperSizeSupported.join(', ')
      : prod.paperSizeSupported || '';
    setPaperSizeSupported(ps);

    const conn = Array.isArray(prod.connectivity)
      ? prod.connectivity.join(', ')
      : prod.connectivity || '';
    setConnectivity(conn);

    setCondition(prod.condition || '');
    setWarranty(prod.warranty || '');
    setFeatured(prod.featured || false);
    setImageFile(null);
    setFieldErrors({});
    setSubmitted(false);

    if (fileInputRef.current) fileInputRef.current.value = '';
    document.getElementById('product-form-section').scrollIntoView({ behavior: 'smooth' });
  };

  const resetForm = () => {
    setId(null);
    setName('');
    setDescription('');
    setPrice('0');
    setCategory('');
    setBrand('');
    setModelNumber('');
    setType('');
    setColorSupport(false);
    setPrintSpeed('');
    setPaperSizeSupported('');
    setConnectivity('');
    setDuplexPrinting(false);
    setAdf(false);
    setTrolley(false);
    setExtraTray(false);
    setMonthlyDutyCycle('0');
    setStock('0');
    setCondition('');
    setWarranty('');
    setFeatured(false);
    setImageFile(null);
    setFieldErrors({});
    setSubmitted(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // ─── shared input style helper ───────────────────────────────────────────────

  const inputStyle = (fieldName) =>
    submitted && fieldErrors[fieldName]
      ? { border: '1.5px solid rgba(239, 68, 68, 0.8)' }
      : {};

  // ─── render ──────────────────────────────────────────────────────────────────

  return (
    <div className="animate-fade-in">
      <h2 style={{ marginBottom: '1.5rem' }}>Manage Products</h2>

      <Alert type="error" message={error} onClose={() => setError(null)} />
      <Alert type="success" message={success} onClose={() => setSuccess(null)} />

      {/* ── Form ────────────────────────────────────────────────────────────── */}
      <div
        id="product-form-section"
        style={{ background: 'rgba(0,0,0,0.2)', padding: '1.5rem', borderRadius: '12px', marginBottom: '3rem' }}
      >
        <h4 style={{ marginBottom: '1rem' }}>{id ? 'Edit Product' : 'Add New Product'}</h4>

        <form
          onSubmit={handleSubmit}
          style={{ display: 'grid', gap: '1.5rem', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)' }}
        >
          {/* Product Name */}
          <div className="form-group" style={{ margin: 0, gridColumn: 'span 2' }}>
            <label className="form-label">
              Product Name <span style={{ color: 'var(--danger)' }}>*</span>
            </label>
            <input
              type="text"
              className="form-input"
              value={name}
              maxLength={100}
              style={inputStyle('name')}
              onChange={(e) => {
                setName(e.target.value);
                clearFieldError('name');
              }}
            />
            {submitted && fieldErrors.name && (
              <span style={{ fontSize: '0.78rem', color: 'var(--danger)', marginTop: '4px', display: 'block' }}>
                Product name is required.
              </span>
            )}
          </div>

          {/* Description */}
          <div className="form-group" style={{ margin: 0, gridColumn: 'span 2' }}>
            <label className="form-label">
              Description <span style={{ color: 'var(--danger)' }}>*</span>
            </label>
            <textarea
              className="form-input"
              rows="4"
              value={description}
              maxLength={1000}
              style={inputStyle('description')}
              onChange={(e) => {
                setDescription(e.target.value);
                clearFieldError('description');
              }}
            />
            {submitted && fieldErrors.description && (
              <span style={{ fontSize: '0.78rem', color: 'var(--danger)', marginTop: '4px', display: 'block' }}>
                Description is required.
              </span>
            )}
          </div>

          {/* Price */}
          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label">Price</label>
            <input
              type="number"
              min="0"
              step="0.01"
              className="form-input"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />
          </div>

          {/* Category */}
          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label">
              Category <span style={{ color: 'var(--danger)' }}>*</span>
            </label>
            <select
              className="form-input"
              value={category}
              style={inputStyle('category')}
              onChange={(e) => {
                setCategory(e.target.value);
                clearFieldError('category');
              }}
            >
              <option value="">Select Category</option>
              {categories.map((cat) => (
                <option key={cat._id} value={cat._id}>
                  {cat.name}
                </option>
              ))}
            </select>
            {submitted && fieldErrors.category && (
              <span style={{ fontSize: '0.78rem', color: 'var(--danger)', marginTop: '4px', display: 'block' }}>
                Please select a category.
              </span>
            )}
          </div>

          {/* Brand */}
          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label">
              Brand <span style={{ color: 'var(--danger)' }}>*</span>
            </label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. Canon, HP"
              value={brand}
              style={inputStyle('brand')}
              onChange={(e) => {
                setBrand(e.target.value);
                clearFieldError('brand');
              }}
            />
            {submitted && fieldErrors.brand && (
              <span style={{ fontSize: '0.78rem', color: 'var(--danger)', marginTop: '4px', display: 'block' }}>
                Brand is required.
              </span>
            )}
          </div>

          {/* Model Number */}
          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label">
              Model Number <span style={{ color: 'var(--danger)' }}>*</span>
            </label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. C5550i"
              value={modelNumber}
              style={inputStyle('modelNumber')}
              onChange={(e) => {
                setModelNumber(e.target.value);
                clearFieldError('modelNumber');
              }}
            />
            {submitted && fieldErrors.modelNumber && (
              <span style={{ fontSize: '0.78rem', color: 'var(--danger)', marginTop: '4px', display: 'block' }}>
                Model number is required.
              </span>
            )}
          </div>

          {/* Type */}
          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label">
              Type <span style={{ color: 'var(--danger)' }}>*</span>
            </label>
            <select
              className="form-input"
              value={type}
              style={inputStyle('type')}
              onChange={(e) => {
                setType(e.target.value);
                clearFieldError('type');
              }}
            >
              <option value="">Select Option</option>
              <option value="Copier">Copier</option>
              <option value="Mfp">Mfp</option>
              <option value="printer">Printer</option>
              <option value="IT equipment">IT Equipment</option>
            </select>
            {submitted && fieldErrors.type && (
              <span style={{ fontSize: '0.78rem', color: 'var(--danger)', marginTop: '4px', display: 'block' }}>
                Please select a type.
              </span>
            )}
          </div>

          {/* Condition */}
          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label">
              Condition <span style={{ color: 'var(--danger)' }}>*</span>
            </label>
            <select
              className="form-input"
              value={condition}
              style={inputStyle('condition')}
              onChange={(e) => {
                setCondition(e.target.value);
                clearFieldError('condition');
              }}
            >
              <option value="">Select Option</option>
              <option value="New">New</option>
              <option value="Used">Used</option>
              <option value="Refurbished">Refurbished</option>
            </select>
            {submitted && fieldErrors.condition && (
              <span style={{ fontSize: '0.78rem', color: 'var(--danger)', marginTop: '4px', display: 'block' }}>
                Please select a condition.
              </span>
            )}
          </div>

          {/* Print Speed */}
          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label">Print Speed</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. 50 ppm"
              value={printSpeed}
              onChange={(e) => setPrintSpeed(e.target.value)}
            />
          </div>

          {/* Paper Size */}
          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label">Paper Size Supported</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. A3, A4, Letter"
              value={paperSizeSupported}
              onChange={(e) => setPaperSizeSupported(e.target.value)}
            />
          </div>

          {/* Connectivity */}
          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label">Connectivity</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. USB, WiFi, Ethernet"
              value={connectivity}
              onChange={(e) => setConnectivity(e.target.value)}
            />
          </div>

          {/* Monthly Duty Cycle */}
          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label">Monthly Duty Cycle</label>
            <input
              type="number"
              min="0"
              className="form-input"
              placeholder="e.g. 50000"
              value={monthlyDutyCycle}
              onChange={(e) => setMonthlyDutyCycle(e.target.value)}
            />
          </div>

          {/* Stock */}
          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label">Stock</label>
            <input
              type="number"
              min="0"
              className="form-input"
              value={stock}
              onChange={(e) => setStock(e.target.value)}
            />
          </div>

          {/* Warranty */}
          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label">Warranty</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. 1 Year"
              value={warranty}
              onChange={(e) => setWarranty(e.target.value)}
            />
          </div>

          {/* Checkboxes */}
          <div
            className="form-group"
            style={{
              margin: 0,
              gridColumn: 'span 2',
              display: 'flex',
              gap: '2rem',
              paddingTop: '1rem',
              flexWrap: 'wrap',
            }}
          >
            {[
              { id: 'colorSupportCheck', label: 'Color Support', value: colorSupport, setter: setColorSupport },
              { id: 'duplexCheck', label: 'Duplex', value: duplexPrinting, setter: setDuplexPrinting },
              { id: 'adfCheck', label: 'ADF', value: adf, setter: setAdf },
              { id: 'trolleyCheck', label: 'Trolley', value: trolley, setter: setTrolley },
              { id: 'extraTrayCheck', label: 'Extra Tray', value: extraTray, setter: setExtraTray },
              { id: 'featuredCheck', label: 'Mark as Featured', value: featured, setter: setFeatured },
            ].map(({ id: cbId, label, value, setter }) => (
              <div key={cbId} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <input
                  type="checkbox"
                  id={cbId}
                  checked={value}
                  onChange={(e) => setter(e.target.checked)}
                  style={{ width: '20px', height: '20px' }}
                />
                <label htmlFor={cbId} style={{ userSelect: 'none', cursor: 'pointer' }}>
                  {label}
                </label>
              </div>
            ))}
          </div>

          {/* Image */}
          <div className="form-group" style={{ margin: 0, gridColumn: 'span 2' }}>
            <label className="form-label">
              Image {!id && <span style={{ color: 'var(--danger)' }}>*</span>}
            </label>
            <input
              type="file"
              className="form-input"
              accept=".jpg,.jpeg,.png,.webp"
              ref={fileInputRef}
              style={inputStyle('image')}
              onChange={(e) => {
                setImageFile(e.target.files[0] || null);
                clearFieldError('image');
              }}
            />
            {id && !imageFile && (
              <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '4px', display: 'block' }}>
                Leave empty to keep current image.
              </span>
            )}
            {submitted && fieldErrors.image && (
              <span style={{ fontSize: '0.78rem', color: 'var(--danger)', marginTop: '4px', display: 'block' }}>
                An image is required.
              </span>
            )}
          </div>

          {/* Submit */}
          <div style={{ gridColumn: 'span 2', display: 'flex', gap: '1rem', marginTop: '1rem' }}>
            <button type="submit" className="btn btn-primary" style={{ padding: '12px 24px' }}>
              {id ? 'Update Product' : 'Create Product'}
            </button>
            {id && (
              <button
                type="button"
                onClick={resetForm}
                className="btn"
                style={{ background: 'rgba(255,255,255,0.1)' }}
              >
                Cancel Edit
              </button>
            )}
          </div>
        </form>
      </div>

      {/* ── Product List ─────────────────────────────────────────────────────── */}
      <div>
        <h4 style={{ marginBottom: '1rem' }}>Existing Products</h4>
        {loading ? (
          <div>Loading...</div>
        ) : (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
              gap: '1rem',
            }}
          >
            {products.map((prod) => {
              const imgUrl = prod.image.startsWith('http')
                ? prod.image
                : `http://localhost:5000${prod.image}`;
              return (
                <div
                  key={prod._id}
                  className="glass-card"
                  style={{ padding: '1rem', display: 'flex', gap: '1rem', alignItems: 'center' }}
                >
                  <img
                    src={imgUrl}
                    alt={prod.name}
                    style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '8px' }}
                  />
                  <div style={{ flex: 1, overflow: 'hidden' }}>
                    <div
                      style={{
                        fontSize: '1.1rem',
                        fontWeight: 600,
                        whiteSpace: 'nowrap',
                        textOverflow: 'ellipsis',
                        overflow: 'hidden',
                      }}
                    >
                      {prod.name}
                    </div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                      {prod.category?.name || 'Uncategorized'}
                    </div>
                    <div style={{ marginTop: '0.5rem' }}>
                      <button
                        onClick={() => startEdit(prod)}
                        className="btn"
                        style={{
                          fontSize: '0.8rem',
                          padding: '4px 8px',
                          background: 'rgba(245, 158, 11, 0.1)',
                          color: 'var(--warning)',
                          marginRight: '5px',
                        }}
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(prod._id)}
                        className="btn btn-danger"
                        style={{ fontSize: '0.8rem', padding: '4px 8px' }}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
            {products.length === 0 && (
              <div style={{ color: 'var(--text-secondary)' }}>No products found.</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}