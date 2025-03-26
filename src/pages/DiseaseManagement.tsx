
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import FadeIn from '@/components/animations/FadeIn';
import { PlusCircle, Edit, Trash2, Search } from 'lucide-react';
import { hasPermission } from '@/lib/permissions';
import { useAuth } from '@/context/AuthContext';

interface Disease {
  id: string;
  name: string;
  category: string;
  description: string;
  symptoms: string;
  treatments: string;
  severity: 'low' | 'medium' | 'high';
  isCommunicable: boolean;
}

const DiseaseManagement: React.FC = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [openDialog, setOpenDialog] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [editingDisease, setEditingDisease] = useState<Disease | null>(null);

  // Mock data for diseases
  const [diseases, setDiseases] = useState<Disease[]>([
    {
      id: '1',
      name: 'Diabetes Mellitus',
      category: 'Endocrine',
      description: 'A metabolic disease that causes high blood sugar.',
      symptoms: 'Increased thirst, frequent urination, hunger, fatigue',
      treatments: 'Insulin therapy, oral medications, lifestyle changes',
      severity: 'medium',
      isCommunicable: false
    },
    {
      id: '2',
      name: 'Influenza',
      category: 'Infectious',
      description: 'A highly contagious respiratory infection.',
      symptoms: 'Fever, cough, sore throat, body aches, fatigue',
      treatments: 'Antiviral medications, rest, fluids',
      severity: 'medium',
      isCommunicable: true
    },
    {
      id: '3',
      name: 'Hypertension',
      category: 'Cardiovascular',
      description: 'High blood pressure that can lead to heart disease.',
      symptoms: 'Often asymptomatic, headaches, shortness of breath',
      treatments: 'Medications, lifestyle changes, regular monitoring',
      severity: 'high',
      isCommunicable: false
    },
    {
      id: '4',
      name: 'Asthma',
      category: 'Respiratory',
      description: 'A condition causing airways to narrow and swell.',
      symptoms: 'Shortness of breath, wheezing, coughing, chest tightness',
      treatments: 'Inhalers, preventive medications, avoiding triggers',
      severity: 'medium',
      isCommunicable: false
    }
  ]);

  // Form state
  const [diseaseForm, setDiseaseForm] = useState<Omit<Disease, 'id'>>({
    name: '',
    category: '',
    description: '',
    symptoms: '',
    treatments: '',
    severity: 'medium',
    isCommunicable: false
  });

  // Handle form input changes
  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setDiseaseForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle checkbox changes
  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setDiseaseForm(prev => ({
      ...prev,
      [name]: checked
    }));
  };

  // Handle severity selection
  const handleSeverityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setDiseaseForm(prev => ({
      ...prev,
      severity: e.target.value as 'low' | 'medium' | 'high'
    }));
  };

  // Edit disease
  const handleEditDisease = (disease: Disease) => {
    setEditingDisease(disease);
    setDiseaseForm({
      name: disease.name,
      category: disease.category,
      description: disease.description,
      symptoms: disease.symptoms,
      treatments: disease.treatments,
      severity: disease.severity,
      isCommunicable: disease.isCommunicable
    });
    setOpenDialog(true);
  };

  // Delete disease
  const handleDeleteDisease = (diseaseId: string) => {
    setDiseases(diseases.filter(disease => disease.id !== diseaseId));
    toast({
      title: "Disease Deleted",
      description: "The disease has been removed from the system."
    });
  };

  // Save disease
  const handleSaveDisease = () => {
    if (!diseaseForm.name || !diseaseForm.category) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    if (editingDisease) {
      // Update existing disease
      setDiseases(diseases.map(disease => 
        disease.id === editingDisease.id ? 
        { ...disease, ...diseaseForm } : 
        disease
      ));
      toast({
        title: "Disease Updated",
        description: "Disease information has been updated successfully."
      });
    } else {
      // Add new disease
      const newDisease: Disease = {
        id: `disease_${Date.now().toString()}`,
        ...diseaseForm
      };
      setDiseases([...diseases, newDisease]);
      toast({
        title: "Disease Added",
        description: "New disease has been added successfully."
      });
    }
    
    // Reset form and close dialog
    setDiseaseForm({
      name: '',
      category: '',
      description: '',
      symptoms: '',
      treatments: '',
      severity: 'medium',
      isCommunicable: false
    });
    setEditingDisease(null);
    setOpenDialog(false);
  };

  // Filter diseases based on search query
  const filteredDiseases = diseases.filter(disease => 
    disease.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    disease.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
            <h2 className="text-3xl font-bold tracking-tight">Disease Management</h2>
            <p className="text-muted-foreground">
              Manage disease information and treatment protocols
            </p>
          </div>
        </div>

        <div className="flex justify-between items-center gap-4">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search diseases..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <Dialog open={openDialog} onOpenChange={setOpenDialog}>
            <DialogTrigger asChild>
              <Button onClick={() => {
                setEditingDisease(null);
                setDiseaseForm({
                  name: '',
                  category: '',
                  description: '',
                  symptoms: '',
                  treatments: '',
                  severity: 'medium',
                  isCommunicable: false
                });
              }}>
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Disease
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>{editingDisease ? 'Edit Disease' : 'Add New Disease'}</DialogTitle>
                <DialogDescription>
                  {editingDisease 
                    ? 'Update the disease information below.' 
                    : 'Fill in the details to add a new disease to the system.'}
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="disease-name">Disease Name*</Label>
                  <Input
                    id="disease-name"
                    name="name"
                    value={diseaseForm.name}
                    onChange={handleFormChange}
                    placeholder="e.g., Diabetes Mellitus"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="disease-category">Category*</Label>
                  <Input
                    id="disease-category"
                    name="category"
                    value={diseaseForm.category}
                    onChange={handleFormChange}
                    placeholder="e.g., Endocrine, Respiratory, Infectious"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="disease-description">Description</Label>
                  <Textarea
                    id="disease-description"
                    name="description"
                    value={diseaseForm.description}
                    onChange={handleFormChange}
                    placeholder="Brief description of the disease"
                    className="resize-none"
                    rows={3}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="disease-symptoms">Symptoms</Label>
                  <Textarea
                    id="disease-symptoms"
                    name="symptoms"
                    value={diseaseForm.symptoms}
                    onChange={handleFormChange}
                    placeholder="Common symptoms"
                    className="resize-none"
                    rows={2}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="disease-treatments">Treatments</Label>
                  <Textarea
                    id="disease-treatments"
                    name="treatments"
                    value={diseaseForm.treatments}
                    onChange={handleFormChange}
                    placeholder="Common treatments"
                    className="resize-none"
                    rows={2}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="disease-severity">Severity</Label>
                  <select
                    id="disease-severity"
                    name="severity"
                    value={diseaseForm.severity}
                    onChange={handleSeverityChange}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="disease-communicable"
                    name="isCommunicable"
                    checked={diseaseForm.isCommunicable}
                    onChange={handleCheckboxChange}
                    className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                  />
                  <Label htmlFor="disease-communicable">Is Communicable (Contagious)</Label>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setOpenDialog(false)}>Cancel</Button>
                <Button onClick={handleSaveDisease}>Save</Button>
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
                  <TableHead>Category</TableHead>
                  <TableHead>Severity</TableHead>
                  <TableHead>Communicable</TableHead>
                  <TableHead className="hidden md:table-cell">Symptoms</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredDiseases.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center">No diseases found</TableCell>
                  </TableRow>
                ) : (
                  filteredDiseases.map((disease) => (
                    <TableRow key={disease.id}>
                      <TableCell className="font-medium">{disease.name}</TableCell>
                      <TableCell>{disease.category}</TableCell>
                      <TableCell>
                        <Badge 
                          variant={
                            disease.severity === 'low' ? "outline" : 
                            disease.severity === 'medium' ? "secondary" : 
                            "destructive"
                          }
                        >
                          {disease.severity}
                        </Badge>
                      </TableCell>
                      <TableCell>{disease.isCommunicable ? 'Yes' : 'No'}</TableCell>
                      <TableCell className="hidden md:table-cell">
                        {disease.symptoms.length > 50 
                          ? `${disease.symptoms.substring(0, 50)}...` 
                          : disease.symptoms}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end space-x-2">
                          <Button variant="ghost" size="icon" onClick={() => handleEditDisease(disease)}>
                            <Edit className="h-4 w-4" />
                            <span className="sr-only">Edit</span>
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => handleDeleteDisease(disease.id)}>
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

export default DiseaseManagement;
