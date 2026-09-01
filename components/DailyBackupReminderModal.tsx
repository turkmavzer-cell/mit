import React from 'react';
import { BellIcon, XIcon, DownloadIcon } from './Icons';

interface DailyBackupReminderModalProps {
    isOpen: boolean;
    onClose: () => void;
    onBackupNow: () => void;
}

const DailyBackupReminderModal: React.FC<DailyBackupReminderModalProps> = ({
    isOpen,
    onClose,
    onBackupNow
}) => {
    if (!isOpen) return null;

    return (
        <div 
            className="fixed inset-0 bg-black/80 backdrop-blur-md flex justify-center items-center z-50 p-4"
            onClick={onClose}
        >
            <div 
                className="bg-gray-800 rounded-2xl shadow-2xl border border-amber-500/40 w-full max-w-sm p-5 space-y-4 text-gray-200 animate-in fade-in zoom-in duration-200"
                onClick={e => e.stopPropagation()}
            >
                <div className="flex justify-between items-start">
                    <div className="flex items-center gap-3">
                        <div className="p-2.5 bg-amber-500/20 text-amber-400 rounded-xl border border-amber-500/30">
                            <BellIcon className="h-7 w-7" />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-amber-400">Günlük Yedekleme Uyarısı</h3>
                            <p className="text-[11px] text-gray-400">Sabah 06:00 sonrası ilk açılış</p>
                        </div>
                    </div>
                    <button 
                        type="button" 
                        onClick={onClose} 
                        className="text-gray-400 hover:text-gray-200 p-1 rounded-lg"
                    >
                        <XIcon />
                    </button>
                </div>

                <div className="bg-amber-950/40 border border-amber-500/30 p-3.5 rounded-xl space-y-2 text-xs text-amber-100/90 leading-relaxed">
                    <p className="font-semibold text-amber-300 text-sm">⚠️ Verilerinizi Güvende Tutun!</p>
                    <p>
                        Güne başlarken müşteri, iş ve muhasebe kayıtlarınızın kaybolmaması için bugünün yedeğini Google Drive'a veya telefonunuza kaydetmeniz önerilir.
                    </p>
                </div>

                <div className="space-y-2.5 pt-1">
                    <button
                        type="button"
                        onClick={() => {
                            onClose();
                            onBackupNow();
                        }}
                        className="w-full bg-teal-600 hover:bg-teal-500 text-white font-bold p-3 rounded-xl flex items-center justify-center gap-2 shadow-lg transition-all border border-teal-400/30 text-sm"
                    >
                        <DownloadIcon className="h-5 w-5" /> Şimdi Yedeği Al / Paylaş
                    </button>

                    <button
                        type="button"
                        onClick={onClose}
                        className="w-full bg-gray-700 hover:bg-gray-600 text-gray-300 font-semibold p-2.5 rounded-xl text-xs transition-colors"
                    >
                        Daha Sonra Hatırlat (Bugünü Geç)
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DailyBackupReminderModal;
