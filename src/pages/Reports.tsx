
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { DatePickerWithRange } from '@/components/ui/date-range-picker';
import { Label } from '@/components/ui/label';
import { Download, Printer, Search, FileText, Database, TrendingUp } from 'lucide-react';
import PatientReportView from '@/components/reports/PatientReportView';
import FinancialReportView from '@/components/reports/FinancialReportView';
import InventoryReportView from '@/components/reports/InventoryReportView';
import { Patient } from '@/lib/types';
import { toast } from 'sonner';
import { useAuth } from '@/context/AuthContext';
import { hasPermission } from '@/lib/permissions';

// Mock patient data
const mockPatients = [
  {
    id: "P0001",
    name: "John Smith",
    email: "john.smith@example.com",
    phone: "+1234567890",
    gender: "male" as const,
    birthDate: new Date(1985, 5, 15),
    address: "123 Main St, Anytown, USA",
    bloodType: "O+",
    medicalHistory: "Hypertension, Diabetes",
    emergencyContact: "Jane Smith, +1234567891 (Wife)",
    admissionStatus: "outpatient" as const,
    createdAt: new Date(2022, 1, 15),
    updatedAt: new Date(2023, 3, 20)
  },
  {
    id: "P0002",
    name: "Sarah Johnson",
    email: "sarah.johnson@example.com",
    phone: "+1234567892",
    gender: "female" as const,
    birthDate: new Date(1990, 8, 23),
    address: "456 Oak Ave, Somewhere, USA",
    bloodType: "A-",
    medicalHistory: "Asthma",
    emergencyContact: "Robert Johnson, +1234567893 (Husband)",
    admissionStatus: "admitted" as const,
    admissionDate: new Date(2023, 4, 12),
    wardId: "W001",
    bedId: "B005",
    createdAt: new Date(2022, 6, 22),
    updatedAt: new Date(2023, 4, 12)
  },
  {
    id: "P0003",
    name: "Michael Brown",
    email: "michael.brown@example.com",
    phone: "+1234567894",
    gender: "male" as const,
    birthDate: new Date(1975, 3, 8),
    address: "789 Pine St, Elsewhere, USA",
    bloodType: "B+",
    medicalHistory: "Arthritis",
    emergencyContact: "Susan Brown, +1234567895 (Wife)",
    admissionStatus: "discharged" as const,
    admissionDate: new Date(2023, 2, 1),
    dischargeDate: new Date(2023, 2, 10),
    wardId: "W002",
    bedId: "B010",
    createdAt: new Date(2021, 11, 5),
    updatedAt: new Date(2023, 2, 10)
  }
];

