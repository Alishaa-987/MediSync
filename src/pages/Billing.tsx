
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import {
  DollarSign, 
  CreditCard, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Search, 
  Plus, 
  FileText, 
  Download, 
  Filter,
  EyeIcon // Change from Eye to EyeIcon
} from 'lucide-react';
import FadeIn from '@/components/animations/FadeIn';

// Mock data
const invoices = [
  {
    id: 'INV-001',
    patient: 'John Doe',
    date: '2023-07-01',
    amount: 150.00,
    status: 'paid'
  },
  {
    id: 'INV-002',
    patient: 'Jane Smith',
    date: '2023-07-05',
    amount: 75.50,
    status: 'pending'
  },
  {
    id: 'INV-003',
    patient: 'Robert Johnson',
    date: '2023-07-10',
    amount: 320.75,
    status: 'overdue'
  },
  {
    id: 'INV-004',
    patient: 'Mary Williams',
    date: '2023-07-15',
    amount: 200.00,
    status: 'paid'
  },
  {
    id: 'INV-005',
    patient: 'David Brown',
    date: '2023-07-18',
    amount: 450.25,
    status: 'pending'
  },
];

const payments = [
  {
    id: 'PMT-001',
    patient: 'John Doe',
    date: '2023-07-01',
    amount: 150.00,
    method: 'Credit Card'
  },
  {
    id: 'PMT-002',
    patient: 'Mary Williams',
    date: '2023-07-15',
    amount: 200.00,
    method: 'Cash'
  },
  {
    id: 'PMT-003',
    patient: 'Sarah Davis',
    date: '2023-07-20',
    amount: 125.50,
    method: 'Bank Transfer'
  },
  {
    id: 'PMT-004',
    patient: 'Michael Jones',
    date: '2023-07-22',
    amount: 310.25,
    method: 'Credit Card'
  },
  {
    id: 'PMT-005',
    patient: 'Elizabeth Wilson',
    date: '2023-07-25',
    amount: 75.00,
    method: 'Cash'
  },
];

