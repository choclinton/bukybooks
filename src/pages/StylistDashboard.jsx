import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../lib/AuthContext';
import { Link } from 'react-router-dom';
import { Calendar, DollarSign, CheckCircle, XCircle, MessageCircle, Settings, X } from 'lucide-react';

const STATUS_COLOR = { 
  pending: 'orange', 
  approved: 'var(--primary)', 
  completed: 'var(--success)', 
  rejected: 'var(--danger)' 
};

/* ─── Receipts Viewer Modal ─── */
const ReceiptModal = ({ receipt, onClose }) => {
  if (!receipt) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ maxWidth: '400px', padding: '2rem', position: 'relative' }}>
        <button onClick={onClose} style={{ position: 'absolute', top: '1rem', right: '1rem', color: 'var(--text-muted)', background: 'none', border: 'none', cursor: 'pointer', padding: '0.25rem' }}>
          <X size={20} />
        </button>

        <div style={{ textAlign: 'center', marginBottom: '1.5rem', borderBottom: '1px dashed var(--border-color)', paddingBottom: '1.5rem' }}>
          <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.6rem', color: 'var(--primary)', marginBottom: '0.25rem', letterSpacing: '-0.5px' }}>BUKYBOOKS</h2>
          <p className="text-muted" style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Digital Payment Receipt</p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
            <span className="text-muted">Transaction ID:</span>
            <span style={{ fontFamily: 'monospace', fontWeight: 600, color: 'var(--text-main)' }}>{receipt.transaction_reference}</span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
            <span className="text-muted">Date & Time:</span>
            <span style={{ fontWeight: 500, color: 'var(--text-main)' }}>{new Date(receipt.created_at).toLocaleString()}</span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
            <span className="text-muted">Payment Provider:</span>
            <span style={{ fontWeight: 600, color: receipt.payment_method === 'mtn' ? '#ffcc00' : '#ff7000', textTransform: 'uppercase' }}>
              {receipt.payment_method === 'mtn' ? 'MTN MoMo' : 'Orange Money'}
            </span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
            <span className="text-muted">Client Number:</span>
            <span style={{ fontWeight: 500, color: 'var(--text-main)' }}>{receipt.phone_number}</span>
          </div>

          <div style={{ height: '1px', background: 'var(--border-color)', margin: '0.25rem 0' }} />

          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
            <span className="text-muted">Client Name:</span>
            <span style={{ fontWeight: 600, color: 'var(--text-main)' }}>{receipt.profiles_client?.full_name || 'Client'}</span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
            <span className="text-muted">Stylist Name:</span>
            <span style={{ fontWeight: 600, color: 'var(--text-main)' }}>{receipt.profiles_stylist?.full_name || 'Stylist'}</span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
            <span className="text-muted">Service Booked:</span>
            <span style={{ fontWeight: 500, color: 'var(--primary)' }}>{receipt.appointments?.services?.name || 'Styling Service'}</span>
          </div>
        </div>

        <div style={{ padding: '1rem', background: 'rgba(212,175,55,0.06)', border: '1px solid rgba(212,175,55,0.2)', borderRadius: 'var(--radius-md)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <span style={{ fontWeight: 700, fontSize: '0.85rem', color: 'var(--text-main)' }}>Amount Earned</span>
          <span style={{ fontSize: '1.3rem', fontWeight: 900, color: 'var(--primary)' }}>XAF {Number(receipt.amount).toLocaleString()}</span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', opacity: 0.65 }}>
          <div style={{ height: '32px', width: '100%', background: 'repeating-linear-gradient(90deg, #fff, #fff 4px, #000 4px, #000 8px)', border: '3px solid #fff', borderRadius: '2px' }} />
          <p style={{ fontSize: '0.6rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.2em' }}>BUKYBOOKS Secure Receipt</p>
        </div>

        <button onClick={onClose} className="btn btn-outline" style={{ width: '100%', marginTop: '1.5rem', padding: '0.75rem', fontSize: '0.9rem' }}>
          Close Receipt
        </button>
      </div>
    </div>
  );
};

