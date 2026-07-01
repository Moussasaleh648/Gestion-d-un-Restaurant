import { Routes, Route, Navigate } from 'react-router-dom';
import { ProtectedRoute, PublicRoute } from './ProtectedRoute';
import { ROLES } from '../data/mockData';

// Auth
import Login from '../pages/auth/Login';
import Register from '../pages/auth/Register';

// SuperAdmin
import SuperAdminLayout from '../components/layout/SuperAdminLayout';
import SuperAdminDashboard from '../pages/superadmin/Dashboard';
import SuperAdminMenu from '../pages/superadmin/Menu';
import SuperAdminUsers from '../pages/superadmin/Users';
import SuperAdminStaff from '../pages/superadmin/Staff';
import SuperAdminReports from '../pages/superadmin/Reports';
import SuperAdminSettings from '../pages/superadmin/Settings';

// Caissier
import CaissierLayout from '../components/layout/CaissierLayout';
import CaissierDashboard from '../pages/caissier/Dashboard';
import CaissierMenu from '../pages/caissier/Menu';
import CaissierOrders from '../pages/caissier/Orders';
import CaissierNewOrder from '../pages/caissier/NewOrder';
import CaissierTables from '../pages/caissier/Tables';
import CaissierStaff from '../pages/caissier/Staff';
import CaissierReports from '../pages/caissier/Reports';

// Client
import ClientLayout from '../components/layout/ClientLayout';
import ClientHome from '../pages/client/Home';
import CartPage from '../pages/client/Cart';
import ClientOrders from '../pages/client/Orders';
import ClientProfile from '../pages/client/Profile';
import About from '../pages/client/About';

export default function AppRouter() {
  return (
    <Routes>
      {/* Routes publiques */}
      <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
      <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />

      {/* Routes Super Admin */}
      <Route path="/superadmin" element={
        <ProtectedRoute allowedRoles={[ROLES.SUPERADMIN]}>
          <SuperAdminLayout />
        </ProtectedRoute>
      }>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<SuperAdminDashboard />} />
        <Route path="menu" element={<SuperAdminMenu />} />
        <Route path="users" element={<SuperAdminUsers />} />
        <Route path="staff" element={<SuperAdminStaff />} />
        <Route path="reports" element={<SuperAdminReports />} />
        <Route path="settings" element={<SuperAdminSettings />} />
      </Route>

      {/* Routes Caissier */}
      <Route path="/caissier" element={
        <ProtectedRoute allowedRoles={[ROLES.CAISSIER, ROLES.SUPERADMIN]}>
          <CaissierLayout />
        </ProtectedRoute>
      }>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<CaissierDashboard />} />
        <Route path="orders" element={<CaissierOrders />} />
        <Route path="new-order" element={<CaissierNewOrder />} />
        <Route path="menu" element={<CaissierMenu />} />
        <Route path="tables" element={<CaissierTables />} />
        <Route path="staff" element={<CaissierStaff />} />
        <Route path="reports" element={<CaissierReports />} />
      </Route>

      {/* Routes Client */}
      <Route path="/" element={<ClientLayout />}>
        <Route index element={<ClientHome />} />
        <Route path="about" element={<About />} />
        <Route path="cart" element={<CartPage />} />
        <Route path="orders" element={
          <ProtectedRoute allowedRoles={[ROLES.CLIENT]}>
            <ClientOrders />
          </ProtectedRoute>
        } />
        <Route path="profile" element={
          <ProtectedRoute allowedRoles={[ROLES.CLIENT]}>
            <ClientProfile />
          </ProtectedRoute>
        } />
      </Route>

      {/* Redirection par défaut */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
