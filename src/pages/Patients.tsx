
import React, { useState, useEffect } from 'react';
import {
  ChevronDown,
  ChevronUp,
  Download,
  Plus,
  Search,
  Trash2,
  Edit,
  Eye,
  Filter,
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
  DialogTrigger,
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
import { Label } from '@/components/ui/label';
import { useAuth } from '@/context/AuthContext';
import FadeIn from '@/components/animations/FadeIn';
import { Patient } from '@/lib/types';
import { toast } from 'sonner';

// Mock data
const mockPatients: Patient[] = Array.from({ length: 50 }, (_, i) => ({
  id: `P${(i + 1).toString().padStart(4, '0')}`,
  name: [
    'John Doe', 'Jane Smith', 'Michael Johnson', 'Emma Williams', 'Robert Brown',
    'Olivia Davis', 'William Miller', 'Sophia Wilson', 'James Moore', 'Isabella Taylor',
    'Benjamin Anderson', 'Mia Thomas', 'Jacob Jackson', 'Charlotte White', 'Ethan Harris',
    'Amelia Martin', 'Alexander Thompson', 'Harper Garcia', 'Daniel Martinez', 'Evelyn Robinson',
  ][i % 20],
  email: `patient${i + 1}@example.com`,
  phone: `(${Math.floor(Math.random() * 900) + 100}) ${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 9000) + 1000}`,
  gender: i % 3 === 0 ? 'male' : i % 3 === 1 ? 'female' : 'other',
  birthDate: new Date(Math.floor(Math.random() * (2000 - 1950 + 1)) + 1950, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1),
  address: `${Math.floor(Math.random() * 9000) + 1000} Main St, City, State`,
  bloodType: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'][Math.floor(Math.random() * 8)],
  createdAt: new Date(Date.now() - Math.floor(Math.random() * 10000000000)),
  updatedAt: new Date(),
}));

type SortField = 'name' | 'email' | 'phone' | 'gender' | 'birthDate' | 'createdAt';

const Patients: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [patients, setPatients] = useState<Patient[]>([]);
  const [filteredPatients, setFilteredPatients] = useState<Patient[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [sortField, setSortField] = useState<SortField>('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [genderFilter, setGenderFilter] = useState<string>('all');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [currentPatient, setCurrentPatient] = useState<Patient | null>(null);

  // Redirect if not logged in
  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  useEffect(() => {
    // Simulate API call
    const timer = setTimeout(() => {
      setPatients(mockPatients);
      setFilteredPatients(mockPatients);
      setLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    // Filter and sort patients
    let result = [...patients];
    
    // Apply gender filter
    if (genderFilter !== 'all') {
      result = result.filter(patient => patient.gender === genderFilter);
    }
    
    // Apply search
    if (search) {
      const searchLower = search.toLowerCase();
      result = result.filter(
        patient => 
          patient.name.toLowerCase().includes(searchLower) ||
          patient.email.toLowerCase().includes(searchLower) ||
          patient.id.toLowerCase().includes(searchLower) ||
          patient.phone.toLowerCase().includes(searchLower)
      );
    }
    
    // Apply sorting
    result.sort((a, b) => {
      let valueA, valueB;
      
      if (sortField === 'birthDate' || sortField === 'createdAt') {
        valueA = new Date(a[sortField]).getTime();
        valueB = new Date(b[sortField]).getTime();
      } else {
        valueA = a[sortField]?.toString().toLowerCase();
        valueB = b[sortField]?.toString().toLowerCase();
      }
      
      if (valueA < valueB) return sortDirection === 'asc' ? -1 : 1;
      if (valueA > valueB) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
    
    setFilteredPatients(result);
  }, [patients, search, sortField, sortDirection, genderFilter]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const handleDeletePatient = (id: string) => {
    // In a real app, this would be an API call
    setPatients(patients.filter(patient => patient.id !== id));
    toast.success('Patient deleted successfully');
  };

  const handleEditPatient = (patient: Patient) => {
    setCurrentPatient(patient);
    setDialogOpen(true);
  };

  const handleAddPatient = () => {
    setCurrentPatient(null);
    setDialogOpen(true);
  };

  const handlePatientFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would send the form data to an API
    setDialogOpen(false);
    toast.success(currentPatient ? 'Patient updated successfully' : 'Patient added successfully');
  };

  if (!user) return null;

  return (
    <div className="container max-w-[1600px] mx-auto">
      <FadeIn>
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Patients</h1>
            <p className="text-muted-foreground">
              Manage patient records and medical histories
            </p>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
            <Button onClick={handleAddPatient} className="bg-hms-600 hover:bg-hms-700">
              <Plus className="mr-2 h-4 w-4" />
              Add Patient
            </Button>
          </div>
        </div>

        <div className="mb-6 flex flex-col sm:flex-row justify-between gap-4">
          <div className="relative w-full sm:w-96">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search patients..."
              className="pl-10"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="flex flex-wrap gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="flex items-center">
                  <Filter className="mr-2 h-4 w-4" />
                  Filter
                  <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <div className="p-2">
                  <Label className="text-xs font-medium">Gender</Label>
                  <Select 
                    value={genderFilter} 
                    onValueChange={setGenderFilter}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All</SelectItem>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <div className="rounded-md border">
          <div className="relative w-full overflow-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">ID</TableHead>
                  <TableHead 
                    className="cursor-pointer hover:bg-muted transition-colors"
                    onClick={() => handleSort('name')}
                  >
                    <div className="flex items-center">
                      Name
                      {sortField === 'name' && (
                        sortDirection === 'asc' ? <ChevronUp className="ml-1 h-4 w-4" /> : <ChevronDown className="ml-1 h-4 w-4" />
                      )}
                    </div>
                  </TableHead>
                  <TableHead 
                    className="cursor-pointer hover:bg-muted transition-colors"
                    onClick={() => handleSort('email')}
                  >
                    <div className="flex items-center">
                      Email
                      {sortField === 'email' && (
                        sortDirection === 'asc' ? <ChevronUp className="ml-1 h-4 w-4" /> : <ChevronDown className="ml-1 h-4 w-4" />
                      )}
                    </div>
                  </TableHead>
                  <TableHead 
                    className="cursor-pointer hover:bg-muted transition-colors"
                    onClick={() => handleSort('phone')}
                  >
                    <div className="flex items-center">
                      Phone
                      {sortField === 'phone' && (
                        sortDirection === 'asc' ? <ChevronUp className="ml-1 h-4 w-4" /> : <ChevronDown className="ml-1 h-4 w-4" />
                      )}
                    </div>
                  </TableHead>
                  <TableHead 
                    className="cursor-pointer hover:bg-muted transition-colors"
                    onClick={() => handleSort('gender')}
                  >
                    <div className="flex items-center">
                      Gender
                      {sortField === 'gender' && (
                        sortDirection === 'asc' ? <ChevronUp className="ml-1 h-4 w-4" /> : <ChevronDown className="ml-1 h-4 w-4" />
                      )}
                    </div>
                  </TableHead>
                  <TableHead 
                    className="cursor-pointer hover:bg-muted transition-colors"
                    onClick={() => handleSort('birthDate')}
                  >
                    <div className="flex items-center">
                      Birth Date
                      {sortField === 'birthDate' && (
                        sortDirection === 'asc' ? <ChevronUp className="ml-1 h-4 w-4" /> : <ChevronDown className="ml-1 h-4 w-4" />
                      )}
                    </div>
                  </TableHead>
                  <TableHead 
                    className="cursor-pointer hover:bg-muted transition-colors"
                    onClick={() => handleSort('createdAt')}
                  >
                    <div className="flex items-center">
                      Registered
                      {sortField === 'createdAt' && (
                        sortDirection === 'asc' ? <ChevronUp className="ml-1 h-4 w-4" /> : <ChevronDown className="ml-1 h-4 w-4" />
                      )}
                    </div>
                  </TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  Array.from({ length: 10 }).map((_, index) => (
                    <TableRow key={index}>
                      {Array.from({ length: 8 }).map((_, colIndex) => (
                        <TableCell key={colIndex}>
                          <div className="h-5 bg-muted rounded animate-pulse w-full max-w-[100px]" />
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : filteredPatients.length > 0 ? (
                  filteredPatients.map((patient) => (
                    <TableRow key={patient.id}>
                      <TableCell className="font-medium">{patient.id}</TableCell>
                      <TableCell>{patient.name}</TableCell>
                      <TableCell>{patient.email}</TableCell>
                      <TableCell>{patient.phone}</TableCell>
                      <TableCell className="capitalize">{patient.gender}</TableCell>
                      <TableCell>
                        {patient.birthDate.toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        {patient.createdAt.toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end space-x-1">
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => {/* View patient details */}}
                          >
                            <Eye className="h-4 w-4" />
                            <span className="sr-only">View</span>
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => handleEditPatient(patient)}
                          >
                            <Edit className="h-4 w-4" />
                            <span className="sr-only">Edit</span>
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => handleDeletePatient(patient.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                            <span className="sr-only">Delete</span>
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={8} className="h-24 text-center">
                      No patients found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>
        
        <div className="mt-4 text-sm text-muted-foreground">
          Showing {filteredPatients.length} of {patients.length} patients
        </div>
      </FadeIn>

      {/* Add/Edit Patient Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>
              {currentPatient ? 'Edit Patient' : 'Add New Patient'}
            </DialogTitle>
            <DialogDescription>
              {currentPatient 
                ? 'Update the patient information below.'
                : 'Fill out the form below to add a new patient.'}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handlePatientFormSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input 
                    id="name" 
                    placeholder="John Doe"
                    defaultValue={currentPatient?.name} 
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    placeholder="john@example.com"
                    defaultValue={currentPatient?.email} 
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input 
                    id="phone" 
                    placeholder="(555) 555-5555"
                    defaultValue={currentPatient?.phone} 
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="gender">Gender</Label>
                  <Select defaultValue={currentPatient?.gender || 'male'}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="birthDate">Birth Date</Label>
                  <Input 
                    id="birthDate" 
                    type="date" 
                    defaultValue={currentPatient?.birthDate.toISOString().split('T')[0]} 
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bloodType">Blood Type</Label>
                  <Select defaultValue={currentPatient?.bloodType || 'A+'}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select blood type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="A+">A+</SelectItem>
                      <SelectItem value="A-">A-</SelectItem>
                      <SelectItem value="B+">B+</SelectItem>
                      <SelectItem value="B-">B-</SelectItem>
                      <SelectItem value="AB+">AB+</SelectItem>
                      <SelectItem value="AB-">AB-</SelectItem>
                      <SelectItem value="O+">O+</SelectItem>
                      <SelectItem value="O-">O-</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Input 
                  id="address" 
                  placeholder="123 Main St, City, State"
                  defaultValue={currentPatient?.address} 
                  required
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
                {currentPatient ? 'Update Patient' : 'Add Patient'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Patients;
