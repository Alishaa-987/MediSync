
import React, { useState } from 'react';
import { Patient, Treatment, Admission, Bed, Ward } from '@/lib/types';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CalendarIcon, PlusCircle, Edit, FileText, CheckCircle, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

interface PatientReportViewProps {
  patient: Patient;
}

// Mock data for patient report details
const mockVisitHistory = [
  { 
    date: new Date(2023, 10, 15), 
    doctor: 'Dr. Sarah Johnson',
    department: 'Cardiology',
    diagnosis: 'Hypertension',
    treatment: 'Prescribed Lisinopril 10mg, daily blood pressure monitoring'
  },
  { 
    date: new Date(2023, 8, 3), 
    doctor: 'Dr. Michael Brown',
    department: 'General Medicine',
    diagnosis: 'Acute bronchitis',
    treatment: 'Prescribed Azithromycin, rest, increased fluid intake'
  },
  { 
    date: new Date(2023, 5, 22), 
    doctor: 'Dr. Emily Davis',
    department: 'Orthopedics',
    diagnosis: 'Ankle sprain',
    treatment: 'RICE therapy, ankle brace, physical therapy recommended'
  }
];

const mockMedications = [
  { name: 'Lisinopril', dosage: '10mg', frequency: 'Once daily', startDate: new Date(2023, 10, 15), endDate: null },
  { name: 'Azithromycin', dosage: '250mg', frequency: 'Once daily', startDate: new Date(2023, 8, 3), endDate: new Date(2023, 8, 8) },
  { name: 'Ibuprofen', dosage: '400mg', frequency: 'As needed for pain', startDate: new Date(2023, 5, 22), endDate: new Date(2023, 6, 5) }
];

const mockBillingHistory = [
  { date: new Date(2023, 10, 15), service: 'Cardiology Consultation', amount: 250.00, status: 'Paid' },
  { date: new Date(2023, 8, 3), service: 'General Consultation + Medication', amount: 175.50, status: 'Paid' },
  { date: new Date(2023, 5, 22), service: 'Orthopedic Consultation + X-Ray', amount: 350.75, status: 'Paid' }
];

// Mock data for admissions
const mockAdmissions = [
  { 
    id: 'ADM001', 
    patientId: 'P0001', 
    admissionDate: new Date(2023, 10, 15), 
    dischargeDate: new Date(2023, 10, 20),
    wardId: 'W001',
    wardName: 'Cardiology Ward',
    bedId: 'B003',
    diagnosis: 'Hypertensive Crisis',
    doctorId: 'D001',
    doctorName: 'Dr. Sarah Johnson',
    status: 'discharged',
    notes: 'Patient responded well to treatment. Follow-up in 2 weeks.'
  },
  { 
    id: 'ADM002', 
    patientId: 'P0001', 
    admissionDate: new Date(2023, 5, 10), 
    dischargeDate: new Date(2023, 5, 15),
    wardId: 'W003',
    wardName: 'Orthopedic Ward',
    bedId: 'B012',
    diagnosis: 'Fractured tibia',
    doctorId: 'D003',
    doctorName: 'Dr. Emily Davis',
    status: 'discharged',
    notes: 'Cast applied. Physical therapy recommended after 6 weeks.'
  }
];

// Mock wards and beds
const mockWards = [
  { id: 'W001', name: 'Cardiology Ward', capacity: 20, availableBeds: 8 },
  { id: 'W002', name: 'General Medicine Ward', capacity: 30, availableBeds: 12 },
  { id: 'W003', name: 'Orthopedic Ward', capacity: 15, availableBeds: 5 },
  { id: 'W004', name: 'Pediatric Ward', capacity: 25, availableBeds: 10 },
];

const mockBeds = [
  { id: 'B001', wardId: 'W001', status: 'available' },
  { id: 'B002', wardId: 'W001', status: 'available' },
  { id: 'B003', wardId: 'W001', status: 'available' },
  { id: 'B004', wardId: 'W002', status: 'available' },
  { id: 'B005', wardId: 'W002', status: 'available' },
  { id: 'B006', wardId: 'W003', status: 'available' },
  { id: 'B007', wardId: 'W003', status: 'available' },
  { id: 'B008', wardId: 'W004', status: 'available' },
  { id: 'B009', wardId: 'W004', status: 'available' },
];

