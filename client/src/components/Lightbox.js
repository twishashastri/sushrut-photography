import React, { useEffect } from 'react';

function Lightbox({ photo, onClose, onNext, onPrev, hasNext, hasPrev }) {
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') onClose();
    };
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowRight' && hasNext) onNext();
      if (e.key === 'ArrowLeft' && hasPrev) onPrev();
    };
    
    window.addEventListener('keydown', handleEsc);
    window.addEventListener('keydown', handleKeyDown);
    
    return () => {
      window.removeEventListener('keydown', handleEsc);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose, onNext, onPrev, hasNext, hasPrev]);

  return (
    <div className="lightbox-overlay" onClick={onClose}>
      <div className="lightbox-container" onClick={(e) => e.stopPropagation()}>
        <button className="lightbox-close" onClick={onClose}>×</button>
        
        {hasPrev && (
          <button className="lightbox-prev" onClick={onPrev}>‹</button>
        )}
        
        <img 
          src={photo.url} 
          alt="" 
          className="lightbox-image" 
        />
        
        {hasNext && (
          <button className="lightbox-next" onClick={onNext}>›</button>
        )}
      </div>
    </div>
  );
}

export default Lightbox;