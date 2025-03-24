
import React, { useState, useEffect } from 'react';
import {
  Calendar,
  Clock,
  Plus,
  Search,
  Trash2,
  Edit,
  Check,
  X,
  Filter,
  ChevronDown,
  MoreHorizontal,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/context/AuthContext';
import FadeIn from '@/components/animations/FadeIn';
import { Appointment, Doctor, Patient } from '@/lib/types';
import { toast } from 'sonner';

// Mock doctors and patients for appointments
const mockDoctors: Doctor[] = Array.from({ length: 10 }, (_, i) => ({
  id: `D${(i + 1).toString().padStart(4, '0')}`,
  name: [
    'Dr. John Smith', 'Dr. Sarah Johnson', 'Dr. Michael Williams', 'Dr. Emily Brown', 'Dr. David Lee',
    'Dr. Jessica Chen', 'Dr. Robert Miller', 'Dr. Jennifer Davis', 'Dr. Thomas Wilson', 'Dr. Patricia Moore',
  ][i],
  email: `doctor${i + 1}@hospital.com`,
  phone: `(${Math.floor(Math.random() * 900) + 100}) ${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 9000) + 1000}`,
  gender: i % 3 === 0 ? 'male' : i % 3 === 1 ? 'female' : 'other',
  specialization: [
    'Cardiology', 'Neurology', 'Orthopedics', 'Pediatrics', 'Oncology', 
    'Gynecology', 'Dermatology', 'Ophthalmology', 'Psychiatry', 'Radiology',
  ][i],
  department: [
    'Cardiology', 'Neurology', 'Orthopedics', 'Pediatrics', 'Oncology', 
    'Gynecology', 'Dermatology', 'Ophthalmology', 'Psychiatry', 'Radiology',
  ][i],
  qualification: ['MD', 'DO', 'PhD', 'MBBS', 'MS'][Math.floor(Math.random() * 5)],
  experience: Math.floor(Math.random() * 20) + 1,
  createdAt: new Date(Date.now() - Math.floor(Math.random() * 10000000000)),
  updatedAt: new Date(),
}));

const mockPatients: Patient[] = Array.from({ length: 20 }, (_, i) => ({
  id: `P${(i + 1).toString().padStart(4, '0')}`,
  name: [
    'John Doe', 'Jane Smith', 'Michael Johnson', 'Emma Williams', 'Robert Brown',
    'Olivia Davis', 'William Miller', 'Sophia Wilson', 'James Moore', 'Isabella Taylor',
    'Benjamin Anderson', 'Mia Thomas', 'Jacob Jackson', 'Charlotte White', 'Ethan Harris',
    'Amelia Martin', 'Alexander Thompson', 'Harper Garcia', 'Daniel Martinez', 'Evelyn Robinson',
  ][i],
  email: `patient${i + 1}@example.com`,
  phone: `(${Math.floor(Math.random() * 900) + 100}) ${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 9000) + 1000}`,
  gender: i % 3 === 0 ? 'male' : i % 3 === 1 ? 'female' : 'other',
  birthDate: new Date(Math.floor(Math.random() * (2000 - 1950 + 1)) + 1950, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1),
  address: `${Math.floor(Math.random() * 9000) + 1000} Main St, City, State`,
  bloodType: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'][Math.floor(Math.random() * 8)],
  createdAt: new Date(Date.now() - Math.floor(Math.random() * 10000000000)),
  updatedAt: new Date(),
}));

// Generate random time
const getRandomTime = () => {
  const hours = Math.floor(Math.random() * 8) + 9; // 9 AM to 5 PM
  const minutes = [0, 15, 30, 45][Math.floor(Math.random() * 4)];
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
};

// Generate random date within next 30 days
const getRandomFutureDate = () => {
  const now = new Date();
  const futureDate = new Date();
  futureDate.setDate(now.getDate() + Math.floor(Math.random() * 30) + 1);
  return futureDate;
};

// Mock appointments
const mockAppointments: Appointment[] = Array.from({ length: 50 }, (_, i) => {
  const patientIndex = Math.floor(Math.random() * mockPatients.length);
  const doctorIndex = Math.floor(Math.random() * mockDoctors.length);
  const startTime = getRandomTime();
  
  // Generate end time 30 minutes after start time
  const [startHour, startMinute] = startTime.split(':').map(Number);
  let endHour = startHour;
  let endMinute = startMinute + 30;
  
  if (endMinute >= 60) {
    endMinute -= 60;
    endHour += 1;
  }
  
  const endTime = `${endHour.toString().padStart(2, '0')}:${endMinute.toString().padStart(2, '0')}`;
  
  return {
    id: `A${(i + 1).toString().padStart(4, '0')}`,
    patientId: mockPatients[patientIndex].id,
    patientName: mockPatients[patientIndex].name,
    doctorId: mockDoctors[doctorIndex].id,
    doctorName: mockDoctors[doctorIndex].name,
    date: getRandomFutureDate(),
    startTime,
    endTime,
    status: ['requested', 'confirmed', 'cancelled', 'completed', 'rescheduled'][Math.floor(Math.random() * 5)] as Appointment['status'],
    notes: Math.random() > 0.5 ? 'Patient has been here before' : undefined,
    createdAt: new Date(Date.now() - Math.floor(Math.random() * 10000000000)),
    updatedAt: new Date(),
  };
});

const Appointments: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [filteredAppointments, setFilteredAppointments] = useState<Appointment[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [currentAppointment, setCurrentAppointment] = useState<Appointment | null>(null);
  const [activeTab, setActiveTab] = useState('upcoming');

  // Redirect if not logged in
  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  useEffect(() => {
    // Simulate API call
    const timer = setTimeout(() => {
      setAppointments(mockAppointments);
      setFilteredAppointments(mockAppointments);
      setLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    // Filter appointments
    let result = [...appointments];
    
    // Filter by status
    if (statusFilter !== 'all') {
      result = result.filter(appointment => appointment.status === statusFilter);
    }
    
    // Filter by tab
    const now = new Date();
    if (activeTab === 'upcoming') {
      result = result.filter(
        appointment => 
          new Date(appointment.date) >= now && 
          appointment.status !== 'cancelled' && 
          appointment.status !== 'completed'
      );
    } else if (activeTab === 'past') {
      result = result.filter(
        appointment => 
          new Date(appointment.date) < now || 
          appointment.status === 'cancelled' || 
          appointment.status === 'completed'
      );
    } else if (activeTab === 'requested') {
      result = result.filter(appointment => appointment.status === 'requested');
    }
    
    // Apply search
    if (search) {
      const searchLower = search.toLowerCase();
      result = result.filter(
        appointment => 
          appointment.patientName.toLowerCase().includes(searchLower) ||
          appointment.doctorName.toLowerCase().includes(searchLower) ||
          appointment.id.toLowerCase().includes(searchLower)
      );
    }
    
    // Sort by date and time
    result.sort((a, b) => {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      
      if (dateA.getTime() !== dateB.getTime()) {
        return dateA.getTime() - dateB.getTime();
      }
      
      return a.startTime.localeCompare(b.startTime);
    });
    
    setFilteredAppointments(result);
  }, [appointments, search, statusFilter, activeTab]);

  const handleDeleteAppointment = (id: string) => {
    // In a real app, this would be an API call
    setAppointments(appointments.filter(appointment => appointment.id !== id));
    toast.success('Appointment deleted successfully');
  };

  const handleEditAppointment = (appointment: Appointment) => {
    setCurrentAppointment(appointment);
    setDialogOpen(true);
  };

  const handleAddAppointment = () => {
    setCurrentAppointment(null);
    setDialogOpen(true);
  };

  const handleAppointmentFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would send the form data to an API
    setDialogOpen(false);
    toast.success(currentAppointment ? 'Appointment updated successfully' : 'Appointment added successfully');
  };

  const handleUpdateStatus = (id: string, status: Appointment['status']) => {
    // In a real app, this would be an API call
    setAppointments(appointments.map(appointment => 
      appointment.id === id ? { ...appointment, status } : appointment
    ));
    
    const statusMessages = {
      confirmed: 'Appointment confirmed successfully',
      cancelled: 'Appointment cancelled successfully',
      completed: 'Appointment marked as completed',
      rescheduled: 'Appointment rescheduled successfully',
    };
    
    toast.success(statusMessages[status] || 'Appointment status updated');
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  if (!user) return null;

  return (
    <div className="container max-w-[1600px] mx-auto">
      <FadeIn>
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Appointments</h1>
            <p className="text-muted-foreground">
              Manage patient appointments and scheduling
            </p>
          </div>
          <div className="flex space-x-2">
            <Button onClick={handleAddAppointment} className="bg-hms-600 hover:bg-hms-700">
              <Plus className="mr-2 h-4 w-4" />
              New Appointment
            </Button>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
          <div className="flex flex-col sm:flex-row justify-between gap-4 mb-4">
            <TabsList>
              <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
              <TabsTrigger value="requested">Requested</TabsTrigger>
              <TabsTrigger value="past">Past</TabsTrigger>
              <TabsTrigger value="all">All</TabsTrigger>
            </TabsList>
            
            <div className="flex flex-wrap gap-2">
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search appointments..."
                  className="pl-10"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="flex items-center">
                    <Filter className="mr-2 h-4 w-4" />
                    Status
                    <ChevronDown className="ml-2 h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <div className="p-2">
                    <Label className="text-xs font-medium">Status</Label>
                    <Select 
                      value={statusFilter} 
                      onValueChange={setStatusFilter}
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Filter by status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All</SelectItem>
                        <SelectItem value="requested">Requested</SelectItem>
                        <SelectItem value="confirmed">Confirmed</SelectItem>
                        <SelectItem value="cancelled">Cancelled</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                        <SelectItem value="rescheduled">Rescheduled</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          <TabsContent value="upcoming" className="mt-0">
            <AppointmentsList 
              appointments={filteredAppointments}
              loading={loading}
              onEdit={handleEditAppointment}
              onDelete={handleDeleteAppointment}
              onUpdateStatus={handleUpdateStatus}
              formatDate={formatDate}
            />
          </TabsContent>
          
          <TabsContent value="requested" className="mt-0">
            <AppointmentsList 
              appointments={filteredAppointments}
              loading={loading}
              onEdit={handleEditAppointment}
              onDelete={handleDeleteAppointment}
              onUpdateStatus={handleUpdateStatus}
              formatDate={formatDate}
            />
          </TabsContent>
          
          <TabsContent value="past" className="mt-0">
            <AppointmentsList 
              appointments={filteredAppointments}
              loading={loading}
              onEdit={handleEditAppointment}
              onDelete={handleDeleteAppointment}
              onUpdateStatus={handleUpdateStatus}
              formatDate={formatDate}
            />
          </TabsContent>
          
          <TabsContent value="all" className="mt-0">
            <AppointmentsList 
              appointments={filteredAppointments}
              loading={loading}
              onEdit={handleEditAppointment}
              onDelete={handleDeleteAppointment}
              onUpdateStatus={handleUpdateStatus}
              formatDate={formatDate}
            />
          </TabsContent>
        </Tabs>
      </FadeIn>

      {/* Add/Edit Appointment Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>
              {currentAppointment ? 'Edit Appointment' : 'New Appointment'}
            </DialogTitle>
            <DialogDescription>
              {currentAppointment 
                ? 'Update the appointment details below.'
                : 'Fill out the form below to schedule a new appointment.'}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleAppointmentFormSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="patient">Patient</Label>
                  <Select defaultValue={currentAppointment?.patientId || mockPatients[0].id}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select patient" />
                    </SelectTrigger>
                    <SelectContent>
                      {mockPatients.map(patient => (
                        <SelectItem key={patient.id} value={patient.id}>{patient.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="doctor">Doctor</Label>
                  <Select defaultValue={currentAppointment?.doctorId || mockDoctors[0].id}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select doctor" />
                    </SelectTrigger>
                    <SelectContent>
                      {mockDoctors.map(doctor => (
                        <SelectItem key={doctor.id} value={doctor.id}>{doctor.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="date">Date</Label>
                  <Input 
                    id="date" 
                    type="date" 
                    defaultValue={
                      currentAppointment 
                        ? new Date(currentAppointment.date).toISOString().split('T')[0]
                        : new Date().toISOString().split('T')[0]
                    } 
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select defaultValue={currentAppointment?.status || 'requested'}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="requested">Requested</SelectItem>
                      <SelectItem value="confirmed">Confirmed</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="rescheduled">Rescheduled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="startTime">Start Time</Label>
                  <Input 
                    id="startTime" 
                    type="time" 
                    defaultValue={currentAppointment?.startTime || '09:00'} 
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="endTime">End Time</Label>
                  <Input 
                    id="endTime" 
                    type="time" 
                    defaultValue={currentAppointment?.endTime || '09:30'} 
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <Input 
                  id="notes" 
                  placeholder="Any additional information"
                  defaultValue={currentAppointment?.notes || ''} 
                />
              </div>
            </div>
            <DialogFooter>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" className="bg-hms-600 hover:bg-hms-700">
                {currentAppointment ? 'Update Appointment' : 'Schedule Appointment'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

interface AppointmentsListProps {
  appointments: Appointment[];
  loading: boolean;
  onEdit: (appointment: Appointment) => void;
  onDelete: (id: string) => void;
  onUpdateStatus: (id: string, status: Appointment['status']) => void;
  formatDate: (date: Date) => string;
}

const AppointmentsList: React.FC<AppointmentsListProps> = ({
  appointments,
  loading,
  onEdit,
  onDelete,
  onUpdateStatus,
  formatDate,
}) => {
  return (
    <div className="rounded-md border">
      <div className="relative w-full overflow-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">ID</TableHead>
              <TableHead>Patient</TableHead>
              <TableHead>Doctor</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Time</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              Array.from({ length: 10 }).map((_, index) => (
                <TableRow key={index}>
                  {Array.from({ length: 7 }).map((_, colIndex) => (
                    <TableCell key={colIndex}>
                      <div className="h-5 bg-muted rounded animate-pulse w-full max-w-[100px]" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : appointments.length > 0 ? (
              appointments.map((appointment) => (
                <TableRow key={appointment.id}>
                  <TableCell className="font-medium">{appointment.id}</TableCell>
                  <TableCell>{appointment.patientName}</TableCell>
                  <TableCell>{appointment.doctorName}</TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                      {formatDate(appointment.date)}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                      {appointment.startTime} - {appointment.endTime}
                    </div>
                  </TableCell>
                  <TableCell>
                    <span 
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        appointment.status === 'confirmed' 
                          ? 'bg-green-100 text-green-700' 
                          : appointment.status === 'requested' 
                          ? 'bg-yellow-100 text-yellow-700'
                          : appointment.status === 'cancelled'
                          ? 'bg-red-100 text-red-700'
                          : appointment.status === 'completed'
                          ? 'bg-blue-100 text-blue-700'
                          : 'bg-orange-100 text-orange-700'
                      }`}
                    >
                      {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-1">
                      {appointment.status === 'requested' && (
                        <>
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => onUpdateStatus(appointment.id, 'confirmed')}
                            className="text-green-600"
                          >
                            <Check className="h-4 w-4" />
                            <span className="sr-only">Confirm</span>
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => onUpdateStatus(appointment.id, 'cancelled')}
                            className="text-red-600"
                          >
                            <X className="h-4 w-4" />
                            <span className="sr-only">Cancel</span>
                          </Button>
                        </>
                      )}
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">More</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => onEdit(appointment)}>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          {appointment.status !== 'completed' && appointment.status !== 'cancelled' && (
                            <DropdownMenuItem onClick={() => onUpdateStatus(appointment.id, 'completed')}>
                              <Check className="mr-2 h-4 w-4 text-green-600" />
                              Mark as Completed
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem 
                            onClick={() => onDelete(appointment.id)}
                            className="text-red-600"
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center">
                  No appointments found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default Appointments;
