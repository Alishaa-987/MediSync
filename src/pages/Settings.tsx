
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import FadeIn from '@/components/animations/FadeIn';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Building, Users, Lock, Bell, LayoutGrid, Bed, Eye, EyeOff, Stethoscope, FileText } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { hasPermission } from '@/lib/permissions';

const Settings: React.FC = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [showPasswordFields, setShowPasswordFields] = useState(false);
  
  // Dummy state for form fields
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '+1 (555) 123-4567',
    address: '123 Medical Drive, Health City, HC 12345',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    language: 'english',
    timezone: 'utc-5',
    notifications: {
      email: true,
      sms: false,
      push: true,
      appointment: true,
      updates: false,
      marketing: false
    },
    theme: 'light',
    fontSize: 'medium',
    highContrast: false
  });

  // Determine if user has advanced permissions
  const canManageSystem = hasPermission(user, 'canManageSystem');

  // Handler for form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handler for nested notification preferences
  const handleNotificationChange = (key: string, checked: boolean) => {
    setProfileData(prev => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [key]: checked
      }
    }));
  };

  // Handler for select changes
  const handleSelectChange = (name: string, value: string) => {
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handler for saving profile changes
  const handleSaveProfile = () => {
    toast({
      title: "Profile Updated",
      description: "Your profile settings have been saved successfully.",
    });
  };

  // Handler for saving password changes
  const handleSavePassword = () => {
    if (profileData.newPassword !== profileData.confirmPassword) {
      toast({
        title: "Error",
        description: "New passwords do not match.",
        variant: "destructive"
      });
      return;
    }
    
    if (profileData.newPassword.length < 8) {
      toast({
        title: "Error",
        description: "Password must be at least 8 characters.",
        variant: "destructive"
      });
      return;
    }
    
    toast({
      title: "Password Updated",
      description: "Your password has been changed successfully.",
    });
    
    // Reset password fields
    setProfileData(prev => ({
      ...prev,
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    }));
    setShowPasswordFields(false);
  };

  // Handler for saving system settings
  const handleSaveSystemSettings = () => {
    toast({
      title: "System Settings Updated",
      description: "System settings have been saved successfully.",
    });
  };

  // Conditionally render content based on user permissions
  if (user?.role === 'patient') {
    // Show limited settings for patients
    return (
      <FadeIn>
        <div className="space-y-4">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">My Settings</h2>
            <p className="text-muted-foreground">
              Manage your account settings and preferences
            </p>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>Update your personal information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input 
                    id="name" 
                    name="name" 
                    value={profileData.name} 
                    onChange={handleInputChange} 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input 
                    id="email" 
                    name="email" 
                    type="email" 
                    value={profileData.email} 
                    onChange={handleInputChange} 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input 
                    id="phone" 
                    name="phone" 
                    value={profileData.phone} 
                    onChange={handleInputChange} 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <Input 
                    id="address" 
                    name="address" 
                    value={profileData.address} 
                    onChange={handleInputChange} 
                  />
                </div>
              </div>
              
              {!showPasswordFields ? (
                <Button 
                  variant="outline" 
                  onClick={() => setShowPasswordFields(true)}
                >
                  Change Password
                </Button>
              ) : (
                <div className="space-y-4 border p-4 rounded-md">
                  <div className="space-y-2">
                    <Label htmlFor="currentPassword">Current Password</Label>
                    <div className="relative">
                      <Input 
                        id="currentPassword" 
                        name="currentPassword"
                        type="password" 
                        value={profileData.currentPassword} 
                        onChange={handleInputChange} 
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="newPassword">New Password</Label>
                    <div className="relative">
                      <Input 
                        id="newPassword" 
                        name="newPassword"
                        type="password" 
                        value={profileData.newPassword} 
                        onChange={handleInputChange} 
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm New Password</Label>
                    <div className="relative">
                      <Input 
                        id="confirmPassword" 
                        name="confirmPassword"
                        type="password" 
                        value={profileData.confirmPassword} 
                        onChange={handleInputChange} 
                      />
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button onClick={handleSavePassword}>Update Password</Button>
                    <Button variant="outline" onClick={() => setShowPasswordFields(false)}>Cancel</Button>
                  </div>
                </div>
              )}
            </CardContent>
            <CardFooter>
              <Button onClick={handleSaveProfile}>Save Changes</Button>
            </CardFooter>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Preferences</CardTitle>
              <CardDescription>Customize your experience</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="language">Language</Label>
                <Select 
                  value={profileData.language} 
                  onValueChange={(value) => handleSelectChange('language', value)}
                >
                  <SelectTrigger id="language">
                    <SelectValue placeholder="Select language" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="english">English</SelectItem>
                    <SelectItem value="spanish">Spanish</SelectItem>
                    <SelectItem value="french">French</SelectItem>
                    <SelectItem value="german">German</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label>Notification Preferences</Label>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="notify-appointment" className="flex-1">Appointment Reminders</Label>
                    <Switch 
                      id="notify-appointment" 
                      checked={profileData.notifications.appointment} 
                      onCheckedChange={(checked) => handleNotificationChange('appointment', checked)} 
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="notify-updates" className="flex-1">System Updates</Label>
                    <Switch 
                      id="notify-updates" 
                      checked={profileData.notifications.updates} 
                      onCheckedChange={(checked) => handleNotificationChange('updates', checked)} 
                    />
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSaveProfile}>Save Preferences</Button>
            </CardFooter>
          </Card>
        </div>
      </FadeIn>
    );
  }

  // For admin and staff - full settings options
  return (
    <FadeIn>
      <div className="space-y-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Settings</h2>
          <p className="text-muted-foreground">
            Manage system settings and preferences
          </p>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 w-full">
            <TabsTrigger value="profile" className="flex">
              <Users className="mr-2 h-4 w-4" />
              Profile
            </TabsTrigger>
            <TabsTrigger value="security" className="flex">
              <Lock className="mr-2 h-4 w-4" />
              Security
            </TabsTrigger>
            <TabsTrigger value="notifications" className="flex">
              <Bell className="mr-2 h-4 w-4" />
              Notifications
            </TabsTrigger>
            {canManageSystem && (
              <>
                <TabsTrigger value="system" className="flex">
                  <LayoutGrid className="mr-2 h-4 w-4" />
                  System
                </TabsTrigger>
                <TabsTrigger value="modules" className="flex">
                  <Building className="mr-2 h-4 w-4" />
                  Modules
                </TabsTrigger>
              </>
            )}
          </TabsList>
          
          <TabsContent value="profile" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>Update your personal information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input 
                      id="name" 
                      name="name" 
                      value={profileData.name} 
                      onChange={handleInputChange} 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input 
                      id="email" 
                      name="email" 
                      type="email" 
                      value={profileData.email} 
                      onChange={handleInputChange} 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input 
                      id="phone" 
                      name="phone" 
                      value={profileData.phone} 
                      onChange={handleInputChange} 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="address">Address</Label>
                    <Input 
                      id="address" 
                      name="address" 
                      value={profileData.address} 
                      onChange={handleInputChange} 
                    />
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={handleSaveProfile}>Save Changes</Button>
              </CardFooter>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Preferences</CardTitle>
                <CardDescription>Customize your experience</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="language">Language</Label>
                    <Select 
                      value={profileData.language} 
                      onValueChange={(value) => handleSelectChange('language', value)}
                    >
                      <SelectTrigger id="language">
                        <SelectValue placeholder="Select language" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="english">English</SelectItem>
                        <SelectItem value="spanish">Spanish</SelectItem>
                        <SelectItem value="french">French</SelectItem>
                        <SelectItem value="german">German</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="timezone">Time Zone</Label>
                    <Select 
                      value={profileData.timezone} 
                      onValueChange={(value) => handleSelectChange('timezone', value)}
                    >
                      <SelectTrigger id="timezone">
                        <SelectValue placeholder="Select timezone" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="utc-8">Pacific Time (UTC-8)</SelectItem>
                        <SelectItem value="utc-7">Mountain Time (UTC-7)</SelectItem>
                        <SelectItem value="utc-6">Central Time (UTC-6)</SelectItem>
                        <SelectItem value="utc-5">Eastern Time (UTC-5)</SelectItem>
                        <SelectItem value="utc+0">UTC</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label>Display Settings</Label>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="theme" className="flex-1">Theme</Label>
                      <Select 
                        value={profileData.theme} 
                        onValueChange={(value) => handleSelectChange('theme', value)}
                      >
                        <SelectTrigger id="theme" className="w-[160px]">
                          <SelectValue placeholder="Select theme" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="light">Light</SelectItem>
                          <SelectItem value="dark">Dark</SelectItem>
                          <SelectItem value="system">System</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="high-contrast" className="flex-1">High Contrast Mode</Label>
                      <Switch 
                        id="high-contrast" 
                        checked={profileData.highContrast} 
                        onCheckedChange={(checked) => handleSelectChange('highContrast', checked.toString())} 
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={handleSaveProfile}>Save Preferences</Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="security" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Password Management</CardTitle>
                <CardDescription>Update your password and security preferences</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="currentPassword">Current Password</Label>
                  <div className="relative">
                    <Input 
                      id="currentPassword" 
                      name="currentPassword"
                      type="password" 
                      value={profileData.currentPassword} 
                      onChange={handleInputChange} 
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="newPassword">New Password</Label>
                  <div className="relative">
                    <Input 
                      id="newPassword" 
                      name="newPassword"
                      type="password" 
                      value={profileData.newPassword} 
                      onChange={handleInputChange} 
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm New Password</Label>
                  <div className="relative">
                    <Input 
                      id="confirmPassword" 
                      name="confirmPassword"
                      type="password" 
                      value={profileData.confirmPassword} 
                      onChange={handleInputChange} 
                    />
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={handleSavePassword}>Update Password</Button>
              </CardFooter>
            </Card>
            
            {canManageSystem && (
              <Card>
                <CardHeader>
                  <CardTitle>Security Settings</CardTitle>
                  <CardDescription>Configure system-wide security options</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="two-factor" className="flex-1">Enable Two-Factor Authentication</Label>
                      <Switch id="two-factor" defaultChecked={true} />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="session-timeout" className="flex-1">Auto Logout After Inactivity</Label>
                      <Switch id="session-timeout" defaultChecked={true} />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="timeout-duration">Session Timeout (minutes)</Label>
                    <Select defaultValue="30">
                      <SelectTrigger id="timeout-duration">
                        <SelectValue placeholder="Session timeout" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="15">15 minutes</SelectItem>
                        <SelectItem value="30">30 minutes</SelectItem>
                        <SelectItem value="60">1 hour</SelectItem>
                        <SelectItem value="120">2 hours</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="password-policy">Password Policy</Label>
                    <Select defaultValue="standard">
                      <SelectTrigger id="password-policy">
                        <SelectValue placeholder="Password policy" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="basic">Basic (8+ characters)</SelectItem>
                        <SelectItem value="standard">Standard (8+ chars, 1 number, 1 uppercase)</SelectItem>
                        <SelectItem value="strong">Strong (12+ chars, number, uppercase, special)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button onClick={handleSaveSystemSettings}>Save Security Settings</Button>
                </CardFooter>
              </Card>
            )}
          </TabsContent>
          
          <TabsContent value="notifications" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Notification Settings</CardTitle>
                <CardDescription>Configure how you receive notifications</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-base">Notification Channels</Label>
                  <div className="grid gap-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="notify-email" className="flex-1">Email Notifications</Label>
                      <Switch 
                        id="notify-email" 
                        checked={profileData.notifications.email} 
                        onCheckedChange={(checked) => handleNotificationChange('email', checked)} 
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="notify-sms" className="flex-1">SMS Notifications</Label>
                      <Switch 
                        id="notify-sms" 
                        checked={profileData.notifications.sms} 
                        onCheckedChange={(checked) => handleNotificationChange('sms', checked)} 
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="notify-push" className="flex-1">Push Notifications</Label>
                      <Switch 
                        id="notify-push" 
                        checked={profileData.notifications.push} 
                        onCheckedChange={(checked) => handleNotificationChange('push', checked)} 
                      />
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label className="text-base">Notification Types</Label>
                  <div className="grid gap-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="notify-appointment" className="flex-1">Appointment Reminders</Label>
                      <Switch 
                        id="notify-appointment" 
                        checked={profileData.notifications.appointment} 
                        onCheckedChange={(checked) => handleNotificationChange('appointment', checked)} 
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="notify-updates" className="flex-1">System Updates</Label>
                      <Switch 
                        id="notify-updates" 
                        checked={profileData.notifications.updates} 
                        onCheckedChange={(checked) => handleNotificationChange('updates', checked)} 
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="notify-marketing" className="flex-1">Marketing & News</Label>
                      <Switch 
                        id="notify-marketing" 
                        checked={profileData.notifications.marketing} 
                        onCheckedChange={(checked) => handleNotificationChange('marketing', checked)} 
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={handleSaveProfile}>Save Notification Settings</Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          {canManageSystem && (
            <>
              <TabsContent value="system" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>System Configuration</CardTitle>
                    <CardDescription>Configure system-wide settings</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="hospital-name">Hospital Name</Label>
                        <Input id="hospital-name" defaultValue="City General Hospital" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="hospital-code">Hospital Code</Label>
                        <Input id="hospital-code" defaultValue="CGH-001" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="address">Hospital Address</Label>
                        <Input id="address" defaultValue="123 Medical Drive, Health City, HC 12345" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="admin-email">Admin Email</Label>
                        <Input id="admin-email" type="email" defaultValue="admin@cityhospital.org" />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="system-mode">System Mode</Label>
                      <Select defaultValue="production">
                        <SelectTrigger id="system-mode">
                          <SelectValue placeholder="System mode" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="maintenance">Maintenance Mode</SelectItem>
                          <SelectItem value="testing">Testing Mode</SelectItem>
                          <SelectItem value="production">Production Mode</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label className="text-base">System Settings</Label>
                      <div className="grid gap-2">
                        <div className="flex items-center justify-between">
                          <Label htmlFor="enable-registration" className="flex-1">Enable Patient Self-Registration</Label>
                          <Switch id="enable-registration" defaultChecked={true} />
                        </div>
                        <div className="flex items-center justify-between">
                          <Label htmlFor="enable-appointments" className="flex-1">Enable Online Appointments</Label>
                          <Switch id="enable-appointments" defaultChecked={true} />
                        </div>
                        <div className="flex items-center justify-between">
                          <Label htmlFor="enable-billing" className="flex-1">Enable Online Billing</Label>
                          <Switch id="enable-billing" defaultChecked={true} />
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="backup-frequency">Database Backup Frequency</Label>
                      <Select defaultValue="daily">
                        <SelectTrigger id="backup-frequency">
                          <SelectValue placeholder="Backup frequency" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="hourly">Hourly</SelectItem>
                          <SelectItem value="daily">Daily</SelectItem>
                          <SelectItem value="weekly">Weekly</SelectItem>
                          <SelectItem value="monthly">Monthly</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button onClick={handleSaveSystemSettings}>Save System Settings</Button>
                  </CardFooter>
                </Card>
              </TabsContent>
              
              <TabsContent value="modules" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Module Management</CardTitle>
                    <CardDescription>Enable or disable system modules</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Card className="border">
                        <CardHeader className="pb-2">
                          <div className="flex items-center justify-between">
                            <CardTitle className="text-base flex items-center">
                              <Users className="mr-2 h-4 w-4" />
                              Patient Management
                            </CardTitle>
                            <Switch id="module-patients" defaultChecked={true} />
                          </div>
                        </CardHeader>
                        <CardContent className="pt-0 text-sm text-muted-foreground">
                          Manage patient records, appointments, and medical history
                        </CardContent>
                      </Card>
                      
                      <Card className="border">
                        <CardHeader className="pb-2">
                          <div className="flex items-center justify-between">
                            <CardTitle className="text-base flex items-center">
                              <Stethoscope className="mr-2 h-4 w-4" />
                              Doctor Management
                            </CardTitle>
                            <Switch id="module-doctors" defaultChecked={true} />
                          </div>
                        </CardHeader>
                        <CardContent className="pt-0 text-sm text-muted-foreground">
                          Manage doctors, schedules, and specializations
                        </CardContent>
                      </Card>
                      
                      <Card className="border">
                        <CardHeader className="pb-2">
                          <div className="flex items-center justify-between">
                            <CardTitle className="text-base flex items-center">
                              <FileText className="mr-2 h-4 w-4" />
                              Billing & Invoices
                            </CardTitle>
                            <Switch id="module-billing" defaultChecked={true} />
                          </div>
                        </CardHeader>
                        <CardContent className="pt-0 text-sm text-muted-foreground">
                          Manage patient billing, invoices, and payments
                        </CardContent>
                      </Card>
                      
                      <Card className="border">
                        <CardHeader className="pb-2">
                          <div className="flex items-center justify-between">
                            <CardTitle className="text-base flex items-center">
                              <Bed className="mr-2 h-4 w-4" />
                              Ward Management
                            </CardTitle>
                            <Switch id="module-wards" defaultChecked={true} />
                          </div>
                        </CardHeader>
                        <CardContent className="pt-0 text-sm text-muted-foreground">
                          Manage hospital wards, beds, and patient admissions
                        </CardContent>
                      </Card>
                      
                      <Card className="border">
                        <CardHeader className="pb-2">
                          <div className="flex items-center justify-between">
                            <CardTitle className="text-base flex items-center">
                              <Building className="mr-2 h-4 w-4" />
                              Department Management
                            </CardTitle>
                            <Switch id="module-departments" defaultChecked={true} />
                          </div>
                        </CardHeader>
                        <CardContent className="pt-0 text-sm text-muted-foreground">
                          Manage hospital departments and staff assignments
                        </CardContent>
                      </Card>
                      
                      <Card className="border">
                        <CardHeader className="pb-2">
                          <div className="flex items-center justify-between">
                            <CardTitle className="text-base flex items-center">
                              <Eye className="mr-2 h-4 w-4" />
                              Audit Logging
                            </CardTitle>
                            <Switch id="module-audit" defaultChecked={true} />
                          </div>
                        </CardHeader>
                        <CardContent className="pt-0 text-sm text-muted-foreground">
                          Track system activities and user actions
                        </CardContent>
                      </Card>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button onClick={handleSaveSystemSettings}>Save Module Settings</Button>
                  </CardFooter>
                </Card>
                
                <Sheet>
                  <SheetTrigger asChild>
                    <Button variant="outline">Install New Module</Button>
                  </SheetTrigger>
                  <SheetContent>
                    <SheetHeader>
                      <SheetTitle>Install New Module</SheetTitle>
                      <SheetDescription>
                        Add additional functionality to your hospital management system
                      </SheetDescription>
                    </SheetHeader>
                    <div className="grid gap-4 py-4">
                      <div className="space-y-4">
                        <Card className="border cursor-pointer hover:bg-accent">
                          <CardHeader className="pb-2">
                            <CardTitle className="text-base">Laboratory Management</CardTitle>
                          </CardHeader>
                          <CardContent className="pt-0 text-sm text-muted-foreground">
                            Manage lab tests, samples, and results
                          </CardContent>
                        </Card>
                        
                        <Card className="border cursor-pointer hover:bg-accent">
                          <CardHeader className="pb-2">
                            <CardTitle className="text-base">Telemedicine Module</CardTitle>
                          </CardHeader>
                          <CardContent className="pt-0 text-sm text-muted-foreground">
                            Enable virtual consultations and remote patient monitoring
                          </CardContent>
                        </Card>
                        
                        <Card className="border cursor-pointer hover:bg-accent">
                          <CardHeader className="pb-2">
                            <CardTitle className="text-base">Insurance Integration</CardTitle>
                          </CardHeader>
                          <CardContent className="pt-0 text-sm text-muted-foreground">
                            Connect with insurance providers for automated claims processing
                          </CardContent>
                        </Card>
                      </div>
                    </div>
                    <div className="flex flex-col gap-2 mt-4">
                      <Button>Install Selected Module</Button>
                      <Button variant="outline">Cancel</Button>
                    </div>
                  </SheetContent>
                </Sheet>
              </TabsContent>
            </>
          )}
        </Tabs>
      </div>
    </FadeIn>
  );
};

export default Settings;
