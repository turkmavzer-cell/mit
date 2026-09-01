import React from 'react';
import type { Customer, Settings, Task } from '../types';
import { XIcon, DownloadIcon, ShareIcon } from './Icons';

interface BackupExportModalProps {
    isOpen: boolean;
    onClose: () => void;
    customers: Customer[];
    tasks?: Task[];
    settings?: Settings;
    onSuccess?: (msg: string) => void;
    onError?: (msg: string) => void;
}

export const exportAllData = async (
    data: { customers: Customer[]; tasks?: Task[]; settings?: Settings },
    mode: 'share' | 'download'
) => {
    const allData = {
        ...data,
        backupDetails: {
            version: '2.0.0',
            createdAt: new Date().toISOString(),
        }
    };

    const dataStr = JSON.stringify(allData, null, 2);
    const dateStr = new Date().toISOString().split('T')[0];
    const fileName = `is-takip-yedek-${dateStr}.json`;

    if (mode === 'share') {
        const file = new File([dataStr], fileName, { type: 'application/json' });
        if (navigator.canShare && navigator.canShare({ files: [file] })) {
            await navigator.share({
                title: 'İş Takip Veri Yedeği',
                text: `İş Takip Asistanı Veri Yedeği (${dateStr})`,
                files: [file]
            });
            return { success: true, message: 'Yedek dosyası paylaşım menüsüne aktarıldı.' };
        } else if (navigator.share) {
            await navigator.share({
                title: 'İş Takip Veri Yedeği',
                text: dataStr
            });
            return { success: true, message: 'Yedek metni paylaşım menüsüne aktarıldı.' };
        }
    }

    // Fallback or explicit 'download' mode
    const dataBlob = new Blob([dataStr], { type: "application/json" });
    const dataUrl = URL.createObjectURL(dataBlob);
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUrl);
    linkElement.setAttribute('download', fileName);
    document.body.appendChild(linkElement);
    linkElement.click();
    document.body.removeChild(linkElement);
    URL.revokeObjectURL(dataUrl);
    return { success: true, message: 'Yedek dosyası cihaza indirildi.' };
};

const BackupExportModal: React.FC<BackupExportModalProps> = ({
    isOpen,
    onClose,
    customers,
    tasks,
    settings,
    onSuccess,
    onError
}) => {
    if (!isOpen) return null;

    const dataObj = { customers, tasks, settings };

    const handleAction = async (mode: 'share' | 'download') => {
        try {
            const res = await exportAllData(dataObj, mode);
            if (onSuccess) onSuccess(res.message);
            onClose();
        } catch (err) {
            if ((err as Error).name !== 'AbortError') {
                console.error("Backup export error:", err);
                if (onError) onError('Yedekleme sırasında bir hata oluştu.');
            }
        }
    };

    return (
        <div 
            className="fixed inset-0 bg-black/75 backdrop-blur-sm flex justify-center items-center z-50 p-4"
            onClick={onClose}
        >
            <div 
                className="bg-gray-800 rounded-xl shadow-2xl border border-gray-700 w-full max-w-md p-5 space-y-4 text-gray-200"
                onClick={e => e.stopPropagation()}
            >
                <div className="flex justify-between items-center border-b border-gray-700 pb-3">
                    <h3 className="text-lg font-bold text-teal-400 flex items-center gap-2">
                        📥 Veri Yedekleme ve Paylaşım Options
                    </h3>
                    <button 
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-200 p-1"
                    >
                        <XIcon />
                    </button>
                </div>

                <p className="text-xs text-gray-300 leading-relaxed">
                    Uygulama verilerinizi Google Drive'a kaydetmek, WhatsApp ile göndermek veya telefon hafızasına indirmek için aşağıdaki yöntemlerden birini seçin:
                </p>

                <div className="space-y-3 pt-1">
                    <button
                        type="button"
                        onClick={() => handleAction('share')}
                        className="w-full bg-teal-600 hover:bg-teal-500 text-white font-semibold p-3.5 rounded-xl flex items-center justify-between gap-3 shadow-md transition-all border border-teal-500/30 text-left"
                    >
                        <div className="flex items-center gap-3">
                            <span className="p-2 bg-teal-700/60 rounded-lg text-white">
                                <ShareIcon className="h-6 w-6" />
                            </span>
                            <div>
                                <p className="text-sm font-bold">Google Drive / WhatsApp / Paylaş</p>
                                <p className="text-[11px] text-teal-100/80">Telefonun paylaşım menüsü açılır (Drive, WhatsApp, Mail vb.)</p>
                            </div>
                        </div>
                    </button>

                    <button
                        type="button"
                        onClick={() => handleAction('download')}
                        className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-semibold p-3.5 rounded-xl flex items-center justify-between gap-3 shadow-md transition-all border border-indigo-500/30 text-left"
                    >
                        <div className="flex items-center gap-3">
                            <span className="p-2 bg-indigo-700/60 rounded-lg text-white">
                                <DownloadIcon className="h-6 w-6" />
                            </span>
                            <div>
                                <p className="text-sm font-bold">Cihaz Hafızasına İndir (.json)</p>
                                <p className="text-[11px] text-indigo-100/80">Yedek dosyasını doğrudan telefon/bilgisayar indirilenlerine kaydeder</p>
                            </div>
                        </div>
                    </button>
                </div>

                <div className="bg-gray-900/70 p-3 rounded-lg border border-gray-700/60 text-[11px] text-gray-400 space-y-1">
                    <p className="font-semibold text-gray-300">💡 İpucu:</p>
                    <p>Google Drive'a kaydetmek için <strong>"Google Drive / WhatsApp / Paylaş"</strong> butonuna basıp çıkan listeden <strong>Drive'a Kaydet</strong> simgesini seçebilirsiniz.</p>
                </div>

                <div className="flex justify-end border-t border-gray-700 pt-3">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-gray-200 text-sm font-semibold rounded-lg transition-colors"
                    >
                        Vazgeç
                    </button>
                </div>
            </div>
        </div>
    );
};

export default BackupExportModal;
