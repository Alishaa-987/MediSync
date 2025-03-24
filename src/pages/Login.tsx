
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import FadeIn from '@/components/animations/FadeIn';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, isLoading } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    await login(email, password);
  };

  // For demo: preset credentials
  const presetCredentials = [
    { role: 'Admin', email: 'admin@hospital.com', password: 'password' },
    { role: 'Doctor', email: 'doctor@hospital.com', password: 'password' },
    { role: 'Nurse', email: 'nurse@hospital.com', password: 'password' },
    { role: 'Patient', email: 'patient@example.com', password: 'password' },
  ];

  const fillCredentials = (email: string, password: string) => {
    setEmail(email);
    setPassword(password);
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4 bg-gradient-to-b from-hms-50/50 to-white">
      <FadeIn>
        <div className="w-full max-w-md">
          <div className="mb-8 text-center">
            <div className="w-12 h-12 rounded-xl bg-hms-600 flex items-center justify-center text-white font-bold text-2xl mx-auto mb-4">
              H
            </div>
            <h1 className="text-2xl font-bold text-foreground tracking-tight mb-1">Welcome back</h1>
            <p className="text-muted-foreground">Login to access your account</p>
          </div>
          
          <Card className="border-border/40 shadow-lg">
            <CardHeader>
              <CardTitle>Login</CardTitle>
              <CardDescription>
                Enter your credentials to access your account
              </CardDescription>
            </CardHeader>
            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    autoComplete="email"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password">Password</Label>
                    <Link 
                      to="/forgot-password" 
                      className="text-xs text-primary hover:underline"
                    >
                      Forgot password?
                    </Link>
                  </div>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="current-password"
                    required
                  />
                </div>
              </CardContent>
              <CardFooter className="flex flex-col">
                <Button 
                  type="submit" 
                  className="w-full bg-hms-600 hover:bg-hms-700" 
                  disabled={isLoading}
                >
                  {isLoading ? 'Logging in...' : 'Login'}
                </Button>
                <div className="mt-4 text-center text-sm text-muted-foreground">
                  Don't have an account?{' '}
                  <Link to="/register" className="text-primary hover:underline">
                    Sign up
                  </Link>
                </div>
              </CardFooter>
            </form>
          </Card>
          
          <div className="mt-8">
            <p className="text-sm text-center text-muted-foreground mb-3">Demo accounts for testing</p>
            <div className="grid grid-cols-2 gap-2">
              {presetCredentials.map((cred) => (
                <Button
                  key={cred.role}
                  variant="outline"
                  size="sm"
                  onClick={() => fillCredentials(cred.email, cred.password)}
                  className="text-xs"
                >
                  {cred.role}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </FadeIn>
    </div>
  );
};

export default Login;
