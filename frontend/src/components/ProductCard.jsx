import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export default function ProductCard({ product }) {
  const [hovered, setHovered] = useState(false);
  const imgUrl = product.image.startsWith('http') ? product.image : `http://localhost:5000${product.image}`;

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: '#ffffff',
        borderRadius: '16px',
        overflow: 'hidden',
        border: `1px solid ${hovered ? '#2563eb' : '#e5e7eb'}`,
        transition: 'all 0.3s ease',
        boxShadow: hovered
          ? '0 20px 40px -12px rgba(37,99,235,0.12)'
          : '0 1px 3px rgba(0,0,0,0.04)',
        transform: hovered ? 'translateY(-6px)' : 'translateY(0)',
        height: '100%',
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      <Link
        to={`/product/${product._id}`}
        style={{ textDecoration: 'none', display: 'flex', flexDirection: 'column', height: '100%' }}
      >
        {/* Image */}
        <div style={{
          position: 'relative',
          height: '200px',
          overflow: 'hidden',
          backgroundColor: '#f9fafb'
        }}>
          <img
            src={imgUrl}
            alt={product.name}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              transition: 'transform 0.4s ease',
              transform: hovered ? 'scale(1.08)' : 'scale(1)'
            }}
            onError={(e) => { e.target.onerror = null; e.target.src = 'https://via.placeholder.com/300x200?text=No+Image'; }}
          />
          {/* Category badge */}
          {product.category?.name && (
            <div style={{
              position: 'absolute',
              top: '10px',
              right: '10px',
              background: 'rgba(255,255,255,0.95)',
              color: '#2563eb',
              padding: '4px 10px',
              borderRadius: '20px',
              fontSize: '0.7rem',
              fontWeight: 700,
              letterSpacing: '0.5px',
              backdropFilter: 'blur(8px)',
              textTransform: 'uppercase'
            }}>
              {product.category.name}
            </div>
          )}
          {product.featured && (
            <div style={{
              position: 'absolute',
              top: '10px',
              left: '10px',
              background: '#2563eb',
              color: 'white',
              padding: '4px 10px',
              borderRadius: '20px',
              fontSize: '0.7rem',
              fontWeight: 700,
              letterSpacing: '0.5px'
            }}>
              ★ FEATURED
            </div>
          )}
        </div>

        {/* Content */}
        <div style={{
          padding: '1.25rem 1.5rem',
          flex: 1,
          display: 'flex',
          flexDirection: 'column'
        }}>
          <h3 style={{
            fontSize: '1.15rem',
            fontWeight: 700,
            color: '#1f2937',
            marginBottom: '0.5rem',
            lineHeight: 1.3
          }}>
            {product.name}
          </h3>

          <p style={{
            color: '#6b7280',
            fontSize: '0.9rem',
            marginBottom: '1rem',
            flex: 1,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            lineHeight: 1.5
          }}>
            {product.description}
          </p>

          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderTop: '1px solid #f3f4f6',
            paddingTop: '1rem',
            marginTop: 'auto'
          }}>
            {product.price > 0 ? (
              <span style={{
                fontSize: '1.2rem',
                fontWeight: 700,
                color: '#2563eb'
              }}>
                ${product.price.toFixed(2)}
              </span>
            ) : (
              <span style={{
                fontSize: '0.95rem',
                fontWeight: 600,
                color: '#6b7280'
              }}>
                Call for Price
              </span>
            )}

            <span style={{
              color: '#2563eb',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              fontSize: '0.85rem',
              fontWeight: 600,
              transition: 'gap 0.2s ease',
              ...(hovered && { gap: '8px' })
            }}>
              View Details
              <ArrowRight size={14} />
            </span>
          </div>
        </div>
      </Link>
    </div>
  );
}
