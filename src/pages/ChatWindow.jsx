import { useEffect, useState, useRef } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../lib/AuthContext';
import { useParams, Link } from 'react-router-dom';
import { Send, ArrowLeft, Phone } from 'lucide-react';

const ChatWindow = () => {
  const { id: otherId } = useParams();   // the other person's user id
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [newMsg, setNewMsg] = useState('');
  const [otherUser, setOtherUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  // Unique channel name – always same regardless of who initiated
  const channelName = `chat_${[user.id, otherId].sort().join('_')}`;

  useEffect(() => {
    if (!otherId || !user) return;
    fetchOtherUser();
    fetchMessages();

    // Realtime subscription – scoped exactly to this conversation pair
    const channel = supabase
      .channel(channelName)
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'messages' },
        (payload) => {
          const msg = payload.new;
          const belongsHere =
            (msg.sender_id === user.id && msg.receiver_id === otherId) ||
            (msg.sender_id === otherId && msg.receiver_id === user.id);
          if (belongsHere) {
            setMessages(prev => {
              // prevent duplicates
              if (prev.find(m => m.id === msg.id)) return prev;
              return [...prev, msg];
            });
          }
        }
      )
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [otherId, user?.id]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const fetchOtherUser = async () => {
    const { data } = await supabase
      .from('profiles')
      .select('id, full_name, avatar_url, role')
      .eq('id', otherId)
      .single();
    if (data) setOtherUser(data);
  };

  const fetchMessages = async () => {
    const { data } = await supabase
      .from('messages')
      .select('*')
      .or(`and(sender_id.eq.${user.id},receiver_id.eq.${otherId}),and(sender_id.eq.${otherId},receiver_id.eq.${user.id})`)
      .order('created_at', { ascending: true });
    if (data) setMessages(data);
    setLoading(false);
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    const content = newMsg.trim();
    if (!content) return;
    setSending(true);
    setNewMsg('');

    const { data, error } = await supabase
      .from('messages')
      .insert([{
        sender_id: user.id,
        receiver_id: otherId,
        content
      }])
      .select()
      .single();

    if (!error && data) {
      setMessages(prev => {
        // prevent duplicate rendering if realtime fires early
        if (prev.find(m => m.id === data.id)) return prev;
        return [...prev, data];
      });
    } else if (error) {
      console.error('Send error:', error.message);
      setNewMsg(content); // restore on failure
    }
    setSending(false);
    inputRef.current?.focus();
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(e);
    }
  };

  const formatTime = (ts) => new Date(ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  const formatDateLabel = (ts) => {
    const d = new Date(ts);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    if (d.toDateString() === today.toDateString()) return 'Today';
    if (d.toDateString() === yesterday.toDateString()) return 'Yesterday';
    return d.toLocaleDateString([], { weekday: 'long', month: 'short', day: 'numeric' });
  };

  // Group messages by date
  const grouped = messages.reduce((acc, msg) => {
    const label = formatDateLabel(msg.created_at);
    if (!acc[label]) acc[label] = [];
    acc[label].push(msg);
    return acc;
  }, {});

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 4.5rem)', background: 'var(--bg-dark)' }}>

      {/* ── Header ── */}
      <div style={{
        padding: '1rem 1.5rem',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        background: 'rgba(17,20,25,0.95)',
        backdropFilter: 'blur(16px)',
        display: 'flex', alignItems: 'center', gap: '1rem',
        boxShadow: '0 1px 0 rgba(255,255,255,0.04)'
      }}>
        <Link to="/chat" style={{ color: 'var(--text-muted)', display: 'flex', alignItems: 'center', padding: '0.375rem', borderRadius: '50%', transition: 'all 0.2s' }}
          onMouseEnter={e => { e.currentTarget.style.color = 'var(--primary)'; e.currentTarget.style.background = 'var(--primary-light)'; }}
          onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-muted)'; e.currentTarget.style.background = 'transparent'; }}>
          <ArrowLeft size={20} />
        </Link>

        <div className="avatar" style={{ width: 44, height: 44 }}>
          {otherUser?.avatar_url
            ? <img src={otherUser.avatar_url} alt={otherUser?.full_name} />
            : <span style={{ fontSize: '1.1rem' }}>{otherUser?.full_name?.charAt(0)}</span>}
        </div>

        <div style={{ flex: 1 }}>
          <p style={{ fontWeight: 700, fontSize: '1rem', lineHeight: 1.2 }}>{otherUser?.full_name}</p>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'capitalize', marginTop: '0.1rem' }}>
            {otherUser?.role}
          </p>
        </div>
      </div>

      {/* ── Messages Area ── */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '1.5rem 1.25rem', display: 'flex', flexDirection: 'column', gap: '0' }}>
        {loading ? (
          <div className="loading-container"><div className="spinner" /></div>
        ) : Object.keys(grouped).length === 0 ? (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '3rem' }}>
            <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'var(--primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem', color: 'var(--primary)' }}>
              <Phone size={28} />
            </div>
            <p style={{ fontWeight: 600, marginBottom: '0.5rem' }}>Start your conversation</p>
            <p className="text-muted" style={{ fontSize: '0.875rem', maxWidth: '260px', lineHeight: 1.6 }}>
              Say hello to <strong style={{ color: 'var(--text-main)' }}>{otherUser?.full_name}</strong> and discuss your appointment.
            </p>
          </div>
        ) : (
          Object.entries(grouped).map(([dateLabel, msgs]) => (
            <div key={dateLabel}>
              {/* Date separator */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', margin: '1.5rem 0 1rem' }}>
                <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.05)' }} />
                <span style={{ fontSize: '0.7rem', color: 'var(--text-subtle)', fontWeight: 600, padding: '0.25rem 0.75rem', background: 'rgba(255,255,255,0.04)', borderRadius: '99px', border: '1px solid rgba(255,255,255,0.06)' }}>
                  {dateLabel}
                </span>
                <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.05)' }} />
              </div>

              {/* Messages */}
              {msgs.map((msg, idx) => {
                const mine = msg.sender_id === user.id;
                const prevMsg = msgs[idx - 1];
                const sameAsPrev = prevMsg && prevMsg.sender_id === msg.sender_id;
                return (
                  <div key={msg.id} style={{
                    display: 'flex',
                    justifyContent: mine ? 'flex-end' : 'flex-start',
                    marginBottom: sameAsPrev ? '0.25rem' : '0.75rem',
                    animation: 'fadeIn 0.2s ease'
                  }}>
                    {/* Other person avatar (only show when sender changes) */}
                    {!mine && !sameAsPrev && (
                      <div className="avatar" style={{ width: 28, height: 28, marginRight: '0.5rem', alignSelf: 'flex-end', flexShrink: 0 }}>
                        {otherUser?.avatar_url
                          ? <img src={otherUser.avatar_url} alt="" />
                          : <span style={{ fontSize: '0.75rem' }}>{otherUser?.full_name?.charAt(0)}</span>}
                      </div>
                    )}
                    {!mine && sameAsPrev && <div style={{ width: 28, marginRight: '0.5rem', flexShrink: 0 }} />}

                    <div style={{
                      maxWidth: '68%',
                      padding: '0.625rem 0.875rem',
                      borderRadius: mine
                        ? (sameAsPrev ? '1rem 0.25rem 0.25rem 1rem' : '1.25rem 0.25rem 1.25rem 1.25rem')
                        : (sameAsPrev ? '0.25rem 1rem 1rem 0.25rem' : '0.25rem 1.25rem 1.25rem 1.25rem'),
                      background: mine
                        ? 'linear-gradient(135deg, #e8c547 0%, #c9942c 100%)'
                        : 'rgba(255,255,255,0.07)',
                      color: mine ? '#000' : 'var(--text-main)',
                      border: mine ? 'none' : '1px solid rgba(255,255,255,0.06)',
                      boxShadow: mine ? '0 2px 12px rgba(212,175,55,0.2)' : 'none',
                    }}>
                      <p style={{ fontSize: '0.9375rem', lineHeight: 1.5, wordBreak: 'break-word' }}>{msg.content}</p>
                      <p style={{ fontSize: '0.65rem', marginTop: '0.3rem', opacity: 0.55, textAlign: 'right' }}>{formatTime(msg.created_at)}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          ))
        )}
        <div ref={bottomRef} />
      </div>

      {/* ── Input Bar ── */}
      <form onSubmit={sendMessage} style={{
        padding: '0.875rem 1.25rem',
        borderTop: '1px solid rgba(255,255,255,0.06)',
        background: 'rgba(17,20,25,0.95)',
        backdropFilter: 'blur(16px)',
        display: 'flex', gap: '0.75rem', alignItems: 'center'
      }}>
        <input
          ref={inputRef}
          type="text"
          className="input-field"
          placeholder={`Message ${otherUser?.full_name || ''}…`}
          value={newMsg}
          onChange={e => setNewMsg(e.target.value)}
          onKeyDown={handleKeyDown}
          style={{ flex: 1, marginBottom: 0, borderRadius: '99px', padding: '0.75rem 1.25rem' }}
        />
        <button
          type="submit"
          disabled={sending || !newMsg.trim()}
          style={{
            width: 44, height: 44, borderRadius: '50%', border: 'none', cursor: newMsg.trim() ? 'pointer' : 'default',
            background: newMsg.trim() ? 'var(--gradient-gold)' : 'var(--bg-card)',
            color: newMsg.trim() ? '#000' : 'var(--text-subtle)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
            transition: 'all 0.2s',
            boxShadow: newMsg.trim() ? '0 4px 15px rgba(212,175,55,0.3)' : 'none',
            transform: newMsg.trim() ? 'scale(1)' : 'scale(0.95)'
          }}
        >
          <Send size={18} />
        </button>
      </form>
    </div>
  );
};

export default ChatWindow;
