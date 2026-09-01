import React, { useState, useEffect } from 'react';
import type { Customer, Job, FabricRoll } from '../types';
import { 
  XIcon, 
  TrashIcon, 
  EditIcon, 
  CheckCircleIcon, 
  RotateCcwIcon, 
  InfoIcon, 
  ImageIcon, 
  CameraIcon, 
  NoteIcon, 
  SaveIcon
} from './Icons';
import FabricRollManager from './FabricRollManager';
import JobInfoModal from './JobInfoModal';

interface JobDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  job: Job;
  customer: Customer;
  onSaveJob: (updatedJob: Job) => void;
  onDeleteJob: (jobId: string) => void;
  onToggleDelivery: (jobId: string, newStatus: 'active' | 'delivered') => void;
  onImageClick: (imageUrl: string) => void;
  onDeletePhotoRequest: (jobId: string, photoIndex: number) => void;
  onPhotoUpload: (jobId: string, base64Photos: string[]) => void;
}

const formatDate = (isoString?: string) => {
  if (!isoString) return '';
  const date = new Date(isoString);
  const options: Intl.DateTimeFormatOptions = { day: '2-digit', month: '2-digit', year: 'numeric' };
  return date.toLocaleDateString('tr-TR', options);
};

const compressAndEncodeImage = (file: File, maxDimension: number = 800, quality: number = 0.7): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      if (!event.target?.result) {
        return reject(new Error("FileReader failed to read file."));
      }
      const img = new Image();
      img.src = event.target.result as string;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let { width, height } = img;

        if (width > height) {
          if (width > maxDimension) {
            height = Math.round((height * maxDimension) / width);
            width = maxDimension;
          }
        } else {
          if (height > maxDimension) {
            width = Math.round((width * maxDimension) / height);
            height = maxDimension;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          return reject(new Error('Could not get 2D context from canvas.'));
        }
        ctx.drawImage(img, 0, 0, width, height);

        const dataUrl = canvas.toDataURL('image/jpeg', quality);
        resolve(dataUrl);
      };
      img.onerror = (err) => reject(err);
    };
    reader.onerror = (err) => reject(err);
  });
};

