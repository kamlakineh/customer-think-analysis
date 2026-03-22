export type UserRole = 'ADMIN' | 'COMPANY';
export type Theme = 'light' | 'dark';
export type Language = 'en' | 'am';

export interface Admin {
  id: string;
  username: string;
}

export interface Company {
  id: string;
  name: string;
  username: string;
  password: string;
  logo?: string;
  createdAt: string;
}

export type CustomerStatus = 'NOT_ARRIVED' | 'ARRIVED';

export interface Customer {
  id: string;
  name: string;
  phone: string;
  companyId: string;
  status: CustomerStatus;
  pain?: string;
  arrivalTime?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthState {
  user: Admin | Company | null;
  role: UserRole | null;
}
