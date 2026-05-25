import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Users, Calendar, List, FileText, Trash2, ShieldCheck, ShieldOff } from 'lucide-react';

const TABS = ['Overview', 'Users', 'Appointments', 'Services', 'Logs'];

const AdminDashboard = () => {
  const [tab, setTab] = useState('Overview');
  const [users, setUsers] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [services, setServices] = useState([]);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => { loadTab(tab); }, [tab]);

  const loadTab = async (t) => {
    setLoading(true);
    if (t === 'Overview' || t === 'Users') {
      const { data } = await supabase.from('profiles').select('*').order('created_at', { ascending: false });
      setUsers(data || []);
    }
    if (t === 'Overview' || t === 'Appointments') {
      const { data } = await supabase.from('appointments').select('*, profiles!client_id(full_name), profiles!stylist_id(full_name), services(name)').order('created_at', { ascending: false }).limit(50);
      setAppointments(data || []);
    }
    if (t === 'Services') {
      const { data } = await supabase.from('services').select('*, profiles!stylist_id(full_name)').order('created_at', { ascending: false });
      setServices(data || []);
    }
    if (t === 'Logs') {
      const { data } = await supabase.from('logs').select('*, profiles(full_name)').order('created_at', { ascending: false }).limit(100);
      setLogs(data || []);
    }
    setLoading(false);
  };

  const deleteUser = async (id) => {
    if (!window.confirm('Delete this user and all their data?')) return;
    await supabase.from('profiles').delete().eq('id', id);
    setUsers(u => u.filter(x => x.id !== id));
  };

  const changeRole = async (id, newRole) => {
    await supabase.from('profiles').update({ role: newRole }).eq('id', id);
    setUsers(u => u.map(x => x.id === id ? { ...x, role: newRole } : x));
  };

  const deleteService = async (id) => {
    if (!window.confirm('Delete this service?')) return;
    await supabase.from('services').delete().eq('id', id);
    setServices(s => s.filter(x => x.id !== id));
  };

  const stats = {
    clients: users.filter(u => u.role === 'client').length,
    stylists: users.filter(u => u.role === 'stylist').length,
    appointments: appointments.length,
    pending: appointments.filter(a => a.status === 'pending').length,
  };

  const statusColor = (s) => ({ pending:'orange', approved:'var(--primary)', completed:'var(--success)', rejected:'var(--danger)' }[s] || 'var(--text-muted)');

  return (
    <div className="container" style={{ padding:'2.5rem 1.5rem', maxWidth:'1100px' }}>
      <h1 style={{ fontSize:'2.5rem', marginBottom:'0.5rem' }}>Admin Panel</h1>
      <p style={{ color:'var(--text-muted)', marginBottom:'2rem' }}>Full control over users, bookings, services, and platform activity.</p>

      {/* Tabs */}
      <div style={{ display:'flex', gap:'0.5rem', marginBottom:'2rem', borderBottom:'1px solid var(--border-color)', paddingBottom:'0' }}>
        {TABS.map(t => (
          <button key={t} onClick={() => setTab(t)} style={{
            padding:'0.6rem 1.25rem', border:'none', cursor:'pointer', fontWeight:600,
            borderRadius:'0.5rem 0.5rem 0 0', fontSize:'0.95rem',
            backgroundColor: tab === t ? 'var(--primary)' : 'transparent',
            color: tab === t ? '#000' : 'var(--text-muted)',
            borderBottom: tab === t ? '2px solid var(--primary)' : '2px solid transparent',
            transition:'all 0.2s'
          }}>
            {t}
          </button>
        ))}
      </div>

      {loading ? (
        <div style={{ textAlign:'center', padding:'4rem', color:'var(--primary)' }}>Loading...</div>
      ) : (
        <>
          {/* OVERVIEW */}
          {tab === 'Overview' && (
            <div>
              <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(180px,1fr))', gap:'1.5rem', marginBottom:'3rem' }}>
                {[
                  { label:'Total Clients', value:stats.clients, icon:<Users size={28} />, color:'#6366f1' },
                  { label:'Total Stylists', value:stats.stylists, icon:<ShieldCheck size={28} />, color:'var(--primary)' },
                  { label:'Appointments', value:stats.appointments, icon:<Calendar size={28} />, color:'var(--success)' },
                  { label:'Pending Approval', value:stats.pending, icon:<FileText size={28} />, color:'orange' },
                ].map((s, i) => (
                  <div key={i} className="card text-center" style={{ padding:'2rem 1rem' }}>
                    <div style={{ color:s.color, marginBottom:'1rem' }}>{s.icon}</div>
                    <h2 style={{ fontSize:'2.5rem', fontWeight:800, color:s.color }}>{s.value}</h2>
                    <p style={{ color:'var(--text-muted)', fontSize:'0.9rem' }}>{s.label}</p>
                  </div>
                ))}
              </div>
              <h3 style={{ marginBottom:'1rem' }}>Recent Appointments</h3>
              <div style={{ display:'flex', flexDirection:'column', gap:'0.75rem' }}>
                {appointments.slice(0, 6).map(a => (
                  <div key={a.id} className="card" style={{ display:'flex', justifyContent:'space-between', padding:'1rem 1.5rem', alignItems:'center' }}>
                    <div>
                      <p style={{ fontWeight:600 }}>{a['profiles!client_id']?.full_name} → {a['profiles!stylist_id']?.full_name}</p>
                      <p style={{ fontSize:'0.85rem', color:'var(--text-muted)' }}>{new Date(a.appointment_date).toLocaleString()} • {a.services?.name}</p>
                    </div>
                    <span style={{ color:statusColor(a.status), fontWeight:700, fontSize:'0.85rem', textTransform:'uppercase' }}>{a.status}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* USERS */}
          {tab === 'Users' && (
            <div style={{ display:'flex', flexDirection:'column', gap:'0.75rem' }}>
              {users.map(u => (
                <div key={u.id} className="card" style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'1rem 1.5rem' }}>
                  <div>
                    <p style={{ fontWeight:700 }}>{u.full_name}</p>
                    <p style={{ fontSize:'0.85rem', color:'var(--text-muted)' }}>Joined {new Date(u.created_at).toLocaleDateString()} • {u.phone_number || 'No phone'}</p>
                  </div>
                  <div style={{ display:'flex', gap:'0.5rem', alignItems:'center' }}>
                    <select
                      value={u.role}
                      onChange={e => changeRole(u.id, e.target.value)}
                      style={{ padding:'0.4rem 0.75rem', backgroundColor:'var(--bg-dark)', color:'var(--primary)', border:'1px solid var(--primary)', borderRadius:'0.4rem', fontWeight:600, cursor:'pointer' }}
                    >
                      <option value="client">Client</option>
                      <option value="stylist">Stylist</option>
                      <option value="admin">Admin</option>
                    </select>
                    <button onClick={() => deleteUser(u.id)} style={{ padding:'0.4rem 0.7rem', backgroundColor:'rgba(239,68,68,0.1)', border:'1px solid rgba(239,68,68,0.3)', color:'var(--danger)', borderRadius:'0.4rem', cursor:'pointer' }}>
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* APPOINTMENTS */}
          {tab === 'Appointments' && (
            <div style={{ display:'flex', flexDirection:'column', gap:'0.75rem' }}>
              {appointments.map(a => (
                <div key={a.id} className="card" style={{ padding:'1rem 1.5rem' }}>
                  <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start' }}>
                    <div>
                      <p style={{ fontWeight:700 }}>{a['profiles!client_id']?.full_name} → {a['profiles!stylist_id']?.full_name}</p>
                      <p style={{ fontSize:'0.85rem', color:'var(--text-muted)', marginTop:'0.25rem' }}>{a.services?.name} • {new Date(a.appointment_date).toLocaleString()} • {a.location_type}</p>
                    </div>
                    <div style={{ textAlign:'right' }}>
                      <span style={{ color:statusColor(a.status), fontWeight:700, fontSize:'0.85rem', textTransform:'uppercase' }}>{a.status}</span>
                      <p style={{ fontSize:'0.8rem', color: a.payment_status === 'succeeded' ? 'var(--success)' : 'orange', marginTop:'0.25rem' }}>Payment: {a.payment_status}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* SERVICES */}
          {tab === 'Services' && (
            <div style={{ display:'flex', flexDirection:'column', gap:'0.75rem' }}>
              {services.map(s => (
                <div key={s.id} className="card" style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'1rem 1.5rem' }}>
                  <div>
                    <p style={{ fontWeight:700 }}>{s.name} <span style={{ color:'var(--text-muted)', fontWeight:400 }}>by {s['profiles!stylist_id']?.full_name}</span></p>
                    <p style={{ fontSize:'0.85rem', color:'var(--text-muted)', marginTop:'0.25rem' }}>XAF {s.price} • {s.duration_minutes} mins</p>
                    {s.description && <p style={{ fontSize:'0.8rem', color:'var(--text-muted)', marginTop:'0.25rem' }}>{s.description}</p>}
                  </div>
                  <button onClick={() => deleteService(s.id)} style={{ padding:'0.4rem 0.7rem', backgroundColor:'rgba(239,68,68,0.1)', border:'1px solid rgba(239,68,68,0.3)', color:'var(--danger)', borderRadius:'0.4rem', cursor:'pointer', flexShrink:0 }}>
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* LOGS */}
          {tab === 'Logs' && (
            <div style={{ display:'flex', flexDirection:'column', gap:'0.5rem' }}>
              {logs.map(l => (
                <div key={l.id} className="card" style={{ padding:'0.75rem 1.25rem', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                  <div>
                    <p style={{ fontWeight:600, fontSize:'0.9rem' }}>{l.profiles?.full_name || 'Unknown User'}</p>
                    <p style={{ color:'var(--primary)', fontSize:'0.85rem' }}>{l.action.replace(/_/g, ' ')}</p>
                    {l.details && Object.keys(l.details).length > 0 && (
                      <p style={{ fontSize:'0.75rem', color:'var(--text-muted)', marginTop:'0.25rem' }}>{JSON.stringify(l.details)}</p>
                    )}
                  </div>
                  <p style={{ fontSize:'0.75rem', color:'var(--text-muted)', flexShrink:0, marginLeft:'1rem' }}>
                    {new Date(l.created_at).toLocaleString()}
                  </p>
                </div>
              ))}
              {logs.length === 0 && <p style={{ color:'var(--text-muted)', textAlign:'center', padding:'3rem' }}>No activity logs yet.</p>}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default AdminDashboard;
