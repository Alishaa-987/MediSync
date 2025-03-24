
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Medicine } from '@/lib/types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';

interface InventoryReportViewProps {
  medicines: Medicine[];
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d', '#ffc658'];

const InventoryReportView: React.FC<InventoryReportViewProps> = ({ medicines }) => {
  // Calculate total inventory value
  const totalInventoryValue = medicines.reduce(
    (sum, med) => sum + med.quantity * med.unitPrice, 
    0
  );
  
  // Calculate medicines that are low in stock (less than 30 units)
  const lowStockMedicines = medicines.filter(med => med.quantity < 30);
  
  // Calculate medicines that are about to expire (within 90 days)
  const now = new Date();
  const ninetyDaysFromNow = new Date(now.getTime() + 90 * 24 * 60 * 60 * 1000);
  const expiringMedicines = medicines.filter(med => med.expiryDate <= ninetyDaysFromNow);
  
  // Prepare data for category distribution chart
  const categoryData: Record<string, number> = {};
  medicines.forEach(med => {
    if (categoryData[med.category]) {
      categoryData[med.category] += med.quantity;
    } else {
      categoryData[med.category] = med.quantity;
    }
  });
  
  const categoryChartData = Object.keys(categoryData).map(category => ({
    name: category,
    value: categoryData[category]
  }));
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="bg-slate-50">
          <CardTitle>Inventory Summary</CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-lg bg-blue-50 border border-blue-100">
              <p className="text-sm font-medium text-blue-600">Total Medications</p>
              <p className="text-2xl font-bold">{medicines.length}</p>
            </div>
            <div className="p-4 rounded-lg bg-green-50 border border-green-100">
              <p className="text-sm font-medium text-green-600">Total Inventory Value</p>
              <p className="text-2xl font-bold">${totalInventoryValue.toLocaleString()}</p>
            </div>
            <div className="p-4 rounded-lg bg-amber-50 border border-amber-100">
              <p className="text-sm font-medium text-amber-600">Low Stock Items</p>
              <p className="text-2xl font-bold">{lowStockMedicines.length}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="md:col-span-1">
          <CardHeader className="bg-slate-50">
            <CardTitle>Medicine Category Distribution</CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryChartData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {categoryChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value} units`, 'Quantity']} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-1">
          <CardHeader className="bg-slate-50">
            <CardTitle>Stock Levels by Medicine</CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={medicines.slice(0, 7)} // Just show top 7 for readability
                  margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="name" 
                    angle={-45} 
                    textAnchor="end" 
                    height={70}
                    tick={{ fontSize: 12 }}
                  />
                  <YAxis />
                  <Tooltip formatter={(value) => [`${value} units`, 'Quantity']} />
                  <Bar dataKey="quantity" fill="#0088FE" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="bg-slate-50">
          <CardTitle>Low Stock Alerts</CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          {lowStockMedicines.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Medicine Name</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead className="text-right">Current Stock</TableHead>
                  <TableHead className="text-right">Unit Price</TableHead>
                  <TableHead className="text-right">Reorder Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {lowStockMedicines.map((medicine) => (
                  <TableRow key={medicine.id}>
                    <TableCell className="font-medium">{medicine.name}</TableCell>
                    <TableCell>{medicine.category}</TableCell>
                    <TableCell className="text-right">{medicine.quantity} units</TableCell>
                    <TableCell className="text-right">${medicine.unitPrice.toFixed(2)}</TableCell>
                    <TableCell className="text-right">
                      <span 
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          medicine.quantity < 10 
                            ? 'bg-red-100 text-red-800' 
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {medicine.quantity < 10 ? 'Critical' : 'Order Soon'}
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <p>No medicines are currently low in stock.</p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="bg-slate-50">
          <CardTitle>Expiring Medications</CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          {expiringMedicines.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Medicine Name</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead className="text-right">Quantity</TableHead>
                  <TableHead className="text-right">Expiry Date</TableHead>
                  <TableHead className="text-right">Days Remaining</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {expiringMedicines.map((medicine) => {
                  const daysRemaining = Math.ceil((medicine.expiryDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
                  return (
                    <TableRow key={medicine.id}>
                      <TableCell className="font-medium">{medicine.name}</TableCell>
                      <TableCell>{medicine.category}</TableCell>
                      <TableCell className="text-right">{medicine.quantity} units</TableCell>
                      <TableCell className="text-right">{medicine.expiryDate.toLocaleDateString()}</TableCell>
                      <TableCell className="text-right">
                        <span 
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            daysRemaining < 30 
                              ? 'bg-red-100 text-red-800' 
                              : daysRemaining < 60 
                                ? 'bg-amber-100 text-amber-800'
                                : 'bg-blue-100 text-blue-800'
                          }`}
                        >
                          {daysRemaining} days
                        </span>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          ) : (
            <p>No medicines are expiring within the next 90 days.</p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="bg-slate-50">
          <CardTitle>Complete Inventory List</CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead className="text-right">Quantity</TableHead>
                <TableHead className="text-right">Unit Price</TableHead>
                <TableHead className="text-right">Total Value</TableHead>
                <TableHead className="text-right">Expiry Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {medicines.map((medicine) => (
                <TableRow key={medicine.id}>
                  <TableCell className="font-medium">{medicine.id}</TableCell>
                  <TableCell>{medicine.name}</TableCell>
                  <TableCell>{medicine.category}</TableCell>
                  <TableCell className="text-right">{medicine.quantity}</TableCell>
                  <TableCell className="text-right">${medicine.unitPrice.toFixed(2)}</TableCell>
                  <TableCell className="text-right">${(medicine.quantity * medicine.unitPrice).toFixed(2)}</TableCell>
                  <TableCell className="text-right">{medicine.expiryDate.toLocaleDateString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default InventoryReportView;
