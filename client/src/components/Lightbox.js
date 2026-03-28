import React, { useEffect } from 'react';

function Lightbox({ photo, onClose }) {
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  return (
    <div className="lightbox-overlay" onClick={onClose}>
      <div className="lightbox-container" onClick={(e) => e.stopPropagation()}>
        <button className="lightbox-close" onClick={onClose}>✕</button>
        <img src={photo.url} alt={photo.event} className="lightbox-image" />
        <div className="lightbox-info">
          <h3>{photo.event} Photography</h3>
          <p>{photo.photographer || 'Sushrut Shastri'}</p>
          <p>Edmonton, Alberta</p>
        </div>
      </div>
    </div>
  );
}

export default Lightbox;