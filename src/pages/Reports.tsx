
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, Download, Printer, Search, ArrowRight } from 'lucide-react';
import FadeIn from '@/components/animations/FadeIn';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Patient, Medicine } from '@/lib/types';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { toast } from 'sonner';
import PatientReportView from '@/components/reports/PatientReportView';
import FinancialReportView from '@/components/reports/FinancialReportView';
import InventoryReportView from '@/components/reports/InventoryReportView';

// Mock data for patient reports
const mockPatients: Patient[] = Array.from({ length: 10 }, (_, i) => ({
  id: `P${(i + 1).toString().padStart(4, '0')}`,
  name: [
    'John Doe', 'Jane Smith', 'Michael Johnson', 'Emma Williams', 'Robert Brown',
    'Olivia Davis', 'William Miller', 'Sophia Wilson', 'James Moore', 'Isabella Taylor',
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

// Mock data for medicines
const mockMedicines: Medicine[] = Array.from({ length: 15 }, (_, i) => ({
  id: `M${(i + 1).toString().padStart(4, '0')}`,
  name: [
    'Amoxicillin', 'Lisinopril', 'Lipitor', 'Amlodipine', 'Metformin',
    'Albuterol', 'Omeprazole', 'Losartan', 'Gabapentin', 'Metoprolol',
    'Hydrochlorothiazide', 'Levothyroxine', 'Simvastatin', 'Azithromycin', 'Ibuprofen'
  ][i],
  description: `Common ${['antibiotic', 'blood pressure', 'cholesterol', 'diabetes', 'asthma', 'acid reflux', 'pain relief'][i % 7]} medication`,
  category: ['Antibiotics', 'Cardiovascular', 'Diabetes', 'Respiratory', 'Gastrointestinal', 'Pain Relief', 'Thyroid'][i % 7],
  quantity: Math.floor(Math.random() * 100) + 20,
  unitPrice: parseFloat((Math.random() * 50 + 5).toFixed(2)),
  expiryDate: new Date(Date.now() + (Math.floor(Math.random() * 365) + 30) * 24 * 60 * 60 * 1000),
  createdAt: new Date(Date.now() - Math.floor(Math.random() * 10000000000)),
  updatedAt: new Date(),
}));

// Mock financial data
const mockFinancialData = {
  totalRevenue: 253750.45,
  totalExpenses: 187320.25,
  netProfit: 66430.20,
  unpaidInvoices: 32145.75,
  revenueByDepartment: [
    { department: 'Cardiology', amount: 68540.50 },
    { department: 'Orthopedics', amount: 52350.25 },
    { department: 'Pediatrics', amount: 43215.75 },
    { department: 'Neurology', amount: 37840.00 },
    { department: 'Dermatology', amount: 28750.25 },
    { department: 'Ophthalmology', amount: 23054.70 }
  ],
  expenseCategories: [
    { category: 'Salaries', amount: 124500.00 },
    { category: 'Medications', amount: 35420.25 },
    { category: 'Equipment', amount: 18750.00 },
    { category: 'Facilities', amount: 8650.00 }
  ]
};

type ReportType = 'patient' | 'financial' | 'inventory' | null;

const Reports: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [reportType, setReportType] = useState<ReportType>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);
  const [searchDialogOpen, setSearchDialogOpen] = useState(false);

  const filteredPatients = mockPatients.filter(
    patient => patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
               patient.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleGeneratePatientReport = (patient: Patient) => {
    setIsGeneratingReport(true);
    setSearchDialogOpen(false);
    
    // Simulate report generation delay
    setTimeout(() => {
      setSelectedPatient(patient);
      setReportType('patient');
      setIsDialogOpen(true);
      setIsGeneratingReport(false);
    }, 1000);
  };

  const handleGenerateFinancialReport = () => {
    setIsGeneratingReport(true);
    
    // Simulate report generation delay
    setTimeout(() => {
      setReportType('financial');
      setIsDialogOpen(true);
      setIsGeneratingReport(false);
    }, 1500);
  };

  const handleGenerateInventoryReport = () => {
    setIsGeneratingReport(true);
    
    // Simulate report generation delay
    setTimeout(() => {
      setReportType('inventory');
      setIsDialogOpen(true);
      setIsGeneratingReport(false);
    }, 1200);
  };

  const handleDownloadReport = () => {
    toast.success("Report downloaded successfully");
    setIsDialogOpen(false);
  };

  const handlePrintReport = () => {
    toast.success("Sending report to printer");
    setIsDialogOpen(false);
  };

  const openPatientSearch = () => {
    setSearchTerm('');
    setSearchDialogOpen(true);
  };

  return (
    <FadeIn>
      <div className="space-y-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Reports</h2>
          <p className="text-muted-foreground">
            Generate and view hospital reports
          </p>
        </div>
        
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card className="overflow-hidden">
            <CardHeader className="pb-2 bg-gradient-to-r from-blue-50 to-indigo-50">
              <CardTitle className="flex items-center">
                <FileText className="mr-2 h-5 w-5 text-blue-600" />
                Patient Reports
              </CardTitle>
              <CardDescription>
                Patient visit summaries and history
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-4">
              <p className="mb-4">Generate detailed reports for patients including visit history, diagnoses, medications, and billing information.</p>
              {isGeneratingReport && reportType === 'patient' ? (
                <div className="flex justify-center items-center h-10">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-700"></div>
                  <span className="ml-2">Generating report...</span>
                </div>
              ) : (
                <Button 
                  className="w-full flex items-center justify-between" 
                  onClick={openPatientSearch}
                >
                  Select Patient
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              )}
            </CardContent>
          </Card>
          
          <Card className="overflow-hidden">
            <CardHeader className="pb-2 bg-gradient-to-r from-green-50 to-emerald-50">
              <CardTitle className="flex items-center">
                <FileText className="mr-2 h-5 w-5 text-green-600" />
                Financial Reports
              </CardTitle>
              <CardDescription>
                Revenue and expense reports
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-4">
              <p className="mb-4">Generate financial reports with revenue metrics, expense breakdowns, and profitability analysis.</p>
              {isGeneratingReport && reportType === 'financial' ? (
                <div className="flex justify-center items-center h-10">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-green-700"></div>
                  <span className="ml-2">Generating report...</span>
                </div>
              ) : (
                <Button 
                  className="w-full flex items-center justify-between bg-green-600 hover:bg-green-700" 
                  onClick={handleGenerateFinancialReport}
                >
                  Generate Report
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              )}
            </CardContent>
          </Card>
          
          <Card className="overflow-hidden">
            <CardHeader className="pb-2 bg-gradient-to-r from-amber-50 to-yellow-50">
              <CardTitle className="flex items-center">
                <FileText className="mr-2 h-5 w-5 text-amber-600" />
                Inventory Reports
              </CardTitle>
              <CardDescription>
                Medication and equipment inventory reports
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-4">
              <p className="mb-4">Generate inventory reports displaying current stock levels, expiry dates, and reorder recommendations.</p>
              {isGeneratingReport && reportType === 'inventory' ? (
                <div className="flex justify-center items-center h-10">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-amber-700"></div>
                  <span className="ml-2">Generating report...</span>
                </div>
              ) : (
                <Button 
                  className="w-full flex items-center justify-between bg-amber-600 hover:bg-amber-700" 
                  onClick={handleGenerateInventoryReport}
                >
                  Generate Report
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Patient Search Dialog */}
      <Dialog open={searchDialogOpen} onOpenChange={setSearchDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Select Patient</DialogTitle>
            <DialogDescription>
              Search for a patient to generate their report.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search by name or ID..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="border rounded-md max-h-72 overflow-y-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPatients.length > 0 ? (
                    filteredPatients.map((patient) => (
                      <TableRow key={patient.id}>
                        <TableCell className="font-medium">{patient.id}</TableCell>
                        <TableCell>{patient.name}</TableCell>
                        <TableCell className="text-right">
                          <Button 
                            size="sm" 
                            onClick={() => handleGeneratePatientReport(patient)}
                          >
                            Select
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={3} className="h-24 text-center">
                        No patients found.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Report View Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-4xl">
          <DialogHeader>
            <DialogTitle>
              {reportType === 'patient' && `Patient Report - ${selectedPatient?.name}`}
              {reportType === 'financial' && 'Financial Report'}
              {reportType === 'inventory' && 'Inventory Report'}
            </DialogTitle>
            <DialogDescription>
              {reportType === 'patient' && `Generated on ${new Date().toLocaleDateString()} for patient ID: ${selectedPatient?.id}`}
              {reportType === 'financial' && `Financial overview as of ${new Date().toLocaleDateString()}`}
              {reportType === 'inventory' && `Inventory status as of ${new Date().toLocaleDateString()}`}
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            {reportType === 'patient' && selectedPatient && (
              <PatientReportView patient={selectedPatient} />
            )}
            
            {reportType === 'financial' && (
              <FinancialReportView financialData={mockFinancialData} />
            )}
            
            {reportType === 'inventory' && (
              <InventoryReportView medicines={mockMedicines} />
            )}
          </div>
          
          <div className="flex justify-end space-x-2 mt-4">
            <Button 
              variant="outline" 
              onClick={handlePrintReport}
              className="flex items-center"
            >
              <Printer className="mr-2 h-4 w-4" />
              Print
            </Button>
            <Button 
              onClick={handleDownloadReport}
              className="flex items-center"
            >
              <Download className="mr-2 h-4 w-4" />
              Download PDF
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </FadeIn>
  );
};

export default Reports;
