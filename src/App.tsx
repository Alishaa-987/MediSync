
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";
import Layout from "@/components/Layout";
import ProtectedRoute from "@/components/ProtectedRoute";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Patients from "./pages/Patients";
import Doctors from "./pages/Doctors";
import Appointments from "./pages/Appointments";
import Billing from "./pages/Billing";
import Register from "./pages/Register";
import Pharmacy from "./pages/Pharmacy";
import Reports from "./pages/Reports";
import Settings from "./pages/Settings";
import WardManagement from "./pages/WardManagement";
import DiseaseManagement from "./pages/DiseaseManagement";
import TreatmentManagement from "./pages/TreatmentManagement";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route element={<Layout />}>
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              
              {/* Protected routes - require authentication */}
              <Route element={<ProtectedRoute />}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/appointments" element={<Appointments />} />
                
                {/* Routes that require specific permissions */}
                <Route element={<ProtectedRoute requiredPermission="canViewAllPatients" />}>
                  <Route path="/patients" element={<Patients />} />
                  <Route path="/doctors" element={<Doctors />} />
                </Route>
                
                <Route element={<ProtectedRoute requiredPermission="canViewFinances" />}>
                  <Route path="/billing" element={<Billing />} />
                </Route>
                
                <Route element={<ProtectedRoute requiredPermission="canManagePharmacy" />}>
                  <Route path="/pharmacy" element={<Pharmacy />} />
                </Route>
                
                <Route element={<ProtectedRoute requiredPermission="canManageReports" />}>
                  <Route path="/reports" element={<Reports />} />
                </Route>
                
                <Route element={<ProtectedRoute requiredPermission="canManageSystem" />}>
                  <Route path="/settings" element={<Settings />} />
                  <Route path="/ward-management" element={<WardManagement />} />
                  <Route path="/disease-management" element={<DiseaseManagement />} />
                  <Route path="/treatment-management" element={<TreatmentManagement />} />
                </Route>
              </Route>
              
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
