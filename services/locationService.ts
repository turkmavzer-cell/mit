
/**
 * Fetches a human-readable address from geographic coordinates using the Nominatim (OpenStreetMap) API.
 * @param lat - Latitude.
 * @param lng - Longitude.
 * @returns A promise that resolves to the address string.
 */
export const getAddressFromCoordinates = async (lat: number, lng: number): Promise<string> => {
    const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`;
    try {
        const response = await fetch(url, {
            headers: {
                'Accept-Language': 'tr-TR,tr;q=0.9', // Request Turkish address if available
            }
        });
        if (!response.ok) {
            throw new Error(`Network response was not ok: ${response.statusText}`);
        }
        const data = await response.json();
        if (data && data.display_name) {
            return data.display_name;
        }
        return 'Adres detayı bulunamadı.';
    } catch (error) {
        console.error("Failed to fetch address:", error);
        return 'Adres alınamadı. İnternet bağlantınızı kontrol edin.';
    }
};

/**
 * Fetches geographic coordinates for a given address string using the Nominatim (OpenStreetMap) API.
 * @param address - The address string to search for.
 * @returns A promise that resolves to the location's coordinates or undefined if not found.
 */
export const geocodeAddress = async (address: string): Promise<{ lat: number; lng: number } | undefined> => {
    const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(address)}&format=json&limit=1&countrycodes=tr`;
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Network response was not ok: ${response.statusText}`);
        }
        const data = await response.json();
        if (data && data.length > 0) {
            return {
                lat: parseFloat(data[0].lat),
                lng: parseFloat(data[0].lon),
            };
        }
        return undefined;
    } catch (error) {
        console.error("Failed to geocode address:", error);
        return undefined;
    }
};

/**
 * Calculates the Haversine distance between two points on the Earth.
 * @param start - The starting coordinates { lat, lng }.
 * @param end - The ending coordinates { lat, lng }.
 * @returns The distance in kilometers.
 */
const haversineDistance = (start: { lat: number; lng: number }, end: { lat: number; lng: number }): number => {
    const R = 6371; // Radius of the Earth in km
    const dLat = (end.lat - start.lat) * (Math.PI / 180);
    const dLon = (end.lng - start.lng) * (Math.PI / 180);
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(start.lat * (Math.PI / 180)) * Math.cos(end.lat * (Math.PI / 180)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
};

/**
 * Estimates travel time based on distance.
 * This is a simplified estimation and doesn't account for traffic.
 * @param start - The starting coordinates { lat, lng }.
 * @param end - The ending coordinates { lat, lng }.
 * @returns The estimated travel time in minutes.
 */
export const calculateTravelTime = (start: { lat: number; lng: number }, end: { lat: number; lng: number }): number => {
    const distance = haversineDistance(start, end);
    // Assume an average speed of 40 km/h for urban/suburban travel
    const AVERAGE_SPEED_KMH = 40;
    const timeHours = distance / AVERAGE_SPEED_KMH;
    return Math.round(timeHours * 60);
};