
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { DatePicker } from '@/components/ui/date-picker';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import FadeIn from '@/components/animations/FadeIn';
import { PlusCircle, Edit, Trash2, ClipboardList } from 'lucide-react';
import { Treatment, Patient, Doctor, Disease } from '@/lib/types';
import { hasPermission } from '@/lib/permissions';
import { useAuth } from '@/context/AuthContext';
import { format } from 'date-fns';

const TreatmentManagement: React.FC = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [openDialog, setOpenDialog] = useState(false);
  const [editingTreatment, setEditingTreatment] = useState<Treatment | null>(null);

  // Mock data for treatments
  const [treatments, setTreatments] = useState<Treatment[]>([
    {
      id: '1',
      patientId: 'p1',
      doctorId: 'd1',
      diseaseId: '1',
      diseaseName: 'Diabetes Type 2',
      medicationPrescribed: 'Metformin 500mg',
      treatmentDate: new Date('2023-05-15'),
      treatmentDetails: 'Take twice daily after meals. Monitor blood sugar levels.'
    },
    {
      id: '2',
      patientId: 'p2',
      doctorId: 'd2',
      diseaseId: '2',
      diseaseName: 'Influenza',
      medicationPrescribed: 'Oseltamivir 75mg',
      treatmentDate: new Date('2023-06-10'),
      treatmentDetails: 'Take once daily for 5 days. Rest and increase fluid intake.'
    },
    {
      id: '3',
      patientId: 'p3',
      doctorId: 'd1',
      diseaseId: '3',
      diseaseName: 'Hypertension',
      medicationPrescribed: 'Lisinopril 10mg',
      treatmentDate: new Date('2023-07-05'),
      treatmentDetails: 'Take once daily in the morning. Monitor blood pressure regularly.'
    }
  ]);

  // Mock data for patients, doctors, and diseases
  const [patients] = useState<Pick<Patient, 'id' | 'name'>[]>([
    { id: 'p1', name: 'John Doe' },
    { id: 'p2', name: 'Jane Smith' },
    { id: 'p3', name: 'Robert Johnson' },
    { id: 'p4', name: 'Emily Davis' }
  ]);

  const [doctors] = useState<Pick<Doctor, 'id' | 'name' | 'specialization'>[]>([
    { id: 'd1', name: 'Dr. Williams', specialization: 'Internal Medicine' },
    { id: 'd2', name: 'Dr. Brown', specialization: 'Cardiology' },
    { id: 'd3', name: 'Dr. Garcia', specialization: 'Endocrinology' }
  ]);

  const [diseases] = useState<Pick<Disease, 'id' | 'name' | 'category'>[]>([
    { id: '1', name: 'Diabetes Type 2', category: 'Chronic' },
    { id: '2', name: 'Influenza', category: 'Viral' },
    { id: '3', name: 'Hypertension', category: 'Chronic' },
    { id: '4', name: 'Asthma', category: 'Chronic' }
  ]);

  // Form state
  const [treatmentForm, setTreatmentForm] = useState({
    patientId: '',
    doctorId: '',
    diseaseId: '',
    medicationPrescribed: '',
    treatmentDate: undefined as Date | undefined,
    treatmentDetails: ''
  });

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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

  // Handle date change
  const handleDateChange = (date: Date | undefined) => {
    setTreatmentForm(prev => ({
      ...prev,
      treatmentDate: date
    }));
  };

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

  // Get disease name by ID
  const getDiseaseNameById = (diseaseId: string) => {
    const disease = diseases.find(d => d.id === diseaseId);
    return disease ? disease.name : 'Unknown Disease';
  };

  // Edit treatment
  const handleEditTreatment = (treatment: Treatment) => {
    setEditingTreatment(treatment);
    setTreatmentForm({
      patientId: treatment.patientId,
      doctorId: treatment.doctorId,
      diseaseId: treatment.diseaseId,
      medicationPrescribed: treatment.medicationPrescribed,
      treatmentDate: treatment.treatmentDate,
      treatmentDetails: treatment.treatmentDetails
    });
    setOpenDialog(true);
  };

  // Delete treatment
  const handleDeleteTreatment = (treatmentId: string) => {
    setTreatments(treatments.filter(treatment => treatment.id !== treatmentId));
    toast({
      title: "Treatment Deleted",
      description: "The treatment has been removed successfully."
    });
  };

  // Save treatment
  const handleSaveTreatment = () => {
    if (!treatmentForm.patientId || !treatmentForm.doctorId || !treatmentForm.diseaseId || 
        !treatmentForm.medicationPrescribed || !treatmentForm.treatmentDate) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    const diseaseName = getDiseaseNameById(treatmentForm.diseaseId);

    if (editingTreatment) {
      // Update existing treatment
      setTreatments(treatments.map(treatment => 
        treatment.id === editingTreatment.id ? 
        { 
          ...treatment, 
          patientId: treatmentForm.patientId,
          doctorId: treatmentForm.doctorId,
          diseaseId: treatmentForm.diseaseId,
          diseaseName,
          medicationPrescribed: treatmentForm.medicationPrescribed,
          treatmentDate: treatmentForm.treatmentDate!,
          treatmentDetails: treatmentForm.treatmentDetails
        } : 
        treatment
      ));
      
      toast({
        title: "Treatment Updated",
        description: "Treatment details have been updated successfully."
      });
    } else {
      // Add new treatment
      const newTreatment: Treatment = {
        id: `treatment_${Date.now().toString()}`,
        patientId: treatmentForm.patientId,
        doctorId: treatmentForm.doctorId,
        diseaseId: treatmentForm.diseaseId,
        diseaseName,
        medicationPrescribed: treatmentForm.medicationPrescribed,
        treatmentDate: treatmentForm.treatmentDate!,
        treatmentDetails: treatmentForm.treatmentDetails
      };
      
      setTreatments([...treatments, newTreatment]);
      
      toast({
        title: "Treatment Added",
        description: "New treatment has been added successfully."
      });
    }
    
    // Reset form and close dialog
    resetForm();
    setOpenDialog(false);
  };

  // Reset form
  const resetForm = () => {
    setTreatmentForm({
      patientId: '',
      doctorId: '',
      diseaseId: '',
      medicationPrescribed: '',
      treatmentDate: undefined,
      treatmentDetails: ''
    });
    setEditingTreatment(null);
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
              Manage patient treatments and prescriptions
            </p>
          </div>
          
          <Dialog open={openDialog} onOpenChange={(open) => {
            setOpenDialog(open);
            if (!open) resetForm();
          }}>
            <DialogTrigger asChild>
              <Button>
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Treatment
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg">
              <DialogHeader>
                <DialogTitle>{editingTreatment ? 'Edit Treatment' : 'Add New Treatment'}</DialogTitle>
                <DialogDescription>
                  {editingTreatment 
                    ? 'Update the treatment information below.' 
                    : 'Fill in the details to add a new treatment to the system.'}
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="patientId">Patient*</Label>
                  <Select
                    value={treatmentForm.patientId}
                    onValueChange={(value) => handleSelectChange('patientId', value)}
                  >
                    <SelectTrigger id="patientId">
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
                  <Label htmlFor="doctorId">Doctor*</Label>
                  <Select
                    value={treatmentForm.doctorId}
                    onValueChange={(value) => handleSelectChange('doctorId', value)}
                  >
                    <SelectTrigger id="doctorId">
                      <SelectValue placeholder="Select a doctor" />
                    </SelectTrigger>
                    <SelectContent>
                      {doctors.map((doctor) => (
                        <SelectItem key={doctor.id} value={doctor.id}>
                          {doctor.name} ({doctor.specialization})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="diseaseId">Disease/Condition*</Label>
                  <Select
                    value={treatmentForm.diseaseId}
                    onValueChange={(value) => handleSelectChange('diseaseId', value)}
                  >
                    <SelectTrigger id="diseaseId">
                      <SelectValue placeholder="Select a disease" />
                    </SelectTrigger>
                    <SelectContent>
                      {diseases.map((disease) => (
                        <SelectItem key={disease.id} value={disease.id}>
                          {disease.name} ({disease.category})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="medicationPrescribed">Medication/Treatment*</Label>
                  <Input
                    id="medicationPrescribed"
                    name="medicationPrescribed"
                    value={treatmentForm.medicationPrescribed}
                    onChange={handleInputChange}
                    placeholder="e.g., Metformin 500mg"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="treatmentDate">Treatment Date*</Label>
                  <DatePicker
                    date={treatmentForm.treatmentDate}
                    setDate={handleDateChange}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="treatmentDetails">Treatment Details</Label>
                  <Textarea
                    id="treatmentDetails"
                    name="treatmentDetails"
                    value={treatmentForm.treatmentDetails}
                    onChange={handleInputChange}
                    placeholder="Additional instructions or details..."
                    rows={3}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => {
                  resetForm();
                  setOpenDialog(false);
                }}>Cancel</Button>
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
                  <TableHead>Medication</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {treatments.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center">No treatments found</TableCell>
                  </TableRow>
                ) : (
                  treatments.map((treatment) => (
                    <TableRow key={treatment.id}>
                      <TableCell>{getPatientNameById(treatment.patientId)}</TableCell>
                      <TableCell>{getDoctorNameById(treatment.doctorId)}</TableCell>
                      <TableCell>{treatment.diseaseName}</TableCell>
                      <TableCell>{treatment.medicationPrescribed}</TableCell>
                      <TableCell>{format(treatment.treatmentDate, 'MMM d, yyyy')}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end space-x-2">
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => handleEditTreatment(treatment)}
                          >
                            <Edit className="h-4 w-4" />
                            <span className="sr-only">Edit</span>
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => handleDeleteTreatment(treatment.id)}
                          >
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
