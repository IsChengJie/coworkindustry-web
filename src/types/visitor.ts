export interface Visitor {
  id: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  purpose: string;
  host: string;
  checkIn: string;
  checkOut?: string;
  status: 'active' | 'checked_out' | 'pre_registered';
  photoUrl?: string;
  signature?: string;
  documents?: string[];
  notes?: string;
  badge?: {
    id: string;
    number: string;
  };
}

export interface VisitorGroup {
  id: string;
  name: string;
  company: string;
  size: number;
  host: string;
  checkIn: string;
  status: 'active' | 'checked_out';
}

export interface Host {
  id: string;
  name: string;
  email: string;
  department?: string;
  phone?: string;
}

export interface VisitorType {
  id: string;
  name: string;
  color: string;
  requirePhoto: boolean;
  requireSignature: boolean;
  requireDocuments: boolean;
} 