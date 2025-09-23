export interface User {
  id: string;
  email: string;
  name: string;
  role: 'student' | 'tutor';
  createdAt: Date;
}

export interface Student {
  id: string;
  name: string;
  email: string;
  university?: string;
  major?: string;
  year?: string;
}

export interface Tutor {
  id: number;
  name: string;
  major: string;
  year: string;
  university?: string;
  subjects: string[];
  hourlyRate: number;
  rating: number;
  reviews: number;
  bio: string;
  availability: string;
  isVerified?: boolean;
  profileImage?: string;
}

export interface BookingRequest {
  tutorId: string;
  subject: string;
  startTime: Date;
  endTime: Date;
  notes?: string;
}

export interface Booking {
  id: string;
  studentId: string;
  tutorId: string;
  subject: string;
  date: Date;
  duration: number;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  totalCost: number;
  notes?: string;
  createdAt?: Date;
}

export interface Review {
  id: string;
  bookingId: string;
  rating: number;
  comment: string;
  createdAt: Date;
}

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  timestamp: Date;
  read: boolean;
}

export interface Subject {
  id: string;
  name: string;
  category: string;
  description?: string;
}

export interface SearchFilters {
  subjects?: string[];
  minRating?: number;
  maxHourlyRate?: number;
  availability?: 'now' | 'today' | 'week';
  university?: string;
}
