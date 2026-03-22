import { Company, Customer } from './types';

export const mockCompanies: Company[] = [
  { id: 'comp-1', name: 'City Dental Clinic', username: 'citydental', password: 'password123', createdAt: '2025-01-15T10:00:00Z' },
  { id: 'comp-2', name: 'Green Valley Medical', username: 'greenvalley', password: 'password456', createdAt: '2025-02-10T11:30:00Z' },
  { id: 'comp-3', name: 'Elite Physio Center', username: 'elitephysio', password: 'password789', createdAt: '2025-03-05T09:15:00Z' }
];

export const mockCustomers: Customer[] = [
  // Company 1
  { id: 'c1-1', name: 'Abebe Kebede', phone: '0911223344', companyId: 'comp-1', status: 'ARRIVED', pain: 'Toothache', createdAt: '2025-03-21T08:00:00Z', updatedAt: '2025-03-21T08:30:00Z' },
  { id: 'c1-2', name: 'Mulugeta Tesfaye', phone: '0922334455', companyId: 'comp-1', status: 'NOT_ARRIVED', createdAt: '2025-03-21T09:00:00Z', updatedAt: '2025-03-21T09:00:00Z' },
  { id: 'c1-3', name: 'Sara Mohammed', phone: '0933445566', companyId: 'comp-1', status: 'ARRIVED', pain: 'Gum bleeding', createdAt: '2025-03-21T10:00:00Z', updatedAt: '2025-03-21T10:15:00Z' },
  { id: 'c1-4', name: 'Daniel Haile', phone: '0944556677', companyId: 'comp-1', status: 'NOT_ARRIVED', createdAt: '2025-03-21T11:00:00Z', updatedAt: '2025-03-21T11:00:00Z' },
  
  // Company 2
  { id: 'c2-1', name: 'Tigist Alemu', phone: '0955667788', companyId: 'comp-2', status: 'ARRIVED', pain: 'Fever', createdAt: '2025-03-21T08:15:00Z', updatedAt: '2025-03-21T08:45:00Z' },
  { id: 'c2-2', name: 'Yonas Biru', phone: '0966778899', companyId: 'comp-2', status: 'NOT_ARRIVED', createdAt: '2025-03-21T09:15:00Z', updatedAt: '2025-03-21T09:15:00Z' },
  { id: 'c2-3', name: 'Helen Tadesse', phone: '0977889900', companyId: 'comp-2', status: 'ARRIVED', pain: 'Headache', createdAt: '2025-03-21T10:15:00Z', updatedAt: '2025-03-21T10:30:00Z' },
  { id: 'c2-4', name: 'Dawit Girma', phone: '0988990011', companyId: 'comp-2', status: 'NOT_ARRIVED', createdAt: '2025-03-21T11:15:00Z', updatedAt: '2025-03-21T11:15:00Z' },
  
  // Company 3
  { id: 'c3-1', name: 'Biniyam Assefa', phone: '0999001122', companyId: 'comp-3', status: 'ARRIVED', pain: 'Back pain', createdAt: '2025-03-21T08:30:00Z', updatedAt: '2025-03-21T09:00:00Z' },
  { id: 'c3-2', name: 'Genet Belay', phone: '0900112233', companyId: 'comp-3', status: 'NOT_ARRIVED', createdAt: '2025-03-21T09:30:00Z', updatedAt: '2025-03-21T09:30:00Z' },
  { id: 'c3-3', name: 'Samuel Negash', phone: '0911334455', companyId: 'comp-3', status: 'ARRIVED', pain: 'Knee injury', createdAt: '2025-03-21T10:30:00Z', updatedAt: '2025-03-21T10:45:00Z' },
  { id: 'c3-4', name: 'Marta Desta', phone: '0922445566', companyId: 'comp-3', status: 'NOT_ARRIVED', createdAt: '2025-03-21T11:30:00Z', updatedAt: '2025-03-21T11:30:00Z' }
];
