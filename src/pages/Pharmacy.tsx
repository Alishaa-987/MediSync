
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import FadeIn from '@/components/animations/FadeIn';

const Pharmacy: React.FC = () => {
  return (
    <FadeIn>
      <div className="space-y-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Pharmacy</h2>
          <p className="text-muted-foreground">
            Manage medications and inventory
          </p>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Inventory Management</CardTitle>
              <CardDescription>
                Track medication stock levels
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p>This feature will allow managing medication inventory.</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Prescriptions</CardTitle>
              <CardDescription>
                Process and fulfill prescriptions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p>This feature will allow processing patient prescriptions.</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Medication Orders</CardTitle>
              <CardDescription>
                Track and place orders for medications
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p>This feature will allow ordering medications when stock is low.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </FadeIn>
  );
};

export default Pharmacy;
