
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import FadeIn from '@/components/animations/FadeIn';

const Settings: React.FC = () => {
  return (
    <FadeIn>
      <div className="space-y-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Settings</h2>
          <p className="text-muted-foreground">
            Manage system settings and preferences
          </p>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Profile Settings</CardTitle>
              <CardDescription>
                Manage your account information
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p>This feature will allow updating your profile information.</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>System Settings</CardTitle>
              <CardDescription>
                Configure system preferences
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p>This feature will allow configuring system-wide settings.</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Security Settings</CardTitle>
              <CardDescription>
                Manage security preferences
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p>This feature will allow configuring security settings.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </FadeIn>
  );
};

export default Settings;
