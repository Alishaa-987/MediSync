
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { User } from '@/lib/types';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (name: string, email: string, password: string, role: User['role']) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock data for development
const mockUsers: User[] = [
  {
    id: '1',
    name: 'Admin User',
    email: 'admin@hospital.com',
    role: 'admin',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=admin',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '2',
    name: 'Doctor Smith',
    email: 'doctor@hospital.com',
    role: 'doctor',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=doctor',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '3',
    name: 'Nurse Johnson',
    email: 'nurse@hospital.com',
    role: 'nurse',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=nurse',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '4',
    name: 'Patient Doe',
    email: 'patient@example.com',
    role: 'patient',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=patient',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '5',
    name: 'Staff Member',
    email: 'staff@hospital.com',
    role: 'receptionist',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=staff',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '6',
    name: 'Pharmacist White',
    email: 'pharmacist@hospital.com',
    role: 'pharmacist',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=pharmacist',
    createdAt: new Date(),
    updatedAt: new Date(),
  }
];

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Check for stored user on mount
    const storedUser = localStorage.getItem('hms_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // In real app, this would be an API call
      const foundUser = mockUsers.find(u => u.email === email);
      
      if (foundUser) {
        setUser(foundUser);
        localStorage.setItem('hms_user', JSON.stringify(foundUser));
        toast.success(`Welcome back, ${foundUser.name}!`);
        navigate('/dashboard');
      } else {
        toast.error('Invalid email or password');
      }
    } catch (error) {
      toast.error('Login failed. Please try again.');
      console.error('Login error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('hms_user');
    toast.success('Logged out successfully');
    navigate('/login');
  };

  const register = async (name: string, email: string, password: string, role: User['role']) => {
    setIsLoading(true);
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // In real app, this would be an API call
      const newUser: User = {
        id: (mockUsers.length + 1).toString(),
        name,
        email,
        role,
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      
      // Add to mock users (in real app, this would be stored in database)
      mockUsers.push(newUser);
      
      toast.success('Registration successful! Please log in.');
      navigate('/login');
    } catch (error) {
      toast.error('Registration failed. Please try again.');
      console.error('Registration error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      isAuthenticated: !!user, 
      isLoading, 
      login, 
      logout, 
      register 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
