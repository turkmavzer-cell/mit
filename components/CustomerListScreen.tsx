import React, { useState, useMemo } from 'react';
import type { Customer, Settings } from '../types';
import { PlusIcon, TrashIcon, SearchIcon, SortIcon, XIcon, CustomersIcon } from './Icons';
import ConfirmationModal from './ConfirmationModal';

interface CustomerListScreenProps {
  customers: Customer[];
  setCustomers: React.Dispatch<React.SetStateAction<Customer[]>>;
  onSelectCustomer: (customerId: string) => void;
  settings: Settings;
}

type SortOption = 'alpha_asc' | 'alpha_desc' | 'most_jobs' | 'newest' | 'oldest' | 'recent_activity';

const CustomerListScreen: React.FC<CustomerListScreenProps> = ({ customers, setCustomers, onSelectCustomer, settings }) => {
  const [newCustomerName, setNewCustomerName] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [customerToDelete, setCustomerToDelete] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('alpha_asc');

  const handleAddCustomer = (e: React.FormEvent) => {
    e.preventDefault();
    if (newCustomerName.trim() === '') return;

    const newCustomer: Customer = {
      id: Date.now().toString(),
      name: newCustomerName.trim(),
      jobs: [],
    };
    setCustomers(prev => [...prev, newCustomer]);
    setNewCustomerName('');
    setIsAdding(false);
  };

  const handleDeleteCustomer = () => {
    if (customerToDelete) {
      setCustomers(prev => prev.filter(c => c.id !== customerToDelete));
      setCustomerToDelete(null);
    }
  };

  const getCustomerSummary = (customer: Customer) => {
    const jobCount = customer.jobs?.length || 0;
    let totalRolls = 0;
    let totalMeters = 0;
    let latestJobDate = 0;

    customer.jobs?.forEach(j => {
      if (j.createdAt) {
        const time = new Date(j.createdAt).getTime();
        if (time > latestJobDate) latestJobDate = time;
      }
      if (j.fabricRolls) {
        totalRolls += j.fabricRolls.length;
        j.fabricRolls.forEach(r => {
          if (r.unit === 'mt') {
            totalMeters += Number(r.value) || 0;
          }
        });
      }
    });

    return { jobCount, totalRolls, totalMeters, latestJobDate };
  };

  // Filtered and Sorted Customers
  const processedCustomers = useMemo(() => {
    // 1. Search filter
    const query = searchTerm.trim().toLocaleLowerCase('tr');
    let filtered = customers;

    if (query) {
      filtered = customers.filter(c => {
        const nameMatch = c.name?.toLocaleLowerCase('tr').includes(query);
        const contactMatch = c.contactPerson?.toLocaleLowerCase('tr').includes(query);
        const phoneMatch = c.phone?.toLowerCase().includes(query);
        const addressMatch = c.address?.toLocaleLowerCase('tr').includes(query);
        return nameMatch || contactMatch || phoneMatch || addressMatch;
      });
    }

    // 2. Sorting
    const sorted = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case 'alpha_asc':
          return (a.name || '').localeCompare(b.name || '', 'tr', { sensitivity: 'base' });
        case 'alpha_desc':
          return (b.name || '').localeCompare(a.name || '', 'tr', { sensitivity: 'base' });
        case 'most_jobs': {
          const aJobs = a.jobs?.length || 0;
          const bJobs = b.jobs?.length || 0;
          if (bJobs !== aJobs) return bJobs - aJobs;
          return (a.name || '').localeCompare(b.name || '', 'tr', { sensitivity: 'base' });
        }
        case 'newest': {
          const aId = Number(a.id) || 0;
          const bId = Number(b.id) || 0;
          return bId - aId;
        }
        case 'oldest': {
          const aId = Number(a.id) || 0;
          const bId = Number(b.id) || 0;
          return aId - bId;
        }
        case 'recent_activity': {
          const aLatest = a.jobs?.reduce((max, j) => Math.max(max, j.createdAt ? new Date(j.createdAt).getTime() : 0), 0) || 0;
          const bLatest = b.jobs?.reduce((max, j) => Math.max(max, j.createdAt ? new Date(j.createdAt).getTime() : 0), 0) || 0;
          if (bLatest !== aLatest) return bLatest - aLatest;
          return (a.name || '').localeCompare(b.name || '', 'tr', { sensitivity: 'base' });
        }
        default:
          return (a.name || '').localeCompare(b.name || '', 'tr', { sensitivity: 'base' });
      }
    });

    return sorted;
  }, [customers, searchTerm, sortBy]);

  return (
    <div className="space-y-4">
      {isAdding ? (
        <form onSubmit={handleAddCustomer} className="p-4 bg-gray-800 rounded-xl shadow-lg border border-gray-700">
          <label className="block text-xs font-semibold text-gray-300 mb-1.5">Yeni Müşteri / Firma Adı</label>
          <input
            type="text"
            value={newCustomerName}
            onChange={(e) => setNewCustomerName(e.target.value)}
            placeholder="Örn: ABC Tekstil"
            className="w-full bg-gray-700 text-gray-200 rounded-lg p-3 focus:ring-2 focus:ring-teal-500 focus:outline-none transition border border-gray-600"
            autoFocus
          />
          <div className="flex justify-end gap-2.5 mt-3">
             <button type="button" onClick={() => setIsAdding(false)} className="px-4 py-2 bg-gray-700 text-gray-300 font-semibold rounded-lg hover:bg-gray-600 transition-colors text-sm cursor-pointer">
              İptal
            </button>
            <button type="submit" className="px-5 py-2 bg-teal-600 text-white font-bold rounded-lg hover:bg-teal-500 transition-colors shadow-md text-sm cursor-pointer">
              Müşteriyi Ekle
            </button>
          </div>
        </form>
      ) : (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-gray-100">Müşteriler</h2>
              <span className="text-xs font-bold font-mono px-2 py-0.5 bg-gray-800 text-teal-300 border border-gray-700 rounded-md">
                {customers.length} Müşteri
              </span>
            </div>
            <p className="text-xs text-gray-400 mt-0.5">İş ve kumaş top takibi için müşteri seçin</p>
          </div>
          <button 
            onClick={() => setIsAdding(true)} 
            className="inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-teal-600 text-white font-bold rounded-xl hover:bg-teal-500 transition-colors shadow-md text-sm cursor-pointer shrink-0"
          >
            <PlusIcon /> Yeni Müşteri
          </button>
        </div>
      )}

      {/* Arama ve Sıralama Çubuğu */}
      {customers.length > 0 && (
        <div className="bg-gray-800/80 border border-gray-700/80 p-3 rounded-xl shadow-xs flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
          {/* Arama Kutusu */}
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
              <SearchIcon className="h-4 w-4" />
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Müşteri adı veya yetkili ara..."
              className="w-full bg-gray-900/90 text-gray-100 text-sm rounded-lg pl-9 pr-8 py-2 border border-gray-700 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 focus:outline-none placeholder-gray-500 transition-colors"
            />
            {searchTerm && (
              <button
                type="button"
                onClick={() => setSearchTerm('')}
                className="absolute inset-y-0 right-0 pr-2.5 flex items-center text-gray-400 hover:text-gray-200 cursor-pointer"
                title="Aramayı Temizle"
              >
                <XIcon />
              </button>
            )}
          </div>

          {/* Sıralama Seçeneği */}
          <div className="flex items-center gap-2 shrink-0">
            <div className="flex items-center gap-1.5 bg-gray-900/90 border border-gray-700 rounded-lg px-2.5 py-1.5">
              <SortIcon className="h-4 w-4 text-teal-400 shrink-0" />
              <label htmlFor="customer-sort-select" className="text-xs text-gray-400 font-medium whitespace-nowrap">Sırala:</label>
              <select
                id="customer-sort-select"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="bg-transparent text-xs font-semibold text-gray-200 focus:outline-none cursor-pointer pr-1"
              >
                <option value="alpha_asc" className="bg-gray-800 text-gray-100">Alfabetik (A - Z)</option>
                <option value="alpha_desc" className="bg-gray-800 text-gray-100">Alfabetik (Z - A)</option>
                <option value="most_jobs" className="bg-gray-800 text-gray-100">En Çok İş Gönderen</option>
                <option value="recent_activity" className="bg-gray-800 text-gray-100">En Son İş Gönderen</option>
                <option value="newest" className="bg-gray-800 text-gray-100">En Son Eklenen</option>
                <option value="oldest" className="bg-gray-800 text-gray-100">En İlk Eklenen</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Müşteri Listesi veya Boş Durum */}
      {customers.length === 0 ? (
        <div className="bg-gray-800/60 border border-gray-700/60 rounded-xl p-8 text-center space-y-2">
          <p className="text-gray-400 font-medium">Henüz müşteri eklenmemiş.</p>
          <p className="text-xs text-gray-500">&apos;Yeni Müşteri&apos; butonuna tıklayarak ilk müşterinizi oluşturabilirsiniz.</p>
        </div>
      ) : processedCustomers.length === 0 ? (
        <div className="bg-gray-800/60 border border-gray-700/60 rounded-xl p-8 text-center space-y-3">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gray-700/50 text-gray-400">
            <SearchIcon className="h-6 w-6" />
          </div>
          <p className="text-gray-300 font-semibold text-sm">
            &apos;<span className="text-teal-300">{searchTerm}</span>&apos; ile eşleşen müşteri bulunamadı.
          </p>
          <button
            type="button"
            onClick={() => setSearchTerm('')}
            className="px-3.5 py-1.5 bg-gray-700 hover:bg-gray-600 text-gray-200 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
          >
            Aramayı Temizle
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {processedCustomers.map(customer => {
            const { jobCount, totalRolls, totalMeters } = getCustomerSummary(customer);
            return (
              <div 
                key={customer.id} 
                onClick={() => onSelectCustomer(customer.id)} 
                className="bg-gray-800/90 border border-gray-700/80 p-4 rounded-xl shadow-md transition-all hover:bg-gray-700/90 hover:border-teal-500/50 cursor-pointer flex flex-col justify-between relative group"
              >
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setCustomerToDelete(customer.id);
                  }}
                  className="absolute top-3 right-3 p-1.5 text-gray-500 hover:text-red-400 hover:bg-gray-800 rounded-lg transition-all opacity-80 group-hover:opacity-100"
                  aria-label="Müşteriyi Sil"
                  title="Müşteriyi Sil"
                >
                  <TrashIcon className="h-4 w-4" />
                </button>

                <div className="pr-6">
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-lg text-teal-300 truncate">{customer.name}</h3>
                  </div>
                  {customer.contactPerson && (
                    <p className="text-xs text-gray-400 mt-0.5">{customer.contactPerson}</p>
                  )}
                  {customer.phone && (
                    <p className="text-[11px] text-gray-500 mt-0.5">{customer.phone}</p>
                  )}
                </div>

                <div className="mt-4 pt-3 border-t border-gray-700/60 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5 text-gray-300">
                    <span className="font-bold text-teal-400 font-mono">{jobCount}</span>
                    <span className="text-gray-400">İş</span>
                  </div>
                  {totalRolls > 0 ? (
                    <div className="text-right">
                      <span className="font-bold text-amber-300 font-mono">{totalRolls} Top</span>
                      {totalMeters > 0 && (
                        <span className="text-gray-400 font-mono ml-1">({Math.round(totalMeters)} m)</span>
                      )}
                    </div>
                  ) : (
                    <span className="text-gray-500 text-[11px] italic">Kayıtlı top yok</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      <ConfirmationModal
        isOpen={!!customerToDelete}
        onClose={() => setCustomerToDelete(null)}
        onConfirm={handleDeleteCustomer}
        title="Müşteriyi Sil"
        settings={settings}
      >
        <p>Bu müşteriyi ve tüm iş geçmişini silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.</p>
      </ConfirmationModal>
    </div>
  );
};

export default CustomerListScreen;

