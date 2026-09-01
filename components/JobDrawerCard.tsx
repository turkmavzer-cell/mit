import React from 'react';
import type { Customer, Job } from '../types';
import { 
  CheckCircleIcon, 
  RotateCcwIcon, 
  InfoIcon, 
  ImageIcon, 
  TrashIcon, 
  ArrowRightIcon 
} from './Icons';

interface JobDrawerCardProps {
  job: Job;
  customer: Customer;
  onOpenDetail: (jobId: string) => void;
  onToggleDelivery: (jobId: string, newStatus: 'active' | 'delivered') => void;
  onDeleteRequest: (jobId: string) => void;
  onOpenInfoModal: (job: Job) => void;
}

const formatDate = (isoString?: string) => {
  if (!isoString) return '';
  const date = new Date(isoString);
  const options: Intl.DateTimeFormatOptions = { day: '2-digit', month: '2-digit', year: 'numeric' };
  return date.toLocaleDateString('tr-TR', options);
};

const formatNum = (n: number) => {
  return new Intl.NumberFormat('tr-TR', {
    maximumFractionDigits: 2,
  }).format(n);
};

export const JobDrawerCard: React.FC<JobDrawerCardProps> = ({
  job,
  onOpenDetail,
  onToggleDelivery,
  onDeleteRequest,
  onOpenInfoModal,
}) => {
  const isDelivered = job.status === 'delivered';

  // Calculate quick summary for rolls
  const rolls = job.fabricRolls || [];
  const meterRolls = rolls.filter(r => r.unit === 'mt' || !r.unit || (r.unit as string) === 'meter');
  const kgRolls = rolls.filter(r => r.unit === 'kg');
  const totalMeters = meterRolls.reduce((acc, r) => acc + (Number(r.value) || 0), 0);
  const totalKg = kgRolls.reduce((acc, r) => acc + (Number(r.value) || 0), 0);

  const gramsPerMeter = job.fabricGramsPerMeter;
  const kgEquivalentMeters = (gramsPerMeter && gramsPerMeter > 0) ? (totalKg * 1000) / gramsPerMeter : 0;

  return (
    <li
      id={`job-${job.id}`}
      className={`group list-none bg-gray-850/95 hover:bg-gray-800 border transition-all duration-200 rounded-2xl p-4 sm:p-5 shadow-lg flex flex-col gap-3.5 ${
        isDelivered
          ? 'border-emerald-700/50 hover:border-emerald-500/70'
          : 'border-gray-700/90 hover:border-teal-500/60'
      }`}
    >
      {/* Top Header Row */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2.5">
        <div className="flex flex-wrap items-center gap-2">
          <h4 className="font-bold text-base sm:text-lg text-white group-hover:text-teal-300 transition-colors">
            {job.name}
          </h4>
          {isDelivered ? (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-emerald-950 text-emerald-300 border border-emerald-600/60 rounded-full text-xs font-bold shadow-xs">
              <CheckCircleIcon className="h-3.5 w-3.5 text-emerald-400" /> Teslim Edildi
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-amber-950 text-amber-300 border border-amber-600/50 rounded-full text-xs font-bold">
              ⚡ İmalatta / Aktif
            </span>
          )}
        </div>

        {/* Quick Action Badges */}
        <div className="flex items-center gap-2 self-end sm:self-center">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onOpenInfoModal(job);
            }}
            className="p-1.5 bg-gray-800 hover:bg-cyan-900/60 text-cyan-400 hover:text-cyan-200 rounded-xl border border-gray-700 hover:border-cyan-500/40 text-xs transition-colors cursor-pointer"
            title="Özet Bilgi Kartı"
          >
            <InfoIcon className="h-4 w-4" />
          </button>

          {!isDelivered ? (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onToggleDelivery(job.id, 'delivered');
              }}
              className="px-2.5 py-1 bg-emerald-700/80 hover:bg-emerald-600 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1 cursor-pointer"
              title="Teslim Edildi Yap"
            >
              <CheckCircleIcon className="h-3.5 w-3.5" /> Teslim Et
            </button>
          ) : (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onToggleDelivery(job.id, 'active');
              }}
              className="px-2.5 py-1 bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white rounded-xl text-xs font-semibold border border-gray-700 flex items-center gap-1 transition-colors cursor-pointer"
              title="Aktife Al"
            >
              <RotateCcwIcon className="h-3.5 w-3.5" /> Aktife Al
            </button>
          )}

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onDeleteRequest(job.id);
            }}
            className="p-1.5 text-gray-400 hover:text-red-400 hover:bg-gray-800 rounded-xl transition-colors cursor-pointer border border-gray-700"
            title="İşi Sil"
          >
            <TrashIcon className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Middle Headline Summary Details */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 text-xs text-gray-300 bg-gray-900/70 p-3 rounded-xl border border-gray-800">
        
        {/* Kumaş ve Tarih Bilgisi */}
        <div className="space-y-1">
          <div className="flex items-center gap-1.5 text-gray-400">
            <span>📅 Giriş:</span>
            <span className="text-gray-200 font-medium">{formatDate(job.createdAt)}</span>
          </div>
          {(job.fabricType || job.fabricColor) && (
            <div className="flex items-center gap-1.5 text-teal-300 font-medium truncate">
              <span>🧵</span>
              <span className="truncate">{[job.fabricType, job.fabricColor].filter(Boolean).join(' - ')}</span>
            </div>
          )}
        </div>

        {/* Top Kumaş Özeti */}
        <div className="space-y-1.5 flex flex-col justify-center">
          {/* Prominent Total Rolls Focal Point */}
          <div className="flex items-center justify-between">
            <span className="text-gray-400 font-semibold flex items-center gap-1">
              <span>🧮</span>
              <span>Toplam Kumaş:</span>
            </span>
            <span className="text-sm font-black text-teal-300 font-mono bg-teal-950/80 border border-teal-600/50 px-2.5 py-0.5 rounded-lg shadow-inner">
              {rolls.length} Top
            </span>
          </div>

          {/* Clean, Understated Sub-details */}
          {(meterRolls.length > 0 || kgRolls.length > 0) && (
            <div className="space-y-1 text-[11px] text-gray-400 bg-gray-950/60 p-2 rounded-lg border border-gray-800/80">
              {meterRolls.length > 0 && (
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">• Metre ({meterRolls.length} Top):</span>
                  <span className="font-mono font-semibold text-gray-200">{formatNum(totalMeters)} mt</span>
                </div>
              )}
              {kgRolls.length > 0 && (
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">• Kilo ({kgRolls.length} Top):</span>
                  <span className="font-mono font-semibold text-gray-200">
                    {formatNum(totalKg)} kg
                    {gramsPerMeter && kgEquivalentMeters > 0 ? (
                      <span className="text-amber-400/90 font-normal ml-1">
                        (≈ {formatNum(kgEquivalentMeters)} mt)
                      </span>
                    ) : null}
                  </span>
                </div>
              )}
            </div>
          )}
          {rolls.length === 0 && <span className="text-gray-500 italic text-[11px]">Top girilmedi</span>}
        </div>

        {/* Fotoğraf Rozetleri */}
        <div className="space-y-1 sm:col-span-2 lg:col-span-1 flex flex-col justify-center">
          <div className="flex flex-wrap items-center gap-1.5">
            {job.photos && job.photos.length > 0 ? (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-blue-950/80 border border-blue-700/50 text-blue-300 rounded-lg text-xs font-semibold">
                <ImageIcon className="h-3.5 w-3.5" /> {job.photos.length} Fotoğraf
              </span>
            ) : (
              <span className="text-gray-500 italic text-[11px]">Fotoğraf yok</span>
            )}
          </div>
        </div>

      </div>

      {/* Main Drawer Button - Enter this Job and open full isolated view */}
      <button
        type="button"
        onClick={() => onOpenDetail(job.id)}
        className="w-full py-2.5 px-4 bg-teal-950/60 hover:bg-teal-900/80 border border-teal-600/50 hover:border-teal-400 text-teal-300 hover:text-white rounded-xl text-xs sm:text-sm font-bold flex items-center justify-between transition-all shadow-xs cursor-pointer group/btn"
      >
        <span className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-teal-400 group-hover/btn:animate-ping"></span>
          İşe Gir / Tüm Detayları Aç
        </span>
        <span className="flex items-center gap-1 text-teal-400 group-hover/btn:translate-x-1 transition-transform">
          Detaylar <ArrowRightIcon className="h-4 w-4" />
        </span>
      </button>
    </li>
  );
};

export default JobDrawerCard;
