import React, { useState, useMemo } from 'react';
import type { FabricRoll } from '../types';
import { PlusIcon, TrashIcon, InfoIcon, ChevronDownIcon } from './Icons';

interface FabricRollManagerProps {
  rolls: FabricRoll[];
  onChange?: (rolls: FabricRoll[]) => void;
  readOnly?: boolean;
  gramsPerMeter?: number;
  onGramsPerMeterChange?: (val: number | undefined) => void;
}

export const FabricRollManager: React.FC<FabricRollManagerProps> = ({
  rolls,
  onChange,
  readOnly = false,
  gramsPerMeter,
  onGramsPerMeterChange,
}) => {
  const [newValue, setNewValue] = useState('');
  const [newUnit, setNewUnit] = useState<'mt' | 'kg'>('mt');
  const [isDetailsExpanded, setIsDetailsExpanded] = useState(false);

  // Split and sort rolls: mt at top, kg at bottom
  const meterRolls = useMemo(() => rolls.filter(r => r.unit === 'mt'), [rolls]);
  const kgRolls = useMemo(() => rolls.filter(r => r.unit === 'kg'), [rolls]);

  const totalMeters = useMemo(() => {
    return meterRolls.reduce((sum, r) => sum + (Number(r.value) || 0), 0);
  }, [meterRolls]);

  const totalKg = useMemo(() => {
    return kgRolls.reduce((sum, r) => sum + (Number(r.value) || 0), 0);
  }, [kgRolls]);

  const totalRollsCount = rolls.length;

  // Calculate equivalent meters for kg rolls based on gramsPerMeter
  const kgEquivalentMeters = useMemo(() => {
    if (!gramsPerMeter || gramsPerMeter <= 0) return 0;
    return (totalKg * 1000) / gramsPerMeter;
  }, [totalKg, gramsPerMeter]);

  const grandTotalEquivalentMeters = useMemo(() => {
    return totalMeters + kgEquivalentMeters;
  }, [totalMeters, kgEquivalentMeters]);

  const calculateRollMeters = (kgValue: number) => {
    if (!gramsPerMeter || gramsPerMeter <= 0) return null;
    return (kgValue * 1000) / gramsPerMeter;
  };

  const handleAddRoll = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const val = parseFloat(newValue.replace(',', '.'));
    if (isNaN(val) || val <= 0) return;

    const newRoll: FabricRoll = {
      id: Date.now().toString() + '-' + Math.random().toString(36).substring(2, 7),
      value: val,
      unit: newUnit,
    };

    if (onChange) {
      onChange([...rolls, newRoll]);
    }
    setNewValue('');
  };

  const handleToggleUnit = (id: string) => {
    if (!onChange || readOnly) return;
    const updated = rolls.map(r => {
      if (r.id === id) {
        return { ...r, unit: r.unit === 'mt' ? ('kg' as const) : ('mt' as const) };
      }
      return r;
    });
    onChange(updated);
  };

  const handleValueChange = (id: string, valStr: string) => {
    if (!onChange || readOnly) return;
    const val = parseFloat(valStr.replace(',', '.'));
    const updated = rolls.map(r => {
      if (r.id === id) {
        return { ...r, value: isNaN(val) ? 0 : val };
      }
      return r;
    });
    onChange(updated);
  };

  const handleDeleteRoll = (id: string) => {
    if (!onChange || readOnly) return;
    onChange(rolls.filter(r => r.id !== id));
  };

  const formatNum = (n: number) => {
    return new Intl.NumberFormat('tr-TR', {
      maximumFractionDigits: 2,
    }).format(n);
  };

  // Read-only presentation for Job Card
  if (readOnly) {
    if (rolls.length === 0) {
      return (
        <div className="text-xs text-gray-500 italic">Top bilgisi girilmedi.</div>
      );
    }

    return (
      <div className="space-y-2.5 text-sm">
        {/* Clean, structured 2-column split totals summary card */}
        <div className="bg-gray-950/80 p-3.5 rounded-xl border border-gray-800 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-gray-800">
            <span className="text-xs font-bold text-gray-200 flex items-center gap-1.5">
              <span>📦</span> Kumaş Topları Özeti
            </span>
            <button
              type="button"
              onClick={() => setIsDetailsExpanded(!isDetailsExpanded)}
              className="text-xs text-teal-400 hover:text-teal-300 font-semibold flex items-center gap-1.5 cursor-pointer transition-colors"
              title={isDetailsExpanded ? 'Top listesini gizle' : 'Tüm top listesini aç'}
            >
              <span>{isDetailsExpanded ? 'Topları Gizle' : 'Top Detayları'}</span>
              <ChevronDownIcon className={`h-3.5 w-3.5 transition-transform duration-200 ${isDetailsExpanded ? 'rotate-180' : ''}`} />
            </button>
          </div>

          {/* Ortadan dikey olarak 2 sütuna ayrılmış düzen: Solda etiketler/top bilgileri, Sağda metraj/kilo değerleri */}
          <div className="text-xs space-y-2">
            {/* Toplam Top */}
            <div className="grid grid-cols-2 gap-3 py-1 border-b border-gray-900 items-center">
              <div className="text-gray-400 font-semibold">Toplam Top:</div>
              <div className="text-right font-bold text-gray-100 font-mono text-sm">
                {totalRollsCount} Top
              </div>
            </div>

            {/* Metre Topları */}
            {meterRolls.length > 0 && (
              <div className="grid grid-cols-2 gap-3 py-1 border-b border-gray-900 items-center">
                <div className="text-gray-400 font-medium">
                  Metre Topları: <span className="text-gray-500 font-normal text-[11px]">({meterRolls.length} Top)</span>
                </div>
                <div className="text-right font-semibold font-mono text-gray-200">
                  {formatNum(totalMeters)} mt
                </div>
              </div>
            )}

            {/* Kilo Topları */}
            {kgRolls.length > 0 && (
              <div className="grid grid-cols-2 gap-3 py-1 border-b border-gray-900 items-center">
                <div className="text-gray-400 font-medium">
                  Kilo Topları: <span className="text-gray-500 font-normal text-[11px]">({kgRolls.length} Top)</span>
                </div>
                <div className="text-right font-mono space-x-1.5">
                  <span className="font-semibold text-gray-200">{formatNum(totalKg)} kg</span>
                  {gramsPerMeter && gramsPerMeter > 0 && (
                    <span className="text-amber-300 font-semibold">
                      ≈ {formatNum(kgEquivalentMeters)} mt
                    </span>
                  )}
                </div>
              </div>
            )}

            {/* Toplam Metraj (Eşdeğer) */}
            {gramsPerMeter && gramsPerMeter > 0 && kgRolls.length > 0 && (
              <div className="grid grid-cols-2 gap-3 py-1.5 pt-2 border-t border-gray-800 items-center">
                <div className="text-gray-300 font-bold">
                  Toplam Metraj (Eşdeğer):
                </div>
                <div className="text-right font-bold text-teal-300 font-mono text-sm">
                  {formatNum(grandTotalEquivalentMeters)} mt
                </div>
              </div>
            )}
          </div>

          {gramsPerMeter && gramsPerMeter > 0 && kgRolls.length > 0 && (
            <div className="text-[11px] text-gray-500 pt-1 border-t border-gray-900 flex items-center justify-between">
              <span>Gramaj: {gramsPerMeter} gr/mt</span>
              <span>Kilo topları metraja dahil edilmiştir</span>
            </div>
          )}
        </div>

        {/* Expanded Top Details List */}
        {isDetailsExpanded && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-2">
            {/* Metre Topları */}
            {meterRolls.length > 0 && (
              <div className="p-3.5 bg-gray-950/90 rounded-xl border border-teal-900/60 shadow-inner flex flex-col">
                <div className="text-xs font-bold text-teal-400 uppercase tracking-wider mb-2.5 pb-1.5 border-b border-teal-900/60 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <span>🧵</span> METRE TOPLARI ({meterRolls.length})
                  </span>
                  <span className="text-teal-300 font-mono font-bold text-xs">{formatNum(totalMeters)} mt</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5 max-h-60 overflow-y-auto pr-1">
                  {meterRolls.map((r, idx) => (
                    <div
                      key={r.id}
                      className="flex items-center justify-between px-2.5 py-1.5 bg-gray-900/90 border border-teal-800/40 text-teal-200 text-xs rounded-lg font-mono hover:border-teal-600/60 transition-colors"
                    >
                      <span className="text-teal-400 font-bold text-[11px] bg-teal-950 px-1.5 py-0.5 rounded border border-teal-900">
                        #{idx + 1}
                      </span>
                      <span className="font-semibold text-teal-100">
                        {formatNum(r.value)} <span className="text-teal-400 font-normal text-[10px]">mt</span>
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Kilo Topları */}
            {kgRolls.length > 0 && (
              <div className="p-3.5 bg-gray-950/90 rounded-xl border border-amber-900/60 shadow-inner flex flex-col">
                <div className="text-xs font-bold text-amber-400 uppercase tracking-wider mb-2.5 pb-1.5 border-b border-amber-900/60 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <span>⚖️</span> KİLO TOPLARI ({kgRolls.length})
                  </span>
                  <span className="text-amber-300 font-mono font-bold text-xs">
                    {formatNum(totalKg)} kg
                    {gramsPerMeter && gramsPerMeter > 0 && ` (≈ ${formatNum(kgEquivalentMeters)} mt)`}
                  </span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5 max-h-60 overflow-y-auto pr-1">
                  {kgRolls.map((r, idx) => {
                    const rollMeters = calculateRollMeters(r.value);
                    return (
                      <div
                        key={r.id}
                        className="flex items-center justify-between px-2.5 py-1.5 bg-gray-900/90 border border-amber-800/40 text-amber-200 text-xs rounded-lg font-mono hover:border-amber-600/60 transition-colors"
                      >
                        <span className="text-amber-400 font-bold text-[11px] bg-amber-950 px-1.5 py-0.5 rounded border border-amber-900 shrink-0">
                          #{idx + 1}
                        </span>
                        <div className="flex flex-col sm:flex-row items-end sm:items-center gap-0.5 sm:gap-1 ml-1 text-right">
                          <span className="font-semibold text-amber-100 whitespace-nowrap">
                            {formatNum(r.value)} <span className="text-amber-400 font-normal text-[10px]">kg</span>
                          </span>
                          {rollMeters !== null && (
                            <span className="text-amber-300 text-[10px] font-semibold bg-amber-950/80 px-1 py-0.5 rounded border border-amber-700/50 whitespace-nowrap">
                              ≈{formatNum(rollMeters)}m
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    );
  }

  // Interactive Form Component (Add / Edit Mode)
  return (
    <div className="bg-gray-800/90 border border-gray-700 rounded-xl p-4 space-y-4 shadow-md">
      <div className="border-b border-gray-700 pb-2.5">
        <h4 className="text-sm font-bold text-teal-400 flex items-center gap-2">
          📦 Kumaş Topları (Top Top Giriş)
        </h4>
        <p className="text-xs text-gray-400 mt-0.5">
          Her topun miktarını girin. Varsayılan <strong className="text-teal-300">mt</strong> seçilidir; tıklayarak <strong className="text-amber-300">kg</strong>&apos;ye dönüştürebilirsiniz.
        </p>
      </div>

      {/* Direct Add Row: Wide input, compact unit toggle, small + icon button */}
      <form onSubmit={handleAddRoll} className="flex items-center gap-2 bg-gray-700/60 p-2 rounded-xl border border-gray-600/60">
        <div className="text-xs font-bold text-teal-300 px-2.5 py-2 bg-gray-800 rounded-lg border border-teal-900/50 shrink-0 font-mono">
          #{totalRollsCount + 1}
        </div>
        <input
          type="number"
          step="0.01"
          value={newValue}
          onChange={e => setNewValue(e.target.value)}
          placeholder="Top miktarı girin (örn: 120)"
          className="flex-1 w-full bg-gray-800 text-gray-100 font-semibold text-sm rounded-lg px-3 py-2 focus:ring-2 focus:ring-teal-500 focus:outline-none border border-gray-600 min-w-0"
          onKeyDown={e => {
            if (e.key === 'Enter') {
              e.preventDefault();
              handleAddRoll();
            }
          }}
        />
        {/* Compact Unit Toggle Button (mt / kg) */}
        <button
          type="button"
          onClick={() => setNewUnit(newUnit === 'mt' ? 'kg' : 'mt')}
          className={`h-9 px-2.5 text-xs font-extrabold rounded-lg transition-all shadow-sm flex items-center justify-center shrink-0 cursor-pointer select-none ${
            newUnit === 'mt'
              ? 'bg-teal-600 hover:bg-teal-500 text-white ring-1 ring-teal-400'
              : 'bg-amber-600 hover:bg-amber-500 text-white ring-1 ring-amber-400'
          }`}
          title="Birim değiştirmek için tıklayın (mt / kg)"
        >
          {newUnit === 'mt' ? 'mt' : 'kg'}
        </button>
        {/* Small compact + Button (only + icon, no text) */}
        <button
          type="button"
          onClick={() => handleAddRoll()}
          className="h-9 w-9 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg transition-colors flex items-center justify-center shrink-0 shadow"
          title="Topu Listeye Ekle"
        >
          <PlusIcon className="h-4 w-4" />
        </button>
      </form>

      {/* 1 METRE KUMAŞ AĞIRLIĞI (GRAMAJ) ALANI - SADECE SARI BAŞLIK (ÜSTTE TEK SATIR) VE GİRİŞ ALANI */}
      <div className="bg-gray-900/80 p-3 rounded-xl border border-amber-500/30 space-y-2">
        <label className="block text-xs font-bold text-amber-300 flex items-center gap-1.5 whitespace-nowrap">
          <span>⚖️ 1 Metre Kumaş Ağırlığı (Gram):</span>
        </label>
        <div className="flex items-center gap-2">
          <input
            type="number"
            step="0.1"
            min="0"
            value={gramsPerMeter || ''}
            onChange={e => {
              if (!onGramsPerMeterChange) return;
              const val = parseFloat(e.target.value.replace(',', '.'));
              onGramsPerMeterChange(isNaN(val) || val <= 0 ? undefined : val);
            }}
            placeholder="Örn: 200"
            className="flex-1 w-full bg-gray-800 text-amber-300 font-extrabold text-sm rounded-lg px-3 py-2 border border-amber-500/50 focus:ring-2 focus:ring-amber-400 focus:outline-none font-mono"
          />
          <span className="text-xs font-bold text-gray-300 bg-gray-800 px-3 py-2 rounded-lg border border-gray-700 shrink-0">
            gr / mt
          </span>
        </div>
      </div>

      {/* Side-by-side Metraj ve Kilo Girdileri (2 Columns / Side by Side) */}
      <div className="space-y-3">
        {rolls.length === 0 ? (
          <div className="p-4 bg-gray-900/50 rounded-lg text-center border border-gray-800">
            <p className="text-xs text-gray-400">Henüz top kumaş girilmedi.</p>
            <p className="text-[11px] text-gray-500 mt-0.5">Yukarıdaki alandan miktar girip Enter veya + butonuna basabilirsiniz.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {/* 1. KOLON: METRE (MT) TOPLARI */}
            <div className="bg-gray-900/60 p-3 rounded-xl border border-teal-900/40 flex flex-col min-h-[140px]">
              <div className="flex justify-between items-center pb-2 mb-2 border-b border-teal-900/40">
                <span className="text-xs font-bold text-teal-400 uppercase tracking-wider flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-teal-400"></span>
                  Metre Topları ({meterRolls.length})
                </span>
                <span className="text-xs text-teal-300 font-mono font-bold bg-teal-950/80 px-2 py-0.5 rounded border border-teal-700/50">
                  {formatNum(totalMeters)} mt
                </span>
              </div>

              {meterRolls.length === 0 ? (
                <div className="flex-1 flex items-center justify-center p-3 text-center text-xs text-gray-500 italic">
                  Metre cinsinden top girilmedi
                </div>
              ) : (
                <div className="space-y-1.5 max-h-64 overflow-y-auto pr-1">
                  {meterRolls.map((roll, idx) => (
                    <div
                      key={roll.id}
                      className="flex items-center gap-1.5 bg-gray-800/90 p-1.5 rounded-lg border border-gray-700 hover:border-teal-500/50 transition-all shadow-sm"
                    >
                      <span className="text-xs font-mono font-bold text-teal-400 bg-gray-900 px-1.5 py-1 rounded min-w-[28px] text-center shrink-0">
                        #{idx + 1}
                      </span>
                      <input
                        type="number"
                        step="0.01"
                        value={roll.value || ''}
                        onChange={e => handleValueChange(roll.id, e.target.value)}
                        className="flex-1 w-full bg-gray-900 text-gray-100 text-sm font-semibold rounded px-2 py-1 focus:ring-1 focus:ring-teal-500 focus:outline-none min-w-0"
                      />
                      <button
                        type="button"
                        onClick={() => handleToggleUnit(roll.id)}
                        className="px-2 py-1 text-xs font-bold bg-teal-600 hover:bg-teal-500 text-white rounded transition-colors cursor-pointer select-none shrink-0"
                        title="Tıklayarak kg'ye dönüştürün"
                      >
                        mt
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteRoll(roll.id)}
                        className="p-1 text-gray-400 hover:text-red-400 hover:bg-gray-700 rounded transition-colors shrink-0"
                        title="Topu Sil"
                      >
                        <TrashIcon className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* 2. KOLON: KİLO (KG) TOPLARI */}
            <div className="bg-gray-900/60 p-3 rounded-xl border border-amber-900/40 flex flex-col min-h-[140px]">
              <div className="flex justify-between items-center pb-2 mb-2 border-b border-amber-900/40">
                <span className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-amber-400"></span>
                  Kilo Topları ({kgRolls.length})
                </span>
                <span className="text-xs text-amber-300 font-mono font-bold bg-amber-950/80 px-2 py-0.5 rounded border border-amber-700/50">
                  {formatNum(totalKg)} kg
                  {gramsPerMeter && gramsPerMeter > 0 && ` (≈${formatNum(kgEquivalentMeters)} mt)`}
                </span>
              </div>

              {kgRolls.length === 0 ? (
                <div className="flex-1 flex items-center justify-center p-3 text-center text-xs text-gray-500 italic">
                  Kilo cinsinden top girilmedi
                </div>
              ) : (
                <div className="space-y-1.5 max-h-64 overflow-y-auto pr-1">
                  {kgRolls.map((roll, idx) => {
                    const rollMeters = calculateRollMeters(roll.value);
                    return (
                      <div
                        key={roll.id}
                        className="flex items-center gap-1.5 bg-gray-800/90 p-1.5 rounded-lg border border-gray-700 hover:border-amber-500/50 transition-all shadow-sm"
                      >
                        <span className="text-xs font-mono font-bold text-amber-400 bg-gray-900 px-1.5 py-1 rounded min-w-[28px] text-center shrink-0">
                          #{idx + 1}
                        </span>
                        <input
                          type="number"
                          step="0.01"
                          value={roll.value || ''}
                          onChange={e => handleValueChange(roll.id, e.target.value)}
                          className="flex-1 w-full bg-gray-900 text-gray-100 text-sm font-semibold rounded px-2 py-1 focus:ring-1 focus:ring-amber-500 focus:outline-none min-w-0"
                        />
                        {/* Show converted meters if gramsPerMeter is set */}
                        {rollMeters !== null && (
                          <span className="text-[11px] font-mono text-amber-300 bg-amber-950/70 px-1.5 py-1 rounded border border-amber-700/40 shrink-0" title={`${roll.value} kg = ~${formatNum(rollMeters)} metre`}>
                            ≈{formatNum(rollMeters)}m
                          </span>
                        )}
                        <button
                          type="button"
                          onClick={() => handleToggleUnit(roll.id)}
                          className="px-2 py-1 text-xs font-bold bg-amber-600 hover:bg-amber-500 text-white rounded transition-colors cursor-pointer select-none shrink-0"
                          title="Tıklayarak mt'ye dönüştürün"
                        >
                          kg
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteRoll(roll.id)}
                          className="p-1 text-gray-400 hover:text-red-400 hover:bg-gray-700 rounded transition-colors shrink-0"
                          title="Topu Sil"
                        >
                          <TrashIcon className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* EN ALTTA METRE, KG VE GENEL TOPLAM HESABI */}
      <div className="bg-gray-900/90 rounded-xl p-3.5 border border-gray-700/80 flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-teal-400"></div>
            <div>
              <p className="text-[10px] text-gray-400 font-semibold uppercase">Metre Topları</p>
              <p className="text-sm font-extrabold text-teal-300">
                {formatNum(totalMeters)} mt <span className="text-xs font-normal text-gray-400">({meterRolls.length} Top)</span>
              </p>
            </div>
          </div>

          <div className="h-8 w-px bg-gray-700 hidden sm:block"></div>

          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-amber-400"></div>
            <div>
              <p className="text-[10px] text-gray-400 font-semibold uppercase">Kilo Topları</p>
              <p className="text-sm font-extrabold text-amber-300">
                {formatNum(totalKg)} kg <span className="text-xs font-normal text-gray-400">({kgRolls.length} Top)</span>
                {gramsPerMeter && gramsPerMeter > 0 && (
                  <span className="text-xs text-amber-200 block sm:inline sm:ml-1 font-mono font-medium">
                    (≈ {formatNum(kgEquivalentMeters)} mt)
                  </span>
                )}
              </p>
            </div>
          </div>

          {gramsPerMeter && gramsPerMeter > 0 && kgRolls.length > 0 && (
            <>
              <div className="h-8 w-px bg-gray-700 hidden sm:block"></div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse"></div>
                <div>
                  <p className="text-[10px] text-emerald-400 font-semibold uppercase">Genel Toplam Metraj</p>
                  <p className="text-base font-extrabold text-emerald-300 font-mono">
                    {formatNum(grandTotalEquivalentMeters)} mt
                  </p>
                </div>
              </div>
            </>
          )}
        </div>

        <div className="text-right sm:border-l sm:border-gray-700 sm:pl-4 pt-2 sm:pt-0 border-t border-gray-800 sm:border-t-0">
          <p className="text-[10px] text-gray-400 font-semibold uppercase">Toplam Top Sayısı</p>
          <p className="text-base font-bold text-gray-200">
            {totalRollsCount} <span className="text-xs font-normal text-gray-400">Top</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default FabricRollManager;
