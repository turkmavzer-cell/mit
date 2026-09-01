export interface FabricRoll {
  id: string;
  value: number;
  unit: 'mt' | 'kg';
}

export interface Job {
  id: string;
  name: string;
  createdAt: string; // ISO string format
  status?: 'active' | 'delivered'; // 'active' (default) or 'delivered'
  deliveredAt?: string; // ISO string format
  fabricRolls?: FabricRoll[]; // Top top kumaş bilgisi
  photos?: string[]; // Array of Base64 strings
  notes?: string;
  fabricType?: string;
  fabricColor?: string;
  fabricGramsPerMeter?: number; // 1 meter weight in grams for converting kg rolls to meters
  deadline?: string; // ISO string format
  personInCharge?: string;
}

export interface Customer {
  id: string;
  name: string;
  jobs: Job[];
  phone?: string;
  contactPerson?: string;
  address?: string;
  location?: {
    lat: number;
    lng: number;
  };
}

export interface Task {
  id: string;
  text: string;
  completed: boolean;
  createdAt: string;
  dueDate?: string;
  locationName?: string;
  locationCoords?: {
    lat: number;
    lng: number;
  };
  notified?: boolean;
}

export interface Settings {
  companyName?: string;
  companyAddress?: string;
  companyPhoneNumbers?: string[];
  companyEmail?: string;
  companyTaxNumber?: string;
  companyLogo?: string;
}

export type View = 'home' | 'customers' | 'customerDetail' | 'settings';
