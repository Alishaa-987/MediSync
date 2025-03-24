
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import {
  ArrowUpRight,
  Calendar,
  CreditCard,
  DollarSign,
  Users,
  Activity,
  TrendingUp,
  Clock,
  FileText,
  BarChart3,
  PlusCircle,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import FadeIn from '@/components/animations/FadeIn';
import { BarChart } from '@/components/ui/chart';

// Mock data
const recentPatients = [
  { id: 'P1', name: 'John Doe', status: 'Scheduled', date: '2023-07-15', time: '09:30 AM' },
  { id: 'P2', name: 'Jane Smith', status: 'In Treatment', date: '2023-07-15', time: '10:00 AM' },
  { id: 'P3', name: 'Robert Johnson', status: 'Awaiting Tests', date: '2023-07-15', time: '11:15 AM' },
  { id: 'P4', name: 'Mary Williams', status: 'Completed', date: '2023-07-14', time: '03:45 PM' },
];

const upcomingAppointments = [
  { id: 'A1', patient: 'Emma Thompson', doctor: 'Dr. Smith', date: '2023-07-16', time: '09:00 AM', status: 'confirmed' },
  { id: 'A2', patient: 'Michael Brown', doctor: 'Dr. Johnson', date: '2023-07-16', time: '10:30 AM', status: 'confirmed' },
  { id: 'A3', patient: 'Sarah Davis', doctor: 'Dr. Martinez', date: '2023-07-16', time: '02:15 PM', status: 'requested' },
  { id: 'A4', patient: 'David Wilson', doctor: 'Dr. Smith', date: '2023-07-17', time: '11:45 AM', status: 'confirmed' },
];

const revenueData = [
  { name: 'Jan', total: 12500 },
  { name: 'Feb', total: 14250 },
  { name: 'Mar', total: 18000 },
  { name: 'Apr', total: 16780 },
  { name: 'May', total: 19800 },
  { name: 'Jun', total: 22560 },
  { name: 'Jul', total: 20890 },
];

const patientData = [
  { name: 'Jan', total: 45 },
  { name: 'Feb', total: 58 },
  { name: 'Mar', total: 72 },
  { name: 'Apr', total: 65 },
  { name: 'May', total: 81 },
  { name: 'Jun', total: 93 },
  { name: 'Jul', total: 87 },
];

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [currentTab, setCurrentTab] = useState('overview');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading data
    const timer = setTimeout(() => {
      setLoading(false);
    }, 800);
    
    return () => clearTimeout(timer);
  }, []);

  // Redirect if not logged in
  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  if (!user) return null;

  return (
    <div className="container max-w-[1600px] mx-auto">
      <div className="mb-8">
        <FadeIn>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back, {user.name}. Here's what's happening today.
          </p>
        </FadeIn>
      </div>

      <Tabs defaultValue="overview" value={currentTab} onValueChange={setCurrentTab}>
        <FadeIn delay={100}>
          <TabsList className="mb-8">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="patients">Patients</TabsTrigger>
            <TabsTrigger value="appointments">Appointments</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>
        </FadeIn>

        <TabsContent value="overview" className="space-y-8">
          {/* Stats Cards */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <FadeIn delay={200}>
              <StatsCard 
                title="Total Patients"
                value="3,621"
                description="+12% from last month"
                icon={<Users className="h-4 w-4 text-muted-foreground" />}
                trend={<TrendingUp className="h-4 w-4 text-green-500" />}
                loading={loading}
              />
            </FadeIn>
            <FadeIn delay={300}>
              <StatsCard 
                title="Appointments"
                value="487"
                description="Next 7 days"
                icon={<Calendar className="h-4 w-4 text-muted-foreground" />}
                trend={<Activity className="h-4 w-4 text-hms-600" />}
                loading={loading}
              />
            </FadeIn>
            <FadeIn delay={400}>
              <StatsCard 
                title="Revenue"
                value="$42,890"
                description="+8.2% from last month"
                icon={<DollarSign className="h-4 w-4 text-muted-foreground" />}
                trend={<TrendingUp className="h-4 w-4 text-green-500" />}
                loading={loading}
              />
            </FadeIn>
            <FadeIn delay={500}>
              <StatsCard 
                title="Pending Bills"
                value="24"
                description="Requires attention"
                icon={<CreditCard className="h-4 w-4 text-muted-foreground" />}
                trend={<Clock className="h-4 w-4 text-yellow-500" />}
                loading={loading}
              />
            </FadeIn>
          </div>

          {/* Chart and Recent Patients */}
          <div className="grid gap-4 lg:grid-cols-3">
            <FadeIn delay={600} className="lg:col-span-2">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Revenue Overview</CardTitle>
                    <CardDescription>
                      Monthly revenue for the current year
                    </CardDescription>
                  </div>
                  <BarChart3 className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <div className="h-80 flex items-center justify-center">
                      <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
                    </div>
                  ) : (
                    <BarChart 
                      data={revenueData} 
                      index="name"
                      categories={["total"]}
                      yAxisWidth={60}
                      showAnimation={true}
                      className="aspect-[4/3] h-80"
                    />
                  )}
                </CardContent>
              </Card>
            </FadeIn>

            <FadeIn delay={700}>
              <Card className="h-full">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <div>
                    <CardTitle>Recent Patients</CardTitle>
                    <CardDescription>
                      Recent patient activity
                    </CardDescription>
                  </div>
                  <Button variant="outline" size="sm">
                    <FileText className="mr-2 h-4 w-4" />
                    View All
                  </Button>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <div className="space-y-4">
                      {[...Array(4)].map((_, i) => (
                        <div key={i} className="flex items-center space-x-4">
                          <div className="h-12 w-12 rounded-full bg-muted animate-pulse" />
                          <div className="space-y-2 flex-1">
                            <div className="h-4 bg-muted rounded animate-pulse" />
                            <div className="h-3 bg-muted rounded animate-pulse w-2/3" />
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {recentPatients.map((patient) => (
                        <div key={patient.id} className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center text-muted-foreground font-medium">
                            {patient.name.split(' ').map(n => n[0]).join('')}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium leading-none">{patient.name}</p>
                            <p className="text-sm text-muted-foreground truncate">
                              {patient.date} • {patient.time}
                            </p>
                          </div>
                          <div>
                            <span 
                              className={`text-xs px-2 py-1 rounded-full ${
                                patient.status === 'Completed' 
                                  ? 'bg-green-100 text-green-700' 
                                  : patient.status === 'In Treatment' 
                                  ? 'bg-blue-100 text-blue-700'
                                  : patient.status === 'Awaiting Tests'
                                  ? 'bg-yellow-100 text-yellow-700'
                                  : 'bg-gray-100 text-gray-700'
                              }`}
                            >
                              {patient.status}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </FadeIn>
          </div>
          
          {/* Appointments */}
          <FadeIn delay={800}>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <div>
                  <CardTitle>Upcoming Appointments</CardTitle>
                  <CardDescription>
                    Schedule for the next few days
                  </CardDescription>
                </div>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm">
                    <Calendar className="mr-2 h-4 w-4" />
                    View Calendar
                  </Button>
                  <Button size="sm" className="bg-hms-600 hover:bg-hms-700">
                    <PlusCircle className="mr-2 h-4 w-4" />
                    New Appointment
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="space-y-4">
                    {[...Array(4)].map((_, i) => (
                      <div key={i} className="h-16 bg-muted rounded animate-pulse" />
                    ))}
                  </div>
                ) : (
                  <div className="rounded-md border">
                    <div className="grid grid-cols-5 bg-muted px-4 py-3 text-sm font-medium">
                      <div>Patient</div>
                      <div>Doctor</div>
                      <div>Date</div>
                      <div>Time</div>
                      <div>Status</div>
                    </div>
                    <div className="divide-y">
                      {upcomingAppointments.map((appointment) => (
                        <div 
                          key={appointment.id} 
                          className="grid grid-cols-5 px-4 py-3 text-sm"
                        >
                          <div className="font-medium">{appointment.patient}</div>
                          <div>{appointment.doctor}</div>
                          <div>{appointment.date}</div>
                          <div>{appointment.time}</div>
                          <div>
                            <span 
                              className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                                appointment.status === 'confirmed'
                                  ? 'bg-green-100 text-green-700'
                                  : appointment.status === 'requested'
                                  ? 'bg-yellow-100 text-yellow-700'
                                  : 'bg-gray-100 text-gray-700'
                              }`}
                            >
                              {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </FadeIn>
        </TabsContent>

        <TabsContent value="patients">
          <FadeIn>
            <Card>
              <CardHeader>
                <CardTitle>Patient Management</CardTitle>
                <CardDescription>
                  View and manage all patient records
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p>Patient management functionality will be displayed here.</p>
                <Button onClick={() => navigate('/patients')} className="mt-4">
                  Go to Patient Management
                </Button>
              </CardContent>
            </Card>
          </FadeIn>
        </TabsContent>

        <TabsContent value="appointments">
          <FadeIn>
            <Card>
              <CardHeader>
                <CardTitle>Appointment Management</CardTitle>
                <CardDescription>
                  Schedule and manage appointments
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p>Appointment management functionality will be displayed here.</p>
                <Button onClick={() => navigate('/appointments')} className="mt-4">
                  Go to Appointments
                </Button>
              </CardContent>
            </Card>
          </FadeIn>
        </TabsContent>

        <TabsContent value="analytics">
          <FadeIn>
            <Card>
              <CardHeader>
                <CardTitle>Analytics</CardTitle>
                <CardDescription>
                  View detailed analytics and reports
                </CardDescription>
              </CardHeader>
              <CardContent>
                {/* Patient Growth Chart */}
                <div className="mb-8">
                  <h3 className="text-lg font-medium mb-4">Patient Growth</h3>
                  <BarChart 
                    data={patientData} 
                    index="name"
                    categories={["total"]}
                    colors={["#0ea5e9"]}
                    yAxisWidth={30}
                    showAnimation={true}
                    className="aspect-[4/3] h-80"
                  />
                </div>
              </CardContent>
            </Card>
          </FadeIn>
        </TabsContent>
      </Tabs>
    </div>
  );
};

interface StatsCardProps {
  title: string;
  value: string;
  description: string;
  icon: React.ReactNode;
  trend: React.ReactNode;
  loading?: boolean;
}

const StatsCard: React.FC<StatsCardProps> = ({ 
  title, 
  value, 
  description, 
  icon, 
  trend,
  loading = false
}) => {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between space-x-4">
          <div className="flex items-center space-x-4">
            <div className="bg-muted p-2 rounded-full">
              {icon}
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">{title}</p>
              {loading ? (
                <div className="h-7 w-20 bg-muted rounded animate-pulse mt-1" />
              ) : (
                <p className="text-2xl font-bold">{value}</p>
              )}
            </div>
          </div>
          <div className="bg-background p-2 rounded-full">
            {loading ? (
              <div className="h-4 w-4 bg-muted rounded-full animate-pulse" />
            ) : (
              trend
            )}
          </div>
        </div>
        <div className="mt-4">
          {loading ? (
            <div className="h-4 w-32 bg-muted rounded animate-pulse" />
          ) : (
            <p className="text-xs text-muted-foreground flex items-center">
              {description}
              <ArrowUpRight className="h-3 w-3 ml-1" />
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default Dashboard;
