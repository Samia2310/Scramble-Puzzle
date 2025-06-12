import React, { useEffect } from 'react';
import './ImageSelectionModal.css';

const ImageSelectionModal = ({ images, onClose, onSelectImage }) => {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const formatImageName = (imagePath) => {
    const filename = imagePath.split('/').pop();
    const nameWithoutExtension = filename.split('.')[0];
    const withSpaces = nameWithoutExtension.replace(/_/g, ' ');
    return withSpaces
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' '); 
  };

  return (
    <div
      className="image-selection-modal-overlay"
      onClick={onClose}
      aria-modal="true"
      role="dialog"
      tabIndex={-1}
    >
      <div
        className="image-selection-modal-content"
        onClick={(e) => e.stopPropagation()} 
      >
        <button className="close-button" onClick={onClose} aria-label="Close Modal">
          &times;
        </button>
        <h2>Choose Your Puzzle Image</h2>
        <div className="image-grid">
          {images.map((imagePath, index) => (
            <button
              key={index}
              className="image-grid-item"
              onClick={() => onSelectImage(index)}
              aria-label={`Select Image: ${formatImageName(imagePath)}`}
            >
              <img
                src={imagePath}
                alt={`Puzzle option: ${formatImageName(imagePath)}`}
              />
              <p>{formatImageName(imagePath)}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ImageSelectionModal;