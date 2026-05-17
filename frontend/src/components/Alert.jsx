import React, { useEffect, useState } from 'react';

export default function Alert({ type = 'error', message, duration = 3000, onClose }) {
  const [visible, setVisible] = useState(false);

  // Reset visibility every time a new message comes in
  useEffect(() => {
    if (!message) return;
    setVisible(true);

    if (duration > 0) {
      const timer = setTimeout(() => {
        setVisible(false);
        if (onClose) onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [message, duration]);

  if (!visible || !message) return null;

  const bg = type === 'error' ? 'rgba(239, 68, 68, 0.2)' : 'rgba(16, 185, 129, 0.2)';
  const border = type === 'error' ? 'rgba(239, 68, 68, 0.5)' : 'rgba(16, 185, 129, 0.5)';
  const color = type === 'error' ? 'var(--danger)' : 'var(--success)';

  return (
    <div className="animate-fade-in" style={{
      padding: '12px 16px',
      background: bg,
      border: `1px solid ${border}`,
      borderRadius: '8px',
      color: color,
      marginBottom: '1rem',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    }}>
      <span>{message}</span>
      <button
        onClick={() => { setVisible(false); if (onClose) onClose(); }}
        style={{ color: 'inherit', fontSize: '1.2rem', padding: '0 8px', background: 'none', border: 'none', cursor: 'pointer' }}
      >
        &times;
      </button>
    </div>
  );
}