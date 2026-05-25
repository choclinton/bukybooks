import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { Link, useNavigate } from 'react-router-dom';

const Register = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    role: 'client',
    acceptedLicense: false
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!formData.acceptedLicense) {
      setError("You must accept the license agreement to register.");
      return;
    }

    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.signUp({
      email: formData.email,
      password: formData.password,
      options: {
        data: {
          full_name: formData.fullName,
          role: formData.role,
          accepted_license: formData.acceptedLicense
        }
      }
    });

    if (error) {
      setError(error.message);
    } else {
      alert('Registration successful! You can now log in.');
      navigate('/login');
    }
    setLoading(false);
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', minHeight: 'calc(100vh - 4rem)' }}>
      {/* Form Side */}
      <div className="flex items-center justify-center" style={{ padding: '2rem', backgroundColor: 'var(--bg-dark)' }}>
        <div className="card animate-fade-in" style={{ width: '100%', maxWidth: '450px', boxShadow: 'none' }}>
          <h2 className="text-center mb-4" style={{ fontSize: '2rem', color: 'var(--primary)' }}>Create Account</h2>
          
          {error && <div style={{ color: 'var(--danger)', marginBottom: '1rem', textAlign: 'center', backgroundColor: 'rgba(239, 68, 68, 0.1)', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid rgba(239,68,68,0.2)' }}>{error}</div>}

          <form onSubmit={handleRegister}>
            <div className="input-group">
              <label>Full Name</label>
              <input 
                type="text" 
                className="input-field" 
                placeholder="John Doe" 
                value={formData.fullName}
                onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                required 
              />
            </div>

            <div className="input-group">
              <label>Email Address</label>
              <input 
                type="email" 
                className="input-field" 
                placeholder="you@example.com" 
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                required 
              />
            </div>
            
            <div className="input-group">
              <label>Password</label>
              <input 
                type="password" 
                className="input-field" 
                placeholder="••••••••" 
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                required 
                minLength={6}
              />
            </div>

            <div className="input-group">
              <label>I want to join as a:</label>
              <select 
                className="input-field" 
                value={formData.role} 
                onChange={(e) => setFormData({...formData, role: e.target.value})}
              >
                <option value="client">Client (Book Appointments)</option>
                <option value="stylist">Stylist / Barber (Offer Services)</option>
                <option value="admin">Administrator</option>
              </select>
            </div>

            <div className="input-group" style={{ flexDirection: 'row', alignItems: 'flex-start', marginTop: '1rem' }}>
              <input 
                type="checkbox" 
                id="license"
                checked={formData.acceptedLicense}
                onChange={(e) => setFormData({...formData, acceptedLicense: e.target.checked})}
                style={{ marginTop: '0.25rem', marginRight: '0.5rem' }}
              />
              <label htmlFor="license" style={{ fontSize: '0.85rem', lineHeight: '1.4', color: 'var(--text-muted)' }}>
                I agree to the <span style={{ color: 'var(--primary)', cursor: 'pointer' }}>End User License Agreement (EULA)</span> and Terms of Service. I understand that any malicious activity will result in immediate termination.
              </label>
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1.5rem' }} disabled={loading}>
              {loading ? 'Creating Account...' : 'Sign Up'}
            </button>
          </form>

          <p className="text-center mt-6" style={{ color: 'var(--text-muted)' }}>
            Already have an account? <Link to="/login" style={{ color: 'var(--primary)', fontWeight: 'bold' }}>Log in</Link>
          </p>
        </div>
      </div>
      
      {/* Image Side */}
      <div style={{
        position: 'relative',
        backgroundColor: 'var(--bg-dark)',
        borderLeft: '1px solid var(--border-color)',
        overflow: 'hidden'
      }}>
        <img 
          src="/images/auth-bg.png" 
          alt="African Hairstylist Braiding" 
          style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.8 }} 
        />
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '3rem', background: 'linear-gradient(to top, var(--bg-dark), transparent)' }}>
          <h2 style={{ fontSize: '2.5rem', color: 'white', marginBottom: '1rem', textShadow: '0 2px 4px rgba(0,0,0,0.8)' }}>
            Elevate Your <span style={{ color: 'var(--primary)' }}>Craft</span>.
          </h2>
          <p style={{ color: 'var(--text-main)', fontSize: '1.2rem', textShadow: '0 1px 2px rgba(0,0,0,0.8)' }}>
            Join our platform to offer your premium services, manage clients, and grow your grooming business.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
