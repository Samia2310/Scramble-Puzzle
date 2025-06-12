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

  // Helper function to format the image name for display
  const formatImageName = (imagePath) => {
    // 1. Get the filename from the full path (e.g., "/images/lego_city.jpg" -> "lego_city.jpg")
    const filename = imagePath.split('/').pop();

    // 2. Remove the file extension (e.g., "lego_city.jpg" -> "lego_city")
    const nameWithoutExtension = filename.split('.')[0];

    // 3. Replace underscores with spaces (e.g., "lego_city" -> "lego city")
    const withSpaces = nameWithoutExtension.replace(/_/g, ' ');

    // 4. Capitalize the first letter of each word (e.g., "lego city" -> "Lego City")
    return withSpaces
      .split(' ') // Split the string into an array of words
      .map(word => word.charAt(0).toUpperCase() + word.slice(1)) // Capitalize first letter of each word
      .join(' '); // Join the words back into a single string
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
        onClick={(e) => e.stopPropagation()} // Prevent clicks inside content from closing modal
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
              // Update aria-label for accessibility to use the formatted name
              aria-label={`Select Image: ${formatImageName(imagePath)}`}
            >
              <img
                src={imagePath}
                // Update alt text for accessibility to use the formatted name
                alt={`Puzzle option: ${formatImageName(imagePath)}`}
              />
              {/* Display the formatted name here */}
              <p>{formatImageName(imagePath)}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ImageSelectionModal;