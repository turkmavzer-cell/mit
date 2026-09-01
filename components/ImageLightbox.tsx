
import React from 'react';
import { XIcon } from './Icons';

interface ImageLightboxProps {
  src: string;
  onClose: () => void;
}

const ImageLightbox: React.FC<ImageLightboxProps> = ({ src, onClose }) => {
  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-80 flex justify-center items-center z-50 p-4"
      onClick={onClose}
    >
      <button
        onClick={(e) => {
          e.stopPropagation(); // Prevent closing when clicking the close button itself from triggering the parent's onClick
          onClose();
        }}
        className="absolute top-4 right-4 text-white z-50 p-2 bg-black/50 rounded-full hover:bg-black/75"
        aria-label="Kapat"
      >
        <XIcon />
      </button>
      <div className="relative w-full h-full flex items-center justify-center">
        <img
          src={src}
          alt="Büyütülmüş resim"
          className="max-w-full max-h-full object-contain cursor-pointer"
        />
      </div>
    </div>
  );
};

export default ImageLightbox;