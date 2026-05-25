import { Link } from 'react-router-dom';
import { Scissors } from 'lucide-react';

const NotFound = () => {
  return (
    <div className="container" style={{ minHeight: '70vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '4rem 1.5rem' }}>
      <div style={{ color: 'var(--primary)', marginBottom: '1.5rem' }}>
        <Scissors size={64} style={{ opacity: 0.5 }} />
      </div>
      <h1 style={{ fontSize: '4rem', marginBottom: '1rem', lineHeight: '1' }}>404</h1>
      <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', color: 'var(--text-muted)' }}>Page Not Found</h2>
      <p style={{ color: 'var(--text-muted)', maxWidth: '400px', marginBottom: '2.5rem', lineHeight: '1.6' }}>
        Oops! We couldn't find the page you were looking for. It might have been moved or doesn't exist.
      </p>
      <Link to="/" className="btn btn-primary" style={{ padding: '0.85rem 2rem', fontSize: '1rem' }}>
        Return Home
      </Link>
    </div>
  );
};

export default NotFound;
