
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { hasPermission } from '@/lib/permissions';

interface ProtectedRouteProps {
  requiredPermission?: keyof typeof rolePermissions[keyof typeof rolePermissions];
  redirectPath?: string;
}

import { rolePermissions } from '@/lib/permissions';

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  requiredPermission,
  redirectPath = '/login',
}) => {
  const { user, isAuthenticated } = useAuth();

  // Check if user is authenticated
  if (!isAuthenticated) {
    return <Navigate to={redirectPath} replace />;
  }

  // If a specific permission is required, check if the user has it
  if (requiredPermission && !hasPermission(user, requiredPermission)) {
    return <Navigate to="/dashboard" replace />;
  }

  // User is authenticated and has the required permission, render the child routes
  return <Outlet />;
};

export default ProtectedRoute;
