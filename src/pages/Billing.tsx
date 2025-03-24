
import React, { useState, useEffect } from 'react';
import {
  ChevronDown,
  ChevronUp,
  Download,
  Plus,
  Search,
  Trash2,
  Edit,
  CreditCard,
  Filter,
  DollarSign,
  FileText,
  MoreHorizontal,
  CheckCircle,
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
import { Bill, Patient } from '@/lib/types';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

// Mock patients for billing
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

// Generate random bill items
const generateBillItems = () => {
  const items = [];
  const possibleItems = [
    { name: 'Consultation', price: 150 },
    { name: 'Blood Test', price: 80 },
    { name: 'X-Ray', price: 120 },
    { name: 'Ultrasound', price: 200 },
    { name: 'MRI Scan', price: 500 },
    { name: 'CT Scan', price: 350 },
    { name: 'Physical Therapy', price: 90 },
    { name: 'Medication', price: 50 },
    { name: 'Surgery', price: 1500 },
    { name: 'Room Charges', price: 300 },
  ];
  
  const numItems = Math.floor(Math.random() * 4) + 1; // 1 to 4 items
  
  for (let i = 0; i < numItems; i++) {
    const itemIndex = Math.floor(Math.random() * possibleItems.length);
    const quantity = Math.floor(Math.random() * 3) + 1; // 1 to 3 quantity
    const item = possibleItems[itemIndex];
    
    items.push({
      id: `I${Math.random().toString(36).substring(2, 9)}`,
      name: item.name,
      description: `Standard ${item.name.toLowerCase()}`,
      quantity,
      unitPrice: item.price,
      totalPrice: item.price * quantity,
    });
  }
  
  return items;
};

// Generate random future date for due date
const getRandomFutureDate = (maxDays = 30) => {
  const now = new Date();
  const futureDate = new Date();
  futureDate.setDate(now.getDate() + Math.floor(Math.random() * maxDays) + 1);
  return futureDate;
};

// Mock bills
const mockBills: Bill[] = Array.from({ length: 50 }, (_, i) => {
  const patientIndex = Math.floor(Math.random() * mockPatients.length);
  const items = generateBillItems();
  const totalAmount = items.reduce((sum, item) => sum + item.totalPrice, 0);
  const status = ['pending', 'paid', 'overdue', 'cancelled'][Math.floor(Math.random() * 4)] as Bill['status'];
  
  return {
    id: `B${(i + 1).toString().padStart(4, '0')}`,
    patientId: mockPatients[patientIndex].id,
    patientName: mockPatients[patientIndex].name,
    amount: totalAmount,
    items,
    status,
    dueDate: getRandomFutureDate(),
    paidAt: status === 'paid' ? new Date(Date.now() - Math.floor(Math.random() * 1000000000)) : undefined,
    createdAt: new Date(Date.now() - Math.floor(Math.random() * 10000000000)),
    updatedAt: new Date(),
  };
});

const Billing: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [bills, setBills] = useState<Bill[]>([]);
  const [filteredBills, setFilteredBills] = useState<Bill[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [sortField, setSortField] = useState<'amount' | 'dueDate' | 'createdAt'>('dueDate');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [billDetailsOpen, setBillDetailsOpen] = useState(false);
  const [currentBill, setCurrentBill] = useState<Bill | null>(null);
  const [activeTab, setActiveTab] = useState('all');

  // Calculate summary stats
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalPending: 0,
    totalOverdue: 0,
    revenueThisMonth: 0,
  });

  // Redirect if not logged in
  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  useEffect(() => {
    // Simulate API call
    const timer = setTimeout(() => {
      setBills(mockBills);
      setFilteredBills(mockBills);
      
      // Calculate stats
      const totalRevenue = mockBills
        .filter(bill => bill.status === 'paid')
        .reduce((sum, bill) => sum + bill.amount, 0);
      
      const totalPending = mockBills
        .filter(bill => bill.status === 'pending')
        .reduce((sum, bill) => sum + bill.amount, 0);
      
      const totalOverdue = mockBills
        .filter(bill => bill.status === 'overdue')
        .reduce((sum, bill) => sum + bill.amount, 0);
      
      // Calculate revenue this month
      const now = new Date();
      const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      
      const revenueThisMonth = mockBills
        .filter(bill => 
          bill.status === 'paid' && 
          bill.paidAt && 
          new Date(bill.paidAt) >= firstDayOfMonth
        )
        .reduce((sum, bill) => sum + bill.amount, 0);
      
      setStats({
        totalRevenue,
        totalPending,
        totalOverdue,
        revenueThisMonth,
      });
      
      setLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    // Filter and sort bills
    let result = [...bills];
    
    // Filter by status
    if (statusFilter !== 'all') {
      result = result.filter(bill => bill.status === statusFilter);
    }
    
    // Filter by tab
    if (activeTab === 'pending') {
      result = result.filter(bill => bill.status === 'pending');
    } else if (activeTab === 'paid') {
      result = result.filter(bill => bill.status === 'paid');
    } else if (activeTab === 'overdue') {
      result = result.filter(bill => bill.status === 'overdue');
    }
    
    // Apply search
    if (search) {
      const searchLower = search.toLowerCase();
      result = result.filter(
        bill => 
          bill.patientName.toLowerCase().includes(searchLower) ||
          bill.id.toLowerCase().includes(searchLower)
      );
    }
    
    // Apply sorting
    result.sort((a, b) => {
      if (sortField === 'amount') {
        return sortDirection === 'asc' ? a.amount - b.amount : b.amount - a.amount;
      } else {
        const dateA = new Date(a[sortField]).getTime();
        const dateB = new Date(b[sortField]).getTime();
        return sortDirection === 'asc' ? dateA - dateB : dateB - dateA;
      }
    });
    
    setFilteredBills(result);
  }, [bills, search, sortField, sortDirection, statusFilter, activeTab]);

  const handleSort = (field: 'amount' | 'dueDate' | 'createdAt') => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const handleDeleteBill = (id: string) => {
    // In a real app, this would be an API call
    setBills(bills.filter(bill => bill.id !== id));
    toast.success('Bill deleted successfully');
  };

  const handleEditBill = (bill: Bill) => {
    setCurrentBill(bill);
    setDialogOpen(true);
  };

  const handleViewBillDetails = (bill: Bill) => {
    setCurrentBill(bill);
    setBillDetailsOpen(true);
  };

  const handleAddBill = () => {
    setCurrentBill(null);
    setDialogOpen(true);
  };

  const handleBillFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would send the form data to an API
    setDialogOpen(false);
    toast.success(currentBill ? 'Bill updated successfully' : 'Bill created successfully');
  };

  const handleUpdateBillStatus = (id: string, status: Bill['status']) => {
    // In a real app, this would be an API call
    setBills(bills.map(bill => 
      bill.id === id ? { 
        ...bill, 
        status,
        paidAt: status === 'paid' ? new Date() : undefined,
        updatedAt: new Date()
      } : bill
    ));
    
    const statusMessages = {
      paid: 'Payment recorded successfully',
      pending: 'Bill marked as pending',
      overdue: 'Bill marked as overdue',
      cancelled: 'Bill cancelled successfully',
    };
    
    toast.success(statusMessages[status] || 'Bill status updated');
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  if (!user) return null;

  return (
    <div className="container max-w-[1600px] mx-auto">
      <FadeIn>
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Billing & Payments</h1>
            <p className="text-muted-foreground">
              Manage patient billing and track payments
            </p>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
            <Button onClick={handleAddBill} className="bg-hms-600 hover:bg-hms-700">
              <Plus className="mr-2 h-4 w-4" />
              Create Bill
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
          <FadeIn delay={100}>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Total Revenue
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center">
                  <div className="mr-2 rounded-full bg-green-100 p-1">
                    <DollarSign className="h-4 w-4 text-green-700" />
                  </div>
                  {loading ? (
                    <div className="h-7 w-24 bg-muted rounded animate-pulse" />
                  ) : (
                    <div className="text-2xl font-bold">{formatCurrency(stats.totalRevenue)}</div>
                  )}
                </div>
              </CardContent>
            </Card>
          </FadeIn>
          
          <FadeIn delay={200}>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Pending Payments
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center">
                  <div className="mr-2 rounded-full bg-yellow-100 p-1">
                    <Clock className="h-4 w-4 text-yellow-700" />
                  </div>
                  {loading ? (
                    <div className="h-7 w-24 bg-muted rounded animate-pulse" />
                  ) : (
                    <div className="text-2xl font-bold">{formatCurrency(stats.totalPending)}</div>
                  )}
                </div>
              </CardContent>
            </Card>
          </FadeIn>
          
          <FadeIn delay={300}>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Overdue Payments
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center">
                  <div className="mr-2 rounded-full bg-red-100 p-1">
                    <AlertTriangle className="h-4 w-4 text-red-700" />
                  </div>
                  {loading ? (
                    <div className="h-7 w-24 bg-muted rounded animate-pulse" />
                  ) : (
                    <div className="text-2xl font-bold">{formatCurrency(stats.totalOverdue)}</div>
                  )}
                </div>
              </CardContent>
            </Card>
          </FadeIn>
          
          <FadeIn delay={400}>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Revenue This Month
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center">
                  <div className="mr-2 rounded-full bg-blue-100 p-1">
                    <CreditCard className="h-4 w-4 text-blue-700" />
                  </div>
                  {loading ? (
                    <div className="h-7 w-24 bg-muted rounded animate-pulse" />
                  ) : (
                    <div className="text-2xl font-bold">{formatCurrency(stats.revenueThisMonth)}</div>
                  )}
                </div>
              </CardContent>
            </Card>
          </FadeIn>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
          <div className="flex flex-col sm:flex-row justify-between gap-4 mb-4">
            <TabsList>
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="pending">Pending</TabsTrigger>
              <TabsTrigger value="paid">Paid</TabsTrigger>
              <TabsTrigger value="overdue">Overdue</TabsTrigger>
            </TabsList>
            
            <div className="flex flex-wrap gap-2">
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search bills..."
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
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="paid">Paid</SelectItem>
                        <SelectItem value="overdue">Overdue</SelectItem>
                        <SelectItem value="cancelled">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          <TabsContent value="all" className="mt-0">
            <BillsList 
              bills={filteredBills}
              loading={loading}
              onEdit={handleEditBill}
              onDelete={handleDeleteBill}
              onUpdateStatus={handleUpdateBillStatus}
              onViewDetails={handleViewBillDetails}
              formatDate={formatDate}
              formatCurrency={formatCurrency}
              onSort={handleSort}
              sortDirection={sortDirection}
              sortField={sortField}
            />
          </TabsContent>
          
          <TabsContent value="pending" className="mt-0">
            <BillsList 
              bills={filteredBills}
              loading={loading}
              onEdit={handleEditBill}
              onDelete={handleDeleteBill}
              onUpdateStatus={handleUpdateBillStatus}
              onViewDetails={handleViewBillDetails}
              formatDate={formatDate}
              formatCurrency={formatCurrency}
              onSort={handleSort}
              sortDirection={sortDirection}
              sortField={sortField}
            />
          </TabsContent>
          
          <TabsContent value="paid" className="mt-0">
            <BillsList 
              bills={filteredBills}
              loading={loading}
              onEdit={handleEditBill}
              onDelete={handleDeleteBill}
              onUpdateStatus={handleUpdateBillStatus}
              onViewDetails={handleViewBillDetails}
              formatDate={formatDate}
              formatCurrency={formatCurrency}
              onSort={handleSort}
              sortDirection={sortDirection}
              sortField={sortField}
            />
          </TabsContent>
          
          <TabsContent value="overdue" className="mt-0">
            <BillsList 
              bills={filteredBills}
              loading={loading}
              onEdit={handleEditBill}
              onDelete={handleDeleteBill}
              onUpdateStatus={handleUpdateBillStatus}
              onViewDetails={handleViewBillDetails}
              formatDate={formatDate}
              formatCurrency={formatCurrency}
              onSort={handleSort}
              sortDirection={sortDirection}
              sortField={sortField}
            />
          </TabsContent>
        </Tabs>
      </FadeIn>

      {/* Add/Edit Bill Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>
              {currentBill ? 'Edit Bill' : 'Create New Bill'}
            </DialogTitle>
            <DialogDescription>
              {currentBill 
                ? 'Update the bill details below.'
                : 'Fill out the form below to create a new bill.'}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleBillFormSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="patient">Patient</Label>
                  <Select defaultValue={currentBill?.patientId || mockPatients[0].id}>
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
                  <Label htmlFor="status">Status</Label>
                  <Select defaultValue={currentBill?.status || 'pending'}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="paid">Paid</SelectItem>
                      <SelectItem value="overdue">Overdue</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="dueDate">Due Date</Label>
                <Input 
                  id="dueDate" 
                  type="date" 
                  defaultValue={
                    currentBill 
                      ? new Date(currentBill.dueDate).toISOString().split('T')[0]
                      : new Date().toISOString().split('T')[0]
                  } 
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label>Bill Items</Label>
                <div className="border rounded-md p-4">
                  <div className="grid grid-cols-12 gap-2 mb-2 text-sm font-medium">
                    <div className="col-span-5">Item</div>
                    <div className="col-span-2 text-center">Qty</div>
                    <div className="col-span-2 text-center">Unit Price</div>
                    <div className="col-span-3 text-right">Total</div>
                  </div>
                  
                  <div className="space-y-2">
                    {(currentBill?.items || [
                      { id: 'new-1', name: 'Consultation', description: 'Standard consultation', quantity: 1, unitPrice: 150, totalPrice: 150 }
                    ]).map((item, index) => (
                      <div key={item.id} className="grid grid-cols-12 gap-2 items-center">
                        <div className="col-span-5">
                          <Input 
                            defaultValue={item.name} 
                            placeholder="Item name"
                          />
                        </div>
                        <div className="col-span-2">
                          <Input 
                            type="number" 
                            min="1" 
                            defaultValue={item.quantity} 
                            className="text-center"
                          />
                        </div>
                        <div className="col-span-2">
                          <Input 
                            type="number" 
                            min="0" 
                            step="0.01" 
                            defaultValue={item.unitPrice} 
                            className="text-center"
                          />
                        </div>
                        <div className="col-span-3 text-right">
                          {formatCurrency(item.totalPrice)}
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="sm" 
                    className="mt-4 w-full"
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Add Item
                  </Button>
                </div>
              </div>
              
              <div className="flex justify-between items-center py-2 font-medium">
                <span>Total Amount:</span>
                <span className="text-xl">
                  {formatCurrency(currentBill?.amount || 150)}
                </span>
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
                {currentBill ? 'Update Bill' : 'Create Bill'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Bill Details Dialog */}
      <Dialog open={billDetailsOpen} onOpenChange={setBillDetailsOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>
              Bill Details
            </DialogTitle>
            <DialogDescription>
              {currentBill?.id}
            </DialogDescription>
          </DialogHeader>
          
          {currentBill && (
            <div className="space-y-6">
              <div className="flex justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Patient</p>
                  <p className="font-medium">{currentBill.patientName}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">Date</p>
                  <p className="font-medium">{formatDate(currentBill.createdAt)}</p>
                </div>
              </div>
              
              <div className="flex justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Status</p>
                  <span 
                    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      currentBill.status === 'paid' 
                        ? 'bg-green-100 text-green-700' 
                        : currentBill.status === 'pending' 
                        ? 'bg-yellow-100 text-yellow-700'
                        : currentBill.status === 'overdue'
                        ? 'bg-red-100 text-red-700'
                        : 'bg-gray-100 text-gray-700'
                    }`}
                  >
                    {currentBill.status.charAt(0).toUpperCase() + currentBill.status.slice(1)}
                  </span>
                </div>
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">Due Date</p>
                  <p className="font-medium">{formatDate(currentBill.dueDate)}</p>
                </div>
              </div>
              
              <div className="rounded-md border">
                <div className="grid grid-cols-12 gap-2 p-3 bg-muted text-sm font-medium">
                  <div className="col-span-6">Item</div>
                  <div className="col-span-2 text-center">Qty</div>
                  <div className="col-span-2 text-right">Unit Price</div>
                  <div className="col-span-2 text-right">Total</div>
                </div>
                
                <div className="divide-y">
                  {currentBill.items.map((item, index) => (
                    <div key={item.id} className="grid grid-cols-12 gap-2 p-3 text-sm">
                      <div className="col-span-6">
                        <p className="font-medium">{item.name}</p>
                        {item.description && (
                          <p className="text-xs text-muted-foreground">{item.description}</p>
                        )}
                      </div>
                      <div className="col-span-2 text-center">{item.quantity}</div>
                      <div className="col-span-2 text-right">{formatCurrency(item.unitPrice)}</div>
                      <div className="col-span-2 text-right font-medium">{formatCurrency(item.totalPrice)}</div>
                    </div>
                  ))}
                </div>
                
                <div className="grid grid-cols-12 gap-2 p-3 bg-muted text-sm font-medium">
                  <div className="col-span-10 text-right">Total:</div>
                  <div className="col-span-2 text-right">{formatCurrency(currentBill.amount)}</div>
                </div>
              </div>
              
              <div className="flex justify-end space-x-2">
                <Button 
                  variant="outline" 
                  onClick={() => setBillDetailsOpen(false)}
                >
                  Close
                </Button>
                <Button 
                  variant="outline"
                  className="border-hms-600 text-hms-600 hover:bg-hms-50"
                >
                  <FileText className="mr-2 h-4 w-4" />
                  Print Invoice
                </Button>
                {currentBill.status === 'pending' && (
                  <Button 
                    onClick={() => {
                      handleUpdateBillStatus(currentBill.id, 'paid');
                      setBillDetailsOpen(false);
                    }}
                    className="bg-hms-600 hover:bg-hms-700"
                  >
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Mark as Paid
                  </Button>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

interface BillsListProps {
  bills: Bill[];
  loading: boolean;
  onEdit: (bill: Bill) => void;
  onDelete: (id: string) => void;
  onUpdateStatus: (id: string, status: Bill['status']) => void;
  onViewDetails: (bill: Bill) => void;
  formatDate: (date: Date) => string;
  formatCurrency: (amount: number) => string;
  onSort: (field: 'amount' | 'dueDate' | 'createdAt') => void;
  sortDirection: 'asc' | 'desc';
  sortField: 'amount' | 'dueDate' | 'createdAt';
}

const BillsList: React.FC<BillsListProps> = ({
  bills,
  loading,
  onEdit,
  onDelete,
  onUpdateStatus,
  onViewDetails,
  formatDate,
  formatCurrency,
  onSort,
  sortDirection,
  sortField,
}) => {
  return (
    <div className="rounded-md border">
      <div className="relative w-full overflow-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Bill #</TableHead>
              <TableHead>Patient</TableHead>
              <TableHead 
                className="cursor-pointer hover:bg-muted transition-colors"
                onClick={() => onSort('amount')}
              >
                <div className="flex items-center">
                  Amount
                  {sortField === 'amount' && (
                    sortDirection === 'asc' ? <ChevronUp className="ml-1 h-4 w-4" /> : <ChevronDown className="ml-1 h-4 w-4" />
                  )}
                </div>
              </TableHead>
              <TableHead 
                className="cursor-pointer hover:bg-muted transition-colors"
                onClick={() => onSort('dueDate')}
              >
                <div className="flex items-center">
                  Due Date
                  {sortField === 'dueDate' && (
                    sortDirection === 'asc' ? <ChevronUp className="ml-1 h-4 w-4" /> : <ChevronDown className="ml-1 h-4 w-4" />
                  )}
                </div>
              </TableHead>
              <TableHead 
                className="cursor-pointer hover:bg-muted transition-colors"
                onClick={() => onSort('createdAt')}
              >
                <div className="flex items-center">
                  Created
                  {sortField === 'createdAt' && (
                    sortDirection === 'asc' ? <ChevronUp className="ml-1 h-4 w-4" /> : <ChevronDown className="ml-1 h-4 w-4" />
                  )}
                </div>
              </TableHead>
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
            ) : bills.length > 0 ? (
              bills.map((bill) => (
                <TableRow key={bill.id}>
                  <TableCell className="font-medium">{bill.id}</TableCell>
                  <TableCell>{bill.patientName}</TableCell>
                  <TableCell>{formatCurrency(bill.amount)}</TableCell>
                  <TableCell>{formatDate(bill.dueDate)}</TableCell>
                  <TableCell>{formatDate(bill.createdAt)}</TableCell>
                  <TableCell>
                    <span 
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        bill.status === 'paid' 
                          ? 'bg-green-100 text-green-700' 
                          : bill.status === 'pending' 
                          ? 'bg-yellow-100 text-yellow-700'
                          : bill.status === 'overdue'
                          ? 'bg-red-100 text-red-700'
                          : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      {bill.status.charAt(0).toUpperCase() + bill.status.slice(1)}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-1">
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => onViewDetails(bill)}
                      >
                        <Eye className="h-4 w-4" />
                        <span className="sr-only">View</span>
                      </Button>
                      
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">More</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => onEdit(bill)}>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          
                          {bill.status !== 'paid' && (
                            <DropdownMenuItem onClick={() => onUpdateStatus(bill.id, 'paid')}>
                              <CheckCircle className="mr-2 h-4 w-4 text-green-600" />
                              Mark as Paid
                            </DropdownMenuItem>
                          )}
                          
                          {bill.status === 'pending' && (
                            <DropdownMenuItem onClick={() => onUpdateStatus(bill.id, 'overdue')}>
                              <AlertTriangle className="mr-2 h-4 w-4 text-yellow-600" />
                              Mark as Overdue
                            </DropdownMenuItem>
                          )}
                          
                          <DropdownMenuItem onClick={() => onDelete(bill.id)}>
                            <Trash2 className="mr-2 h-4 w-4 text-red-600" />
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
                  No bills found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

// Missing AlertTriangle icon
const AlertTriangle = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
    <path d="M12 9v4" />
    <path d="M12 17h.01" />
  </svg>
);

const Clock = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
);

export default Billing;
