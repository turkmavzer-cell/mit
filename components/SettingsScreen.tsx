import React, { useRef, useState } from 'react';
import type { Settings, Customer, Task } from '../types';
import Toast from './Toast';
import { DownloadIcon, DatabaseIcon, UploadIcon, CheckCircleIcon } from './Icons';
import BackupExportModal from './BackupExportModal';

interface SettingsScreenProps {
    settings: Settings;
    setSettings: React.Dispatch<React.SetStateAction<Settings>>;
    customers: Customer[];
    setCustomers: React.Dispatch<React.SetStateAction<Customer[]>>;
    tasks: Task[];
    setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
}

const SettingsScreen: React.FC<SettingsScreenProps> = ({ 
    settings, setSettings, 
    customers, setCustomers,
    tasks, setTasks
}) => {
    const [toastInfo, setToastInfo] = useState<{ message: string, type: 'success' | 'error' } | null>(null);
    const [isBackupExportModalOpen, setIsBackupExportModalOpen] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileRestore = (e: React.ChangeEvent<HTMLInputElement>) => {
        const fileReader = new FileReader();
        if (e.target.files && e.target.files[0]) {
            fileReader.readAsText(e.target.files[0], "UTF-8");
            fileReader.onload = (event) => {
                try {
                    const parsedData = JSON.parse(event.target?.result as string);
                    if (parsedData.customers) {
                        setCustomers(parsedData.customers);
                        if (parsedData.settings) {
                            setSettings(parsedData.settings);
                        }
                        if (parsedData.tasks) {
                            setTasks(parsedData.tasks);
                        }
                        setToastInfo({ message: "Veriler başarıyla geri yüklendi!", type: 'success' });
                    } else {
                        throw new Error("Geçersiz yedek dosyası formatı.");
                    }
                } catch (error) {
                    console.error("Restore failed:", error);
                    setToastInfo({ message: "Geri yükleme başarısız oldu. Dosya bozuk veya geçersiz formatta.", type: 'error' });
                }
            };
        }
    };

    return (
        <div className="space-y-6">
            {toastInfo && <Toast message={toastInfo.message} type={toastInfo.type} show={!!toastInfo} onClose={() => setToastInfo(null)} />}
            
            {/* Header */}
            <div>
                <h2 className="text-2xl font-bold text-teal-400">Ayarlar</h2>
                <p className="text-xs text-gray-400 mt-1">Uygulama verilerinizi yönetin ve güvenli şekilde yedekleyin.</p>
            </div>
            
            {/* Veri Yönetimi & Yedekleme Panel */}
            <div className="p-5 sm:p-6 bg-gray-800/90 rounded-2xl shadow-xl border border-gray-700/80 space-y-5">
                <div className="flex items-center gap-3 border-b border-gray-700/80 pb-4">
                    <div className="p-3 bg-teal-950/80 border border-teal-600/50 rounded-xl text-teal-400">
                        <DatabaseIcon className="h-6 w-6" />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-gray-100">Veri Yönetimi & Yedekleme</h3>
                        <p className="text-xs text-gray-400">Müşteri, iş ve kumaş top kayıtlarınızı dışa aktarın veya geri yükleyin</p>
                    </div>
                </div>

                <div className="space-y-4 text-sm">
                    <p className="text-gray-300 leading-relaxed text-xs sm:text-sm bg-gray-900/60 p-4 rounded-xl border border-gray-700/60">
                        Cihazınızdaki tüm müşteri kayıtlarını, imalattaki ve teslim edilen işleri, kumaş top metrajlarını güvenle yedekleyebilir; Google Drive, WhatsApp veya e-posta ile paylaşabilir ya da daha önce aldığınız bir yedek dosyasından geri yükleyebilirsiniz.
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                        {/* Yedekleme & Paylaşım Butonu */}
                        <button 
                            type="button" 
                            onClick={() => setIsBackupExportModalOpen(true)} 
                            className="flex flex-col items-start gap-2 p-4 bg-indigo-600/90 hover:bg-indigo-600 text-white rounded-xl transition-all shadow-md border border-indigo-500/30 cursor-pointer text-left group"
                        >
                            <div className="flex items-center gap-2 font-bold text-sm">
                                <DownloadIcon className="h-5 w-5" /> Verileri İndir / Paylaş
                            </div>
                            <span className="text-[11px] text-indigo-200">
                                Google Drive, WhatsApp ile paylaş veya cihazına JSON olarak indir.
                            </span>
                        </button>

                        {/* Yedekten Geri Yükle Butonu */}
                        <button 
                            type="button" 
                            onClick={() => fileInputRef.current?.click()} 
                            className="flex flex-col items-start gap-2 p-4 bg-teal-600/90 hover:bg-teal-600 text-white rounded-xl transition-all shadow-md border border-teal-500/30 cursor-pointer text-left group"
                        >
                            <div className="flex items-center gap-2 font-bold text-sm">
                                <UploadIcon className="h-5 w-5" /> Yedekten Geri Yükle
                            </div>
                            <span className="text-[11px] text-teal-200">
                                Önceden kaydedilmiş .json yedek dosyasını uygulamaya yükle.
                            </span>
                        </button>

                        <input 
                            type="file" 
                            ref={fileInputRef} 
                            onChange={handleFileRestore} 
                            accept=".json" 
                            className="hidden" 
                        />
                    </div>
                </div>

                {/* Özet Bilgi Kartı */}
                <div className="bg-gray-900/80 p-4 rounded-xl border border-gray-700/60 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2 text-gray-300">
                        <CheckCircleIcon className="h-4 w-4 text-teal-400" />
                        <span>Kayıtlı Müşteri Sayısı:</span>
                    </div>
                    <span className="font-mono font-bold text-teal-300 text-sm">{customers.length} Müşteri</span>
                </div>
            </div>

            {/* Modals */}
            <BackupExportModal
                isOpen={isBackupExportModalOpen}
                onClose={() => setIsBackupExportModalOpen(false)}
                customers={customers}
                tasks={tasks}
                settings={settings}
                onSuccess={(msg) => setToastInfo({ message: msg, type: 'success' })}
                onError={(msg) => setToastInfo({ message: msg, type: 'error' })}
            />
        </div>
    );
};

export default SettingsScreen;
