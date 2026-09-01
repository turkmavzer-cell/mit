import React, { useState, useEffect } from 'react';
import type { Customer, Task, View, Settings } from './types';
import { useLocalStorage } from './hooks/useLocalStorage';
import CustomerListScreen from './components/CustomerListScreen';
import HomeScreen from './components/HomeScreen';
import SplashScreen from './components/SplashScreen';
import { CustomersIcon, HomeIcon, SettingsIcon } from './components/Icons';
import CustomerDetailScreen from './components/CustomerDetailScreen';
import SettingsScreen from './components/SettingsScreen';
import DailyBackupReminderModal from './components/DailyBackupReminderModal';
import BackupExportModal from './components/BackupExportModal';
import Toast from './components/Toast';

const defaultSettings: Settings = {
    companyName: 'mechi a.ş',
    companyAddress: 'Örnek Mah. Sanayi Cad. No:123\n34000, Sanayi Bölgesi / İstanbul',
    companyPhoneNumbers: ['+90 (212) 555 00 00'],
    companyEmail: 'info@mechi.com',
    companyTaxNumber: '1234567890',
};

const App: React.FC = () => {
  const [customers, setCustomers] = useLocalStorage<Customer[]>('customers', []);
  const [tasks, setTasks] = useLocalStorage<Task[]>('tasks', []);
  const [settings, setSettings] = useLocalStorage<Settings>('settings', defaultSettings);
  const [currentView, setCurrentView] = useState<View>('home');
  const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(null);
  const [targetJobId, setTargetJobId] = useState<string | null>(null);
  const [userLocation, setUserLocation] = useState<{lat: number, lng: number} | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isBackupExportModalOpen, setIsBackupExportModalOpen] = useState(false);
  const [isDailyReminderOpen, setIsDailyReminderOpen] = useState(false);
  const [toastInfo, setToastInfo] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // Splash screen timer & daily backup reminder check
  useEffect(() => {
    const timer = setTimeout(() => {
        setIsLoading(false);
        // Daily backup check after 06:00 AM
        const now = new Date();
        const hour = now.getHours();
        if (hour >= 6) {
          const todayStr = now.toISOString().split('T')[0];
          const lastReminder = localStorage.getItem('last_daily_backup_reminder_date');
          if (lastReminder !== todayStr) {
            setIsDailyReminderOpen(true);
            localStorage.setItem('last_daily_backup_reminder_date', todayStr);
          }
        }
    }, 2000); // 2 seconds

    return () => clearTimeout(timer); // Cleanup timer on unmount
  }, []);

  // Fetch user location once on component mount
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      },
      (error) => {
        console.error("Error getting user location:", error);
      }
    );
  }, []);

  const handleSelectCustomer = (customerId: string, jobId?: string) => {
    setSelectedCustomerId(customerId);
    setTargetJobId(jobId || null);
    setCurrentView('customerDetail');
  };

  const handleBackToList = () => {
    setSelectedCustomerId(null);
    setTargetJobId(null);
    setCurrentView('customers');
  };

  const renderContent = () => {
    switch (currentView) {
      case 'home':
        return <HomeScreen customers={customers} onNavigate={setCurrentView} onSelectCustomerJob={handleSelectCustomer} />;
      case 'customers':
        return (
          <CustomerListScreen
            customers={customers}
            setCustomers={setCustomers}
            onSelectCustomer={handleSelectCustomer}
            settings={settings}
          />
        );
      case 'customerDetail':
        const selectedCustomer = customers.find(c => c.id === selectedCustomerId);
        if (selectedCustomer) {
          return (
              <CustomerDetailScreen
                customer={selectedCustomer}
                setCustomers={setCustomers}
                onBack={handleBackToList}
                settings={settings}
                userLocation={userLocation}
                targetJobId={targetJobId}
              />
          );
        }
        handleBackToList();
        return null;
      case 'settings':
        return <SettingsScreen 
            settings={settings} 
            setSettings={setSettings} 
            customers={customers}
            tasks={tasks}
            setCustomers={setCustomers}
            setTasks={setTasks}
             />;
      default:
        return <HomeScreen customers={customers} onNavigate={setCurrentView} onSelectCustomerJob={handleSelectCustomer} />;
    }
  };

  const NavButton = ({ view, label, icon }: { view: View, label: string, icon: React.ReactElement }) => (
    <button
      onClick={() => setCurrentView(view)}
      className={`flex flex-col items-center justify-center w-full pt-2 pb-1 transition-colors duration-200 cursor-pointer ${currentView === view || (view === 'customers' && currentView === 'customerDetail') ? 'text-teal-400 font-bold' : 'text-gray-400 hover:text-teal-300'}`}
    >
      {icon}
      <span className="text-xs mt-1">{label}</span>
    </button>
  );

  return (
    <>
      {isLoading ? (
        <SplashScreen />
      ) : (
        <div className="flex flex-col h-screen font-sans">
          <header className="bg-gray-800 shadow-md p-4 text-center">
            <h1 className="text-2xl font-bold text-teal-400 tracking-wider">MİT</h1>
          </header>
          <main className="flex-grow overflow-y-auto p-4 pb-20 bg-gray-900">
            {renderContent()}
          </main>
          <nav className="fixed bottom-0 left-0 right-0 bg-gray-800 border-t border-gray-700 shadow-lg flex justify-around">
            <NavButton view="home" label="Ana Sayfa" icon={<HomeIcon />} />
            <NavButton view="customers" label="Müşteriler" icon={<CustomersIcon />} />
            <NavButton view="settings" label="Ayarlar" icon={<SettingsIcon />} />
          </nav>

          <DailyBackupReminderModal
            isOpen={isDailyReminderOpen}
            onClose={() => setIsDailyReminderOpen(false)}
            onBackupNow={() => {
              setIsDailyReminderOpen(false);
              setIsBackupExportModalOpen(true);
            }}
          />

          <BackupExportModal
            isOpen={isBackupExportModalOpen}
            onClose={() => setIsBackupExportModalOpen(false)}
            customers={customers}
            tasks={tasks}
            settings={settings}
            onSuccess={(msg) => setToastInfo({ message: msg, type: 'success' })}
            onError={(msg) => setToastInfo({ message: msg, type: 'error' })}
          />

          {toastInfo && (
            <Toast
              message={toastInfo.message}
              type={toastInfo.type}
              show={!!toastInfo}
              onClose={() => setToastInfo(null)}
            />
          )}
        </div>
      )}
    </>
  );
};

export default App;