export const JobDetailModal: React.FC<JobDetailModalProps> = ({
  isOpen,
  onClose,
  job,
  customer,
  onSaveJob,
  onDeleteJob,
  onToggleDelivery,
  onImageClick,
  onDeletePhotoRequest,
  onPhotoUpload,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);
  const [notesVisible, setNotesVisible] = useState(true);
  const [photosVisible, setPhotosVisible] = useState(true);

  // Edit State
  const [editName, setEditName] = useState(job.name);
  const [editFabricRolls, setEditFabricRolls] = useState<FabricRoll[]>(job.fabricRolls || []);
  const [editNotes, setEditNotes] = useState(job.notes || '');
  const [editFabricType, setEditFabricType] = useState(job.fabricType || '');
  const [editFabricColor, setEditFabricColor] = useState(job.fabricColor || '');
  const [editFabricGramsPerMeter, setEditFabricGramsPerMeter] = useState<number | undefined>(job.fabricGramsPerMeter);
  const [editDeadline, setEditDeadline] = useState(job.deadline ? job.deadline.split('T')[0] : '');
  const [editPersonInCharge, setEditPersonInCharge] = useState(job.personInCharge || '');

  // Prevent background scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Sync edit state when job updates
  useEffect(() => {
    setEditName(job.name);
    setEditFabricRolls(job.fabricRolls || []);
    setEditNotes(job.notes || '');
    setEditFabricType(job.fabricType || '');
    setEditFabricColor(job.fabricColor || '');
    setEditFabricGramsPerMeter(job.fabricGramsPerMeter);
    setEditDeadline(job.deadline ? job.deadline.split('T')[0] : '');
    setEditPersonInCharge(job.personInCharge || '');
    setIsEditing(false);
  }, [job]);

  if (!isOpen) return null;

  const isDelivered = job.status === 'delivered';

  const handlePhotoUploadChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const files = Array.from(e.target.files);
      const base64Photos = await Promise.all(files.map((file: File) => compressAndEncodeImage(file)));
      onPhotoUpload(job.id, base64Photos);
    }
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editName.trim() === '') return;

    const updated: Job = {
      ...job,
      name: editName.trim(),
      fabricRolls: editFabricRolls,
      notes: editNotes.trim(),
      fabricType: editFabricType.trim(),
      fabricColor: editFabricColor.trim(),
      fabricGramsPerMeter: editFabricGramsPerMeter,
      deadline: editDeadline ? new Date(editDeadline).toISOString() : undefined,
      personInCharge: editPersonInCharge.trim(),
    };

    onSaveJob(updated);
    setIsEditing(false);
  };

  return (
    <div
      className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-2 sm:p-4 overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="bg-gray-900 border border-gray-700 rounded-2xl shadow-2xl w-full max-w-3xl max-h-[94vh] flex flex-col overflow-hidden text-gray-100"
        onClick={e => e.stopPropagation()}
      >
        {/* Sticky Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 px-4 sm:px-6 py-3.5 bg-gray-850 border-b border-gray-800 shrink-0">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white rounded-xl transition-colors cursor-pointer border border-gray-700"
              title="Geri / Kapat"
            >
              <XIcon className="h-5 w-5" />
            </button>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="text-base sm:text-lg font-bold text-teal-300">{job.name}</h3>
                {isDelivered ? (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-emerald-950 text-emerald-300 border border-emerald-600/60 rounded-full text-xs font-bold shadow-xs">
                    <CheckCircleIcon className="h-3.5 w-3.5 text-emerald-400" /> Teslim Edildi {job.deliveredAt ? `(${formatDate(job.deliveredAt)})` : ''}
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-amber-950 text-amber-300 border border-amber-600/50 rounded-full text-xs font-bold">
                    ⚡ İmalatta / Aktif
                  </span>
                )}
              </div>
              <p className="text-xs text-gray-400 mt-0.5 font-medium">
                Müşteri: <span className="text-gray-200 font-semibold">{customer.name}</span> • Giriş: {formatDate(job.createdAt)}
              </p>
            </div>
          </div>

          {/* Action Bar */}
          <div className="flex flex-wrap items-center gap-2 self-end sm:self-center">
            {/* Job Info Modal Trigger */}
            <button
              type="button"
              onClick={() => setIsInfoModalOpen(true)}
              className="px-2.5 py-1.5 bg-cyan-700/80 hover:bg-cyan-600 text-cyan-100 hover:text-white font-bold text-xs rounded-xl transition-all shadow-xs flex items-center gap-1.5 border border-cyan-500/40 cursor-pointer"
              title="İşin tüm bilgilerini özet info kartı olarak görüntüle"
            >
              <InfoIcon className="h-4 w-4" /> Detay Bilgi
            </button>

            {/* Delivery Toggle Button */}
            {!isDelivered ? (
              <button
                type="button"
                onClick={() => onToggleDelivery(job.id, 'delivered')}
                className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl transition-all shadow-md flex items-center gap-1.5 cursor-pointer"
                title="İşi Teslim Edildi Olarak İşaretle"
              >
                <CheckCircleIcon className="h-4 w-4" /> İş Teslim Edildi
              </button>
            ) : (
              <button
                type="button"
                onClick={() => onToggleDelivery(job.id, 'active')}
                className="px-2.5 py-1.5 bg-gray-700 hover:bg-gray-600 text-gray-300 hover:text-white text-xs font-semibold rounded-xl border border-gray-600 flex items-center gap-1 transition-colors cursor-pointer"
                title="İşi Tekrar Aktif İmalata Al"
              >
                <RotateCcwIcon className="h-3.5 w-3.5" /> Aktife Al
              </button>
            )}

            {/* Edit / View Toggle */}
            {!isEditing ? (
              <button
                type="button"
                onClick={() => setIsEditing(true)}
                className="p-2 text-gray-300 hover:text-teal-300 hover:bg-gray-800 rounded-xl transition-colors cursor-pointer border border-gray-700"
                title="İşi Düzenle"
              >
                <EditIcon className="h-4 w-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="px-2.5 py-1.5 bg-gray-800 text-gray-300 hover:text-white text-xs font-semibold rounded-xl border border-gray-700 cursor-pointer"
              >
                Görüntüle
              </button>
            )}

            {/* Delete Button */}
            <button
              type="button"
              onClick={() => onDeleteJob(job.id)}
              className="p-2 text-gray-400 hover:text-red-400 hover:bg-gray-800 rounded-xl transition-colors cursor-pointer border border-gray-700"
              title="İşi Sil"
            >
              <TrashIcon className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Scrollable Modal Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 custom-scrollbar">
          {isEditing ? (
            /* Editing Form Mode */
            <form onSubmit={handleSaveEdit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-200 mb-1">İş Adı / Modeli *</label>
                <input
                  type="text"
                  value={editName}
                  onChange={e => setEditName(e.target.value)}
                  className="w-full bg-gray-800 text-gray-100 rounded-xl p-2.5 focus:ring-2 focus:ring-teal-500 focus:outline-none font-semibold border border-gray-700"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-300 mb-1">Kumaş Türü</label>
                  <input
                    type="text"
                    value={editFabricType}
                    onChange={e => setEditFabricType(e.target.value)}
                    placeholder="Örn: 30/1 Süprem"
                    className="w-full bg-gray-800 text-gray-200 rounded-xl p-2.5 focus:ring-2 focus:ring-teal-500 focus:outline-none text-sm border border-gray-700"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-300 mb-1">Kumaş Rengi</label>
                  <input
                    type="text"
                    value={editFabricColor}
                    onChange={e => setEditFabricColor(e.target.value)}
                    placeholder="Örn: Lacivert, Siyah"
                    className="w-full bg-gray-800 text-gray-200 rounded-xl p-2.5 focus:ring-2 focus:ring-teal-500 focus:outline-none text-sm border border-gray-700"
                  />
                </div>
              </div>

              {/* Fabric Rolls Management */}
              <FabricRollManager
                rolls={editFabricRolls}
                onChange={setEditFabricRolls}
                gramsPerMeter={editFabricGramsPerMeter}
                onGramsPerMeterChange={setEditFabricGramsPerMeter}
              />

              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1">İş Notları</label>
                <textarea
                  value={editNotes}
                  onChange={e => setEditNotes(e.target.value)}
                  placeholder="İş ile ilgili notlar..."
                  className="w-full bg-gray-800 text-gray-200 rounded-xl p-2.5 focus:ring-2 focus:ring-teal-500 focus:outline-none border border-gray-700 text-sm"
                  rows={2}
                />
              </div>

              <div className="flex justify-end gap-2.5 pt-2 border-t border-gray-800">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 bg-gray-800 text-gray-300 font-semibold rounded-xl hover:bg-gray-700 transition-colors text-sm cursor-pointer border border-gray-700"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-teal-600 hover:bg-teal-500 text-white font-bold rounded-xl flex items-center gap-1.5 shadow-md transition-all text-sm cursor-pointer"
                >
                  <SaveIcon className="h-4 w-4" /> Değişiklikleri Kaydet
                </button>
              </div>
            </form>
          ) : (
            /* Standard View Mode */
            <div className="space-y-4">
              
              {/* Info Badges & Details Summary */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-gray-950/70 p-4 rounded-xl border border-gray-800 text-xs">
                <div className="space-y-2.5">
                  <div>
                    <span className="text-gray-100 font-bold block text-xs mb-0.5">🧵 Kumaş:</span>
                    <span className="text-gray-300 font-normal">
                      {[job.fabricType, job.fabricColor].filter(Boolean).join(' - ') || 'Belirtilmedi'}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-100 font-bold block text-xs mb-0.5">📅 Giriş Tarihi:</span>
                    <span className="text-gray-300">{formatDate(job.createdAt)}</span>
                  </div>
                </div>

                <div className="space-y-2.5 border-t sm:border-t-0 sm:border-l border-gray-800 sm:pl-3 pt-2 sm:pt-0">
                  {job.fabricGramsPerMeter ? (
                    <div>
                      <span className="text-gray-100 font-bold block text-xs mb-0.5">⚖️ 1 mt Gramajı:</span>
                      <span className="text-amber-400/90 font-mono font-medium">{job.fabricGramsPerMeter} gr</span>
                    </div>
                  ) : (
                    <div>
                      <span className="text-gray-100 font-bold block text-xs mb-0.5">📦 Top Adedi:</span>
                      <span className="text-teal-300 font-mono font-bold">{job.fabricRolls?.length || 0} Top</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Fabric Rolls Section (Top top kumaş listesi ve toplamları) */}
              <div className="border-t border-gray-800 pt-3">
                <FabricRollManager
                  rolls={job.fabricRolls || []}
                  readOnly={true}
                  gramsPerMeter={job.fabricGramsPerMeter}
                />
              </div>

              {/* Photos Section */}
              <div className="border-t border-gray-800 pt-3 space-y-2.5">
                <div className="flex justify-between items-center">
                  <button 
                    onClick={() => setPhotosVisible(!photosVisible)}
                    className="flex items-center gap-2 text-sm text-teal-400 font-bold text-left hover:text-teal-300 transition-colors cursor-pointer"
                  >
                    <ImageIcon className="h-4 w-4" /> Fotoğraflar ({job.photos?.length || 0}) {photosVisible ? '▲' : '▼'}
                  </button>
                  <div className="flex items-center gap-2">
                    <label title="Galeriden Yükle" className="cursor-pointer px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold flex items-center gap-1 transition-all shadow-xs">
                      <ImageIcon className="h-3.5 w-3.5" /> Galeri
                      <input type="file" multiple accept="image/*" className="hidden" onChange={handlePhotoUploadChange} />
                    </label>
                    <label title="Fotoğraf Çek" className="cursor-pointer px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold flex items-center gap-1 transition-all shadow-xs">
                      <CameraIcon className="h-3.5 w-3.5" /> Fotoğraf Çek
                      <input type="file" accept="image/*" capture="environment" className="hidden" onChange={handlePhotoUploadChange} />
                    </label>
                  </div>
                </div>

                {photosVisible && job.photos && job.photos.length > 0 && (
                  <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2.5 mt-2">
                    {job.photos.map((photo, index) => (
                      <div key={index} className="relative group aspect-square rounded-xl overflow-hidden border border-gray-700 bg-gray-950 shadow-inner">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onDeletePhotoRequest(job.id, index);
                          }}
                          className="absolute top-1 right-1 z-10 p-1.5 bg-red-600/90 hover:bg-red-500 rounded-full text-white shadow-md cursor-pointer transition-transform group-hover:scale-110"
                          aria-label="Fotoğrafı Sil"
                          title="Fotoğrafı Sil"
                        >
                          <TrashIcon className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => onImageClick(photo)}
                          className="w-full h-full focus:outline-none focus:ring-2 focus:ring-teal-500 cursor-pointer"
                        >
                          <img src={photo} alt={`İş Fotoğrafı ${index + 1}`} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Notes Section */}
              {job.notes && (
                <div className="border-t border-gray-800 pt-3">
                  <button 
                    onClick={() => setNotesVisible(!notesVisible)}
                    className="flex items-center gap-2 text-xs text-gray-400 font-semibold hover:text-gray-200 transition-colors cursor-pointer"
                  >
                    <NoteIcon className="h-3.5 w-3.5 text-teal-400" /> Notları {notesVisible ? 'Gizle' : 'Göster'}
                  </button>
                  {notesVisible && (
                    <div className="mt-2 p-3.5 bg-gray-950/80 rounded-xl border border-gray-800">
                      <p className="text-gray-300 text-xs whitespace-pre-wrap font-sans leading-relaxed">{job.notes}</p>
                    </div>
                  )}
                </div>
              )}

            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-4 sm:px-6 py-3 bg-gray-850 border-t border-gray-800 flex justify-end items-center shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 bg-gray-800 hover:bg-gray-700 text-white font-bold text-xs rounded-xl transition-colors cursor-pointer border border-gray-700"
          >
            Pencereyi Kapat
          </button>
        </div>
      </div>

      {/* Job Info Modal */}
      <JobInfoModal
        isOpen={isInfoModalOpen}
        onClose={() => setIsInfoModalOpen(false)}
        job={job}
        customer={customer}
      />
    </div>
  );
};

export default JobDetailModal;
