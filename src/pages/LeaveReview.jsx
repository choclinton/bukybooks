import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../lib/AuthContext';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Star, ChevronLeft, CheckCircle } from 'lucide-react';

const LeaveReview = () => {
  const { id: appointmentId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [appointment, setAppointment] = useState(null);
  const [rating, setRating] = useState(0);
  const [hovered, setHovered] = useState(0);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => { fetchAppointment(); }, [appointmentId]);

  const fetchAppointment = async () => {
    const { data } = await supabase
      .from('appointments')
      .select('*, profiles!stylist_id(id, full_name, avatar_url), services(name)')
      .eq('id', appointmentId)
      .eq('client_id', user.id)
      .single();
    setAppointment(data);
    setLoading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (rating === 0) { setError('Please select a star rating.'); return; }
    setSubmitting(true); setError('');
    try {
      const { error: rErr } = await supabase.from('reviews').insert([{
        appointment_id: appointmentId,
        client_id: user.id,
        stylist_id: appointment.profiles.id,
        rating,
        comment: comment.trim() || null
      }]);
      if (rErr) throw rErr;
      setSuccess(true);
      setTimeout(() => navigate('/client/appointments'), 3000);
    } catch (err) {
      setError(err.message.includes('unique') ? 'You have already reviewed this appointment.' : err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const ratingLabels = { 1: 'Poor', 2: 'Fair', 3: 'Good', 4: 'Very Good', 5: 'Excellent' };
  const displayRating = hovered || rating;

  if (loading) return <div className="loading-container"><div className="spinner" /></div>;

  if (!appointment) return (
    <div className="container" style={{ padding: '4rem 1.5rem', textAlign: 'center' }}>
      <h2>Appointment not found.</h2>
      <Link to="/client/appointments" className="btn btn-primary" style={{ marginTop: '2rem' }}>Back to Appointments</Link>
    </div>
  );

  if (success) return (
    <div className="loading-container animate-scale">
      <div style={{ textAlign: 'center' }}>
        <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'var(--primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
          <CheckCircle size={40} color="var(--primary)" />
        </div>
        <h2 style={{ marginBottom: '0.75rem' }}>Thank You!</h2>
        <p className="text-muted">Your review has been submitted successfully.</p>
      </div>
    </div>
  );

  return (
    <div className="container animate-fade-in" style={{ padding: '3rem 1.5rem', maxWidth: '560px' }}>
      <Link to="/client/appointments" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '2rem', transition: 'color 0.2s' }}
        onMouseEnter={e => e.currentTarget.style.color = 'var(--primary)'} onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}>
        <ChevronLeft size={16} /> Back
      </Link>

      <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Leave a Review</h1>
      <p className="text-muted" style={{ marginBottom: '2.5rem' }}>Share your experience to help others find great stylists.</p>

      {/* Stylist card */}
      <div className="card" style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '2rem', padding: '1.25rem 1.5rem' }}>
        <div className="avatar" style={{ width: 56, height: 56 }}>
          {appointment.profiles?.avatar_url
            ? <img src={appointment.profiles.avatar_url} alt={appointment.profiles.full_name} />
            : <span style={{ fontSize: '1.25rem' }}>{appointment.profiles?.full_name?.charAt(0)}</span>}
        </div>
        <div>
          <p style={{ fontWeight: 700, fontSize: '1.1rem' }}>{appointment.profiles?.full_name}</p>
          <p style={{ color: 'var(--primary)', fontSize: '0.875rem' }}>{appointment.services?.name}</p>
        </div>
      </div>

      {error && (
        <div style={{ padding: '0.875rem 1rem', background: 'var(--danger-light)', border: '1px solid rgba(255,68,68,0.2)', borderRadius: 'var(--radius-md)', color: 'var(--danger)', marginBottom: '1.5rem', fontSize: '0.875rem' }}>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        {/* Star Rating */}
        <div style={{ marginBottom: '2rem' }}>
          <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '1rem' }}>Your Rating</p>
          <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '0.75rem' }}>
            {[1, 2, 3, 4, 5].map(star => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                onMouseEnter={() => setHovered(star)}
                onMouseLeave={() => setHovered(0)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '0.25rem', transition: 'transform 0.15s' }}
              >
                <Star
                  size={40}
                  fill={displayRating >= star ? 'var(--primary)' : 'transparent'}
                  color={displayRating >= star ? 'var(--primary)' : 'var(--border-light)'}
                  style={{ transition: 'all 0.15s', transform: displayRating >= star ? 'scale(1.1)' : 'scale(1)' }}
                />
              </button>
            ))}
          </div>
          {displayRating > 0 && (
            <p style={{ color: 'var(--primary)', fontWeight: 700, fontSize: '1rem' }}>
              {ratingLabels[displayRating]}
            </p>
          )}
        </div>

        {/* Comment */}
        <div className="input-group">
          <label>Your Comment (optional)</label>
          <textarea
            className="input-field"
            rows={4}
            value={comment}
            onChange={e => setComment(e.target.value)}
            placeholder="Describe your experience — the atmosphere, the result, the professionalism…"
          />
        </div>

        <button
          type="submit"
          className="btn btn-primary"
          style={{ width: '100%', padding: '1rem', fontSize: '1rem', marginTop: '0.5rem' }}
          disabled={submitting || rating === 0}
        >
          {submitting ? 'Submitting…' : 'Submit Review'}
        </button>
      </form>
    </div>
  );
};

export default LeaveReview;
