import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useParams, Link } from 'react-router-dom';
import { MapPin, Star, Clock, Home, MessageCircle } from 'lucide-react';
import { useAuth } from '../lib/AuthContext';

const StylistProfile = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [stylist, setStylist] = useState(null);
  const [services, setServices] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchAll(); }, [id]);

  const fetchAll = async () => {
    const { data: p } = await supabase.from('profiles').select('*, stylist_details(*)').eq('id', id).single();
    setStylist(p);

    const { data: s } = await supabase.from('services').select('*').eq('stylist_id', id);
    setServices(s || []);

    const { data: r } = await supabase.from('reviews').select('*, profiles!client_id(full_name, avatar_url)').eq('stylist_id', id).order('created_at', { ascending: false });
    setReviews(r || []);

    setLoading(false);
  };

  if (loading) return <div style={{ display:'flex',alignItems:'center',justifyContent:'center',minHeight:'60vh' }}><p style={{ color:'var(--primary)' }}>Loading...</p></div>;
  if (!stylist) return <div className="container text-center" style={{ padding:'4rem' }}><h2>Stylist not found.</h2></div>;

  const details = stylist.stylist_details?.[0] || {};
  const avgRating = reviews.length ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1) : null;

  return (
    <div className="container" style={{ padding:'2.5rem 1.5rem', maxWidth:'900px' }}>

      {/* Profile Header */}
      <div className="card" style={{ display:'flex', gap:'2rem', alignItems:'flex-start', marginBottom:'2rem', padding:'2rem' }}>
        <div style={{ width:110, height:110, borderRadius:'50%', border:'2px solid var(--primary)', overflow:'hidden', backgroundColor:'rgba(212,175,55,0.1)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
          {stylist.avatar_url
            ? <img src={stylist.avatar_url} alt="avatar" style={{ width:'100%', height:'100%', objectFit:'cover' }} />
            : <span style={{ fontSize:'3rem', color:'var(--primary)', fontWeight:700 }}>{stylist.full_name.charAt(0)}</span>}
        </div>

        <div style={{ flex:1 }}>
          <h1 style={{ fontSize:'2rem', marginBottom:'0.5rem' }}>{stylist.full_name}</h1>
          {details.business_address && (
            <p style={{ color:'var(--text-muted)', display:'flex', alignItems:'center', gap:'0.4rem', marginBottom:'0.5rem', fontSize:'0.9rem' }}>
              <MapPin size={14} /> {details.business_address}
            </p>
          )}
          <div style={{ display:'flex', gap:'0.75rem', flexWrap:'wrap', marginBottom:'1rem' }}>
            {details.is_home_service_available && (
              <span style={{ fontSize:'0.8rem', padding:'0.25rem 0.75rem', backgroundColor:'rgba(16,185,129,0.1)', color:'var(--success)', borderRadius:'1rem', display:'flex', alignItems:'center', gap:'0.3rem' }}>
                <Home size={12} /> Home Service Available
              </span>
            )}
            {avgRating && (
              <span style={{ fontSize:'0.8rem', padding:'0.25rem 0.75rem', backgroundColor:'rgba(212,175,55,0.1)', color:'var(--primary)', borderRadius:'1rem', display:'flex', alignItems:'center', gap:'0.3rem' }}>
                <Star size={12} fill="var(--primary)" /> {avgRating} ({reviews.length} review{reviews.length !== 1 ? 's' : ''})
              </span>
            )}
          </div>
          {details.bio && <p style={{ color:'var(--text-muted)', lineHeight:1.6, fontSize:'0.9rem' }}>{details.bio}</p>}
        </div>

        {user && user.id !== id && (
          <Link to={`/chat/${id}`} className="btn btn-outline" style={{ display:'flex', alignItems:'center', gap:'0.5rem', flexShrink:0 }}>
            <MessageCircle size={16} /> Message
          </Link>
        )}
      </div>

      {/* Services */}
      <h2 style={{ marginBottom:'1.25rem' }}>Services</h2>
      {services.length === 0 ? (
        <div className="card text-center" style={{ padding:'2rem', marginBottom:'2rem' }}>
          <p style={{ color:'var(--text-muted)' }}>No services listed yet.</p>
        </div>
      ) : (
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(260px, 1fr))', gap:'1.25rem', marginBottom:'3rem' }}>
          {services.map(s => (
            <div key={s.id} className="card" style={{ padding:0, overflow:'hidden', display:'flex', flexDirection:'column' }}>
              {/* Service Image */}
              <div style={{ height:'180px', background:'rgba(212,175,55,0.08)', position:'relative', flexShrink:0 }}>
                {s.image_url ? (
                  <img
                    src={s.image_url}
                    alt={s.name}
                    style={{ width:'100%', height:'100%', objectFit:'cover' }}
                    onError={e => { e.target.style.display='none'; e.target.nextSibling.style.display='flex'; }}
                  />
                ) : null}
                {/* Fallback placeholder — shown when no image or image fails to load */}
                <div style={{
                  display: s.image_url ? 'none' : 'flex',
                  width:'100%', height:'100%', alignItems:'center', justifyContent:'center',
                  flexDirection:'column', gap:'0.5rem', position:'absolute', top:0, left:0
                }}>
                  <span style={{ fontSize:'2.5rem' }}>✂️</span>
                  <span style={{ fontSize:'0.75rem', color:'var(--text-muted)', textTransform:'uppercase', letterSpacing:'0.1em' }}>Style Preview</span>
                </div>
                {/* Duration badge */}
                <div style={{ position:'absolute', top:'0.75rem', left:'0.75rem', background:'rgba(0,0,0,0.65)', backdropFilter:'blur(6px)', borderRadius:'99px', padding:'0.2rem 0.65rem', fontSize:'0.72rem', color:'#fff', display:'flex', alignItems:'center', gap:'0.3rem' }}>
                  <Clock size={11} /> {s.duration_minutes} mins
                </div>
              </div>

              {/* Card Body */}
              <div style={{ padding:'1.25rem', flex:1, display:'flex', flexDirection:'column' }}>
                <h3 style={{ fontSize:'1.05rem', fontWeight:700, marginBottom:'0.35rem' }}>{s.name}</h3>
                {s.description && (
                  <p style={{ color:'var(--text-muted)', fontSize:'0.82rem', lineHeight:1.5, marginBottom:'0.75rem', flex:1,
                    display:'-webkit-box', WebkitLineClamp:2, WebkitBoxOrient:'vertical', overflow:'hidden' }}>
                    {s.description}
                  </p>
                )}
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginTop:'auto', paddingTop:'0.75rem', borderTop:'1px solid var(--border-color)' }}>
                  <span style={{ fontSize:'1.2rem', fontWeight:800, color:'var(--primary)' }}>XAF {Number(s.price).toLocaleString()}</span>
                  <Link to={`/book/${s.id}`} className="btn btn-primary" style={{ padding:'0.45rem 1.1rem', fontSize:'0.82rem' }}>
                    Book Now
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Reviews */}
      <h2 style={{ marginBottom:'1.25rem' }}>Client Reviews {avgRating && <span style={{ color:'var(--primary)', fontSize:'1rem' }}>★ {avgRating}</span>}</h2>
      {reviews.length === 0 ? (
        <div className="card text-center" style={{ padding:'2rem' }}>
          <p style={{ color:'var(--text-muted)' }}>No reviews yet. Be the first to book and leave a review!</p>
        </div>
      ) : (
        <div style={{ display:'flex', flexDirection:'column', gap:'1rem' }}>
          {reviews.map(r => (
            <div key={r.id} className="card" style={{ padding:'1.25rem 1.5rem' }}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'0.75rem' }}>
                <div style={{ display:'flex', alignItems:'center', gap:'0.75rem' }}>
                  <div style={{ width:36, height:36, borderRadius:'50%', backgroundColor:'rgba(212,175,55,0.1)', border:'1px solid var(--primary)', overflow:'hidden', display:'flex', alignItems:'center', justifyContent:'center' }}>
                    {r.profiles?.avatar_url
                      ? <img src={r.profiles.avatar_url} alt="client" style={{ width:'100%', height:'100%', objectFit:'cover' }} />
                      : <span style={{ fontSize:'0.9rem', color:'var(--primary)', fontWeight:700 }}>{r.profiles?.full_name?.charAt(0)}</span>}
                  </div>
                  <p style={{ fontWeight:600 }}>{r.profiles?.full_name}</p>
                </div>
                <div style={{ display:'flex', gap:'2px' }}>
                  {[1,2,3,4,5].map(star => (
                    <Star key={star} size={16} fill={r.rating >= star ? 'var(--primary)' : 'transparent'} color={r.rating >= star ? 'var(--primary)' : 'var(--border-color)'} />
                  ))}
                </div>
              </div>
              {r.comment && <p style={{ color:'var(--text-muted)', lineHeight:1.5, fontSize:'0.9rem' }}>{r.comment}</p>}
              <p style={{ fontSize:'0.75rem', color:'var(--text-muted)', marginTop:'0.75rem' }}>{new Date(r.created_at).toLocaleDateString()}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default StylistProfile;
