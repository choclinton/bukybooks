import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../lib/AuthContext';
import { Link } from 'react-router-dom';
import { MessageCircle, Search, AlertCircle } from 'lucide-react';

const ChatList = () => {
  const { user, role } = useAuth();
  const [conversations, setConversations] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [error, setError] = useState(null);

  useEffect(() => { 
    if (user) {
      fetchConversations(); 
    }
  }, [user, role]);

  const fetchConversations = async () => {
    try {
      setLoading(true);
      setError(null);

      // 1. Fetch all messages involving this user
      const { data: msgs, error: msgsErr } = await supabase
        .from('messages')
        .select('id, sender_id, receiver_id, content, created_at')
        .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`)
        .order('created_at', { ascending: false });

      if (msgsErr) throw msgsErr;

      // 2. Fetch all appointments involving this user to suggest contacts
      let contactSuggestions = [];
      try {
        if (role === 'client') {
          const { data: appts, error: apptsErr } = await supabase
            .from('appointments')
            .select('profiles!stylist_id(id, full_name, avatar_url, role)')
            .eq('client_id', user.id);
          
          if (!apptsErr && appts) {
            const seen = new Set();
            contactSuggestions = appts
              .map(a => a.profiles)
              .filter(p => {
                if (!p || seen.has(p.id)) return false;
                seen.add(p.id);
                return true;
              });
          }
        } else if (role === 'stylist') {
          const { data: appts, error: apptsErr } = await supabase
            .from('appointments')
            .select('profiles!client_id(id, full_name, avatar_url, role)')
            .eq('stylist_id', user.id);
          
          if (!apptsErr && appts) {
            const seen = new Set();
            contactSuggestions = appts
              .map(a => a.profiles)
              .filter(p => {
                if (!p || seen.has(p.id)) return false;
                seen.add(p.id);
                return true;
              });
          }
        }
      } catch (suggErr) {
        console.error("Error fetching contact suggestions:", suggErr);
      }

      if (!msgs || msgs.length === 0) {
        setConversations([]);
        setSuggestions(contactSuggestions);
        setLoading(false);
        return;
      }

      // Build map of other_user_id → last message
      const convMap = new Map();
      for (const msg of msgs) {
        const otherId = msg.sender_id === user.id ? msg.receiver_id : msg.sender_id;
        if (!convMap.has(otherId)) {
          convMap.set(otherId, { lastMessage: msg.content, lastAt: msg.created_at });
        }
      }

      // Fetch profiles for all other users
      const otherIds = [...convMap.keys()];
      const { data: profiles, error: profsErr } = await supabase
        .from('profiles')
        .select('id, full_name, avatar_url, role')
        .in('id', otherIds);

      if (profsErr) throw profsErr;

      const result = (profiles || []).map(p => ({
        ...p,
        ...convMap.get(p.id)
      })).sort((a, b) => new Date(b.lastAt) - new Date(a.lastAt));

      setConversations(result);

      // Filter suggestions to only show contacts who don't already have an active conversation
      const activeIds = new Set(result.map(c => c.id));
      setSuggestions(contactSuggestions.filter(s => s && !activeIds.has(s.id)));

    } catch (err) {
      console.error("Error loading chats:", err.message);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (ts) => {
    const d = new Date(ts);
    const now = new Date();
    const diff = now - d;
    if (diff < 86400000) return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    if (diff < 604800000) return d.toLocaleDateString([], { weekday: 'short' });
    return d.toLocaleDateString([], { month: 'short', day: 'numeric' });
  };

  const filtered = conversations.filter(c =>
    c.full_name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 4.5rem)' }}>
      {/* Header */}
      <div style={{ padding: '1.5rem 1.5rem 1rem', borderBottom: '1px solid var(--border-color)', background: 'rgba(8,10,14,0.8)', backdropFilter: 'blur(10px)' }}>
        <h1 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Messages</h1>
        {/* Search */}
        <div style={{ position: 'relative' }}>
          <Search size={16} style={{ position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', pointerEvents: 'none' }} />
          <input
            type="text"
            className="input-field"
            placeholder="Search conversations…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ paddingLeft: '2.5rem', marginBottom: 0 }}
          />
        </div>
      </div>

      {/* Suggestion Contacts Bar */}
      {!loading && suggestions.length > 0 && (
        <div style={{ padding: '1rem 1.5rem 0.75rem', borderBottom: '1px solid rgba(255,255,255,0.03)', background: 'rgba(255,255,255,0.01)' }}>
          <p style={{ fontSize: '0.75rem', color: 'var(--primary)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.75rem' }}>
            {role === 'client' ? 'Suggested Stylists' : 'My Clients'}
          </p>
          <div style={{ display: 'flex', gap: '1.25rem', overflowX: 'auto', paddingBottom: '0.5rem', scrollbarWidth: 'none' }}>
            {suggestions.map(s => (
              <Link key={s.id} to={`/chat/${s.id}`} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.4rem', minWidth: '60px', textDecoration: 'none' }}>
                <div className="avatar" style={{ width: 44, height: 44 }}>
                  {s.avatar_url ? (
                    <img src={s.avatar_url} alt={s.full_name} />
                  ) : (
                    <span style={{ fontSize: '1.1rem' }}>{s.full_name?.charAt(0)}</span>
                  )}
                </div>
                <p style={{ fontSize: '0.7rem', color: 'var(--text-main)', textAlign: 'center', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', width: '60px', fontWeight: 600 }}>
                  {s.full_name?.split(' ')[0]}
                </p>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Conversation List */}
      <div style={{ flex: 1, overflowY: 'auto' }}>
        {loading ? (
          <div className="loading-container"><div className="spinner" /></div>
        ) : error ? (
          <div style={{ textAlign: 'center', padding: '3rem 1.5rem', color: 'var(--danger)' }}>
            <AlertCircle size={40} style={{ margin: '0 auto 1rem', opacity: 0.8 }} />
            <h3 style={{ marginBottom: '0.5rem' }}>Failed to load messages</h3>
            <p className="text-muted" style={{ fontSize: '0.9rem', marginBottom: '1.5rem' }}>{error}</p>
            <button onClick={fetchConversations} className="btn btn-outline" style={{ fontSize: '0.85rem' }}>Try Again</button>
          </div>
        ) : filtered.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">
              <MessageCircle size={32} />
            </div>
            <h3 style={{ marginBottom: '0.5rem' }}>
              {search ? 'No results found' : 'No active chats'}
            </h3>
            <p className="text-muted" style={{ maxWidth: '280px', margin: '0 auto', fontSize: '0.9rem' }}>
              {search 
                ? `No conversation matches "${search}"` 
                : suggestions.length > 0 
                  ? 'Click on any suggested contact above to start a conversation!' 
                  : 'Your conversations with professionals and clients will appear here.'}
            </p>
          </div>
        ) : (
          filtered.map((c, i) => (
            <Link key={c.id} to={`/chat/${c.id}`} style={{ textDecoration: 'none', display: 'block' }}>
              <div style={{
                display: 'flex', alignItems: 'center', gap: '1rem',
                padding: '1rem 1.5rem',
                borderBottom: '1px solid rgba(255,255,255,0.03)',
                transition: 'background 0.15s',
                animation: `fadeIn 0.3s ease ${i * 0.05}s both`
              }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.03)'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              >
                {/* Avatar */}
                <div className="avatar" style={{ width: 52, height: 52, flexShrink: 0 }}>
                  {c.avatar_url
                    ? <img src={c.avatar_url} alt={c.full_name} />
                    : <span style={{ fontSize: '1.25rem' }}>{c.full_name?.charAt(0)}</span>}
                </div>

                {/* Info */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '0.25rem' }}>
                    <p style={{ fontWeight: 700, fontSize: '0.9375rem', color: 'var(--text-main)' }}>{c.full_name}</p>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', flexShrink: 0, marginLeft: '0.5rem' }}>{formatTime(c.lastAt)}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.8125rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '240px' }}>
                      {c.lastMessage}
                    </p>
                    <span style={{ fontSize: '0.7rem', padding: '0.15rem 0.5rem', borderRadius: '99px', background: 'rgba(212,175,55,0.1)', color: 'var(--primary)', fontWeight: 600, textTransform: 'capitalize', marginLeft: '0.5rem', flexShrink: 0 }}>
                      {c.role}
                    </span>
                  </div>
                </div>

                {/* Arrow */}
                <span style={{ color: 'var(--text-subtle)', flexShrink: 0, fontSize: '1.2rem' }}>›</span>
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
};

export default ChatList;
