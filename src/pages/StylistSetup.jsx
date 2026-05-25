import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../lib/AuthContext';
import { Home, MapPin, CheckCircle } from 'lucide-react';

const StylistSetup = () => {
  const { user } = useAuth();
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    bio: '',
    business_address: '',
    is_home_service_available: false,
    years_experience: '',
    specialties: ''
  });

  useEffect(() => { if (user) fetchDetails(); }, [user]);

  const fetchDetails = async () => {
    const { data } = await supabase.from('stylist_details').select('*').eq('id', user.id).single();
    if (data) setForm({
      bio: data.bio || '',
      business_address: data.business_address || '',
      is_home_service_available: data.is_home_service_available || false,
      years_experience: data.years_experience || '',
      specialties: data.specialties || ''
    });
    setLoading(false);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true); setSuccess(false); setError('');
    const { error: err } = await supabase.from('stylist_details').upsert({
      id: user.id,
      bio: form.bio,
      business_address: form.business_address,
      is_home_service_available: form.is_home_service_available,
      years_experience: form.years_experience ? parseInt(form.years_experience) : null,
      specialties: form.specialties
    });
    if (err) { setError(err.message); }
    else {
      setSuccess(true);
      await supabase.from('logs').insert([{ user_id: user.id, action: 'stylist_setup_updated', details: {} }]);
      setTimeout(() => setSuccess(false), 4000);
    }
    setSaving(false);
  };

  if (loading) return <div className="loading-container"><div className="spinner" /></div>;

  return (
    <div className="container animate-fade-in" style={{ padding: '3rem 1.5rem', maxWidth: '760px' }}>
      <div style={{ marginBottom: '2.5rem' }}>
        <h1 style={{ fontSize: '2.25rem', marginBottom: '0.5rem' }}>Professional Profile</h1>
        <p className="text-muted">Complete your profile so clients can discover and book you.</p>
      </div>

      {success && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '1rem 1.25rem', background: 'var(--success-light)', border: '1px solid rgba(16,232,144,0.2)', borderRadius: 'var(--radius-md)', marginBottom: '1.5rem', color: 'var(--success)', animation: 'fadeIn 0.3s' }}>
          <CheckCircle size={18} />
          <p style={{ fontWeight: 600, fontSize: '0.9rem' }}>Profile saved successfully!</p>
        </div>
      )}
      {error && (
        <div style={{ padding: '1rem', background: 'var(--danger-light)', border: '1px solid rgba(255,68,68,0.2)', borderRadius: 'var(--radius-md)', color: 'var(--danger)', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
          {error}
        </div>
      )}

      <form onSubmit={handleSave}>
        {/* About You */}
        <div className="card" style={{ marginBottom: '1.5rem', padding: '1.75rem' }}>
          <h2 style={{ fontSize: '1.125rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ width: 28, height: 28, borderRadius: '50%', background: 'var(--primary-light)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)', fontSize: '0.75rem', fontWeight: 800 }}>1</span>
            About You
          </h2>

          <div className="input-group">
            <label>Bio / Introduction</label>
            <textarea
              className="input-field"
              rows={4}
              placeholder="Tell clients about your experience, signature styles, and what sets you apart…"
              value={form.bio}
              onChange={e => setForm({ ...form, bio: e.target.value })}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="input-group" style={{ marginBottom: 0 }}>
              <label>Years of Experience</label>
              <input
                type="number" min="0" max="50"
                className="input-field"
                placeholder="e.g. 5"
                value={form.years_experience}
                onChange={e => setForm({ ...form, years_experience: e.target.value })}
              />
            </div>
            <div className="input-group" style={{ marginBottom: 0 }}>
              <label>Specialties</label>
              <input
                type="text"
                className="input-field"
                placeholder="e.g. Braids, Locs, Fades"
                value={form.specialties}
                onChange={e => setForm({ ...form, specialties: e.target.value })}
              />
            </div>
          </div>
        </div>

        {/* Location & Services */}
        <div className="card" style={{ marginBottom: '1.5rem', padding: '1.75rem' }}>
          <h2 style={{ fontSize: '1.125rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ width: 28, height: 28, borderRadius: '50%', background: 'var(--primary-light)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)', fontSize: '0.75rem', fontWeight: 800 }}>2</span>
            Location & Services
          </h2>

          <div className="input-group">
            <label>Business Address</label>
            <div style={{ position: 'relative' }}>
              <MapPin size={16} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', pointerEvents: 'none' }} />
              <input
                type="text"
                className="input-field"
                style={{ paddingLeft: '2.75rem' }}
                placeholder="e.g. 123 Avenue Kennedy, Yaoundé"
                value={form.business_address}
                onChange={e => setForm({ ...form, business_address: e.target.value })}
              />
            </div>
          </div>

          {/* Home service toggle */}
          <button
            type="button"
            onClick={() => setForm({ ...form, is_home_service_available: !form.is_home_service_available })}
            style={{
              width: '100%', display: 'flex', alignItems: 'center', gap: '1rem', padding: '1.25rem',
              borderRadius: 'var(--radius-md)', cursor: 'pointer', textAlign: 'left',
              border: `1px solid ${form.is_home_service_available ? 'rgba(212,175,55,0.4)' : 'var(--border-color)'}`,
              background: form.is_home_service_available ? 'var(--primary-light)' : 'rgba(255,255,255,0.02)',
              transition: 'all 0.25s'
            }}>
            <div style={{ width: 44, height: 44, borderRadius: 'var(--radius-md)', background: form.is_home_service_available ? 'rgba(212,175,55,0.2)' : 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transition: 'all 0.25s' }}>
              <Home size={20} color={form.is_home_service_available ? 'var(--primary)' : 'var(--text-muted)'} />
            </div>
            <div style={{ flex: 1 }}>
              <p style={{ fontWeight: 700, color: form.is_home_service_available ? 'var(--primary)' : 'var(--text-main)', marginBottom: '0.2rem' }}>Home Service Available</p>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Enable this to allow clients to book you at their home or office</p>
            </div>
            {/* Toggle switch */}
            <div style={{
              width: 48, height: 26, borderRadius: '99px', flexShrink: 0, transition: 'all 0.25s',
              background: form.is_home_service_available ? 'var(--primary)' : 'var(--border-light)',
              position: 'relative'
            }}>
              <div style={{
                position: 'absolute', top: 3, left: form.is_home_service_available ? 25 : 3,
                width: 20, height: 20, borderRadius: '50%', background: '#fff', transition: 'left 0.25s',
                boxShadow: '0 1px 3px rgba(0,0,0,0.3)'
              }} />
            </div>
          </button>
        </div>

        <button
          type="submit"
          className="btn btn-primary"
          style={{ width: '100%', padding: '1rem', fontSize: '1rem' }}
          disabled={saving}
        >
          {saving ? 'Saving…' : 'Save Professional Profile'}
        </button>
      </form>
    </div>
  );
};

export default StylistSetup;
