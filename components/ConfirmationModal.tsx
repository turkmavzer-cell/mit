import React from 'react';
import { TrashIcon } from './Icons';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  children?: React.ReactNode;
  confirmButtonText?: string;
  confirmButtonClass?: string;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title = "Silmeyi Onayla", 
  children = "Bu kaydı silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.",
  confirmButtonText = "Evet, Sil",
  confirmButtonClass = "bg-red-600 hover:bg-red-500",
}) => {
  if (!isOpen) {
    return null;
  }

  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  const handleWrapperClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black/80 backdrop-blur-xs flex justify-center items-center z-50 p-4"
      onClick={handleWrapperClick}
    >
      <div 
        className="bg-gray-900 rounded-2xl shadow-2xl p-6 w-full max-w-sm border border-gray-700 text-gray-100 space-y-4 animate-in fade-in zoom-in duration-150"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-red-950/80 border border-red-800/60 rounded-xl text-red-400 shrink-0">
            <TrashIcon className="h-6 w-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-100">{title}</h2>
            <p className="text-xs text-gray-400">Onayınız gerekiyor</p>
          </div>
        </div>

        <div className="text-sm text-gray-300 bg-gray-950/60 p-3.5 rounded-xl border border-gray-800 leading-relaxed">
          {children}
        </div>

        <div className="flex justify-end gap-2.5 pt-2">
          <button 
            type="button"
            onClick={onClose} 
            className="px-4 py-2.5 bg-gray-850 hover:bg-gray-800 text-gray-300 hover:text-white font-semibold rounded-xl text-xs transition-colors border border-gray-700 cursor-pointer"
          >
            Vazgeç
          </button>
          <button 
            type="button"
            onClick={handleConfirm}
            className={`px-4 py-2.5 text-white font-bold rounded-xl text-xs transition-all shadow-md cursor-pointer ${confirmButtonClass}`}
          >
            {confirmButtonText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
