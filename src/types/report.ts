export interface Report {
  id: string;
  title: string;
  date: string;
  type: string;
  status: 'completed' | 'pending';
  downloadUrl?: string;
} 