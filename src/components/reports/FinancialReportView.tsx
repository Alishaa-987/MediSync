
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';

interface FinancialData {
  totalRevenue: number;
  totalExpenses: number;
  netProfit: number;
  unpaidInvoices: number;
  revenueByDepartment: {
    department: string;
    amount: number;
  }[];
  expenseCategories: {
    category: string;
    amount: number;
  }[];
}

interface FinancialReportViewProps {
  financialData: FinancialData;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

const FinancialReportView: React.FC<FinancialReportViewProps> = ({ financialData }) => {
  // Create data for pie chart
  const expenseData = financialData.expenseCategories.map(item => ({
    name: item.category,
    value: item.amount
  }));

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="bg-slate-50">
          <CardTitle>Financial Summary</CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="p-4 rounded-lg bg-blue-50 border border-blue-100">
              <p className="text-sm font-medium text-blue-600">Total Revenue</p>
              <p className="text-2xl font-bold">${financialData.totalRevenue.toLocaleString()}</p>
            </div>
            <div className="p-4 rounded-lg bg-red-50 border border-red-100">
              <p className="text-sm font-medium text-red-600">Total Expenses</p>
              <p className="text-2xl font-bold">${financialData.totalExpenses.toLocaleString()}</p>
            </div>
            <div className="p-4 rounded-lg bg-green-50 border border-green-100">
              <p className="text-sm font-medium text-green-600">Net Profit</p>
              <p className="text-2xl font-bold">${financialData.netProfit.toLocaleString()}</p>
            </div>
            <div className="p-4 rounded-lg bg-amber-50 border border-amber-100">
              <p className="text-sm font-medium text-amber-600">Unpaid Invoices</p>
              <p className="text-2xl font-bold">${financialData.unpaidInvoices.toLocaleString()}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="md:col-span-1">
          <CardHeader className="bg-slate-50">
            <CardTitle>Revenue by Department</CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={financialData.revenueByDepartment}
                  margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="department" 
                    angle={-45} 
                    textAnchor="end" 
                    height={70}
                    tick={{ fontSize: 12 }}
                  />
                  <YAxis />
                  <Tooltip formatter={(value) => [`$${value.toLocaleString()}`, 'Revenue']} />
                  <Bar dataKey="amount" fill="#0088FE" />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Department</TableHead>
                    <TableHead className="text-right">Revenue</TableHead>
                    <TableHead className="text-right">% of Total</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {financialData.revenueByDepartment.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell>{item.department}</TableCell>
                      <TableCell className="text-right">${item.amount.toLocaleString()}</TableCell>
                      <TableCell className="text-right">
                        {((item.amount / financialData.totalRevenue) * 100).toFixed(1)}%
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-1">
          <CardHeader className="bg-slate-50">
            <CardTitle>Expense Distribution</CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={expenseData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {expenseData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`$${value.toLocaleString()}`, 'Amount']} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Category</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                    <TableHead className="text-right">% of Total</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {financialData.expenseCategories.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell>{item.category}</TableCell>
                      <TableCell className="text-right">${item.amount.toLocaleString()}</TableCell>
                      <TableCell className="text-right">
                        {((item.amount / financialData.totalExpenses) * 100).toFixed(1)}%
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="bg-slate-50">
          <CardTitle>Profit Margin Analysis</CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="flex items-center space-x-2 mb-4">
            <div className="text-2xl font-bold">
              {((financialData.netProfit / financialData.totalRevenue) * 100).toFixed(1)}%
            </div>
            <div className="text-muted-foreground">overall profit margin</div>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-4">
            <div 
              className="bg-green-600 h-4 rounded-full"
              style={{ width: `${(financialData.netProfit / financialData.totalRevenue) * 100}%` }}
            ></div>
          </div>
          <div className="mt-8 text-sm text-muted-foreground">
            <p>This report was automatically generated on {new Date().toLocaleDateString()} at {new Date().toLocaleTimeString()}.</p>
            <p>Financial data reflects the period from January 1, 2023 to December 31, 2023.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FinancialReportView;
