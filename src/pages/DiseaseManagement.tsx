
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import FadeIn from '@/components/animations/FadeIn';
import { PlusCircle, Edit, Trash2, Virus } from 'lucide-react';
import { Disease } from '@/lib/types';
import { hasPermission } from '@/lib/permissions';
import { useAuth } from '@/context/AuthContext';
import { Checkbox } from '@/components/ui/checkbox';

const DiseaseManagement: React.FC = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [openDialog, setOpenDialog] = useState(false);
  const [editingDisease, setEditingDisease] = useState<Disease | null>(null);

  // Mock data for diseases
  const [diseases, setDiseases] = useState<Disease[]>([
    {
      id: '1',
      name: 'Diabetes Type 2',
      category: 'Chronic',
      description: 'A chronic condition that affects the way the body processes blood sugar (glucose).',
      symptoms: ['Increased thirst', 'Frequent urination', 'Increased hunger', 'Fatigue', 'Blurred vision'],
      treatments: ['Insulin therapy', 'Blood sugar monitoring', 'Healthy diet', 'Regular exercise'],
      riskFactors: ['Obesity', 'Family history', 'Age', 'Physical inactivity'],
      isCommunicable: false,
      createdAt: new Date('2023-01-15'),
      updatedAt: new Date('2023-03-20')
    },
    {
      id: '2',
      name: 'Influenza',
      category: 'Viral',
      description: 'A contagious respiratory illness caused by influenza viruses that infect the nose, throat, and lungs.',
      symptoms: ['Fever', 'Cough', 'Sore throat', 'Muscle aches', 'Fatigue'],
      treatments: ['Antiviral medications', 'Rest', 'Fluids', 'Pain relievers'],
      riskFactors: ['Age', 'Weakened immune system', 'Chronic conditions'],
      isCommunicable: true,
      createdAt: new Date('2023-02-10'),
      updatedAt: new Date('2023-04-05')
    },
    {
      id: '3',
      name: 'Hypertension',
      category: 'Chronic',
      description: 'High blood pressure that increases risk of heart disease and stroke.',
      symptoms: ['Headaches', 'Shortness of breath', 'Nosebleeds'],
      treatments: ['Blood pressure medication', 'Lifestyle changes', 'Diet modifications', 'Exercise'],
      riskFactors: ['Age', 'Family history', 'Obesity', 'Tobacco use', 'High sodium diet'],
      isCommunicable: false,
      createdAt: new Date('2023-01-05'),
      updatedAt: new Date('2023-03-15')
    },
  ]);

  // Form state
  const [diseaseForm, setDiseaseForm] = useState({
    name: '',
    category: '',
    description: '',
    symptoms: [''],
    treatments: [''],
    riskFactors: [''],
    isCommunicable: false
  });

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setDiseaseForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle select changes
  const handleSelectChange = (name: string, value: string) => {
    setDiseaseForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle checkbox change
  const handleCheckboxChange = (checked: boolean) => {
    setDiseaseForm(prev => ({
      ...prev,
      isCommunicable: checked
    }));
  };

  // Handle array input changes (symptoms, treatments, riskFactors)
  const handleArrayInputChange = (type: 'symptoms' | 'treatments' | 'riskFactors', index: number, value: string) => {
    setDiseaseForm(prev => {
      const newArray = [...prev[type]];
      newArray[index] = value;
      return {
        ...prev,
        [type]: newArray
      };
    });
  };

  // Add new field to array
  const addArrayField = (type: 'symptoms' | 'treatments' | 'riskFactors') => {
    setDiseaseForm(prev => ({
      ...prev,
      [type]: [...prev[type], '']
    }));
  };

  // Remove field from array
  const removeArrayField = (type: 'symptoms' | 'treatments' | 'riskFactors', index: number) => {
    setDiseaseForm(prev => {
      const newArray = prev[type].filter((_, i) => i !== index);
      return {
        ...prev,
        [type]: newArray.length > 0 ? newArray : ['']
      };
    });
  };

  // Edit disease
  const handleEditDisease = (disease: Disease) => {
    setEditingDisease(disease);
    setDiseaseForm({
      name: disease.name,
      category: disease.category,
      description: disease.description,
      symptoms: [...disease.symptoms],
      treatments: [...disease.treatments],
      riskFactors: disease.riskFactors ? [...disease.riskFactors] : [''],
      isCommunicable: disease.isCommunicable
    });
    setOpenDialog(true);
  };

  // Delete disease
  const handleDeleteDisease = (diseaseId: string) => {
    setDiseases(diseases.filter(disease => disease.id !== diseaseId));
    toast({
      title: "Disease Deleted",
      description: "The disease has been removed successfully."
    });
  };

  // Save disease
  const handleSaveDisease = () => {
    if (!diseaseForm.name || !diseaseForm.category || !diseaseForm.description) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    // Filter out empty values from arrays
    const symptoms = diseaseForm.symptoms.filter(s => s.trim() !== '');
    const treatments = diseaseForm.treatments.filter(t => t.trim() !== '');
    const riskFactors = diseaseForm.riskFactors.filter(r => r.trim() !== '');

    if (symptoms.length === 0 || treatments.length === 0) {
      toast({
        title: "Validation Error",
        description: "Please add at least one symptom and one treatment.",
        variant: "destructive"
      });
      return;
    }

    if (editingDisease) {
      // Update existing disease
      const updatedDisease: Disease = {
        ...editingDisease,
        name: diseaseForm.name,
        category: diseaseForm.category,
        description: diseaseForm.description,
        symptoms,
        treatments,
        riskFactors: riskFactors.length > 0 ? riskFactors : undefined,
        isCommunicable: diseaseForm.isCommunicable,
        updatedAt: new Date()
      };
      
      setDiseases(diseases.map(disease => 
        disease.id === editingDisease.id ? updatedDisease : disease
      ));
      
      toast({
        title: "Disease Updated",
        description: "Disease information has been updated successfully."
      });
    } else {
      // Add new disease
      const newDisease: Disease = {
        id: `disease_${Date.now().toString()}`,
        name: diseaseForm.name,
        category: diseaseForm.category,
        description: diseaseForm.description,
        symptoms,
        treatments,
        riskFactors: riskFactors.length > 0 ? riskFactors : undefined,
        isCommunicable: diseaseForm.isCommunicable,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      setDiseases([...diseases, newDisease]);
      
      toast({
        title: "Disease Added",
        description: "New disease has been added successfully."
      });
    }
    
    // Reset form and close dialog
    resetForm();
    setOpenDialog(false);
  };

  // Reset form
  const resetForm = () => {
    setDiseaseForm({
      name: '',
      category: '',
      description: '',
      symptoms: [''],
      treatments: [''],
      riskFactors: [''],
      isCommunicable: false
    });
    setEditingDisease(null);
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
            <h2 className="text-3xl font-bold tracking-tight">Disease Management</h2>
            <p className="text-muted-foreground">
              Manage diseases, symptoms, and treatments
            </p>
          </div>
          
          <Dialog open={openDialog} onOpenChange={(open) => {
            setOpenDialog(open);
            if (!open) resetForm();
          }}>
            <DialogTrigger asChild>
              <Button>
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Disease
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{editingDisease ? 'Edit Disease' : 'Add New Disease'}</DialogTitle>
                <DialogDescription>
                  {editingDisease 
                    ? 'Update the disease information below.' 
                    : 'Fill in the details to add a new disease to the system.'}
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Disease Name*</Label>
                    <Input
                      id="name"
                      name="name"
                      value={diseaseForm.name}
                      onChange={handleInputChange}
                      placeholder="e.g., Hypertension"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="category">Category*</Label>
                    <Select
                      value={diseaseForm.category}
                      onValueChange={(value) => handleSelectChange('category', value)}
                    >
                      <SelectTrigger id="category">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Chronic">Chronic</SelectItem>
                        <SelectItem value="Viral">Viral</SelectItem>
                        <SelectItem value="Bacterial">Bacterial</SelectItem>
                        <SelectItem value="Fungal">Fungal</SelectItem>
                        <SelectItem value="Parasitic">Parasitic</SelectItem>
                        <SelectItem value="Genetic">Genetic</SelectItem>
                        <SelectItem value="Autoimmune">Autoimmune</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="description">Description*</Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={diseaseForm.description}
                    onChange={handleInputChange}
                    placeholder="Describe the disease..."
                    rows={3}
                  />
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label>Symptoms*</Label>
                    <Button 
                      type="button" 
                      variant="outline" 
                      size="sm" 
                      onClick={() => addArrayField('symptoms')}
                    >
                      Add Symptom
                    </Button>
                  </div>
                  {diseaseForm.symptoms.map((symptom, index) => (
                    <div key={`symptom-${index}`} className="flex gap-2">
                      <Input
                        value={symptom}
                        onChange={(e) => handleArrayInputChange('symptoms', index, e.target.value)}
                        placeholder="e.g., Fever"
                      />
                      {diseaseForm.symptoms.length > 1 && (
                        <Button 
                          type="button" 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => removeArrayField('symptoms', index)}
                        >
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">Remove</span>
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label>Treatments*</Label>
                    <Button 
                      type="button" 
                      variant="outline" 
                      size="sm" 
                      onClick={() => addArrayField('treatments')}
                    >
                      Add Treatment
                    </Button>
                  </div>
                  {diseaseForm.treatments.map((treatment, index) => (
                    <div key={`treatment-${index}`} className="flex gap-2">
                      <Input
                        value={treatment}
                        onChange={(e) => handleArrayInputChange('treatments', index, e.target.value)}
                        placeholder="e.g., Medication"
                      />
                      {diseaseForm.treatments.length > 1 && (
                        <Button 
                          type="button" 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => removeArrayField('treatments', index)}
                        >
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">Remove</span>
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label>Risk Factors</Label>
                    <Button 
                      type="button" 
                      variant="outline" 
                      size="sm" 
                      onClick={() => addArrayField('riskFactors')}
                    >
                      Add Risk Factor
                    </Button>
                  </div>
                  {diseaseForm.riskFactors.map((factor, index) => (
                    <div key={`factor-${index}`} className="flex gap-2">
                      <Input
                        value={factor}
                        onChange={(e) => handleArrayInputChange('riskFactors', index, e.target.value)}
                        placeholder="e.g., Age"
                      />
                      {diseaseForm.riskFactors.length > 1 && (
                        <Button 
                          type="button" 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => removeArrayField('riskFactors', index)}
                        >
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">Remove</span>
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="isCommunicable" 
                    checked={diseaseForm.isCommunicable} 
                    onCheckedChange={handleCheckboxChange} 
                  />
                  <Label htmlFor="isCommunicable">Is Communicable Disease</Label>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => {
                  resetForm();
                  setOpenDialog(false);
                }}>Cancel</Button>
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
                  <TableHead>Description</TableHead>
                  <TableHead>Communicable</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {diseases.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center">No diseases found</TableCell>
                  </TableRow>
                ) : (
                  diseases.map((disease) => (
                    <TableRow key={disease.id}>
                      <TableCell className="font-medium">{disease.name}</TableCell>
                      <TableCell>{disease.category}</TableCell>
                      <TableCell className="max-w-xs truncate">
                        {disease.description}
                      </TableCell>
                      <TableCell>
                        <Badge variant={disease.isCommunicable ? "secondary" : "outline"}>
                          {disease.isCommunicable ? 'Yes' : 'No'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end space-x-2">
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => handleEditDisease(disease)}
                          >
                            <Edit className="h-4 w-4" />
                            <span className="sr-only">Edit</span>
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => handleDeleteDisease(disease.id)}
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

export default DiseaseManagement;
