import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { Link } from 'react-router-dom';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  const handleReset = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });

    if (error) {
      setError(error.message);
    } else {
      setMessage('If an account with that email exists, a password reset link has been sent.');
    }
    setLoading(false);
  };

  return (
    <div className="container flex items-center justify-center" style={{ minHeight: 'calc(100vh - 4rem)', padding: '2rem' }}>
      <div className="card animate-fade-in" style={{ width: '100%', maxWidth: '400px' }}>
        <h2 className="text-center mb-4" style={{ fontSize: '1.75rem', color: 'var(--primary)' }}>Reset Password</h2>
        
        <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', textAlign: 'center' }}>
          Enter your email address and we'll send you a link to reset your password.
        </p>

        {error && <div style={{ color: 'var(--danger)', marginBottom: '1rem', textAlign: 'center', backgroundColor: 'rgba(239, 68, 68, 0.1)', padding: '0.5rem', borderRadius: '0.5rem' }}>{error}</div>}
        {message && <div style={{ color: 'var(--success)', marginBottom: '1rem', textAlign: 'center', backgroundColor: 'rgba(16, 185, 129, 0.1)', padding: '0.5rem', borderRadius: '0.5rem' }}>{message}</div>}

        <form onSubmit={handleReset}>
          <div className="input-group">
            <label>Email Address</label>
            <input 
              type="email" 
              className="input-field" 
              placeholder="you@example.com" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required 
            />
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }} disabled={loading}>
            {loading ? 'Sending...' : 'Send Reset Link'}
          </button>
        </form>

        <p className="text-center mt-4" style={{ color: 'var(--text-muted)' }}>
          Remembered your password? <Link to="/login" style={{ color: 'var(--primary)', fontWeight: 'bold' }}>Log in</Link>
        </p>
      </div>
    </div>
  );
};

export default ForgotPassword;
