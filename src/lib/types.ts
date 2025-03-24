
export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'doctor' | 'nurse' | 'receptionist' | 'patient' | 'pharmacist';
  avatar?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Patient {
  id: string;
  name: string;
  email: string;
  phone: string;
  gender: 'male' | 'female' | 'other';
  birthDate: Date;
  address: string;
  bloodType?: string;
  medicalHistory?: string;
  emergencyContact?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Doctor {
  id: string;
  name: string;
  email: string;
  phone: string;
  gender: 'male' | 'female' | 'other';
  specialization: string;
  department: string;
  qualification: string;
  experience: number;
  availability?: {
    days: string[];
    startTime: string;
    endTime: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  doctorId: string;
  doctorName: string;
  date: Date;
  startTime: string;
  endTime: string;
  status: 'requested' | 'confirmed' | 'cancelled' | 'completed' | 'rescheduled';
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Bill {
  id: string;
  patientId: string;
  patientName: string;
  amount: number;
  items: BillItem[];
  status: 'pending' | 'paid' | 'overdue' | 'cancelled';
  dueDate: Date;
  paidAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface BillItem {
  id: string;
  name: string;
  description?: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface Medicine {
  id: string;
  name: string;
  description?: string;
  category: string;
  quantity: number;
  unitPrice: number;
  expiryDate: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface DashboardStats {
  totalPatients: number;
  totalDoctors: number;
  totalAppointments: number;
  totalRevenue: number;
  patientsByMonth: {
    month: string;
    count: number;
  }[];
  appointmentsByStatus: {
    status: string;
    count: number;
  }[];
  revenueByMonth: {
    month: string;
    amount: number;
  }[];
}
