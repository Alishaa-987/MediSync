
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Search, Plus, RefreshCcw, AlertTriangle, FileText } from 'lucide-react';
import FadeIn from '@/components/animations/FadeIn';
import { Medicine } from '@/lib/types';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import InventoryReportView from '@/components/reports/InventoryReportView';

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

// Update some items to be low stock for demonstration
mockMedicines[2].quantity = 8;
mockMedicines[5].quantity = 12;
mockMedicines[9].quantity = 15;

const Pharmacy: React.FC = () => {
  const [medicines, setMedicines] = useState<Medicine[]>(mockMedicines);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentMedicine, setCurrentMedicine] = useState<Medicine | null>(null);
  const [addMedicineDialogOpen, setAddMedicineDialogOpen] = useState(false);
  const [inventoryReportOpen, setInventoryReportOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // Filter medicines based on search term
  const filteredMedicines = medicines.filter(med => 
    med.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    med.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    med.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Get low stock medicines
  const lowStockMedicines = medicines.filter(med => med.quantity < 30);

  const handleAddMedicine = (e: React.FormEvent) => {
    e.preventDefault();
    
    // In a real app, this would send the data to an API
    if (currentMedicine) {
      // Edit existing medicine
      setMedicines(medicines.map(med => 
        med.id === currentMedicine.id ? { ...currentMedicine, updatedAt: new Date() } : med
      ));
      toast.success(`${currentMedicine.name} has been updated`);
    } else {
      // Add new medicine (with mocked data)
      const newMedicine: Medicine = {
        id: `M${(medicines.length + 1).toString().padStart(4, '0')}`,
        name: (document.getElementById('medicineName') as HTMLInputElement).value,
        description: (document.getElementById('description') as HTMLInputElement).value,
        category: (document.getElementById('category') as HTMLSelectElement).value,
        quantity: parseInt((document.getElementById('quantity') as HTMLInputElement).value),
        unitPrice: parseFloat((document.getElementById('unitPrice') as HTMLInputElement).value),
        expiryDate: new Date((document.getElementById('expiryDate') as HTMLInputElement).value),
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      
      setMedicines([...medicines, newMedicine]);
      toast.success(`${newMedicine.name} has been added to inventory`);
    }
    
    setAddMedicineDialogOpen(false);
    setCurrentMedicine(null);
  };

  const handleEditMedicine = (medicine: Medicine) => {
    setCurrentMedicine(medicine);
    setAddMedicineDialogOpen(true);
  };

  const handleUpdateStock = (id: string, change: number) => {
    setLoading(true);
    
    // Simulate API call delay
    setTimeout(() => {
      setMedicines(medicines.map(med => {
        if (med.id === id) {
          const newQuantity = Math.max(0, med.quantity + change);
          return { ...med, quantity: newQuantity, updatedAt: new Date() };
        }
        return med;
      }));
      
      const medicine = medicines.find(med => med.id === id);
      if (medicine) {
        if (change > 0) {
          toast.success(`Added ${change} units of ${medicine.name} to inventory`);
        } else {
          toast.success(`Removed ${Math.abs(change)} units of ${medicine.name} from inventory`);
        }
      }
      
      setLoading(false);
    }, 500);
  };

  const handleReorderMedicine = (id: string) => {
    setLoading(true);
    
    // Simulate API call delay
    setTimeout(() => {
      setMedicines(medicines.map(med => {
        if (med.id === id) {
          // Assume we reorder 50 units
          return { ...med, quantity: med.quantity + 50, updatedAt: new Date() };
        }
        return med;
      }));
      
      const medicine = medicines.find(med => med.id === id);
      if (medicine) {
        toast.success(`Reordered 50 units of ${medicine.name}`);
      }
      
      setLoading(false);
    }, 1000);
  };

  const handleGenerateInventoryReport = () => {
    setInventoryReportOpen(true);
  };

  return (
    <FadeIn>
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Pharmacy</h2>
            <p className="text-muted-foreground">
              Manage medications and inventory
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              className="flex items-center"
              onClick={handleGenerateInventoryReport}
            >
              <FileText className="mr-2 h-4 w-4" />
              Inventory Report
            </Button>
            <Button
              onClick={() => setAddMedicineDialogOpen(true)}
              className="flex items-center"
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Medicine
            </Button>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader className="pb-2 bg-gradient-to-r from-blue-50 to-indigo-50">
              <CardTitle className="flex items-center">
                <Search className="mr-2 h-5 w-5 text-blue-600" />
                Search Inventory
              </CardTitle>
              <CardDescription>
                Find medications in stock
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search by name, category, or ID..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2 bg-gradient-to-r from-amber-50 to-yellow-50">
              <CardTitle className="flex items-center">
                <AlertTriangle className="mr-2 h-5 w-5 text-amber-600" />
                Low Stock Alerts
              </CardTitle>
              <CardDescription>
                Medications that need reordering
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-4">
              {lowStockMedicines.length > 0 ? (
                <div className="space-y-2">
                  {lowStockMedicines.slice(0, 3).map(med => (
                    <div key={med.id} className="flex items-center justify-between border-b pb-2">
                      <div>
                        <p className="font-medium">{med.name}</p>
                        <p className="text-sm text-muted-foreground">{med.quantity} units remaining</p>
                      </div>
                      <Button 
                        size="sm" 
                        variant="outline"
                        className="ml-2"
                        onClick={() => handleReorderMedicine(med.id)}
                        disabled={loading}
                      >
                        <RefreshCcw className="mr-1 h-3 w-3" />
                        Reorder
                      </Button>
                    </div>
                  ))}
                  {lowStockMedicines.length > 3 && (
                    <p className="text-sm text-muted-foreground text-center pt-2">
                      + {lowStockMedicines.length - 3} more items
                    </p>
                  )}
                </div>
              ) : (
                <p className="text-center text-muted-foreground py-4">
                  No medications are low in stock
                </p>
              )}
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2 bg-gradient-to-r from-green-50 to-emerald-50">
              <CardTitle className="flex items-center">
                <RefreshCcw className="mr-2 h-5 w-5 text-green-600" />
                Stock Management
              </CardTitle>
              <CardDescription>
                Update inventory quantities
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-4">
              <p className="mb-4">Quick access to update medication stock levels and prices.</p>
              <Button 
                className="w-full bg-green-600 hover:bg-green-700"
                onClick={() => setAddMedicineDialogOpen(true)}
              >
                Manage Inventory
              </Button>
            </CardContent>
          </Card>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Medication Inventory</CardTitle>
            <CardDescription>
              Current stock of all medications
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead className="text-right">Stock</TableHead>
                    <TableHead className="text-right">Unit Price</TableHead>
                    <TableHead className="text-right">Expiry Date</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredMedicines.length > 0 ? (
                    filteredMedicines.map((medicine) => (
                      <TableRow key={medicine.id}>
                        <TableCell className="font-medium">{medicine.id}</TableCell>
                        <TableCell>
                          <div>
                            <p>{medicine.name}</p>
                            <p className="text-xs text-muted-foreground">{medicine.description}</p>
                          </div>
                        </TableCell>
                        <TableCell>{medicine.category}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              medicine.quantity < 10 
                                ? 'bg-red-100 text-red-800' 
                                : medicine.quantity < 30
                                  ? 'bg-amber-100 text-amber-800'
                                  : 'bg-green-100 text-green-800'
                            } mr-2`}>
                              {medicine.quantity}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">${medicine.unitPrice.toFixed(2)}</TableCell>
                        <TableCell className="text-right">{medicine.expiryDate.toLocaleDateString()}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end space-x-1">
                            <Button 
                              variant="outline" 
                              size="sm"
                              className="h-8 px-2"
                              onClick={() => handleUpdateStock(medicine.id, -1)}
                              disabled={medicine.quantity <= 0 || loading}
                            >
                              -
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm"
                              className="h-8 px-2"
                              onClick={() => handleUpdateStock(medicine.id, 1)}
                              disabled={loading}
                            >
                              +
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm"
                              className="h-8"
                              onClick={() => handleEditMedicine(medicine)}
                            >
                              Edit
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={7} className="h-24 text-center">
                        No medications found.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Add/Edit Medicine Dialog */}
      <Dialog open={addMedicineDialogOpen} onOpenChange={setAddMedicineDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>{currentMedicine ? 'Edit Medicine' : 'Add New Medicine'}</DialogTitle>
            <DialogDescription>
              {currentMedicine ? 'Update the medicine details below.' : 'Fill out the form to add a new medicine to inventory.'}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleAddMedicine}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="medicineName">Medicine Name</Label>
                  <Input 
                    id="medicineName" 
                    placeholder="Amoxicillin"
                    defaultValue={currentMedicine?.name || ''} 
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select defaultValue={currentMedicine?.category || 'Antibiotics'}>
                    <SelectTrigger id="category">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Antibiotics">Antibiotics</SelectItem>
                      <SelectItem value="Cardiovascular">Cardiovascular</SelectItem>
                      <SelectItem value="Diabetes">Diabetes</SelectItem>
                      <SelectItem value="Respiratory">Respiratory</SelectItem>
                      <SelectItem value="Gastrointestinal">Gastrointestinal</SelectItem>
                      <SelectItem value="Pain Relief">Pain Relief</SelectItem>
                      <SelectItem value="Thyroid">Thyroid</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Input 
                  id="description" 
                  placeholder="Common antibiotic medication"
                  defaultValue={currentMedicine?.description || ''} 
                  required
                />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="quantity">Quantity</Label>
                  <Input 
                    id="quantity" 
                    type="number" 
                    min="0"
                    placeholder="50"
                    defaultValue={currentMedicine?.quantity || 50} 
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="unitPrice">Unit Price ($)</Label>
                  <Input 
                    id="unitPrice" 
                    type="number" 
                    step="0.01"
                    min="0.01"
                    placeholder="12.99"
                    defaultValue={currentMedicine?.unitPrice || 12.99} 
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="expiryDate">Expiry Date</Label>
                  <Input 
                    id="expiryDate" 
                    type="date" 
                    defaultValue={currentMedicine?.expiryDate.toISOString().split('T')[0] || new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]} 
                    required
                  />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => {
                  setAddMedicineDialogOpen(false);
                  setCurrentMedicine(null);
                }}
              >
                Cancel
              </Button>
              <Button type="submit">
                {currentMedicine ? 'Update Medicine' : 'Add Medicine'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Inventory Report Dialog */}
      <Dialog open={inventoryReportOpen} onOpenChange={setInventoryReportOpen}>
        <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Inventory Report</DialogTitle>
            <DialogDescription>
              Complete inventory status as of {new Date().toLocaleDateString()}
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <InventoryReportView medicines={medicines} />
          </div>
          <DialogFooter>
            <Button onClick={() => setInventoryReportOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </FadeIn>
  );
};

export default Pharmacy;
