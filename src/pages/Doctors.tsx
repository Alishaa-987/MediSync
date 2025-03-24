
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
import { Doctor } from '@/lib/types';
import { toast } from 'sonner';

// Mock data for departments
const departments = ['Cardiology', 'Neurology', 'Orthopedics', 'Pediatrics', 'Oncology', 'Gynecology', 'Dermatology', 'Ophthalmology', 'Psychiatry', 'Radiology'];

// Mock data
const mockDoctors: Doctor[] = Array.from({ length: 30 }, (_, i) => ({
  id: `D${(i + 1).toString().padStart(4, '0')}`,
  name: [
    'Dr. John Smith', 'Dr. Sarah Johnson', 'Dr. Michael Williams', 'Dr. Emily Brown', 'Dr. David Lee',
    'Dr. Jessica Chen', 'Dr. Robert Miller', 'Dr. Jennifer Davis', 'Dr. Thomas Wilson', 'Dr. Patricia Moore',
    'Dr. James Taylor', 'Dr. Linda Anderson', 'Dr. Christopher Martin', 'Dr. Elizabeth White', 'Dr. Daniel Harris',
    'Dr. Susan Lewis', 'Dr. Joseph Clark', 'Dr. Karen Young', 'Dr. Matthew Hall', 'Dr. Nancy Allen',
  ][i % 20],
  email: `doctor${i + 1}@hospital.com`,
  phone: `(${Math.floor(Math.random() * 900) + 100}) ${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 9000) + 1000}`,
  gender: i % 3 === 0 ? 'male' : i % 3 === 1 ? 'female' : 'other',
  specialization: [
    'Cardiology', 'Neurology', 'Orthopedics', 'Pediatrics', 'Oncology', 
    'Gynecology', 'Dermatology', 'Ophthalmology', 'Psychiatry', 'Radiology',
    'Urology', 'Endocrinology', 'Gastroenterology', 'Nephrology', 'Pulmonology',
  ][i % 15],
  department: departments[i % departments.length],
  qualification: ['MD', 'DO', 'PhD', 'MBBS', 'MS'][Math.floor(Math.random() * 5)],
  experience: Math.floor(Math.random() * 20) + 1,
  createdAt: new Date(Date.now() - Math.floor(Math.random() * 10000000000)),
  updatedAt: new Date(),
}));

type SortField = 'name' | 'email' | 'phone' | 'specialization' | 'department' | 'experience';

