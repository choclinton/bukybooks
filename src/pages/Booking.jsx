import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../lib/AuthContext';
import { Calendar, Clock, MapPin, Home, CheckCircle, ChevronLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const Booking = () => {
  const { id: serviceId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [service, setService] = useState(null);
  const [stylist, setStylist] = useState(null);
  const [loading, setLoading] = useState(true);

  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [locationType, setLocationType] = useState('business');
  const [note, setNote] = useState('');

  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => { fetchServiceDetails(); }, [serviceId]);

  const fetchServiceDetails = async () => {
    try {
      const { data: svc, error: svcErr } = await supabase.from('services').select('*').eq('id', serviceId).single();
      if (svcErr) throw svcErr;
      setService(svc);
      const { data: stl, error: stlErr } = await supabase.from('profiles').select('*, stylist_details(*)').eq('id', svc.stylist_id).single();
      if (stlErr) throw stlErr;
      setStylist(stl);
    } catch (err) {
      console.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleBooking = async (e) => {
    e.preventDefault();
    setError(null);
    if (!date || !time) { setError('Please select a date and time.'); return; }

    setSubmitting(true);
    try {
      const appointmentDate = new Date(`${date}T${time}:00`).toISOString();
      const { error: insertError } = await supabase.from('appointments').insert([{
        client_id: user.id,
        stylist_id: stylist.id,
        service_id: service.id,
        appointment_date: appointmentDate,
        location_type: locationType,
        status: 'pending',
        payment_status: 'pending',
        notes: note || null
      }]);
      if (insertError) throw insertError;
      await supabase.from('logs').insert([{ user_id: user.id, action: 'appointment_created', details: { stylist_id: stylist.id, service: service.name } }]);
      setSuccess(true);
      setTimeout(() => navigate('/client/appointments'), 3000);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return (
    <div className="loading-container">
      <div className="spinner"></div>
      <p className="text-muted">Loading service details...</p>
    </div>
  );

  if (!service) return (
    <div className="container" style={{ padding: '4rem 1.5rem', textAlign: 'center' }}>
      <h2>Service not found.</h2>
      <Link to="/discover" className="btn btn-primary" style={{ marginTop: '2rem' }}>Browse Stylists</Link>
    </div>
  );

  if (success) return (
    <div className="loading-container animate-scale">
      <div style={{ textAlign: 'center', maxWidth: '420px' }}>
        <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'var(--success-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', animation: 'goldPulse 1.5s infinite' }}>
          <CheckCircle size={40} color="var(--success)" />
        </div>
        <h2 style={{ fontSize: '1.75rem', marginBottom: '0.75rem' }}>Booking Sent!</h2>
        <p className="text-muted" style={{ lineHeight: 1.7, marginBottom: '1.5rem' }}>
          Your appointment request has been sent to <strong style={{ color: 'var(--primary)' }}>{stylist?.full_name}</strong>. Once approved, you will receive a prompt to complete your payment.
        </p>
        <p className="text-muted" style={{ fontSize: '0.85rem' }}>Redirecting to your appointments...</p>
      </div>
    </div>
  );

  // stylist_details can be an array (from select with join) or an object (from .single()) 
  // — normalise both shapes safely
  const rawDetails = stylist?.stylist_details;
  const details = Array.isArray(rawDetails)
    ? (rawDetails[0] || {})
    : (rawDetails || {});
  const homeAvailable = details.is_home_service_available === true;

  return (
    <div className="container animate-fade-in" style={{ padding: '3rem 1.5rem', maxWidth: '680px' }}>
      {/* Back */}
      <Link to={`/stylist/${stylist?.id}`} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '2rem', transition: 'color 0.2s' }}
        onMouseEnter={e => e.currentTarget.style.color = 'var(--primary)'} onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}>
        <ChevronLeft size={16} /> Back to stylist
      </Link>

      <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Book Appointment</h1>
      <p className="text-muted" style={{ marginBottom: '2.5rem' }}>You're booking with <span style={{ color: 'var(--primary)', fontWeight: 600 }}>{stylist?.full_name}</span></p>

      {/* Service summary */}
      <div style={{ padding: '1.25rem 1.5rem', borderRadius: 'var(--radius-lg)', border: '1px solid rgba(212,175,55,0.2)', background: 'rgba(212,175,55,0.04)', marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <p style={{ fontWeight: 700, fontSize: '1.1rem', marginBottom: '0.25rem' }}>{service.name}</p>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
              <Clock size={14} /> {service.duration_minutes} mins
            </span>
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <p style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--primary)' }}>XAF {Number(service.price).toLocaleString()}</p>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Paid after approval</p>
        </div>
      </div>

      {error && (
        <div style={{ padding: '0.875rem 1rem', background: 'var(--danger-light)', border: '1px solid rgba(255,68,68,0.2)', borderRadius: 'var(--radius-md)', color: 'var(--danger)', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
          {error}
        </div>
      )}

      <form onSubmit={handleBooking}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div className="input-group">
            <label>Date</label>
            <input type="date" className="input-field" value={date} onChange={e => setDate(e.target.value)} min={new Date().toISOString().split('T')[0]} required />
          </div>
          <div className="input-group">
            <label>Time</label>
            <input type="time" className="input-field" value={time} onChange={e => setTime(e.target.value)} required />
          </div>
        </div>

        <div className="input-group">
          <label>Service Location</label>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
            <button type="button" onClick={() => setLocationType('business')} style={{
              padding: '1rem', borderRadius: 'var(--radius-md)', cursor: 'pointer', textAlign: 'center',
              border: `1px solid ${locationType === 'business' ? 'var(--primary)' : 'var(--border-color)'}`,
              background: locationType === 'business' ? 'var(--primary-light)' : 'rgba(255,255,255,0.02)',
              color: locationType === 'business' ? 'var(--primary)' : 'var(--text-muted)',
              transition: 'all 0.2s'
            }}>
              <MapPin size={20} style={{ margin: '0 auto 0.5rem' }} />
              <p style={{ fontWeight: 600, fontSize: '0.875rem' }}>At the Salon</p>
              {details.business_address && <p style={{ fontSize: '0.75rem', marginTop: '0.25rem', opacity: 0.7 }}>{details.business_address}</p>}
            </button>

            {/* Home Service — always rendered; disabled only when stylist hasn't enabled it */}
            <button
              type="button"
              onClick={() => homeAvailable && setLocationType('home')}
              disabled={!homeAvailable}
              style={{
                padding: '1rem', borderRadius: 'var(--radius-md)', textAlign: 'center',
                cursor: homeAvailable ? 'pointer' : 'not-allowed',
                opacity: homeAvailable ? 1 : 0.45,
                border: `1px solid ${locationType === 'home' ? 'var(--primary)' : 'var(--border-color)'}`,
                background: locationType === 'home' ? 'var(--primary-light)' : 'rgba(255,255,255,0.02)',
                color: locationType === 'home' ? 'var(--primary)' : 'var(--text-muted)',
                transition: 'all 0.2s'
              }}
            >
              <Home size={20} style={{ margin: '0 auto 0.5rem' }} />
              <p style={{ fontWeight: 600, fontSize: '0.875rem' }}>Home Service</p>
              <p style={{ fontSize: '0.75rem', marginTop: '0.25rem', opacity: 0.8 }}>
                {homeAvailable ? 'Stylist comes to you' : 'Not offered by this stylist'}
              </p>
            </button>
          </div>
        </div>

        <div className="input-group" style={{ marginTop: '0.5rem' }}>
          <label>Note to Stylist (optional)</label>
          <textarea className="input-field" rows="3" value={note} onChange={e => setNote(e.target.value)} placeholder="Any special requests, hair type, etc." />
        </div>

        {/* Payment info notice */}
        <div style={{ padding: '1rem 1.25rem', borderRadius: 'var(--radius-md)', background: 'rgba(16,232,144,0.06)', border: '1px solid rgba(16,232,144,0.15)', marginBottom: '1.5rem', display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
          <div style={{ color: 'var(--success)', marginTop: '0.1rem', flexShrink: 0 }}>
            <Calendar size={18} />
          </div>
          <div>
            <p style={{ fontWeight: 600, color: 'var(--success)', fontSize: '0.9rem', marginBottom: '0.25rem' }}>Payment after approval</p>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.8375rem', lineHeight: 1.5 }}>
              No payment is required now. Once the stylist approves your booking, you'll be prompted to pay via MTN Mobile Money or Orange Money.
            </p>
          </div>
        </div>

        <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '1rem', fontSize: '1rem' }} disabled={submitting}>
          {submitting ? 'Submitting Request...' : 'Send Booking Request'}
        </button>
      </form>
    </div>
  );
};

export default Booking;