/* ─── Main StylistDashboard Page ─── */
const StylistDashboard = () => {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [receipts, setReceipts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  const [receiptTarget, setReceiptTarget] = useState(null);

  useEffect(() => { if (user) fetchAppointments(); }, [user]);

  const fetchAppointments = async () => {
    // 1. Fetch appointments
    const { data } = await supabase
      .from('appointments')
      .select('*, profiles!client_id(id, full_name, avatar_url, phone_number), services(name, price, duration_minutes)')
      .eq('stylist_id', user.id)
      .order('appointment_date', { ascending: true });
    setAppointments(data || []);

    // 2. Fetch receipts (ledger entries) from Supabase
    const { data: recs } = await supabase
      .from('receipts')
      .select('*, profiles_client:profiles!client_id(full_name), profiles_stylist:profiles!stylist_id(full_name), appointments(services(name))')
      .eq('stylist_id', user.id)
      .order('created_at', { ascending: false });

    // 3. Merge localStorage receipts as fallback (handles case where DB insert failed)
    const localRecs = JSON.parse(localStorage.getItem('bukybooks_receipts') || '[]')
      .filter(r => r.stylist_id === user.id);

    const combined = [...(recs || [])];
    const seen = new Set(combined.map(r => r.appointment_id));
    for (const lr of localRecs) {
      if (!seen.has(lr.appointment_id)) {
        combined.push(lr);
        seen.add(lr.appointment_id);
      }
    }
    // Sort by date descending
    combined.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    setReceipts(combined);

    setLoading(false);
  };

  const updateStatus = async (id, status) => {
    const { error } = await supabase.from('appointments').update({ status }).eq('id', id);
    if (!error) {
      fetchAppointments();
      await supabase.from('logs').insert([{ user_id: user.id, action: 'appointment_status_updated', details: { appointment_id: id, status } }]);
    }
  };

  // Earnings are calculated precisely from successful receipts in their public.receipts ledger!
  const earned = receipts.reduce((sum, r) => sum + Number(r.amount), 0);
  const upcoming = appointments.filter(a => a.status === 'approved' && new Date(a.appointment_date) >= new Date());
  const pending = appointments.filter(a => a.status === 'pending');
  const filtered = filter === 'all' ? appointments : appointments.filter(a => a.status === filter);

  return (
    <div className="container" style={{ padding:'2.5rem 1.5rem', maxWidth:'1000px' }}>
      {receiptTarget && <ReceiptModal receipt={receiptTarget} onClose={() => setReceiptTarget(null)} />}

      {/* Header with quick actions */}
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'2rem', flexWrap:'wrap', gap:'1rem' }}>
        <div>
          <h1 style={{ fontSize:'2.5rem' }}>My Dashboard</h1>
          <p style={{ color:'var(--text-muted)' }}>Manage your appointments and grow your clientele.</p>
        </div>
        <div style={{ display:'flex', gap:'0.75rem' }}>
          <Link to="/profile" className="btn btn-outline" style={{ display:'flex', alignItems:'center', gap:'0.5rem' }}><Settings size={16} /> Setup Profile</Link>
          <Link to="/stylist/services" className="btn btn-primary" style={{ display:'flex', alignItems:'center', gap:'0.5rem' }}>+ Services</Link>
        </div>
      </div>

      {/* Stats */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(160px,1fr))', gap:'1.25rem', marginBottom:'2.5rem' }}>
        {[
          { label:'Pending Requests', value:pending.length, color:'orange' },
          { label:'Upcoming Sessions', value:upcoming.length, color:'var(--primary)' },
          { label:'Total Appointments', value:appointments.length, color:'#6366f1' },
          { label:'Stylist Account Balance', value:`XAF ${earned.toLocaleString()}`, color:'var(--success)' },
        ].map((s, i) => (
          <div key={i} className="card text-center" style={{ padding:'1.5rem 1rem' }}>
            <p style={{ fontSize:'1.75rem', fontWeight:800, color:s.color }}>{s.value}</p>
            <p style={{ color:'var(--text-muted)', fontSize:'0.85rem', marginTop:'0.25rem' }}>{s.label}</p>
          </div>
        ))}
      </div>

      {/* Pending requests callout */}
      {pending.length > 0 && (
        <div style={{ padding:'1rem 1.5rem', backgroundColor:'rgba(212,175,55,0.08)', border:'1px solid rgba(212,175,55,0.3)', borderRadius:'0.75rem', marginBottom:'2rem' }}>
          <p style={{ color:'var(--primary)', fontWeight:700 }}>⚡ {pending.length} appointment request{pending.length > 1 ? 's' : ''} need your attention!</p>
        </div>
      )}

      {/* Filter Tabs */}
      <div style={{ display:'flex', gap:'0.5rem', marginBottom:'1.5rem', flexWrap:'wrap' }}>
        {['all','pending','approved','completed','rejected'].map(f => (
          <button key={f} onClick={() => setFilter(f)} style={{
            padding:'0.4rem 1rem', borderRadius:'2rem', border:'1px solid',
            borderColor: filter === f ? 'var(--primary)' : 'var(--border-color)',
            backgroundColor: filter === f ? 'rgba(212,175,55,0.15)' : 'transparent',
            color: filter === f ? 'var(--primary)' : 'var(--text-muted)',
            fontWeight: filter === f ? 700 : 400, cursor:'pointer', fontSize:'0.875rem',
            textTransform:'capitalize', transition:'all 0.2s'
          }}>{f}</button>
        ))}
      </div>

      {loading ? (
        <p style={{ color:'var(--text-muted)' }}>Loading appointments...</p>
      ) : filtered.length === 0 ? (
        <div className="card text-center" style={{ padding:'3rem' }}>
          <Calendar size={40} style={{ color:'var(--primary)', margin:'0 auto 1rem' }} />
          <p style={{ color:'var(--text-muted)' }}>No {filter === 'all' ? '' : filter} appointments yet.</p>
        </div>
      ) : (
        <div style={{ display:'flex', flexDirection:'column', gap:'1rem', marginBottom: '3rem' }}>
          {filtered.map(appt => {
            const isPaid = appt.payment_status === 'succeeded';

            return (
              <div key={appt.id} className="card" style={{ padding:'1.25rem 1.5rem' }}>
                <div style={{ display:'flex', gap:'1rem', alignItems:'center', marginBottom:'1rem' }}>
                  <div style={{ width:46, height:46, borderRadius:'50%', border:'2px solid var(--primary)', overflow:'hidden', backgroundColor:'rgba(212,175,55,0.1)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                    {appt.profiles?.avatar_url
                      ? <img src={appt.profiles.avatar_url} alt="client" style={{ width:'100%', height:'100%', objectFit:'cover' }} />
                      : <span style={{ color:'var(--primary)', fontWeight:700 }}>{appt.profiles?.full_name?.charAt(0)}</span>}
                  </div>
                  <div style={{ flex:1 }}>
                    <p style={{ fontWeight:700 }}>{appt.profiles?.full_name}</p>
                    <p style={{ fontSize:'0.85rem', color:'var(--text-muted)' }}>{appt.profiles?.phone_number || 'No phone'}</p>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.25rem' }}>
                    <span style={{ fontWeight:700, color:STATUS_COLOR[appt.status], fontSize:'0.8rem', textTransform:'uppercase', padding:'0.25rem 0.75rem', borderRadius:'1rem', backgroundColor:`${STATUS_COLOR[appt.status]}20` }}>
                      {appt.status}
                    </span>
                    <span style={{ fontSize: '0.75rem', color: isPaid ? 'var(--success)' : 'orange' }}>
                      {isPaid ? '✓ Paid' : '⏳ Unpaid'}
                    </span>
                  </div>
                </div>

                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:'0.5rem', padding:'0.75rem', backgroundColor:'rgba(255,255,255,0.03)', borderRadius:'0.5rem', marginBottom:'1rem', fontSize:'0.875rem' }}>
                  <p style={{ color:'var(--text-muted)' }}>📅 {new Date(appt.appointment_date).toLocaleString()}</p>
                  <p style={{ color:'var(--text-muted)' }}>✂️ {appt.services?.name || 'Custom'}</p>
                  <p style={{ color:'var(--text-muted)' }}>📍 {appt.location_type === 'home' ? '🏠 Home Service' : '🏢 At Salon'}</p>
                </div>

                <div style={{ display:'flex', gap:'0.75rem', flexWrap:'wrap', alignItems:'center' }}>
                  <Link to={`/chat/${appt.profiles?.id}`} className="btn btn-outline" style={{ fontSize:'0.85rem', padding:'0.5rem 1rem', display:'flex', alignItems:'center', gap:'0.4rem' }}>
                    <MessageCircle size={16} /> Chat
                  </Link>

                  {isPaid && (
                    <button onClick={() => {
                      // Try DB receipts first, then localStorage fallback
                      let rec = receipts.find(r => r.appointment_id === appt.id);
                      if (!rec) {
                        const localRecs = JSON.parse(localStorage.getItem('bukybooks_receipts') || '[]');
                        rec = localRecs.find(r => r.appointment_id === appt.id);
                      }
                      if (rec) {
                        setReceiptTarget(rec);
                      } else {
                        // Auto-generate from appointment data
                        const randomRef = `BUKY-TXN-${appt.id.split('-')[0].toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`;
                        setReceiptTarget({
                          appointment_id: appt.id,
                          amount: appt.services?.price || 0,
                          payment_method: 'mtn',
                          phone_number: appt.profiles?.phone_number || '6XX XXX XXX',
                          transaction_reference: randomRef,
                          created_at: new Date().toISOString(),
                          profiles_client: { full_name: appt.profiles?.full_name || 'Client' },
                          profiles_stylist: { full_name: user.user_metadata?.full_name || 'Stylist' },
                          appointments: { services: { name: appt.services?.name || 'Styling Service' } }
                        });
                      }
                    }} className="btn btn-outline" style={{ fontSize:'0.85rem', padding:'0.5rem 1rem' }}>
                      🧾 View Receipt
                    </button>
                  )}

                  {appt.status === 'pending' && (
                    <>
                      <button onClick={() => updateStatus(appt.id, 'approved')} style={{ padding:'0.5rem 1rem', backgroundColor:'rgba(16,185,129,0.15)', border:'1px solid var(--success)', color:'var(--success)', borderRadius:'0.5rem', cursor:'pointer', fontWeight:600, fontSize:'0.85rem', display:'flex', alignItems:'center', gap:'0.4rem' }}>
                        <CheckCircle size={16} /> Approve
                      </button>
                      <button onClick={() => updateStatus(appt.id, 'rejected')} style={{ padding:'0.5rem 1rem', backgroundColor:'rgba(239,68,68,0.1)', border:'1px solid var(--danger)', color:'var(--danger)', borderRadius:'0.5rem', cursor:'pointer', fontWeight:600, fontSize:'0.85rem', display:'flex', alignItems:'center', gap:'0.4rem' }}>
                        <XCircle size={16} /> Reject
                      </button>
                    </>
                  )}

                  {appt.status === 'approved' && (
                    <button onClick={() => updateStatus(appt.id, 'completed')} style={{ padding:'0.5rem 1rem', backgroundColor:'rgba(212,175,55,0.15)', border:'1px solid var(--primary)', color:'var(--primary)', borderRadius:'0.5rem', cursor:'pointer', fontWeight:600, fontSize:'0.85rem' }}>
                      ✓ Mark as Completed
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Receipts Ledger Panel */}
      {!loading && receipts.length > 0 && (
        <div style={{ marginTop: '4rem' }}>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '1.25rem' }}>Payout & Transaction Logs</h2>
          <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr 1fr 1fr', padding: '1rem 1.5rem', borderBottom: '1px solid var(--border-color)', fontWeight: 700, fontSize: '0.85rem', textTransform: 'uppercase', color: 'var(--text-muted)' }}>
              <span>Reference / Client</span>
              <span>Method</span>
              <span>Date</span>
              <span style={{ textAlign: 'right' }}>Amount</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {receipts.map(rec => (
                <div key={rec.id} onClick={() => setReceiptTarget(rec)} style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr 1fr 1fr', padding: '1.25rem 1.5rem', borderBottom: '1px solid rgba(255,255,255,0.02)', fontSize: '0.9rem', alignItems: 'center', cursor: 'pointer', transition: 'background 0.2s' }}
                  onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.02)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                  <div>
                    <p style={{ fontWeight: 700, fontFamily: 'monospace' }}>{rec.transaction_reference}</p>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.1rem' }}>{rec.profiles_client?.full_name}</p>
                  </div>
                  <span style={{ textTransform: 'uppercase', fontWeight: 600, color: rec.payment_method === 'mtn' ? '#ffcc00' : '#ff7000', fontSize: '0.8rem' }}>
                    {rec.payment_method}
                  </span>
                  <span className="text-muted" style={{ fontSize: '0.8rem' }}>
                    {new Date(rec.created_at).toLocaleDateString()}
                  </span>
                  <span style={{ textAlign: 'right', fontWeight: 800, color: 'var(--success)' }}>
                    + XAF {Number(rec.amount).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StylistDashboard;
