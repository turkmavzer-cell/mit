import React, { useMemo } from 'react';
import type { Customer, View, Job } from '../types';
import { CustomersIcon, ArrowRightIcon, CalendarIcon } from './Icons';

interface HomeScreenProps {
  customers: Customer[];
  onNavigate: (view: View) => void;
  onSelectCustomerJob?: (customerId: string, jobId: string) => void;
}

interface ActiveJobItem {
  customer: Customer;
  job: Job;
}

const HomeScreen: React.FC<HomeScreenProps> = ({ customers, onNavigate, onSelectCustomerJob }) => {
  // Collect all active jobs across all customers
  const activeJobsList: ActiveJobItem[] = useMemo(() => {
    const list: ActiveJobItem[] = [];
    customers.forEach(c => {
      c.jobs?.forEach(j => {
        if (j.status !== 'delivered') {
          list.push({ customer: c, job: j });
        }
      });
    });
    // Sort by createdAt descending
    return list.sort((a, b) => new Date(b.job.createdAt).getTime() - new Date(a.job.createdAt).getTime());
  }, [customers]);

  const activeJobsCount = activeJobsList.length;

  const formatDate = (isoString?: string) => {
    if (!isoString) return '';
    const date = new Date(isoString);
    return date.toLocaleDateString('tr-TR', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };

  const handleJobClick = (customerId: string, jobId: string) => {
    if (onSelectCustomerJob) {
      onSelectCustomerJob(customerId, jobId);
    } else {
      onNavigate('customers');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-extrabold text-gray-100">Ana Sayfa</h2>
        <p className="text-xs text-gray-400 mt-1">İmalattaki aktif işlerinizi ve müşteri takiplerinizi yönetin.</p>
      </div>

      {/* Top Stat Cards: Only Müşteri Sayısı and Aktif İş Sayısı */}
      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={() => onNavigate('customers')}
          className="bg-gray-800/90 border border-gray-700/80 hover:border-teal-500/50 p-4 rounded-xl text-center shadow-md flex flex-col justify-center transition-all hover:bg-gray-700/70 text-left"
        >
          <p className="text-3xl font-extrabold text-teal-400">{customers.length}</p>
          <p className="text-xs text-gray-300 font-semibold mt-1">Müşteri Sayısı</p>
          <span className="text-[11px] text-teal-400/80 mt-0.5 flex items-center justify-center gap-0.5">
            Müşterileri Gör &rarr;
          </span>
        </button>

        <div className="bg-gradient-to-br from-gray-800 to-gray-800/90 border border-amber-500/40 p-4 rounded-xl text-center shadow-md flex flex-col justify-center">
          <div className="flex items-center justify-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-amber-400 animate-pulse"></span>
            <p className="text-3xl font-extrabold text-amber-400">{activeJobsCount}</p>
          </div>
          <p className="text-xs text-amber-300 font-semibold mt-1">İmalattaki Aktif İşler</p>
          <span className="text-[11px] text-gray-400 mt-0.5">
            {activeJobsCount > 0 ? 'Farklı müşterilerden devam eden' : 'Şu an imalatta iş yok'}
          </span>
        </div>
      </div>

      {/* Navigation Card: Only Customers */}
      <div>
        <button
          onClick={() => onNavigate('customers')}
          className="bg-gray-800/90 border border-gray-700/80 p-4 rounded-xl shadow-lg text-left w-full transition-all duration-200 hover:bg-gray-700/90 hover:border-teal-500/50 focus:outline-none focus:ring-2 focus:ring-teal-500"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3.5">
              <div className="bg-gray-900/80 p-3 rounded-xl text-teal-400 border border-gray-700/60 shadow-inner">
                <CustomersIcon />
              </div>
              <div>
                <h3 className="text-base font-bold text-gray-100">Müşteriler Listesi</h3>
                <p className="text-xs text-gray-400 mt-0.5">Müşteri detaylarına gidin ve yeni işler ekleyin.</p>
              </div>
            </div>
            <div className="text-gray-400 pr-2">
              <ArrowRightIcon className="h-5 w-5" />
            </div>
          </div>
        </button>
      </div>

      {/* Active Jobs in Production (Farklı Müşterilerden İmalattaki İşler) */}
      <div className="space-y-3 pt-1">
        <div className="flex items-center justify-between border-b border-gray-700 pb-2">
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-amber-400"></span>
            <h3 className="text-lg font-bold text-gray-100">İmalattaki İşler</h3>
            <span className="bg-amber-900/60 text-amber-300 text-xs px-2 py-0.5 rounded-full font-bold border border-amber-600/40">
              {activeJobsCount} Aktif
            </span>
          </div>
          <span className="text-[11px] text-gray-400">Tıklayarak ilgili işe gidin</span>
        </div>

        {activeJobsList.length === 0 ? (
          <div className="bg-gray-800/60 border border-gray-700/60 rounded-xl p-8 text-center space-y-2">
            <p className="text-gray-300 font-semibold text-sm">Şu anda imalatta aktif iş bulunmuyor.</p>
            <p className="text-xs text-gray-500">
              Müşteri detayından yeni iş ekleyebilir veya teslim edilen işleri inceleyebilirsiniz.
            </p>
          </div>
        ) : (
          <div className="space-y-2.5">
            {activeJobsList.map(({ customer, job }) => {
              const rollCount = job.fabricRolls?.length || 0;

              return (
                <div
                  key={job.id}
                  onClick={() => handleJobClick(customer.id, job.id)}
                  className="bg-gray-800/90 border border-gray-700/80 hover:border-amber-500/60 p-4 rounded-xl shadow-md cursor-pointer transition-all hover:bg-gray-750 hover:shadow-lg group"
                >
                  <div className="flex justify-between items-start gap-3">
                    <div className="space-y-1.5 flex-1 min-w-0">
                      {/* Customer Badge */}
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-teal-900/60 text-teal-300 border border-teal-700/50 truncate max-w-[200px]">
                          👤 {customer.name}
                        </span>
                        <span className="inline-flex items-center gap-1 text-[11px] text-amber-400 font-medium">
                          ⚡ İmalatta
                        </span>
                      </div>

                      {/* Job Name */}
                      <h4 className="text-base font-bold text-gray-100 group-hover:text-amber-300 transition-colors truncate">
                        {job.name}
                      </h4>

                      {/* Job Metadata Badges */}
                      <div className="flex flex-wrap items-center gap-2 text-xs text-gray-400 pt-0.5">
                        <span className="flex items-center gap-1">
                          <CalendarIcon /> {formatDate(job.createdAt)}
                        </span>
                        {job.fabricType && (
                          <span className="bg-gray-700/80 px-2 py-0.5 rounded text-gray-300">
                            🧵 {job.fabricType} {job.fabricColor ? `(${job.fabricColor})` : ''}
                          </span>
                        )}
                        {rollCount > 0 && (
                          <span className="bg-gray-700/80 px-2 py-0.5 rounded text-teal-300 font-mono font-semibold">
                            📦 {rollCount} Top
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Go to Job Action Button */}
                    <div className="flex items-center self-center pl-2">
                      <button
                        type="button"
                        className="px-3 py-1.5 bg-amber-500/20 group-hover:bg-amber-500 text-amber-300 group-hover:text-gray-900 font-bold text-xs rounded-lg transition-all border border-amber-500/40 flex items-center gap-1 shadow-sm whitespace-nowrap"
                      >
                        İşe Git
                        <ArrowRightIcon className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default HomeScreen;
