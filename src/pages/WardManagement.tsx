import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import FadeIn from '@/components/animations/FadeIn';
import { PlusCircle, Edit, Trash2, BedDouble, Users, ClipboardList } from 'lucide-react';
import { Ward, Bed } from '@/lib/types';
import { hasPermission } from '@/lib/permissions';
import { useAuth } from '@/context/AuthContext';

const WardManagement: React.FC = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('wards');
  const [openWardDialog, setOpenWardDialog] = useState(false);
  const [openBedDialog, setOpenBedDialog] = useState(false);
  const [editingWard, setEditingWard] = useState<Ward | null>(null);
  const [editingBed, setEditingBed] = useState<Bed | null>(null);

  // Mock data for wards
  const [wards, setWards] = useState<Ward[]>([
    { id: '1', name: 'General Ward', capacity: 20, availableBeds: 5, description: 'For general patients' },
    { id: '2', name: 'ICU', capacity: 10, availableBeds: 2, description: 'For critical care patients' },
    { id: '3', name: 'Pediatric Ward', capacity: 15, availableBeds: 8, description: 'For children' },
    { id: '4', name: 'Maternity Ward', capacity: 12, availableBeds: 3, description: 'For pregnant women and newborns' }
  ]);

  // Mock data for beds
  const [beds, setBeds] = useState<Bed[]>([
    { id: '1', wardId: '1', status: 'available', patientId: undefined },
    { id: '2', wardId: '1', status: 'occupied', patientId: 'p1' },
    { id: '3', wardId: '2', status: 'available', patientId: undefined },
    { id: '4', wardId: '2', status: 'maintenance', patientId: undefined },
    { id: '5', wardId: '3', status: 'available', patientId: undefined },
    { id: '6', wardId: '4', status: 'occupied', patientId: 'p2' }
  ]);

  // Form states
  const [wardForm, setWardForm] = useState({
    name: '',
    capacity: 0,
    description: ''
  });

  const [bedForm, setBedForm] = useState({
    wardId: '',
    status: 'available'
  });

  // Handle ward form input changes
  const handleWardFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setWardForm(prev => ({
      ...prev,
      [name]: name === 'capacity' ? parseInt(value) || 0 : value
    }));
  };

  // Handle bed form input changes
  const handleBedFormSelectChange = (name: string, value: string) => {
    setBedForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Edit ward
  const handleEditWard = (ward: Ward) => {
    setEditingWard(ward);
    setWardForm({
      name: ward.name,
      capacity: ward.capacity,
      description: ward.description || ''
    });
    setOpenWardDialog(true);
  };

  // Delete ward
  const handleDeleteWard = (wardId: string) => {
    setWards(wards.filter(ward => ward.id !== wardId));
    toast({
      title: "Ward Deleted",
      description: "The ward has been removed successfully."
    });
  };

  // Save ward
  const handleSaveWard = () => {
    if (!wardForm.name || wardForm.capacity <= 0) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    if (editingWard) {
      // Update existing ward
      setWards(wards.map(ward => 
        ward.id === editingWard.id ? 
        { ...ward, name: wardForm.name, capacity: wardForm.capacity, description: wardForm.description } : 
        ward
      ));
      toast({
        title: "Ward Updated",
        description: "Ward information has been updated successfully."
      });
    } else {
      // Add new ward
      const newWard: Ward = {
        id: `ward_${Date.now().toString()}`,
        name: wardForm.name,
        capacity: wardForm.capacity,
        availableBeds: wardForm.capacity,
        description: wardForm.description
      };
      setWards([...wards, newWard]);
      toast({
        title: "Ward Added",
        description: "New ward has been added successfully."
      });
    }
    
    // Reset form and close dialog
    setWardForm({ name: '', capacity: 0, description: '' });
    setEditingWard(null);
    setOpenWardDialog(false);
  };

  // Edit bed
  const handleEditBed = (bed: Bed) => {
    setEditingBed(bed);
    setBedForm({
      wardId: bed.wardId,
      status: bed.status
    });
    setOpenBedDialog(true);
  };

  // Delete bed
  const handleDeleteBed = (bedId: string) => {
    setBeds(beds.filter(bed => bed.id !== bedId));
    toast({
      title: "Bed Deleted",
      description: "The bed has been removed successfully."
    });
  };

  // Save bed
  const handleSaveBed = () => {
    if (!bedForm.wardId) {
      toast({
        title: "Validation Error",
        description: "Please select a ward for the bed.",
        variant: "destructive"
      });
      return;
    }

    if (editingBed) {
      // Update existing bed
      setBeds(beds.map(bed => 
        bed.id === editingBed.id ? 
        { ...bed, wardId: bedForm.wardId, status: bedForm.status as 'available' | 'occupied' | 'maintenance' } : 
        bed
      ));
      toast({
        title: "Bed Updated",
        description: "Bed information has been updated successfully."
      });
    } else {
      // Add new bed
      const newBed: Bed = {
        id: `bed_${Date.now().toString()}`,
        wardId: bedForm.wardId,
        status: bedForm.status as 'available' | 'occupied' | 'maintenance'
      };
      setBeds([...beds, newBed]);
      toast({
        title: "Bed Added",
        description: "New bed has been added successfully."
      });
    }
    
    // Reset form and close dialog
    setBedForm({ wardId: '', status: 'available' });
    setEditingBed(null);
    setOpenBedDialog(false);
  };

  // Get ward name by ID
  const getWardNameById = (wardId: string) => {
    const ward = wards.find(w => w.id === wardId);
    return ward ? ward.name : 'Unknown Ward';
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
            <h2 className="text-3xl font-bold tracking-tight">Ward Management</h2>
            <p className="text-muted-foreground">
              Manage hospital wards and beds
            </p>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="wards" className="flex items-center">
              <ClipboardList className="mr-2 h-4 w-4" />
              Wards
            </TabsTrigger>
            <TabsTrigger value="beds" className="flex items-center">
              <BedDouble className="mr-2 h-4 w-4" />
              Beds
            </TabsTrigger>
          </TabsList>

          {/* Wards Tab */}
          <TabsContent value="wards" className="space-y-4">
            <div className="flex justify-end">
              <Dialog open={openWardDialog} onOpenChange={setOpenWardDialog}>
                <DialogTrigger asChild>
                  <Button onClick={() => {
                    setEditingWard(null);
                    setWardForm({ name: '', capacity: 0, description: '' });
                  }}>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Add Ward
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>{editingWard ? 'Edit Ward' : 'Add New Ward'}</DialogTitle>
                    <DialogDescription>
                      {editingWard 
                        ? 'Update the ward information below.' 
                        : 'Fill in the details to add a new ward to the system.'}
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="ward-name">Ward Name*</Label>
                      <Input
                        id="ward-name"
                        name="name"
                        value={wardForm.name}
                        onChange={handleWardFormChange}
                        placeholder="e.g., General Ward"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="ward-capacity">Capacity*</Label>
                      <Input
                        id="ward-capacity"
                        name="capacity"
                        type="number"
                        value={wardForm.capacity}
                        onChange={handleWardFormChange}
                        min={1}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="ward-description">Description</Label>
                      <Input
                        id="ward-description"
                        name="description"
                        value={wardForm.description}
                        onChange={handleWardFormChange}
                        placeholder="Brief description of the ward"
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setOpenWardDialog(false)}>Cancel</Button>
                    <Button onClick={handleSaveWard}>Save</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>

            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Capacity</TableHead>
                      <TableHead>Available Beds</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {wards.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center">No wards found</TableCell>
                      </TableRow>
                    ) : (
                      wards.map((ward) => (
                        <TableRow key={ward.id}>
                          <TableCell>{ward.name}</TableCell>
                          <TableCell>{ward.capacity}</TableCell>
                          <TableCell>
                            <Badge variant={ward.availableBeds > 0 ? "outline" : "destructive"}>
                              {ward.availableBeds} / {ward.capacity}
                            </Badge>
                          </TableCell>
                          <TableCell>{ward.description || '-'}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end space-x-2">
                              <Button variant="ghost" size="icon" onClick={() => handleEditWard(ward)}>
                                <Edit className="h-4 w-4" />
                                <span className="sr-only">Edit</span>
                              </Button>
                              <Button variant="ghost" size="icon" onClick={() => handleDeleteWard(ward.id)}>
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
          </TabsContent>

          {/* Beds Tab */}
          <TabsContent value="beds" className="space-y-4">
            <div className="flex justify-end">
              <Dialog open={openBedDialog} onOpenChange={setOpenBedDialog}>
                <DialogTrigger asChild>
                  <Button onClick={() => {
                    setEditingBed(null);
                    setBedForm({ wardId: '', status: 'available' });
                  }}>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Add Bed
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>{editingBed ? 'Edit Bed' : 'Add New Bed'}</DialogTitle>
                    <DialogDescription>
                      {editingBed 
                        ? 'Update the bed information below.' 
                        : 'Fill in the details to add a new bed to the system.'}
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="bed-ward">Ward*</Label>
                      <Select
                        value={bedForm.wardId}
                        onValueChange={(value) => handleBedFormSelectChange('wardId', value)}
                      >
                        <SelectTrigger id="bed-ward">
                          <SelectValue placeholder="Select a ward" />
                        </SelectTrigger>
                        <SelectContent>
                          {wards.map((ward) => (
                            <SelectItem key={ward.id} value={ward.id}>
                              {ward.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="bed-status">Status</Label>
                      <Select
                        value={bedForm.status}
                        onValueChange={(value) => handleBedFormSelectChange('status', value)}
                      >
                        <SelectTrigger id="bed-status">
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="available">Available</SelectItem>
                          <SelectItem value="occupied">Occupied</SelectItem>
                          <SelectItem value="maintenance">Maintenance</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setOpenBedDialog(false)}>Cancel</Button>
                    <Button onClick={handleSaveBed}>Save</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>

            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Ward</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Patient</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {beds.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center">No beds found</TableCell>
                      </TableRow>
                    ) : (
                      beds.map((bed) => (
                        <TableRow key={bed.id}>
                          <TableCell>{bed.id}</TableCell>
                          <TableCell>{getWardNameById(bed.wardId)}</TableCell>
                          <TableCell>
                            <Badge 
                              variant={
                                bed.status === 'available' ? "secondary" : 
                                bed.status === 'occupied' ? "outline" : 
                                "destructive"
                              }
                            >
                              {bed.status}
                            </Badge>
                          </TableCell>
                          <TableCell>{bed.patientId || '-'}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end space-x-2">
                              <Button variant="ghost" size="icon" onClick={() => handleEditBed(bed)}>
                                <Edit className="h-4 w-4" />
                                <span className="sr-only">Edit</span>
                              </Button>
                              <Button variant="ghost" size="icon" onClick={() => handleDeleteBed(bed.id)}>
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
          </TabsContent>
        </Tabs>
      </div>
    </FadeIn>
  );
};

export default WardManagement;
