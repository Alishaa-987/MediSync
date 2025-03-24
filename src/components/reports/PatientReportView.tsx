
import React from 'react';
import { Patient } from '@/lib/types';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

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

const PatientReportView: React.FC<PatientReportViewProps> = ({ patient }) => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="bg-slate-50">
          <CardTitle>Patient Information</CardTitle>
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
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="bg-slate-50">
          <CardTitle>Visit History</CardTitle>
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
    </div>
  );
};

export default PatientReportView;
