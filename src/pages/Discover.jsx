import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Link } from 'react-router-dom';
import { Search, MapPin, Home, Star, SlidersHorizontal } from 'lucide-react';

const Discover = () => {
  const [stylists, setStylists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [homeOnly, setHomeOnly] = useState(false);
  const [ratings, setRatings] = useState({});

  useEffect(() => { fetchStylists(); }, []);

  const fetchStylists = async () => {
    const { data } = await supabase
      .from('profiles')
      .select('*, stylist_details(*)')
      .eq('role', 'stylist')
      .order('created_at', { ascending: false });

    const list = data || [];
    setStylists(list);

    // Fetch average ratings
    if (list.length > 0) {
      const ids = list.map(s => s.id);
      const { data: reviews } = await supabase
        .from('reviews')
        .select('stylist_id, rating')
        .in('stylist_id', ids);

      const ratingMap = {};
      (reviews || []).forEach(r => {
        if (!ratingMap[r.stylist_id]) ratingMap[r.stylist_id] = [];
        ratingMap[r.stylist_id].push(r.rating);
      });
      const avgMap = {};
      Object.entries(ratingMap).forEach(([id, arr]) => {
        avgMap[id] = { avg: (arr.reduce((a, b) => a + b, 0) / arr.length).toFixed(1), count: arr.length };
      });
      setRatings(avgMap);
    }
    setLoading(false);
  };

  const filtered = stylists.filter(s => {
    const matchSearch = s.full_name?.toLowerCase().includes(search.toLowerCase()) ||
      s.stylist_details?.[0]?.business_address?.toLowerCase().includes(search.toLowerCase());
    const matchHome = !homeOnly || s.stylist_details?.[0]?.is_home_service_available;
    return matchSearch && matchHome;
  });

  return (
    <div className="animate-fade-in">
      {/* Hero search bar */}
      <div style={{
        background: 'linear-gradient(180deg, rgba(212,175,55,0.06) 0%, transparent 100%)',
        borderBottom: '1px solid var(--border-color)',
        padding: '3rem 0 2.5rem'
      }}>
        <div className="container" style={{ maxWidth: '800px' }}>
          <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem', textAlign: 'center' }}>
            Find Your <span style={{ background: 'var(--gradient-gold)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Perfect Stylist</span>
          </h1>
          <p className="text-muted" style={{ textAlign: 'center', marginBottom: '2rem' }}>Browse top-rated professionals near you</p>

          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            {/* Search */}
            <div style={{ position: 'relative', flex: 1, minWidth: '200px' }}>
              <Search size={17} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', pointerEvents: 'none' }} />
              <input
                type="text"
                className="input-field"
                placeholder="Search by name or location…"
                value={search}
                onChange={e => setSearch(e.target.value)}
                style={{ paddingLeft: '2.75rem', marginBottom: 0, borderRadius: '99px' }}
              />
            </div>
            {/* Home service toggle */}
            <button
              onClick={() => setHomeOnly(!homeOnly)}
              style={{
                display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0 1.25rem',
                borderRadius: '99px', border: '1px solid', cursor: 'pointer', fontWeight: 600, fontSize: '0.875rem',
                transition: 'all 0.2s', whiteSpace: 'nowrap',
                borderColor: homeOnly ? 'var(--primary)' : 'var(--border-color)',
                background: homeOnly ? 'var(--primary-light)' : 'transparent',
                color: homeOnly ? 'var(--primary)' : 'var(--text-muted)'
              }}>
              <Home size={15} />
              Home Service
            </button>
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="container" style={{ padding: '2.5rem 1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <p className="text-muted" style={{ fontSize: '0.9rem' }}>
            {loading ? 'Loading…' : `${filtered.length} stylist${filtered.length !== 1 ? 's' : ''} found`}
          </p>
        </div>

        {loading ? (
          <div className="loading-container"><div className="spinner" /></div>
        ) : filtered.length === 0 ? (
          <div className="card empty-state">
            <div className="empty-state-icon"><Search size={32} /></div>
            <h3 style={{ marginBottom: '0.5rem' }}>No stylists found</h3>
            <p className="text-muted">Try adjusting your search or filters.</p>
          </div>
        ) : (
          <div className="stagger" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
            {filtered.map(stylist => {
              const detail = stylist.stylist_details?.[0] || {};
              const rating = ratings[stylist.id];
              return (
                <Link key={stylist.id} to={`/stylist/${stylist.id}`} style={{ textDecoration: 'none' }}>
                  <div className="card" style={{ padding: 0, overflow: 'hidden', cursor: 'pointer' }}>
                    {/* Card top gradient band */}
                    <div style={{ height: '4px', background: 'var(--gradient-gold)' }} />

                    <div style={{ padding: '1.5rem' }}>
                      {/* Avatar + name */}
                      <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '1.25rem' }}>
                        <div className="avatar" style={{ width: 64, height: 64 }}>
                          {stylist.avatar_url
                            ? <img src={stylist.avatar_url} alt={stylist.full_name} />
                            : <span style={{ fontSize: '1.5rem' }}>{stylist.full_name?.charAt(0)}</span>}
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <h3 style={{ fontSize: '1.1rem', marginBottom: '0.2rem' }}>{stylist.full_name}</h3>
                          {detail.business_address && (
                            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.3rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                              <MapPin size={11} /> {detail.business_address}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Bio */}
                      {detail.bio && (
                        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.5, marginBottom: '1.25rem', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                          {detail.bio}
                        </p>
                      )}

                      {/* Badges */}
                      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1.25rem' }}>
                        {detail.is_home_service_available && (
                          <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.75rem', padding: '0.25rem 0.625rem', borderRadius: '99px', background: 'var(--success-light)', color: 'var(--success)', border: '1px solid rgba(16,232,144,0.2)', fontWeight: 600 }}>
                            <Home size={11} /> Home Service
                          </span>
                        )}
                        {rating && (
                          <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.75rem', padding: '0.25rem 0.625rem', borderRadius: '99px', background: 'var(--primary-light)', color: 'var(--primary)', border: '1px solid rgba(212,175,55,0.2)', fontWeight: 600 }}>
                            <Star size={11} fill="var(--primary)" /> {rating.avg} ({rating.count})
                          </span>
                        )}
                      </div>

                      <div className="gold-line" />
                      <div style={{ paddingTop: '1rem', display: 'flex', justifyContent: 'flex-end' }}>
                        <span style={{ fontSize: '0.8125rem', color: 'var(--primary)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                          View Profile →
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Discover;
