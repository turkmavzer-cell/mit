import React, { useState } from 'react';
import type { Customer, Job } from '../types';
import { XIcon, CopyIcon } from './Icons';

interface JobInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  job: Job;
  customer: Customer;
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

export const JobInfoModal: React.FC<JobInfoModalProps> = ({
  isOpen,
  onClose,
  job,
  customer,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const isDelivered = job.status === 'delivered';

  const rolls = job.fabricRolls || [];
  const meterRolls = rolls.filter(r => r.unit === 'mt' || !r.unit || (r.unit as string) === 'meter');
  const kgRolls = rolls.filter(r => r.unit === 'kg');
  const totalMeters = meterRolls.reduce((sum, r) => sum + (Number(r.value) || 0), 0);
  const totalKg = kgRolls.reduce((sum, r) => sum + (Number(r.value) || 0), 0);
  
  const gramsPerMeter = job.fabricGramsPerMeter;
  const kgEquivalentMeters = (gramsPerMeter && gramsPerMeter > 0) ? (totalKg * 1000) / gramsPerMeter : 0;
  const grandTotalMeters = totalMeters + kgEquivalentMeters;

  // Plain text generator for copy / share
  const generateSummaryText = () => {
    const lines: string[] = [];
    lines.push(`İŞ DETAYI`);
    lines.push(`----------------------------------`);
    lines.push(`Müşteri: ${customer.name}`);
    lines.push(`İş / Model: ${job.name}`);
    lines.push(`İş Durumu: ${isDelivered ? `Teslim Edildi (${formatDate(job.deliveredAt)})` : 'İmalatta / Aktif'}`);
    lines.push(`Kumaş: ${[job.fabricType, job.fabricColor].filter(Boolean).join(' - ') || 'Belirtilmedi'}${gramsPerMeter ? ` (1 mt: ${gramsPerMeter} gr)` : ''}`);
    if (job.notes) {
      lines.push(`Not: ${job.notes}`);
    }
    lines.push(``);
    lines.push(`KUMAŞ TOPLARI:`);
    if (meterRolls.length > 0) {
      lines.push(`Metre Topları:`);
      meterRolls.forEach((r, idx) => {
        lines.push(`  Top ${idx + 1}: ${formatNum(r.value)} mt`);
      });
      lines.push(`  Toplam Metre: ${formatNum(totalMeters)} mt (${meterRolls.length} Top)`);
    }
    if (kgRolls.length > 0) {
      lines.push(`Kilo Topları:`);
      kgRolls.forEach((r, idx) => {
        const equiv = gramsPerMeter ? ` (≈ ${formatNum((r.value * 1000) / gramsPerMeter)} mt)` : '';
        lines.push(`  Top ${idx + 1}: ${formatNum(r.value)} kg${equiv}`);
      });
      lines.push(`  Toplam Kilo: ${formatNum(totalKg)} kg (${kgRolls.length} Top)${gramsPerMeter ? ` ≈ ${formatNum(kgEquivalentMeters)} mt` : ''}`);
    }
    if (gramsPerMeter && kgRolls.length > 0) {
      lines.push(`Genel Toplam: ${formatNum(grandTotalMeters)} mt (${rolls.length} Top)`);
    } else if (rolls.length > 0) {
      lines.push(`Toplam: ${rolls.length} Top`);
    }
    return lines.join('\n');
  };

  const handleCopyText = async () => {
    try {
      const text = generateSummaryText();
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Kopyalama hatası:', err);
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black/75 backdrop-blur-xs z-50 flex justify-center items-center p-3 sm:p-4 overflow-y-auto"
      onClick={onClose}
    >
      <div 
        className="bg-gray-900 border border-gray-700 rounded-xl shadow-2xl w-full max-w-lg overflow-hidden text-gray-100 font-sans"
        onClick={e => e.stopPropagation()}
      >
        {/* Simple Header */}
        <div className="flex justify-between items-center px-4 py-3 bg-gray-850 border-b border-gray-800">
          <div>
            <h3 className="text-base font-bold text-white">İş Detayı</h3>
            <p className="text-xs text-gray-400 font-medium">{job.name}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors cursor-pointer"
            title="Kapat"
          >
            <XIcon />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-5 space-y-4 text-sm max-h-[80vh] overflow-y-auto custom-scrollbar">
          
          {/* Main Job Info */}
          <div className="bg-gray-800/70 border border-gray-700/80 rounded-lg p-3.5 space-y-3 leading-relaxed">
            <div>
              <span className="text-xs font-black text-gray-100 tracking-wider uppercase block mb-0.5">Müşteri:</span>
              <span className="text-gray-300 font-medium text-sm">{customer.name}</span>
            </div>

            <div>
              <span className="text-xs font-black text-gray-100 tracking-wider uppercase block mb-0.5">İş Durumu:</span>
              <span className={`font-semibold text-xs px-2 py-0.5 rounded inline-block w-fit ${
                isDelivered ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-700/50' : 'bg-amber-950/80 text-amber-300 border border-amber-700/50'
              }`}>
                {isDelivered ? `Teslim Edildi (${formatDate(job.deliveredAt)})` : 'İmalatta / Aktif'}
              </span>
            </div>

            <div>
              <span className="text-xs font-black text-gray-100 tracking-wider uppercase block mb-0.5">Kumaş:</span>
              <span className="text-gray-300 text-sm">
                {[job.fabricType, job.fabricColor].filter(Boolean).join(' - ') || 'Belirtilmedi'}
                {gramsPerMeter ? <span className="text-amber-400/90 font-normal ml-1.5 text-xs">({gramsPerMeter} gr/mt)</span> : null}
              </span>
            </div>

            {job.notes && (
              <div className="pt-2 border-t border-gray-700/50">
                <span className="text-xs font-black text-gray-100 tracking-wider uppercase block mb-0.5">Not:</span>
                <span className="text-gray-400 italic text-xs whitespace-pre-wrap">{job.notes}</span>
              </div>
            )}
          </div>

          {/* Kumaş Topları Dökümü */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold text-gray-300 uppercase tracking-wide">
                Kumaş Topları ({rolls.length} Top)
              </span>
              {gramsPerMeter && (
                <span className="text-[11px] text-amber-300 bg-amber-950/60 px-2 py-0.5 rounded border border-amber-800/40">
                  1 mt = {gramsPerMeter} gr
                </span>
              )}
            </div>

            {rolls.length === 0 ? (
              <div className="p-3 bg-gray-800/40 rounded-lg text-xs text-gray-500 italic text-center border border-gray-800">
                Top bilgisi girilmedi.
              </div>
            ) : (
              <div className="bg-gray-950 p-3.5 rounded-lg border border-gray-800 font-mono text-xs space-y-3 shadow-inner">
                
                {/* Metre Topları Listesi */}
                {meterRolls.length > 0 && (
                  <div className="space-y-1.5">
                    <div className="text-teal-400 font-bold text-[11px] border-b border-teal-900/50 pb-1 flex justify-between">
                      <span>🧵 METRE TOPLARI ({meterRolls.length})</span>
                      <span>{formatNum(totalMeters)} mt</span>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-3 gap-y-1 pt-1 text-gray-300">
                      {meterRolls.map((r, idx) => (
                        <div key={r.id} className="flex justify-between border-b border-gray-900 pb-0.5">
                          <span className="text-gray-500">#{idx + 1}</span>
                          <span className="font-semibold text-teal-200">{formatNum(r.value)} mt</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Kilo Topları Listesi */}
                {kgRolls.length > 0 && (
                  <div className="space-y-1.5 pt-1">
                    <div className="text-amber-400 font-bold text-[11px] border-b border-amber-900/50 pb-1 flex justify-between">
                      <span>⚖️ KİLO TOPLARI ({kgRolls.length})</span>
                      <span>
                        {formatNum(totalKg)} kg
                        {gramsPerMeter && gramsPerMeter > 0 && ` (≈ ${formatNum(kgEquivalentMeters)} mt)`}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-3 gap-y-1 pt-1 text-gray-300">
                      {kgRolls.map((r, idx) => {
                        const rollEquiv = gramsPerMeter ? (r.value * 1000) / gramsPerMeter : null;
                        return (
                          <div key={r.id} className="flex justify-between items-center border-b border-gray-900 pb-0.5">
                            <span className="text-gray-500">#{idx + 1}</span>
                            <div className="flex items-center gap-1">
                              <span className="font-semibold text-amber-200">{formatNum(r.value)} kg</span>
                              {rollEquiv !== null && (
                                <span className="text-amber-400 text-[10px]">≈ {formatNum(rollEquiv)} mt</span>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Alt Toplam Çizgisi */}
                <div className="pt-2 border-t border-dashed border-gray-700 flex justify-between items-center font-sans font-bold text-xs">
                  <span className="text-gray-300">TOPLAM:</span>
                  <div className="text-right font-mono">
                    {gramsPerMeter && kgRolls.length > 0 ? (
                      <span className="text-emerald-300 font-bold text-sm">
                        {formatNum(grandTotalMeters)} mt <span className="text-[11px] text-gray-400 font-normal">({rolls.length} Top)</span>
                      </span>
                    ) : (
                      <span className="text-teal-300 font-bold text-sm">
                        {meterRolls.length > 0 && `${formatNum(totalMeters)} mt`}
                        {meterRolls.length > 0 && kgRolls.length > 0 && ' + '}
                        {kgRolls.length > 0 && `${formatNum(totalKg)} kg`}
                        <span className="text-[11px] text-gray-400 font-normal ml-1">({rolls.length} Top)</span>
                      </span>
                    )}
                  </div>
                </div>

              </div>
            )}
          </div>

        </div>

        {/* Simple Footer */}
        <div className="px-4 py-3 bg-gray-850 border-t border-gray-800 flex justify-between items-center">
          <button
            type="button"
            onClick={handleCopyText}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
              copied 
                ? 'bg-emerald-600 text-white' 
                : 'bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white border border-gray-700'
            }`}
          >
            <CopyIcon className="h-3.5 w-3.5" />
            {copied ? 'Kopyalandı ✓' : 'Metni Kopyala'}
          </button>

          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 bg-gray-700 hover:bg-gray-600 text-white font-semibold text-xs rounded-lg transition-colors cursor-pointer"
          >
            Kapat
          </button>
        </div>
      </div>
    </div>
  );
};

export default JobInfoModal;
