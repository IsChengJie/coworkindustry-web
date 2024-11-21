export interface Report {
  id?: string;
  title: string;
  type: string;
  date: Date;
  content: any;
  createdBy?: string;
  createdAt?: Date;
} 