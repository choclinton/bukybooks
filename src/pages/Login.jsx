import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { Link, useNavigate } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
    } else {
      navigate('/discover');
    }
    setLoading(false);
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', minHeight: 'calc(100vh - 4rem)' }}>
      {/* Image Side */}
      <div style={{
        position: 'relative',
        backgroundColor: 'var(--bg-dark)',
        borderRight: '1px solid var(--border-color)',
        overflow: 'hidden'
      }}>
        <img 
          src="/images/auth-bg.png" 
          alt="African Hairstylist Braiding" 
          style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.8 }} 
        />
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '3rem', background: 'linear-gradient(to top, var(--bg-dark), transparent)' }}>
          <h2 style={{ fontSize: '2.5rem', color: 'white', marginBottom: '1rem', textShadow: '0 2px 4px rgba(0,0,0,0.8)' }}>
            Step into <span style={{ color: 'var(--primary)' }}>Elegance</span>.
          </h2>
          <p style={{ color: 'var(--text-main)', fontSize: '1.2rem', textShadow: '0 1px 2px rgba(0,0,0,0.8)' }}>
            Log in to manage your appointments, book your next session, and discover elite stylists.
          </p>
        </div>
      </div>

      {/* Form Side */}
      <div className="flex items-center justify-center" style={{ padding: '2rem', backgroundColor: 'var(--bg-dark)' }}>
        <div className="card animate-fade-in" style={{ width: '100%', maxWidth: '420px', boxShadow: 'none' }}>
          <h2 className="text-center mb-4" style={{ fontSize: '2rem', color: 'var(--primary)' }}>Welcome Back</h2>
          
          {error && <div style={{ color: 'var(--danger)', marginBottom: '1rem', textAlign: 'center', backgroundColor: 'rgba(239, 68, 68, 0.1)', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid rgba(239,68,68,0.2)' }}>{error}</div>}

          <form onSubmit={handleLogin}>
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
            
            <div className="input-group">
              <div className="flex justify-between">
                <label>Password</label>
                <Link to="/forgot-password" style={{ fontSize: '0.875rem', color: 'var(--primary)' }}>Forgot Password?</Link>
              </div>
              <input 
                type="password" 
                className="input-field" 
                placeholder="••••••••" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required 
              />
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1.5rem' }} disabled={loading}>
              {loading ? 'Logging in...' : 'Log In'}
            </button>
          </form>

          <p className="text-center mt-6" style={{ color: 'var(--text-muted)' }}>
            Don't have an account? <Link to="/register" style={{ color: 'var(--primary)', fontWeight: 'bold' }}>Sign up</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
