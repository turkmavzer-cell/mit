import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';
import type { LatLng } from 'leaflet';
import { XIcon } from './Icons';

interface MapSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLocationSelect: (location: { lat: number; lng: number }) => void;
  userLocation: { lat: number; lng: number } | null;
}

// Helper component to control map state dynamically
const MapController: React.FC<{ target: LatLng | null; zoom: number }> = ({ target, zoom }) => {
  const map = useMap();
  useEffect(() => {
    // Invalidate size to fix rendering issues in modals
    map.invalidateSize();
    // If we have a target location, fly to it
    if (target) {
      map.flyTo(target, zoom);
    }
  }, [target, zoom, map]);
  return null;
};

const MapClickHandler: React.FC<{ setPosition: (pos: { lat: number, lng: number }) => void }> = ({ setPosition }) => {
  useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng;
      setPosition({ lat, lng });
    },
  });
  return null;
};

const MapSelectorModal: React.FC<MapSelectorModalProps> = ({ isOpen, onClose, onLocationSelect, userLocation }) => {
  const [position, setPosition] = useState<{ lat: number; lng: number } | null>(null);
  const turkeyCenter: [number, number] = [39.9334, 32.8597]; // Ankara as default center

  // When the modal opens, set the initial position and marker to the user's location if available.
  useEffect(() => {
    if (isOpen) {
      setPosition(userLocation || null);
    } else {
      // Reset position when modal closes to avoid showing old marker on reopen
      setPosition(null); 
    }
  }, [isOpen, userLocation]);

  if (!isOpen) {
    return null;
  }

  const handleConfirm = () => {
    if (position) {
      onLocationSelect(position);
    }
  };

  // Determine map center and zoom level dynamically. Prioritize user's location on initial load.
  const mapTarget = userLocation ? { lat: userLocation.lat, lng: userLocation.lng } : null;
  const initialCenter = userLocation ? [userLocation.lat, userLocation.lng] : turkeyCenter;
  const initialZoom = userLocation ? 15 : 6;

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-80 flex flex-col z-50 p-4"
      onClick={onClose}
    >
      <div className="bg-gray-800 rounded-lg shadow-xl w-full max-w-4xl mx-auto flex flex-col h-full" onClick={e => e.stopPropagation()}>
        <header className="flex justify-between items-center p-4 border-b border-gray-700 flex-shrink-0">
          <h2 className="text-xl font-bold text-teal-400">Haritadan Konum Seçin</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <XIcon />
          </button>
        </header>
        
        <div className="flex-grow relative">
            <MapContainer center={initialCenter} zoom={initialZoom} scrollWheelZoom={true} style={{ height: '100%', width: '100%' }}>
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <MapController target={mapTarget} zoom={initialZoom} />
                <MapClickHandler setPosition={setPosition} />
                {position && <Marker position={position}></Marker>}
            </MapContainer>
        </div>

        <footer className="p-4 border-t border-gray-700 flex-shrink-0">
            <button
                onClick={handleConfirm}
                disabled={!position}
                className="w-full px-4 py-3 bg-teal-600 text-white font-semibold rounded-lg hover:bg-teal-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
                Konumu Onayla
            </button>
        </footer>
      </div>
    </div>
  );
};
export default MapSelectorModal;