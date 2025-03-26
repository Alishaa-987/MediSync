
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DatePicker } from '@/components/ui/date-picker';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import FadeIn from '@/components/animations/FadeIn';
import { PlusCircle, Edit, Trash2, Search, Calendar, FileText } from 'lucide-react';
import { hasPermission } from '@/lib/permissions';
import { useAuth } from '@/context/AuthContext';
import { Treatment } from '@/lib/types';

// Mock data for diseases
interface Disease {
  id: string;
  name: string;
}

// Mock data for doctors
interface Doctor {
  id: string;
  name: string;
}

// Mock data for patients
interface Patient {
  id: string;
  name: string;
}

const TreatmentManagement: React.FC = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [openDialog, setOpenDialog] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [editingTreatment, setEditingTreatment] = useState<Treatment | null>(null);
  const [treatmentDate, setTreatmentDate] = useState<Date | undefined>(new Date());

  // Mock data
  const diseases: Disease[] = [
    { id: 'd1', name: 'Diabetes Mellitus' },
    { id: 'd2', name: 'Influenza' },
    { id: 'd3', name: 'Hypertension' },
    { id: 'd4', name: 'Asthma' }
  ];

  const doctors: Doctor[] = [
    { id: 'doc1', name: 'Dr. John Smith' },
    { id: 'doc2', name: 'Dr. Sarah Johnson' },
    { id: 'doc3', name: 'Dr. Michael Brown' }
  ];

  const patients: Patient[] = [
    { id: 'p1', name: 'Alice Williams' },
    { id: 'p2', name: 'Bob Anderson' },
    { id: 'p3', name: 'Charlie Davis' },
    { id: 'p4', name: 'Diana Miller' }
  ];

  // Mock data for treatments
  const [treatments, setTreatments] = useState<Treatment[]>([
    {
      id: 't1',
      patientId: 'p1',
      doctorId: 'doc1',
      diseaseId: 'd1',
      diseaseName: 'Diabetes Mellitus',
      medicationPrescribed: 'Metformin 500mg twice daily',
      treatmentDate: new Date(2023, 5, 15),
      treatmentDetails: 'Initial diagnosis. Patient advised on diet and exercise.'
    },
    {
      id: 't2',
      patientId: 'p2',
      doctorId: 'doc2',
      diseaseId: 'd2',
      diseaseName: 'Influenza',
      medicationPrescribed: 'Oseltamivir 75mg daily for 5 days',
      treatmentDate: new Date(2023, 6, 20),
      treatmentDetails: 'Bed rest advised. Increase fluid intake.'
    },
    {
      id: 't3',
      patientId: 'p3',
      doctorId: 'doc3',
      diseaseId: 'd3',
      diseaseName: 'Hypertension',
      medicationPrescribed: 'Lisinopril 10mg daily',
      treatmentDate: new Date(2023, 7, 5),
      treatmentDetails: 'Regular blood pressure monitoring. Follow-up in 2 weeks.'
    }
  ]);

  // Form state
  const [treatmentForm, setTreatmentForm] = useState({
    patientId: '',
    doctorId: '',
    diseaseId: '',
    medicationPrescribed: '',
    treatmentDetails: ''
  });

  // Handle form input changes
  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setTreatmentForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle select changes
  const handleSelectChange = (name: string, value: string) => {
    setTreatmentForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Edit treatment
  const handleEditTreatment = (treatment: Treatment) => {
    setEditingTreatment(treatment);
    setTreatmentForm({
      patientId: treatment.patientId,
      doctorId: treatment.doctorId,
      diseaseId: treatment.diseaseId,
      medicationPrescribed: treatment.medicationPrescribed,
      treatmentDetails: treatment.treatmentDetails
    });
    setTreatmentDate(treatment.treatmentDate);
    setOpenDialog(true);
  };

  // Delete treatment
  const handleDeleteTreatment = (treatmentId: string) => {
    setTreatments(treatments.filter(treatment => treatment.id !== treatmentId));
    toast({
      title: "Treatment Deleted",
      description: "The treatment record has been removed from the system."
    });
  };

  // Save treatment
  const handleSaveTreatment = () => {
    if (!treatmentForm.patientId || !treatmentForm.doctorId || !treatmentForm.diseaseId || !treatmentDate) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    const selectedDisease = diseases.find(d => d.id === treatmentForm.diseaseId);
    
    if (!selectedDisease) {
      toast({
        title: "Error",
        description: "Selected disease not found.",
        variant: "destructive"
      });
      return;
    }

    if (editingTreatment) {
      // Update existing treatment
      setTreatments(treatments.map(treatment => 
        treatment.id === editingTreatment.id ? 
        { 
          ...treatment, 
          ...treatmentForm,
          diseaseName: selectedDisease.name,
          treatmentDate: treatmentDate
        } : 
        treatment
      ));
      toast({
        title: "Treatment Updated",
        description: "Treatment record has been updated successfully."
      });
    } else {
      // Add new treatment
      const newTreatment: Treatment = {
        id: `treatment_${Date.now().toString()}`,
        ...treatmentForm,
        diseaseName: selectedDisease.name,
        treatmentDate: treatmentDate
      };
      setTreatments([...treatments, newTreatment]);
      toast({
        title: "Treatment Added",
        description: "New treatment record has been added successfully."
      });
    }
    
    // Reset form and close dialog
    setTreatmentForm({
      patientId: '',
      doctorId: '',
      diseaseId: '',
      medicationPrescribed: '',
      treatmentDetails: ''
    });
    setTreatmentDate(new Date());
    setEditingTreatment(null);
    setOpenDialog(false);
  };

  // Filter treatments based on search query
  const filteredTreatments = treatments.filter(treatment => {
    const patientName = patients.find(p => p.id === treatment.patientId)?.name || '';
    const doctorName = doctors.find(d => d.id === treatment.doctorId)?.name || '';
    
    return patientName.toLowerCase().includes(searchQuery.toLowerCase()) || 
           doctorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
           treatment.diseaseName.toLowerCase().includes(searchQuery.toLowerCase());
  });

  // Get patient name by ID
  const getPatientNameById = (patientId: string) => {
    const patient = patients.find(p => p.id === patientId);
    return patient ? patient.name : 'Unknown Patient';
  };

  // Get doctor name by ID
  const getDoctorNameById = (doctorId: string) => {
    const doctor = doctors.find(d => d.id === doctorId);
    return doctor ? doctor.name : 'Unknown Doctor';
  };

  // Format date
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Check if user has permission to manage
  const canManage = hasPermission(user, 'canManageSystem');

  if (!canManage) {
    return (
      <FadeIn>
        <div className="flex items-center justify-center h-full">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Access Denied</CardTitle>
              <CardDescription>
                You do not have permission to access this page.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </FadeIn>
    );
  }

  return (
    <FadeIn>
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Treatment Management</h2>
            <p className="text-muted-foreground">
              Manage patient treatment records and prescriptions
            </p>
          </div>
        </div>

        <div className="flex justify-between items-center gap-4">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search treatments..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <Dialog open={openDialog} onOpenChange={setOpenDialog}>
            <DialogTrigger asChild>
              <Button onClick={() => {
                setEditingTreatment(null);
                setTreatmentForm({
                  patientId: '',
                  doctorId: '',
                  diseaseId: '',
                  medicationPrescribed: '',
                  treatmentDetails: ''
                });
                setTreatmentDate(new Date());
              }}>
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Treatment
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{editingTreatment ? 'Edit Treatment' : 'Add New Treatment'}</DialogTitle>
                <DialogDescription>
                  {editingTreatment 
                    ? 'Update the treatment information below.' 
                    : 'Fill in the details to add a new treatment record.'}
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="treatment-patient">Patient*</Label>
                  <Select 
                    value={treatmentForm.patientId}
                    onValueChange={(value) => handleSelectChange('patientId', value)}
                  >
                    <SelectTrigger id="treatment-patient">
                      <SelectValue placeholder="Select a patient" />
                    </SelectTrigger>
                    <SelectContent>
                      {patients.map((patient) => (
                        <SelectItem key={patient.id} value={patient.id}>
                          {patient.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="treatment-doctor">Doctor*</Label>
                  <Select 
                    value={treatmentForm.doctorId}
                    onValueChange={(value) => handleSelectChange('doctorId', value)}
                  >
                    <SelectTrigger id="treatment-doctor">
                      <SelectValue placeholder="Select a doctor" />
                    </SelectTrigger>
                    <SelectContent>
                      {doctors.map((doctor) => (
                        <SelectItem key={doctor.id} value={doctor.id}>
                          {doctor.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="treatment-disease">Disease/Condition*</Label>
                  <Select 
                    value={treatmentForm.diseaseId}
                    onValueChange={(value) => handleSelectChange('diseaseId', value)}
                  >
                    <SelectTrigger id="treatment-disease">
                      <SelectValue placeholder="Select a disease" />
                    </SelectTrigger>
                    <SelectContent>
                      {diseases.map((disease) => (
                        <SelectItem key={disease.id} value={disease.id}>
                          {disease.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="treatment-date">Treatment Date*</Label>
                  <DatePicker 
                    date={treatmentDate} 
                    setDate={setTreatmentDate}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="treatment-medication">Medication Prescribed</Label>
                  <Input
                    id="treatment-medication"
                    name="medicationPrescribed"
                    value={treatmentForm.medicationPrescribed}
                    onChange={handleFormChange}
                    placeholder="e.g., Metformin 500mg twice daily"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="treatment-details">Treatment Details</Label>
                  <Textarea
                    id="treatment-details"
                    name="treatmentDetails"
                    value={treatmentForm.treatmentDetails}
                    onChange={handleFormChange}
                    placeholder="Additional treatment details and instructions"
                    className="resize-none"
                    rows={3}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setOpenDialog(false)}>Cancel</Button>
                <Button onClick={handleSaveTreatment}>Save</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Patient</TableHead>
                  <TableHead>Doctor</TableHead>
                  <TableHead>Disease</TableHead>
                  <TableHead className="hidden md:table-cell">Date</TableHead>
                  <TableHead className="hidden lg:table-cell">Medication</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTreatments.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center">No treatment records found</TableCell>
                  </TableRow>
                ) : (
                  filteredTreatments.map((treatment) => (
                    <TableRow key={treatment.id}>
                      <TableCell className="font-medium">{getPatientNameById(treatment.patientId)}</TableCell>
                      <TableCell>{getDoctorNameById(treatment.doctorId)}</TableCell>
                      <TableCell>{treatment.diseaseName}</TableCell>
                      <TableCell className="hidden md:table-cell">{formatDate(treatment.treatmentDate)}</TableCell>
                      <TableCell className="hidden lg:table-cell">
                        {treatment.medicationPrescribed.length > 30 
                          ? `${treatment.medicationPrescribed.substring(0, 30)}...` 
                          : treatment.medicationPrescribed || '-'}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end space-x-2">
                          <Button variant="ghost" size="icon" onClick={() => handleEditTreatment(treatment)}>
                            <Edit className="h-4 w-4" />
                            <span className="sr-only">Edit</span>
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => handleDeleteTreatment(treatment.id)}>
                            <Trash2 className="h-4 w-4" />
                            <span className="sr-only">Delete</span>
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </FadeIn>
  );
};

export default TreatmentManagement;
