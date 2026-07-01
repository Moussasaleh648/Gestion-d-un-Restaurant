import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export function ProtectedRoute({ children, allowedRoles }) {
  const { currentUser, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(currentUser.role)) {
    // Redirect to their own dashboard
    const redirectMap = {
      superadmin: '/superadmin/dashboard',
      caissier: '/caissier/dashboard',
      client: '/',
    };
    return <Navigate to={redirectMap[currentUser.role] || '/login'} replace />;
  }

  return children;
}

export function PublicRoute({ children }) {
  const { currentUser, isAuthenticated } = useAuth();

  if (isAuthenticated) {
    const redirectMap = {
      superadmin: '/superadmin/dashboard',
      caissier: '/caissier/dashboard',
      client: '/',
    };
    return <Navigate to={redirectMap[currentUser.role] || '/'} replace />;
  }

  return children;
}
