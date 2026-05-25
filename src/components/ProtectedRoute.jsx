import { Navigate } from 'react-router-dom';
import { useAuth } from '../lib/AuthContext';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, role, loading } = useAuth();

  if (loading) {
    return (
      <div className="container flex items-center justify-center" style={{ minHeight: '50vh' }}>
        <p style={{ color: 'var(--primary)', fontSize: '1.25rem' }}>Loading...</p>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(role)) {
    return (
      <div className="container text-center mt-4">
        <h2 style={{ color: 'var(--danger)' }}>Access Denied</h2>
        <p>You do not have permission to view this page.</p>
      </div>
    );
  }

  return children;
};

export default ProtectedRoute;