const Reports: React.FC = () => {
  const { user } = useAuth();
  const [selectedReportType, setSelectedReportType] = useState('patient');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPatientId, setSelectedPatientId] = useState('');
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);
  const [reportGenerated, setReportGenerated] = useState(false);

  // Check permissions
  const canGenerateReports = hasPermission(user, 'canGenerateReports');

  const filteredPatients = searchTerm 
    ? mockPatients.filter(patient => 
        patient.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        patient.id.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : mockPatients;

  const handlePatientSelect = (patientId: string) => {
    setSelectedPatientId(patientId);
    const patient = mockPatients.find(p => p.id === patientId);
    if (patient) {
      setSelectedPatient(patient as Patient);
    }
  };

  const handleGenerateReport = () => {
    if (!selectedPatientId && selectedReportType === 'patient') {
      toast.error('Please select a patient first');
      return;
    }

    setIsGeneratingReport(true);
    
    // Simulate API call delay
    setTimeout(() => {
      setIsGeneratingReport(false);
      setReportGenerated(true);
      toast.success(`${selectedReportType.charAt(0).toUpperCase() + selectedReportType.slice(1)} report generated successfully`);
    }, 1500);
  };

  const handleDownloadReport = () => {
    toast.success('Report downloaded successfully');
  };

  const handlePrintReport = () => {
    toast.success('Sending report to printer...');
  };

  // Conditionally render content based on user role
  if (user?.role === 'patient') {
    // Patient can only see their own reports
    return (
      <div className="container mx-auto py-6 space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">My Reports</h1>
            <p className="text-muted-foreground">View and download your medical reports</p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>My Medical History</CardTitle>
          </CardHeader>
          <CardContent>
            <Button onClick={handleGenerateReport} disabled={isGeneratingReport} className="mr-2">
              {isGeneratingReport ? 'Generating...' : 'Generate Report'}
            </Button>
            {reportGenerated && (
              <>
                <Button variant="outline" onClick={handleDownloadReport} className="mr-2">
                  <Download className="mr-2 h-4 w-4" />
                  Download
                </Button>
                <Button variant="outline" onClick={handlePrintReport}>
                  <Printer className="mr-2 h-4 w-4" />
                  Print
                </Button>
              </>
            )}
            
            {reportGenerated && (
              <div className="mt-6">
                <PatientReportView patient={mockPatients[0] as Patient} />
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Reports</h1>
          <p className="text-muted-foreground">Generate and manage hospital reports</p>
        </div>
      </div>

      <Tabs defaultValue="patient" onValueChange={setSelectedReportType}>
        <TabsList>
          <TabsTrigger value="patient" className="flex">
            <FileText className="mr-2 h-4 w-4" />
            Patient Reports
          </TabsTrigger>
          {hasPermission(user, 'canViewFinances') && (
            <TabsTrigger value="financial" className="flex">
              <TrendingUp className="mr-2 h-4 w-4" />
              Financial Reports
            </TabsTrigger>
          )}
          {hasPermission(user, 'canManagePharmacy') && (
            <TabsTrigger value="inventory" className="flex">
              <Database className="mr-2 h-4 w-4" />
              Inventory Reports
            </TabsTrigger>
          )}
        </TabsList>

        <TabsContent value="patient">
          <Card>
            <CardHeader>
              <CardTitle>Patient Reports</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6">
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="w-full sm:w-1/3">
                    <Label htmlFor="patient-search">Search Patient</Label>
                    <div className="relative">
                      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="patient-search"
                        type="search"
                        placeholder="Search by name or ID..."
                        className="pl-8"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="w-full sm:w-1/3">
                    <Label htmlFor="patient-select">Select Patient</Label>
                    <Select value={selectedPatientId} onValueChange={handlePatientSelect}>
                      <SelectTrigger id="patient-select">
                        <SelectValue placeholder="Select patient" />
                      </SelectTrigger>
                      <SelectContent>
                        {filteredPatients.map((patient) => (
                          <SelectItem key={patient.id} value={patient.id}>
                            {patient.name} ({patient.id})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-end">
                    <Button onClick={handleGenerateReport} disabled={!canGenerateReports || isGeneratingReport || !selectedPatientId}>
                      {isGeneratingReport ? 'Generating...' : 'Generate Report'}
                    </Button>
                  </div>
                </div>

                {reportGenerated && selectedPatient && (
                  <div className="mt-4 space-y-4">
                    <div className="flex justify-end space-x-2">
                      <Button variant="outline" onClick={handleDownloadReport}>
                        <Download className="mr-2 h-4 w-4" />
                        Download Report
                      </Button>
                      <Button variant="outline" onClick={handlePrintReport}>
                        <Printer className="mr-2 h-4 w-4" />
                        Print Report
                      </Button>
                    </div>
                    <PatientReportView patient={selectedPatient} />
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="financial">
          <Card>
            <CardHeader>
              <CardTitle>Financial Reports</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6">
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="w-full sm:w-1/3">
                    <Label>Report Type</Label>
                    <Select defaultValue="monthly">
                      <SelectTrigger>
                        <SelectValue placeholder="Select report type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="daily">Daily Revenue</SelectItem>
                        <SelectItem value="weekly">Weekly Revenue</SelectItem>
                        <SelectItem value="monthly">Monthly Revenue</SelectItem>
                        <SelectItem value="quarterly">Quarterly Revenue</SelectItem>
                        <SelectItem value="yearly">Yearly Revenue</SelectItem>
                        <SelectItem value="expenses">Expense Report</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="w-full sm:w-1/3">
                    <Label>Date Range</Label>
                    <DatePickerWithRange />
                  </div>
                  <div className="flex items-end">
                    <Button onClick={handleGenerateReport} disabled={!canGenerateReports || isGeneratingReport}>
                      {isGeneratingReport ? 'Generating...' : 'Generate Report'}
                    </Button>
                  </div>
                </div>

                {reportGenerated && (
                  <div className="mt-4 space-y-4">
                    <div className="flex justify-end space-x-2">
                      <Button variant="outline" onClick={handleDownloadReport}>
                        <Download className="mr-2 h-4 w-4" />
                        Download Report
                      </Button>
                      <Button variant="outline" onClick={handlePrintReport}>
                        <Printer className="mr-2 h-4 w-4" />
                        Print Report
                      </Button>
                    </div>
                    <FinancialReportView />
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="inventory">
          <Card>
            <CardHeader>
              <CardTitle>Inventory Reports</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6">
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="w-full sm:w-1/3">
                    <Label>Report Type</Label>
                    <Select defaultValue="stock">
                      <SelectTrigger>
                        <SelectValue placeholder="Select report type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="stock">Current Stock</SelectItem>
                        <SelectItem value="lowstock">Low Stock Items</SelectItem>
                        <SelectItem value="expiry">Near Expiry Items</SelectItem>
                        <SelectItem value="usage">Usage Analysis</SelectItem>
                        <SelectItem value="transactions">Transaction History</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="w-full sm:w-1/3">
                    <Label>Category</Label>
                    <Select defaultValue="all">
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Categories</SelectItem>
                        <SelectItem value="medications">Medications</SelectItem>
                        <SelectItem value="supplies">Medical Supplies</SelectItem>
                        <SelectItem value="equipment">Equipment</SelectItem>
                        <SelectItem value="lab">Laboratory</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-end">
                    <Button onClick={handleGenerateReport} disabled={!canGenerateReports || isGeneratingReport}>
                      {isGeneratingReport ? 'Generating...' : 'Generate Report'}
                    </Button>
                  </div>
                </div>

                {reportGenerated && (
                  <div className="mt-4 space-y-4">
                    <div className="flex justify-end space-x-2">
                      <Button variant="outline" onClick={handleDownloadReport}>
                        <Download className="mr-2 h-4 w-4" />
                        Download Report
                      </Button>
                      <Button variant="outline" onClick={handlePrintReport}>
                        <Printer className="mr-2 h-4 w-4" />
                        Print Report
                      </Button>
                    </div>
                    <InventoryReportView />
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Reports;
