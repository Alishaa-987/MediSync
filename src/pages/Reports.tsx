
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import FadeIn from '@/components/animations/FadeIn';

const Reports: React.FC = () => {
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
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Patient Reports</CardTitle>
              <CardDescription>
                Patient visit summaries and history
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p>This feature will allow generating patient visit reports.</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Financial Reports</CardTitle>
              <CardDescription>
                Revenue and expense reports
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p>This feature will allow generating financial reports for the hospital.</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Inventory Reports</CardTitle>
              <CardDescription>
                Medication and equipment inventory reports
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p>This feature will allow generating inventory reports.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </FadeIn>
  );
};

export default Reports;
