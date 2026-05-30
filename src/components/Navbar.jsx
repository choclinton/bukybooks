import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../lib/AuthContext';
import { Scissors } from 'lucide-react';

const Navbar = () => {
  const { user, role } = useAuth();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="navbar">
      <div className="container nav-container">
        <Link to="/" className="nav-logo" style={{ padding: 0 }}>
          <img src="/images/logo.png" alt="BUKYBOOKS" style={{ height: '50px', width: 'auto', display: 'block' }} />
        </Link>

        <div className="nav-links">
          {/* UNAUTHENTICATED */}
          {!user && (
            <>
              <Link to="/discover" className={`nav-link${isActive('/discover') ? ' active' : ''}`}>Discover</Link>
              <Link to="/about" className={`nav-link${isActive('/about') ? ' active' : ''}`}>About</Link>
              <Link to="/contact" className={`nav-link${isActive('/contact') ? ' active' : ''}`}>Contact</Link>
              <Link to="/login" className={`nav-link${isActive('/login') ? ' active' : ''}`}>Log In</Link>
              <Link to="/register" className="btn btn-primary" style={{ padding: '0.5rem 1.25rem', fontSize: '0.875rem' }}>Get Started</Link>
            </>
          )}

          {/* CLIENT ROLE */}
          {user && role === 'client' && (
            <>
              <Link to="/discover" className={`nav-link${isActive('/discover') ? ' active' : ''}`}>Find Stylist</Link>
              <Link to="/client/appointments" className={`nav-link${isActive('/client/appointments') ? ' active' : ''}`}>My Bookings</Link>
              <Link to="/chat" className={`nav-link${isActive('/chat') ? ' active' : ''}`}>Messages</Link>
              <Link to="/profile" className="btn btn-outline" style={{ padding: '0.5rem 1.25rem', fontSize: '0.875rem' }}>Profile</Link>
            </>
          )}

          {/* STYLIST ROLE */}
          {user && role === 'stylist' && (
            <>
              <Link to="/stylist/dashboard" className={`nav-link${isActive('/stylist/dashboard') ? ' active' : ''}`}>Dashboard</Link>
              <Link to="/stylist/services" className={`nav-link${isActive('/stylist/services') ? ' active' : ''}`}>Services</Link>
              <Link to="/chat" className={`nav-link${isActive('/chat') ? ' active' : ''}`}>Messages</Link>
              <Link to="/profile" className="btn btn-outline" style={{ padding: '0.5rem 1.25rem', fontSize: '0.875rem' }}>Profile</Link>
            </>
          )}

          {/* ADMIN ROLE */}
          {user && role === 'admin' && (
            <>
              <Link to="/admin/dashboard" className={`nav-link${isActive('/admin/dashboard') ? ' active' : ''}`}>Admin Panel</Link>
              <Link to="/discover" className={`nav-link${isActive('/discover') ? ' active' : ''}`}>Discover</Link>
              <Link to="/chat" className={`nav-link${isActive('/chat') ? ' active' : ''}`}>Messages</Link>
              <Link to="/profile" className="btn btn-outline" style={{ padding: '0.5rem 1.25rem', fontSize: '0.875rem' }}>Profile</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
