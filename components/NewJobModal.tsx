import React, { useState, useEffect } from 'react';
import type { Customer, Job, FabricRoll } from '../types';
import { XIcon } from './Icons';
import FabricRollManager from './FabricRollManager';

interface NewJobModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddJob: (newJob: Job) => void;
  customer: Customer;
  onShowToast: (message: string, type: 'success' | 'error') => void;
}

export const NewJobModal: React.FC<NewJobModalProps> = ({
  isOpen,
  onClose,
  onAddJob,
  customer,
  onShowToast,
}) => {
  const [jobName, setJobName] = useState('');
  const [fabricType, setFabricType] = useState('');
  const [fabricColor, setFabricColor] = useState('');
  const [fabricGramsPerMeter, setFabricGramsPerMeter] = useState<number | undefined>(undefined);
  const [fabricRolls, setFabricRolls] = useState<FabricRoll[]>([]);
  const [deadline, setDeadline] = useState('');
  const [personInCharge, setPersonInCharge] = useState('');
  const [notes, setNotes] = useState('');

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

  // Reset when opened
  useEffect(() => {
    if (isOpen) {
      setJobName('');
      setFabricType('');
      setFabricColor('');
      setFabricGramsPerMeter(undefined);
      setFabricRolls([]);
      setDeadline('');
      setPersonInCharge('');
      setNotes('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (jobName.trim() === '') {
      onShowToast('Lütfen bir iş adı / modeli giriniz.', 'error');
      return;
    }

    const newJob: Job = {
      id: Date.now().toString(),
      name: jobName.trim(),
      createdAt: new Date().toISOString(),
      status: 'active',
      fabricRolls,
      photos: [],
      notes: notes.trim(),
      fabricType: fabricType.trim(),
      fabricColor: fabricColor.trim(),
      fabricGramsPerMeter,
      deadline: deadline ? new Date(deadline).toISOString() : undefined,
      personInCharge: personInCharge.trim(),
    };

    onAddJob(newJob);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-3 sm:p-5 overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="bg-gray-900 border border-teal-500/40 rounded-2xl shadow-2xl w-full max-w-xl max-h-[92vh] flex flex-col overflow-hidden text-gray-100"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-center px-4 sm:px-6 py-3.5 bg-gray-850 border-b border-gray-800 shrink-0">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-teal-400 animate-pulse"></span>
              <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">Yeni İş Girişi</h3>
            </div>
            <p className="text-xs text-teal-300/90 font-medium mt-0.5">
              Müşteri: <span className="text-white font-semibold">{customer.name}</span>
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-white hover:bg-gray-800 rounded-xl transition-colors cursor-pointer"
            title="Pencereyi Kapat"
          >
            <XIcon className="h-5 w-5" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden">
          <div className="p-4 sm:p-6 space-y-4 overflow-y-auto flex-1 text-sm custom-scrollbar">
            
            {/* İş Adı / Modeli */}
            <div>
              <label className="block text-xs font-bold text-gray-200 mb-1.5">
                İş Adı / Modeli <span className="text-teal-400">*</span>
              </label>
              <input
                type="text"
                value={jobName}
                onChange={e => setJobName(e.target.value)}
                placeholder="Örn: 2026 Yazlık T-Shirt Baskı / Model A"
                className="w-full bg-gray-800 text-gray-100 font-semibold rounded-xl p-3 focus:ring-2 focus:ring-teal-500 focus:outline-none border border-gray-700 placeholder-gray-500 shadow-inner"
                required
                autoFocus
              />
            </div>

            {/* Kumaş Türü & Kumaş Rengi */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">Kumaş Türü</label>
                <input
                  type="text"
                  value={fabricType}
                  onChange={e => setFabricType(e.target.value)}
                  placeholder="Örn: 30/1 Süprem, İnterlok"
                  className="w-full bg-gray-800 text-gray-200 rounded-xl p-2.5 text-sm focus:ring-2 focus:ring-teal-500 focus:outline-none border border-gray-700"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">Kumaş Rengi</label>
                <input
                  type="text"
                  value={fabricColor}
                  onChange={e => setFabricColor(e.target.value)}
                  placeholder="Örn: Lacivert, Siyah"
                  className="w-full bg-gray-800 text-gray-200 rounded-xl p-2.5 text-sm focus:ring-2 focus:ring-teal-500 focus:outline-none border border-gray-700"
                />
              </div>
            </div>

            {/* Top Top Kumaş ve 1 mt Gramaj Girişi */}
            <FabricRollManager
              rolls={fabricRolls}
              onChange={setFabricRolls}
              gramsPerMeter={fabricGramsPerMeter}
              onGramsPerMeterChange={setFabricGramsPerMeter}
            />

            {/* İş Notları */}
            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1">
                İş Notları <span className="text-gray-500 font-normal">(İsteğe Bağlı)</span>
              </label>
              <textarea
                value={notes}
                onChange={e => setNotes(e.target.value)}
                placeholder="İş veya kumaş ile ilgili özel talimatlar..."
                className="w-full bg-gray-800 text-gray-200 rounded-xl p-2.5 focus:ring-2 focus:ring-teal-500 focus:outline-none border border-gray-700 text-sm shadow-inner"
                rows={2}
              />
            </div>
          </div>

          {/* Modal Footer with Actions */}
          <div className="px-4 sm:px-6 py-3.5 bg-gray-850 border-t border-gray-800 flex justify-end items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white font-semibold rounded-xl text-sm transition-colors cursor-pointer border border-gray-700"
            >
              İptal
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-teal-600 hover:bg-teal-500 text-white font-bold rounded-xl text-sm transition-all shadow-lg hover:shadow-teal-500/20 cursor-pointer"
            >
              İşi Kaydet
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewJobModal;
