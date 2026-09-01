import React, { useState, useEffect, useMemo } from 'react';
import type { Customer, Job, Settings } from '../types';
import { 
  BackIcon, 
  PlusIcon, 
  EditIcon, 
  SaveIcon, 
  MapPinIcon, 
  ShareIcon, 
  UserIcon, 
  PackageIcon 
} from './Icons';
import ConfirmationModal from './ConfirmationModal';
import Toast from './Toast';
import ImageLightbox from './ImageLightbox';
import { getAddressFromCoordinates } from '../services/locationService';
import MapSelectorModal from './MapSelectorModal';
import JobInfoModal from './JobInfoModal';
import NewJobModal from './NewJobModal';
import JobDrawerCard from './JobDrawerCard';
import JobDetailModal from './JobDetailModal';

interface CustomerDetailScreenProps {
  customer: Customer;
  setCustomers: React.Dispatch<React.SetStateAction<Customer[]>>;
  onBack: () => void;
  settings?: Settings;
  userLocation: { lat: number; lng: number } | null;
  targetJobId?: string | null;
}

const CustomerDetailScreen: React.FC<CustomerDetailScreenProps> = ({ 
  customer, 
  setCustomers, 
  onBack, 
  settings, 
  userLocation, 
  targetJobId 
}) => {
  const [isAddingJob, setIsAddingJob] = useState(false);
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);
  const [infoModalJob, setInfoModalJob] = useState<Job | null>(null);
  const [jobToDelete, setJobToDelete] = useState<string | null>(null);
  const [photoToDelete, setPhotoToDelete] = useState<{ jobId: string; photoIndex: number } | null>(null);
  const [toastInfo, setToastInfo] = useState<{ message: string, type: 'success' | 'error' } | null>(null);
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);

  // Tabs: 'active' or 'delivered'
  const [jobTab, setJobTab] = useState<'active' | 'delivered'>('active');

  // Customer Name Edit State
  const [isEditingName, setIsEditingName] = useState(false);
  const [editedName, setEditedName] = useState(customer.name);
  
  // Customer Info Edit State
  const [isEditingInfo, setIsEditingInfo] = useState(false);
  const [editedPhone, setEditedPhone] = useState(customer.phone || '');
  const [editedContact, setEditedContact] = useState(customer.contactPerson || '');
  const [editedAddress, setEditedAddress] = useState(customer.address || '');
  const [editedLocation, setEditedLocation] = useState(customer.location);
  const [isFetchingLocation, setIsFetchingLocation] = useState(false);
  const [isMapOpen, setIsMapOpen] = useState(false);

  // Separate Active and Delivered Jobs
  const activeJobs = useMemo(() => customer.jobs?.filter(j => j.status !== 'delivered') || [], [customer.jobs]);
  const deliveredJobs = useMemo(() => customer.jobs?.filter(j => j.status === 'delivered') || [], [customer.jobs]);

  // Selected job for the full isolated detail modal
  const selectedJob = useMemo(() => {
    if (!selectedJobId) return null;
    return customer.jobs?.find(j => j.id === selectedJobId) || null;
  }, [customer.jobs, selectedJobId]);

  // Handle targetJobId transition from Home
  useEffect(() => {
    if (targetJobId) {
      const isTargetDelivered = customer.jobs?.some(j => j.id === targetJobId && j.status === 'delivered');
      if (isTargetDelivered) {
        setJobTab('delivered');
      } else {
        setJobTab('active');
      }
      setSelectedJobId(targetJobId);
    }
  }, [targetJobId, customer.jobs]);

  useEffect(() => { 
    setEditedName(customer.name);
    setEditedPhone(customer.phone || '');
    setEditedContact(customer.contactPerson || '');
    setEditedAddress(customer.address || '');
    setEditedLocation(customer.location);
  }, [customer]);

  const handleAddNewJob = (newJob: Job) => {
    setCustomers(prev => prev.map(c => c.id === customer.id ? { ...c, jobs: [newJob, ...c.jobs] } : c));
    setIsAddingJob(false);
    setJobTab('active');
    setToastInfo({ message: "Yeni iş başarıyla eklendi.", type: 'success' });
  };
  
  const handleSaveJob = (updatedJob: Job) => {
    setCustomers(prev => prev.map(c => c.id === customer.id ? { ...c, jobs: c.jobs.map(j => j.id === updatedJob.id ? updatedJob : j) } : c));
    setToastInfo({ message: "İş bilgileri güncellendi.", type: 'success' });
  };

  const handleToggleDelivery = (jobId: string, newStatus: 'active' | 'delivered') => {
    const deliveredAt = newStatus === 'delivered' ? new Date().toISOString() : undefined;
    setCustomers(prev => prev.map(c => c.id === customer.id ? {
      ...c,
      jobs: c.jobs.map(j => j.id === jobId ? { ...j, status: newStatus, deliveredAt } : j)
    } : c));

    if (newStatus === 'delivered') {
      setToastInfo({ message: "İş teslim edildi olarak işaretlendi ve Teslim Edilenler sekmesine taşındı.", type: 'success' });
    } else {
      setToastInfo({ message: "İş tekrar Aktif İşler sekmesine alındı.", type: 'success' });
    }
  };

  const handlePhotoUpload = (jobId: string, base64Photos: string[]) => {
    setCustomers(prev => prev.map(c => c.id === customer.id ? {
      ...c,
      jobs: c.jobs.map(j => j.id === jobId ? { ...j, photos: [...(j.photos || []), ...base64Photos] } : j)
    } : c));
    setToastInfo({ message: `${base64Photos.length} fotoğraf eklendi.`, type: 'success' });
  };

  const handleDeleteRequest = (jobId: string) => setJobToDelete(jobId);
  const handleConfirmDelete = () => {
    if (!jobToDelete) return;
    setCustomers(prev => prev.map(c => c.id === customer.id ? { ...c, jobs: c.jobs.filter(job => job.id !== jobToDelete) } : c));
    if (selectedJobId === jobToDelete) {
      setSelectedJobId(null);
    }
    setJobToDelete(null);
    setToastInfo({ message: "İş başarıyla silindi.", type: 'success' });
  };
  
  const handleDeletePhotoRequest = (jobId: string, photoIndex: number) => {
    setPhotoToDelete({ jobId, photoIndex });
  };

  const handleConfirmPhotoDelete = () => {
    if (!photoToDelete) return;
    const { jobId, photoIndex } = photoToDelete;

    setCustomers(prevCustomers => prevCustomers.map(c => {
      if (c.id === customer.id) {
        return {
          ...c,
          jobs: c.jobs.map(j => {
            if (j.id === jobId) {
              const updatedPhotos = j.photos?.filter((_, index) => index !== photoIndex);
              return { ...j, photos: updatedPhotos };
            }
            return j;
          })
        };
      }
      return c;
    }));

    setPhotoToDelete(null);
  };

  const handleSaveName = () => {
    if (editedName.trim() === '') return;
    setCustomers(prev => prev.map(c => c.id === customer.id ? { ...c, name: editedName.trim() } : c));
    setIsEditingName(false);
  };

  const handleSaveInfo = () => {
    setCustomers(prev => prev.map(c => c.id === customer.id ? { 
      ...c, 
      phone: editedPhone.trim(),
      contactPerson: editedContact.trim(),
      address: editedAddress.trim(),
      location: editedLocation
    } : c));
    setIsEditingInfo(false);
    setToastInfo({ message: "Müşteri bilgileri güncellendi.", type: 'success' });
  };

  const handleCancelEditInfo = () => {
    setEditedPhone(customer.phone || '');
    setEditedContact(customer.contactPerson || '');
    setEditedAddress(customer.address || '');
    setEditedLocation(customer.location);
    setIsEditingInfo(false);
  };
  
  const handleLocationSelectFromMap = async (location: { lat: number; lng: number }) => {
    setIsMapOpen(false);
    setIsFetchingLocation(true);
    try {
      const address = await getAddressFromCoordinates(location.lat, location.lng);
      setEditedAddress(address);
      setEditedLocation(location);
      setToastInfo({ message: "Adres haritadan alındı.", type: 'success' });
    } catch (error) {
      console.error("Failed to fetch address:", error);
      setToastInfo({ message: 'Adres bilgisi alınamadı.', type: 'error' });
    } finally {
      setIsFetchingLocation(false);
    }
  };
  
  const handleShareLocation = async () => {
    if (navigator.share && customer.location) {
      const mapUrl = `https://www.google.com/maps?q=${customer.location.lat},${customer.location.lng}`;
      try {
        await navigator.share({
          title: `${customer.name} Konumu`,
          text: `${customer.name} için adres bilgisi.`,
          url: mapUrl,
        });
      } catch (error) {
        console.error('Error sharing location:', error);
      }
    }
  };

  return (
    <div className="space-y-6">
      {toastInfo && <Toast message={toastInfo.message} type={toastInfo.type} show={!!toastInfo} onClose={() => setToastInfo(null)} />}
      
      {/* Top Bar / Header */}
      <div className="flex justify-between items-center">
        <button onClick={onBack} className="flex items-center gap-1.5 text-teal-400 hover:text-teal-300 font-semibold transition-colors cursor-pointer">
          <BackIcon /> Geri
        </button>
        {isEditingName ? (
          <div className="flex-grow flex items-center gap-2 mx-4">
            <input type="text" value={editedName} onChange={(e) => setEditedName(e.target.value)} className="w-full bg-gray-700 text-gray-100 rounded-lg p-2 text-xl font-bold focus:ring-2 focus:ring-teal-500 focus:outline-none border border-gray-600" autoFocus />
            <button onClick={handleSaveName} className="px-3 py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-500 text-sm cursor-pointer">Kaydet</button>
            <button onClick={() => setIsEditingName(false)} className="px-3 py-2 bg-gray-600 text-white font-semibold rounded-lg hover:bg-gray-500 text-sm cursor-pointer">İptal</button>
          </div>
        ) : (
          <div className="flex items-center gap-2.5">
            <h2 className="text-2xl font-extrabold text-teal-400 truncate text-center">{customer.name}</h2>
            <button onClick={() => setIsEditingName(true)} className="text-gray-400 hover:text-teal-300 p-1 cursor-pointer" title="İsmi Düzenle"><EditIcon className="h-4 w-4" /></button>
          </div>
        )}
        <div className="w-12"></div>
      </div>
      
      {/* Customer Info Section */}
      <div className="bg-gray-800/90 border border-gray-700/80 p-4 rounded-xl shadow-md">
        <div className="flex justify-between items-center mb-3 border-b border-gray-700 pb-2">
          <h3 className="text-sm font-bold text-gray-300 flex items-center gap-2">
            <UserIcon className="h-4 w-4 text-teal-400" /> Müşteri Bilgileri
          </h3>
          {!isEditingInfo && <button onClick={() => setIsEditingInfo(true)} className="text-teal-400 hover:text-teal-300 flex items-center gap-1 text-xs font-semibold cursor-pointer"><EditIcon className="h-3.5 w-3.5" /> Düzenle</button>}
        </div>
        {isEditingInfo ? (
          <div className="space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input type="tel" value={editedPhone} onChange={e => setEditedPhone(e.target.value)} placeholder="Telefon Numarası" className="w-full bg-gray-700 text-gray-200 rounded-lg p-2.5 focus:ring-2 focus:ring-teal-500 focus:outline-none text-sm"/>
              <input type="text" value={editedContact} onChange={e => setEditedContact(e.target.value)} placeholder="Yetkili Kişi" className="w-full bg-gray-700 text-gray-200 rounded-lg p-2.5 focus:ring-2 focus:ring-teal-500 focus:outline-none text-sm"/>
            </div>
            <textarea value={editedAddress} onChange={e => setEditedAddress(e.target.value)} placeholder="Adres..." rows={2} className="w-full bg-gray-700 text-gray-200 rounded-lg p-2.5 focus:ring-2 focus:ring-teal-500 focus:outline-none text-sm"/>
            <button type="button" onClick={() => setIsMapOpen(true)} disabled={isFetchingLocation} className="w-full text-center px-4 py-2 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-500 transition-colors text-sm disabled:opacity-50 cursor-pointer">
              {isFetchingLocation ? 'Adres Aranıyor...' : '📍 Haritadan Seç'}
            </button>
            <div className="flex justify-end gap-2 pt-1"><button type="button" onClick={handleCancelEditInfo} className="px-3 py-1.5 bg-gray-600 text-white text-xs font-semibold rounded-lg hover:bg-gray-500 cursor-pointer">İptal</button><button onClick={handleSaveInfo} className="px-3 py-1.5 bg-green-600 text-white text-xs font-semibold rounded-lg hover:bg-green-500 flex items-center gap-1 cursor-pointer"><SaveIcon className="h-3.5 w-3.5"/> Kaydet</button></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
            <p><strong className="text-gray-400 block font-medium">Telefon:</strong> <span className="text-gray-200 font-semibold">{customer.phone || 'Belirtilmemiş'}</span></p>
            <p><strong className="text-gray-400 block font-medium">Yetkili:</strong> <span className="text-gray-200 font-semibold">{customer.contactPerson || 'Belirtilmemiş'}</span></p>
            <p><strong className="text-gray-400 block font-medium">Adres:</strong> <span className="text-gray-200">{customer.address || 'Belirtilmemiş'}</span></p>
            {customer.location && (
              <div className="flex items-center gap-3 col-span-full pt-1">
                <a href={`https://www.google.com/maps?q=${customer.location.lat},${customer.location.lng}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-blue-400 hover:text-blue-300 text-xs font-medium">
                  <MapPinIcon className="h-3.5 w-3.5" /> Haritada Aç
                </a>
                {navigator.share && (
                  <button onClick={handleShareLocation} className="inline-flex items-center gap-1 text-blue-400 hover:text-blue-300 text-xs font-medium cursor-pointer">
                    <ShareIcon className="h-3.5 w-3.5" /> Konumu Paylaş
                  </button>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Jobs Section Header */}
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-xl font-bold text-gray-100">İşler ve Top Takibi</h3>
          <p className="text-xs text-gray-400">Bu müşteriye ait iş kayıtları ve kumaş girişleri</p>
        </div>
        <button 
          onClick={() => setIsAddingJob(true)} 
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-teal-600 hover:bg-teal-500 text-white text-sm font-bold rounded-xl transition-all shadow-md hover:shadow-teal-500/20 cursor-pointer"
        >
          <PlusIcon /> Yeni İş Ekle
        </button>
      </div>

      {/* New Job Modal Window */}
      <NewJobModal
        isOpen={isAddingJob}
        onClose={() => setIsAddingJob(false)}
        onAddJob={handleAddNewJob}
        customer={customer}
        onShowToast={(msg, type) => setToastInfo({ message: msg, type })}
      />

      <MapSelectorModal isOpen={isMapOpen} onClose={() => setIsMapOpen(false)} onLocationSelect={handleLocationSelectFromMap} userLocation={userLocation} />

      {/* Tabs for Active Jobs vs Delivered Jobs */}
      <div className="flex items-center gap-2 p-1.5 bg-gray-800/90 rounded-xl border border-gray-700/80 shadow-md">
        <button
          type="button"
          onClick={() => setJobTab('active')}
          className={`flex-1 py-2.5 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${jobTab === 'active' ? 'bg-amber-600 text-white shadow-md' : 'text-gray-400 hover:text-gray-200 hover:bg-gray-700/50'}`}
        >
          <span>⚡ Aktif İşler (İmalatta)</span>
          <span className={`px-2 py-0.5 rounded-full text-[11px] font-mono ${jobTab === 'active' ? 'bg-amber-800 text-white' : 'bg-gray-700 text-gray-300'}`}>
            {activeJobs.length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setJobTab('delivered')}
          className={`flex-1 py-2.5 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${jobTab === 'delivered' ? 'bg-emerald-600 text-white shadow-md' : 'text-gray-400 hover:text-gray-200 hover:bg-gray-700/50'}`}
        >
          <span className="flex items-center gap-1"><PackageIcon className="h-3.5 w-3.5" /> Teslim Edilenler</span>
          <span className={`px-2 py-0.5 rounded-full text-[11px] font-mono ${jobTab === 'delivered' ? 'bg-emerald-800 text-white' : 'bg-gray-700 text-gray-300'}`}>
            {deliveredJobs.length}
          </span>
        </button>
      </div>

      {/* Jobs Summary Drawers List */}
      <ul className="space-y-3">
        {(jobTab === 'active' ? activeJobs : deliveredJobs).length > 0 ? (
          (jobTab === 'active' ? activeJobs : deliveredJobs).map(job => (
            <JobDrawerCard
              key={job.id}
              job={job}
              customer={customer}
              onOpenDetail={(jobId) => setSelectedJobId(jobId)}
              onToggleDelivery={handleToggleDelivery}
              onDeleteRequest={handleDeleteRequest}
              onOpenInfoModal={(j) => setInfoModalJob(j)}
            />
          ))
        ) : (
          <div className="bg-gray-800/60 border border-gray-700/60 rounded-2xl p-8 text-center space-y-2">
            {jobTab === 'active' ? (
              <>
                <p className="text-gray-300 font-semibold text-sm">Bu müşteri için imalatta aktif iş bulunmuyor.</p>
                <p className="text-xs text-gray-500">Yukarıdaki &apos;Yeni İş Ekle&apos; butonuna tıklayarak model ve kumaş topu girişi yapabilirsiniz veya &apos;Teslim Edilenler&apos; sekmesine bakabilirsiniz.</p>
              </>
            ) : (
              <>
                <p className="text-gray-300 font-semibold text-sm">Bu müşteriye ait henüz teslim edilmiş bir iş bulunmuyor.</p>
                <p className="text-xs text-gray-500">Aktif işler bittiğinde &apos;Teslim Et&apos; butonuna basarak bu listeye aktarabilirsiniz.</p>
              </>
            )}
          </div>
        )}
      </ul>

      {/* Dedicated Isolated Full Job Detail Modal */}
      {selectedJob && (
        <JobDetailModal
          isOpen={!!selectedJob}
          onClose={() => setSelectedJobId(null)}
          job={selectedJob}
          customer={customer}
          onSaveJob={handleSaveJob}
          onDeleteJob={handleDeleteRequest}
          onToggleDelivery={handleToggleDelivery}
          onImageClick={setLightboxImage}
          onDeletePhotoRequest={handleDeletePhotoRequest}
          onPhotoUpload={handlePhotoUpload}
        />
      )}

      {/* Direct Info Modal Trigger from drawer */}
      {infoModalJob && (
        <JobInfoModal
          isOpen={!!infoModalJob}
          onClose={() => setInfoModalJob(null)}
          job={infoModalJob}
          customer={customer}
        />
      )}

      {lightboxImage && <ImageLightbox src={lightboxImage} onClose={() => setLightboxImage(null)} />}

      <ConfirmationModal 
        isOpen={!!jobToDelete} 
        onClose={() => setJobToDelete(null)} 
        onConfirm={handleConfirmDelete} 
        title="İşi Silmeyi Onayla"
      >
        <p>Bu iş kaydını ve ilgili tüm verileri kalıcı olarak silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.</p>
      </ConfirmationModal>
      
      <ConfirmationModal
        isOpen={!!photoToDelete}
        onClose={() => setPhotoToDelete(null)}
        onConfirm={handleConfirmPhotoDelete}
        title="Fotoğrafı Silmeyi Onayla"
      >
        <p>Bu fotoğrafı kalıcı olarak silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.</p>
      </ConfirmationModal>
    </div>
  );
};

export default CustomerDetailScreen;