const Doctors: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [filteredDoctors, setFilteredDoctors] = useState<Doctor[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [sortField, setSortField] = useState<SortField>('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [departmentFilter, setDepartmentFilter] = useState<string>('all');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [currentDoctor, setCurrentDoctor] = useState<Doctor | null>(null);

  // Redirect if not logged in
  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  useEffect(() => {
    // Simulate API call
    const timer = setTimeout(() => {
      setDoctors(mockDoctors);
      setFilteredDoctors(mockDoctors);
      setLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    // Filter and sort doctors
    let result = [...doctors];
    
    // Apply department filter
    if (departmentFilter !== 'all') {
      result = result.filter(doctor => doctor.department === departmentFilter);
    }
    
    // Apply search
    if (search) {
      const searchLower = search.toLowerCase();
      result = result.filter(
        doctor => 
          doctor.name.toLowerCase().includes(searchLower) ||
          doctor.email.toLowerCase().includes(searchLower) ||
          doctor.id.toLowerCase().includes(searchLower) ||
          doctor.specialization.toLowerCase().includes(searchLower) ||
          doctor.department.toLowerCase().includes(searchLower)
      );
    }
    
    // Apply sorting
    result.sort((a, b) => {
      let valueA, valueB;
      
      if (sortField === 'experience') {
        valueA = a[sortField];
        valueB = b[sortField];
      } else {
        valueA = a[sortField]?.toString().toLowerCase();
        valueB = b[sortField]?.toString().toLowerCase();
      }
      
      if (valueA < valueB) return sortDirection === 'asc' ? -1 : 1;
      if (valueA > valueB) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
    
    setFilteredDoctors(result);
  }, [doctors, search, sortField, sortDirection, departmentFilter]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const handleDeleteDoctor = (id: string) => {
    // In a real app, this would be an API call
    setDoctors(doctors.filter(doctor => doctor.id !== id));
    toast.success('Doctor deleted successfully');
  };

  const handleEditDoctor = (doctor: Doctor) => {
    setCurrentDoctor(doctor);
    setDialogOpen(true);
  };

  const handleAddDoctor = () => {
    setCurrentDoctor(null);
    setDialogOpen(true);
  };

  const handleDoctorFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would send the form data to an API
    setDialogOpen(false);
    toast.success(currentDoctor ? 'Doctor updated successfully' : 'Doctor added successfully');
  };

  if (!user) return null;

  return (
    <div className="container max-w-[1600px] mx-auto">
      <FadeIn>
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Doctors</h1>
            <p className="text-muted-foreground">
              Manage hospital doctors and specialists
            </p>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
            <Button onClick={handleAddDoctor} className="bg-hms-600 hover:bg-hms-700">
              <Plus className="mr-2 h-4 w-4" />
              Add Doctor
            </Button>
          </div>
        </div>

        <div className="mb-6 flex flex-col sm:flex-row justify-between gap-4">
          <div className="relative w-full sm:w-96">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search doctors..."
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
                  Filter by Department
                  <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <div className="p-2">
                  <Label className="text-xs font-medium">Department</Label>
                  <Select 
                    value={departmentFilter} 
                    onValueChange={setDepartmentFilter}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select department" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Departments</SelectItem>
                      {departments.map(dept => (
                        <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                      ))}
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
                    onClick={() => handleSort('specialization')}
                  >
                    <div className="flex items-center">
                      Specialization
                      {sortField === 'specialization' && (
                        sortDirection === 'asc' ? <ChevronUp className="ml-1 h-4 w-4" /> : <ChevronDown className="ml-1 h-4 w-4" />
                      )}
                    </div>
                  </TableHead>
                  <TableHead 
                    className="cursor-pointer hover:bg-muted transition-colors"
                    onClick={() => handleSort('department')}
                  >
                    <div className="flex items-center">
                      Department
                      {sortField === 'department' && (
                        sortDirection === 'asc' ? <ChevronUp className="ml-1 h-4 w-4" /> : <ChevronDown className="ml-1 h-4 w-4" />
                      )}
                    </div>
                  </TableHead>
                  <TableHead 
                    className="cursor-pointer hover:bg-muted transition-colors"
                    onClick={() => handleSort('experience')}
                  >
                    <div className="flex items-center">
                      Experience
                      {sortField === 'experience' && (
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
                ) : filteredDoctors.length > 0 ? (
                  filteredDoctors.map((doctor) => (
                    <TableRow key={doctor.id}>
                      <TableCell className="font-medium">{doctor.id}</TableCell>
                      <TableCell>{doctor.name}</TableCell>
                      <TableCell>{doctor.specialization}</TableCell>
                      <TableCell>{doctor.department}</TableCell>
                      <TableCell>{doctor.experience} years</TableCell>
                      <TableCell>{doctor.email}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end space-x-1">
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => {/* View doctor details */}}
                          >
                            <Eye className="h-4 w-4" />
                            <span className="sr-only">View</span>
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => handleEditDoctor(doctor)}
                          >
                            <Edit className="h-4 w-4" />
                            <span className="sr-only">Edit</span>
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => handleDeleteDoctor(doctor.id)}
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
                    <TableCell colSpan={7} className="h-24 text-center">
                      No doctors found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>
        
        <div className="mt-4 text-sm text-muted-foreground">
          Showing {filteredDoctors.length} of {doctors.length} doctors
        </div>
      </FadeIn>

      {/* Add/Edit Doctor Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>
              {currentDoctor ? 'Edit Doctor' : 'Add New Doctor'}
            </DialogTitle>
            <DialogDescription>
              {currentDoctor 
                ? 'Update the doctor information below.'
                : 'Fill out the form below to add a new doctor.'}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleDoctorFormSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input 
                    id="name" 
                    placeholder="Dr. John Smith"
                    defaultValue={currentDoctor?.name} 
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    placeholder="doctor@hospital.com"
                    defaultValue={currentDoctor?.email} 
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
                    defaultValue={currentDoctor?.phone} 
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="gender">Gender</Label>
                  <Select defaultValue={currentDoctor?.gender || 'male'}>
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
                  <Label htmlFor="specialization">Specialization</Label>
                  <Select defaultValue={currentDoctor?.specialization || 'Cardiology'}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select specialization" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Cardiology">Cardiology</SelectItem>
                      <SelectItem value="Neurology">Neurology</SelectItem>
                      <SelectItem value="Orthopedics">Orthopedics</SelectItem>
                      <SelectItem value="Pediatrics">Pediatrics</SelectItem>
                      <SelectItem value="Oncology">Oncology</SelectItem>
                      <SelectItem value="Gynecology">Gynecology</SelectItem>
                      <SelectItem value="Dermatology">Dermatology</SelectItem>
                      <SelectItem value="Ophthalmology">Ophthalmology</SelectItem>
                      <SelectItem value="Psychiatry">Psychiatry</SelectItem>
                      <SelectItem value="Radiology">Radiology</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="department">Department</Label>
                  <Select defaultValue={currentDoctor?.department || departments[0]}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select department" />
                    </SelectTrigger>
                    <SelectContent>
                      {departments.map(dept => (
                        <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="qualification">Qualification</Label>
                  <Select defaultValue={currentDoctor?.qualification || 'MD'}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select qualification" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="MD">MD</SelectItem>
                      <SelectItem value="DO">DO</SelectItem>
                      <SelectItem value="PhD">PhD</SelectItem>
                      <SelectItem value="MBBS">MBBS</SelectItem>
                      <SelectItem value="MS">MS</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="experience">Experience (years)</Label>
                  <Input 
                    id="experience" 
                    type="number"
                    min="1"
                    max="50" 
                    defaultValue={currentDoctor?.experience || 1} 
                    required
                  />
                </div>
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
                {currentDoctor ? 'Update Doctor' : 'Add Doctor'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Doctors;