const PatientReportView: React.FC<PatientReportViewProps> = ({ patient }) => {
  const [activeTab, setActiveTab] = useState('general');
  const [visitDialogOpen, setVisitDialogOpen] = useState(false);
  const [admissionDialogOpen, setAdmissionDialogOpen] = useState(false);
  const [selectedWard, setSelectedWard] = useState('');
  const [availableBeds, setAvailableBeds] = useState<Bed[]>([]);
  const [formData, setFormData] = useState({
    diagnosis: '',
    doctor: '',
    department: '',
    treatment: '',
    notes: '',
    wardId: '',
    bedId: '',
  });

  const handleWardChange = (value: string) => {
    setSelectedWard(value);
    // Filter beds by selected ward
    const beds = mockBeds.filter(bed => bed.wardId === value && bed.status === 'available');
    setAvailableBeds(beds);
    setFormData({ ...formData, wardId: value, bedId: '' });
  };

  const handleBedChange = (value: string) => {
    setFormData({ ...formData, bedId: value });
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleAddVisit = () => {
    // In a real app, this would send the data to an API
    toast.success('Patient visit recorded successfully');
    setVisitDialogOpen(false);
  };

  const handleAdmitPatient = () => {
    // In a real app, this would send the data to an API
    toast.success(`Patient admitted to ${mockWards.find(w => w.id === formData.wardId)?.name}, Bed ${formData.bedId}`);
    setAdmissionDialogOpen(false);
  };

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-5 w-full">
          <TabsTrigger value="general">General Info</TabsTrigger>
          <TabsTrigger value="visits">Visit History</TabsTrigger>
          <TabsTrigger value="medications">Medications</TabsTrigger>
          <TabsTrigger value="admissions">Admissions</TabsTrigger>
          <TabsTrigger value="billing">Billing</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="mt-4">
          <Card>
            <CardHeader className="bg-slate-50">
              <CardTitle className="flex items-center">
                <FileText className="mr-2 h-5 w-5 text-slate-600" />
                Patient Information
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Patient ID</p>
                  <p>{patient.id}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Name</p>
                  <p>{patient.name}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Gender</p>
                  <p className="capitalize">{patient.gender}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Date of Birth</p>
                  <p>{patient.birthDate.toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Blood Type</p>
                  <p>{patient.bloodType}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Contact</p>
                  <p>{patient.phone}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-sm font-medium text-muted-foreground">Address</p>
                  <p>{patient.address}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-sm font-medium text-muted-foreground">Email</p>
                  <p>{patient.email}</p>
                </div>
                <div className="col-span-2 mt-2">
                  <p className="text-sm font-medium text-muted-foreground">Admission Status</p>
                  <div className="mt-1">
                    {patient.admissionStatus === 'admitted' ? (
                      <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        <CheckCircle className="mr-1 h-3 w-3" />
                        Currently Admitted
                      </div>
                    ) : (
                      <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-800">
                        Outpatient
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex mt-6 space-x-3">
                <Button 
                  onClick={() => setVisitDialogOpen(true)}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <PlusCircle className="mr-1.5 h-4 w-4" />
                  Record Visit
                </Button>
                {patient.admissionStatus !== 'admitted' && (
                  <Button 
                    onClick={() => setAdmissionDialogOpen(true)}
                    variant="outline"
                    className="border-blue-200 text-blue-700 hover:bg-blue-50"
                  >
                    <PlusCircle className="mr-1.5 h-4 w-4" />
                    Admit Patient
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="visits" className="mt-4">
          <Card>
            <CardHeader className="bg-slate-50 flex flex-row items-center justify-between">
              <CardTitle>Visit History</CardTitle>
              <Button 
                onClick={() => setVisitDialogOpen(true)} 
                size="sm"
                className="bg-blue-600 hover:bg-blue-700"
              >
                <PlusCircle className="mr-1.5 h-4 w-4" />
                New Visit
              </Button>
            </CardHeader>
            <CardContent className="pt-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Doctor</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead>Diagnosis</TableHead>
                    <TableHead>Treatment</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockVisitHistory.map((visit, index) => (
                    <TableRow key={index}>
                      <TableCell>{visit.date.toLocaleDateString()}</TableCell>
                      <TableCell>{visit.doctor}</TableCell>
                      <TableCell>{visit.department}</TableCell>
                      <TableCell>{visit.diagnosis}</TableCell>
                      <TableCell>{visit.treatment}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="medications" className="mt-4">
          <Card>
            <CardHeader className="bg-slate-50">
              <CardTitle>Current & Past Medications</CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Medication</TableHead>
                    <TableHead>Dosage</TableHead>
                    <TableHead>Frequency</TableHead>
                    <TableHead>Start Date</TableHead>
                    <TableHead>End Date</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockMedications.map((medication, index) => (
                    <TableRow key={index}>
                      <TableCell>{medication.name}</TableCell>
                      <TableCell>{medication.dosage}</TableCell>
                      <TableCell>{medication.frequency}</TableCell>
                      <TableCell>{medication.startDate.toLocaleDateString()}</TableCell>
                      <TableCell>{medication.endDate ? medication.endDate.toLocaleDateString() : 'Ongoing'}</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${medication.endDate ? 'bg-slate-100' : 'bg-green-100 text-green-800'}`}>
                          {medication.endDate ? 'Completed' : 'Active'}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="admissions" className="mt-4">
          <Card>
            <CardHeader className="bg-slate-50 flex flex-row items-center justify-between">
              <CardTitle>Admission History</CardTitle>
              {patient.admissionStatus !== 'admitted' && (
                <Button 
                  onClick={() => setAdmissionDialogOpen(true)} 
                  size="sm"
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <PlusCircle className="mr-1.5 h-4 w-4" />
                  Admit Patient
                </Button>
              )}
            </CardHeader>
            <CardContent className="pt-4">
              {mockAdmissions.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Admission ID</TableHead>
                      <TableHead>Ward</TableHead>
                      <TableHead>Bed</TableHead>
                      <TableHead>Admit Date</TableHead>
                      <TableHead>Discharge Date</TableHead>
                      <TableHead>Doctor</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockAdmissions.map((admission, index) => (
                      <TableRow key={index}>
                        <TableCell>{admission.id}</TableCell>
                        <TableCell>{admission.wardName}</TableCell>
                        <TableCell>{admission.bedId}</TableCell>
                        <TableCell>{admission.admissionDate.toLocaleDateString()}</TableCell>
                        <TableCell>{admission.dischargeDate ? admission.dischargeDate.toLocaleDateString() : 'Active'}</TableCell>
                        <TableCell>{admission.doctorName}</TableCell>
                        <TableCell>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            admission.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-slate-100'
                          }`}>
                            {admission.status === 'active' ? 'Active' : 'Discharged'}
                          </span>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  No admission history found for this patient.
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="billing" className="mt-4">
          <Card>
            <CardHeader className="bg-slate-50">
              <CardTitle>Billing History</CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Service</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockBillingHistory.map((bill, index) => (
                    <TableRow key={index}>
                      <TableCell>{bill.date.toLocaleDateString()}</TableCell>
                      <TableCell>{bill.service}</TableCell>
                      <TableCell>${bill.amount.toFixed(2)}</TableCell>
                      <TableCell>
                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          {bill.status}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                  <TableRow>
                    <TableCell colSpan={2} className="text-right font-medium">Total</TableCell>
                    <TableCell className="font-medium">
                      ${mockBillingHistory.reduce((sum, bill) => sum + bill.amount, 0).toFixed(2)}
                    </TableCell>
                    <TableCell></TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Add Visit Dialog */}
      <Dialog open={visitDialogOpen} onOpenChange={setVisitDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Record Patient Visit</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="department">Department</Label>
              <Select name="department" onValueChange={(value) => setFormData({ ...formData, department: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select department" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cardiology">Cardiology</SelectItem>
                  <SelectItem value="orthopedics">Orthopedics</SelectItem>
                  <SelectItem value="neurology">Neurology</SelectItem>
                  <SelectItem value="pediatrics">Pediatrics</SelectItem>
                  <SelectItem value="general">General Medicine</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="doctor">Doctor</Label>
              <Select name="doctor" onValueChange={(value) => setFormData({ ...formData, doctor: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select doctor" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Dr. Sarah Johnson">Dr. Sarah Johnson (Cardiology)</SelectItem>
                  <SelectItem value="Dr. Emily Davis">Dr. Emily Davis (Orthopedics)</SelectItem>
                  <SelectItem value="Dr. Michael Brown">Dr. Michael Brown (General Medicine)</SelectItem>
                  <SelectItem value="Dr. David Wilson">Dr. David Wilson (Neurology)</SelectItem>
                  <SelectItem value="Dr. Lisa Chen">Dr. Lisa Chen (Pediatrics)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="diagnosis">Diagnosis</Label>
              <Input 
                id="diagnosis" 
                name="diagnosis"
                value={formData.diagnosis}
                onChange={handleFormChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="treatment">Treatment Plan</Label>
              <Textarea 
                id="treatment" 
                name="treatment"
                value={formData.treatment}
                onChange={handleFormChange}
                className="min-h-[80px]"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="notes">Additional Notes</Label>
              <Textarea 
                id="notes" 
                name="notes"
                value={formData.notes}
                onChange={handleFormChange}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setVisitDialogOpen(false)}>
              Cancel
            </Button>
            <Button type="button" onClick={handleAddVisit}>
              Save Visit
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Admit Patient Dialog */}
      <Dialog open={admissionDialogOpen} onOpenChange={setAdmissionDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Admit Patient</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="ward">Select Ward</Label>
              <Select onValueChange={handleWardChange}>
                <SelectTrigger id="ward">
                  <SelectValue placeholder="Select ward" />
                </SelectTrigger>
                <SelectContent>
                  {mockWards.map(ward => (
                    <SelectItem key={ward.id} value={ward.id}>
                      {ward.name} ({ward.availableBeds} beds available)
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            {selectedWard && (
              <div className="space-y-2">
                <Label htmlFor="bed">Select Bed</Label>
                <Select onValueChange={handleBedChange} disabled={availableBeds.length === 0}>
                  <SelectTrigger id="bed">
                    <SelectValue placeholder={availableBeds.length === 0 ? "No beds available" : "Select bed"} />
                  </SelectTrigger>
                  <SelectContent>
                    {availableBeds.map(bed => (
                      <SelectItem key={bed.id} value={bed.id}>
                        Bed {bed.id}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {availableBeds.length === 0 && (
                  <p className="text-sm text-red-500 flex items-center mt-1">
                    <AlertCircle className="h-4 w-4 mr-1" />
                    No beds available in this ward
                  </p>
                )}
              </div>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="admitDiagnosis">Diagnosis</Label>
              <Input 
                id="admitDiagnosis" 
                name="diagnosis"
                value={formData.diagnosis}
                onChange={handleFormChange}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="doctor">Attending Doctor</Label>
              <Select name="doctor" onValueChange={(value) => setFormData({ ...formData, doctor: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select doctor" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Dr. Sarah Johnson">Dr. Sarah Johnson (Cardiology)</SelectItem>
                  <SelectItem value="Dr. Emily Davis">Dr. Emily Davis (Orthopedics)</SelectItem>
                  <SelectItem value="Dr. Michael Brown">Dr. Michael Brown (General Medicine)</SelectItem>
                  <SelectItem value="Dr. David Wilson">Dr. David Wilson (Neurology)</SelectItem>
                  <SelectItem value="Dr. Lisa Chen">Dr. Lisa Chen (Pediatrics)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="admitNotes">Notes</Label>
              <Textarea 
                id="admitNotes" 
                name="notes"
                value={formData.notes}
                onChange={handleFormChange}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setAdmissionDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              type="button" 
              onClick={handleAdmitPatient} 
              disabled={!formData.wardId || !formData.bedId || !formData.diagnosis || !formData.doctor}
            >
              Admit Patient
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PatientReportView;