const Billing = () => {
  const [currentTab, setCurrentTab] = useState('invoices');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredInvoices = invoices.filter(invoice => 
    invoice.patient.toLowerCase().includes(searchQuery.toLowerCase()) ||
    invoice.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredPayments = payments.filter(payment => 
    payment.patient.toLowerCase().includes(searchQuery.toLowerCase()) ||
    payment.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="container max-w-[1600px] mx-auto p-6">
      <FadeIn>
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Billing & Payments</h1>
          <p className="text-muted-foreground">
            Manage invoices, process payments, and view financial reports.
          </p>
        </div>
      </FadeIn>

      <div className="mb-8">
        <FadeIn delay={100}>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between space-x-2">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Total Revenue</p>
                    <p className="text-2xl font-bold">$24,560.00</p>
                  </div>
                  <div className="bg-primary/10 p-2 rounded-full">
                    <DollarSign className="h-6 w-6 text-primary" />
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mt-3">+15.2% from last month</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between space-x-2">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Pending Invoices</p>
                    <p className="text-2xl font-bold">$5,240.50</p>
                  </div>
                  <div className="bg-yellow-100 p-2 rounded-full">
                    <Clock className="h-6 w-6 text-yellow-600" />
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mt-3">12 invoices pending payment</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between space-x-2">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Payments Received</p>
                    <p className="text-2xl font-bold">$18,420.75</p>
                  </div>
                  <div className="bg-green-100 p-2 rounded-full">
                    <CheckCircle className="h-6 w-6 text-green-600" />
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mt-3">38 payments this month</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between space-x-2">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Overdue Invoices</p>
                    <p className="text-2xl font-bold">$1,890.25</p>
                  </div>
                  <div className="bg-red-100 p-2 rounded-full">
                    <XCircle className="h-6 w-6 text-red-600" />
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mt-3">4 invoices overdue</p>
              </CardContent>
            </Card>
          </div>
        </FadeIn>
      </div>

      <div className="bg-white rounded-lg border shadow-sm">
        <FadeIn delay={200}>
          <Tabs value={currentTab} onValueChange={setCurrentTab}>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border-b">
              <TabsList>
                <TabsTrigger value="invoices">Invoices</TabsTrigger>
                <TabsTrigger value="payments">Payments</TabsTrigger>
                <TabsTrigger value="reports">Financial Reports</TabsTrigger>
              </TabsList>
              
              <div className="flex space-x-2 mt-4 sm:mt-0">
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search..."
                    className="pl-8 w-[200px] sm:w-[300px]"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <Button variant="outline" size="icon">
                  <Filter className="h-4 w-4" />
                  <span className="sr-only">Filter</span>
                </Button>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  New Invoice
                </Button>
              </div>
            </div>

            <TabsContent value="invoices" className="p-0">
              <div className="rounded-md overflow-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Invoice</TableHead>
                      <TableHead>Patient</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredInvoices.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                          No invoices found. Try a different search.
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredInvoices.map((invoice) => (
                        <TableRow key={invoice.id}>
                          <TableCell className="font-medium">{invoice.id}</TableCell>
                          <TableCell>{invoice.patient}</TableCell>
                          <TableCell>{invoice.date}</TableCell>
                          <TableCell>${invoice.amount.toFixed(2)}</TableCell>
                          <TableCell>
                            <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              invoice.status === 'paid' 
                                ? 'bg-green-100 text-green-800' 
                                : invoice.status === 'pending' 
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button variant="ghost" size="icon">
                              <EyeIcon className="h-4 w-4" />
                              <span className="sr-only">View</span>
                            </Button>
                            <Button variant="ghost" size="icon">
                              <Download className="h-4 w-4" />
                              <span className="sr-only">Download</span>
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>

            <TabsContent value="payments" className="p-0">
              <div className="rounded-md overflow-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Payment ID</TableHead>
                      <TableHead>Patient</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Method</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredPayments.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                          No payments found. Try a different search.
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredPayments.map((payment) => (
                        <TableRow key={payment.id}>
                          <TableCell className="font-medium">{payment.id}</TableCell>
                          <TableCell>{payment.patient}</TableCell>
                          <TableCell>{payment.date}</TableCell>
                          <TableCell>${payment.amount.toFixed(2)}</TableCell>
                          <TableCell>
                            <div className="flex items-center">
                              <CreditCard className="mr-2 h-4 w-4 text-muted-foreground" />
                              {payment.method}
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button variant="ghost" size="icon">
                              <EyeIcon className="h-4 w-4" />
                              <span className="sr-only">View</span>
                            </Button>
                            <Button variant="ghost" size="icon">
                              <FileText className="h-4 w-4" />
                              <span className="sr-only">Receipt</span>
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>

            <TabsContent value="reports" className="p-6">
              <div className="space-y-4">
                <h3 className="text-xl font-semibold">Financial Reports</h3>
                <p className="text-muted-foreground">
                  Access and download detailed financial reports for your practice.
                </p>
                
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle>Monthly Revenue</CardTitle>
                      <CardDescription>
                        Revenue breakdown by month
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Button variant="outline" className="w-full mt-4">
                        <Download className="mr-2 h-4 w-4" />
                        Download Report
                      </Button>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle>Payment Methods</CardTitle>
                      <CardDescription>
                        Analysis of payment methods used
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Button variant="outline" className="w-full mt-4">
                        <Download className="mr-2 h-4 w-4" />
                        Download Report
                      </Button>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle>Outstanding Balances</CardTitle>
                      <CardDescription>
                        List of patients with outstanding balances
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Button variant="outline" className="w-full mt-4">
                        <Download className="mr-2 h-4 w-4" />
                        Download Report
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </FadeIn>
      </div>
    </div>
  );
};

export default Billing;
