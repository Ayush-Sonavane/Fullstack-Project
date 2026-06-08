import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import DashboardLayout from './layouts/DashboardLayout';

// Auth pages
import Login from './pages/Login';
import Register from './pages/Register';
import ChangePassword from './pages/ChangePassword';

// Admin pages
import AdminDashboard from './pages/admin/AdminDashboard';
import UsersList from './pages/admin/UsersList';
import UserDetail from './pages/admin/UserDetail';
import StoresList from './pages/admin/StoresList';
import AddUser from './pages/admin/AddUser';
import AddStore from './pages/admin/AddStore';

// User pages
import StoreListing from './pages/user/StoreListing';

// Owner pages
import OwnerDashboard from './pages/owner/OwnerDashboard';

/**
 * Root redirect based on user role
 */
const RootRedirect = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="spinner" />
      </div>
    );
  }

  if (!user) return <Navigate to="/login" replace />;
  if (user.role === 'admin') return <Navigate to="/admin" replace />;
  if (user.role === 'store_owner') return <Navigate to="/owner" replace />;
  return <Navigate to="/stores" replace />;
};

const App = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: '#ffffff',
              color: '#1f2937',
              border: '1px solid #e5e7eb',
              borderRadius: '0.75rem',
              fontSize: '0.875rem',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
            },
            success: {
              iconTheme: { primary: '#059669', secondary: '#ffffff' },
            },
            error: {
              iconTheme: { primary: '#dc2626', secondary: '#ffffff' },
            },
          }}
        />

        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Root redirect */}
          <Route path="/" element={<RootRedirect />} />

          {/* Admin Routes */}
          <Route path="/admin" element={
            <ProtectedRoute roles={['admin']}>
              <DashboardLayout><AdminDashboard /></DashboardLayout>
            </ProtectedRoute>
          } />
          <Route path="/admin/users" element={
            <ProtectedRoute roles={['admin']}>
              <DashboardLayout><UsersList /></DashboardLayout>
            </ProtectedRoute>
          } />
          <Route path="/admin/users/new" element={
            <ProtectedRoute roles={['admin']}>
              <DashboardLayout><AddUser /></DashboardLayout>
            </ProtectedRoute>
          } />
          <Route path="/admin/users/:id" element={
            <ProtectedRoute roles={['admin']}>
              <DashboardLayout><UserDetail /></DashboardLayout>
            </ProtectedRoute>
          } />
          <Route path="/admin/stores" element={
            <ProtectedRoute roles={['admin']}>
              <DashboardLayout><StoresList /></DashboardLayout>
            </ProtectedRoute>
          } />
          <Route path="/admin/stores/new" element={
            <ProtectedRoute roles={['admin']}>
              <DashboardLayout><AddStore /></DashboardLayout>
            </ProtectedRoute>
          } />

          {/* Normal User Routes */}
          <Route path="/stores" element={
            <ProtectedRoute roles={['user']}>
              <DashboardLayout><StoreListing /></DashboardLayout>
            </ProtectedRoute>
          } />

          {/* Store Owner Routes */}
          <Route path="/owner" element={
            <ProtectedRoute roles={['store_owner']}>
              <DashboardLayout><OwnerDashboard /></DashboardLayout>
            </ProtectedRoute>
          } />

          {/* Shared Routes */}
          <Route path="/profile/password" element={
            <ProtectedRoute>
              <DashboardLayout><ChangePassword /></DashboardLayout>
            </ProtectedRoute>
          } />

          {/* Catch-all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
