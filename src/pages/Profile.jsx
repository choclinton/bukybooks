import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../lib/AuthContext';
import { LogOut, Camera, MapPin, Home } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const { user, role } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [avatarFile, setAvatarFile] = useState(null);
  
  const [profileData, setProfileData] = useState({
    full_name: '', phone_number: '', date_of_birth: '', avatar_url: ''
  });

  const [stylistData, setStylistData] = useState({
    bio: '', business_address: '', is_home_service_available: false, years_experience: '', specialties: ''
  });

  useEffect(() => { 
    if (user) {
      loadAllData();
    }
  }, [user, role]);

  const loadAllData = async () => {
    setLoading(true);
    try {
      const { data: prof, error: profErr } = await supabase
        .from('profiles')
        .select('full_name, phone_number, date_of_birth, avatar_url')
        .eq('id', user.id)
        .single();
      
      if (!profErr && prof) {
        setProfileData({
          full_name: prof.full_name || '',
          phone_number: prof.phone_number || '',
          date_of_birth: prof.date_of_birth || '',
          avatar_url: prof.avatar_url || ''
        });
      }

      if (role === 'stylist') {
        const { data: stl, error: stlErr } = await supabase
          .from('stylist_details')
          .select('*')
          .eq('id', user.id)
          .single();
        
        if (!stlErr && stl) {
          setStylistData({
            bio: stl.bio || '',
            business_address: stl.business_address || '',
            is_home_service_available: stl.is_home_service_available || false,
            years_experience: stl.years_experience || '',
            specialties: stl.specialties || ''
          });
        }
      }
    } catch (err) {
      console.error("Error loading profile details:", err);
    } finally {
      setLoading(false);
    }
  };

  const uploadAvatar = async () => {
    const fileExt = avatarFile.name.split('.').pop();
    const fileName = `${user.id}-${Date.now()}.${fileExt}`;
    const { error } = await supabase.storage.from('avatars').upload(fileName, avatarFile, { upsert: true });
    if (error) throw error;
    return supabase.storage.from('avatars').getPublicUrl(fileName).data.publicUrl;
  };

  const updateProfile = async (e) => {
    e.preventDefault();
    setSaving(true); setMessage(''); setErrorMsg('');
    try {
      let newAvatarUrl = profileData.avatar_url;
      if (avatarFile) newAvatarUrl = await uploadAvatar();

      // Update core profile
      const updateObj = {
        full_name: profileData.full_name,
        phone_number: profileData.phone_number,
        avatar_url: newAvatarUrl
      };
      if (profileData.date_of_birth) updateObj.date_of_birth = profileData.date_of_birth;

      const { error: profErr } = await supabase.from('profiles').update(updateObj).eq('id', user.id);
      if (profErr) throw profErr;

      // Update stylist specific details
      if (role === 'stylist') {
        const { error: stlErr } = await supabase.from('stylist_details').upsert({
          id: user.id,
          bio: stylistData.bio,
          business_address: stylistData.business_address,
          is_home_service_available: stylistData.is_home_service_available,
          years_experience: stylistData.years_experience ? parseInt(stylistData.years_experience) : null,
          specialties: stylistData.specialties
        });
        if (stlErr) throw stlErr;
      }

      setProfileData(p => ({ ...p, avatar_url: newAvatarUrl }));
      setAvatarFile(null);
      setMessage('Profile updated successfully!');
      await supabase.from('logs').insert([{ user_id: user.id, action: 'profile_updated', details: {} }]);
    } catch (err) {
      setErrorMsg(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  if (loading) return <div style={{ display:'flex',alignItems:'center',justifyContent:'center',minHeight:'60vh' }}><p style={{ color:'var(--primary)' }}>Loading profile...</p></div>;

  const previewUrl = avatarFile ? URL.createObjectURL(avatarFile) : profileData.avatar_url;

  return (
    <div className="container animate-fade-in" style={{ padding:'2.5rem 1.5rem', maxWidth:'1000px' }}>
      <h1 style={{ fontSize:'2.5rem', marginBottom:'2rem' }}>My Profile</h1>
      <div className="card" style={{ display:'grid', gridTemplateColumns:'220px 1fr', padding:0, overflow:'hidden' }}>

        {/* Sidebar */}
        <div style={{ display:'flex',flexDirection:'column',alignItems:'center',padding:'2.5rem 1.5rem',gap:'1.25rem',background:'rgba(212,175,55,0.04)',borderRight:'1px solid var(--border-color)' }}>
          <div style={{ position:'relative', width:140, height:140 }}>
            <div style={{ width:140,height:140,borderRadius:'50%',overflow:'hidden',border:'2px solid var(--primary)',backgroundColor:'rgba(212,175,55,0.1)',display:'flex',alignItems:'center',justifyContent:'center' }}>
              {previewUrl
                ? <img src={previewUrl} alt="avatar" style={{ width:'100%',height:'100%',objectFit:'cover' }} />
                : <span style={{ fontSize:'3.5rem',color:'var(--primary)',fontWeight:700 }}>{profileData.full_name?.charAt(0)?.toUpperCase()}</span>}
            </div>
            <label htmlFor="avatar-upload" title="Change photo" style={{ position:'absolute',bottom:4,right:4,width:34,height:34,borderRadius:'50%',backgroundColor:'var(--primary)',color:'#000',display:'flex',alignItems:'center',justifyContent:'center',cursor:'pointer',boxShadow:'0 2px 8px rgba(0,0,0,0.4)' }}>
              <Camera size={16} />
              <input id="avatar-upload" type="file" accept="image/*" style={{ display:'none' }} onChange={e => setAvatarFile(e.target.files[0])} />
            </label>
          </div>

          <div style={{ textAlign:'center' }}>
            <p style={{ fontWeight:700, fontSize:'1rem' }}>{profileData.full_name || '—'}</p>
            <p style={{ fontSize:'0.8rem',color:'var(--text-muted)',marginTop:'0.25rem' }}>{user?.email}</p>
          </div>

          <span style={{ padding:'0.25rem 0.9rem',backgroundColor:'rgba(212,175,55,0.15)',color:'var(--primary)',borderRadius:'1rem',fontWeight:700,fontSize:'0.75rem',textTransform:'uppercase',letterSpacing:'0.05em',border:'1px solid rgba(212,175,55,0.3)' }}>{role}</span>

          {avatarFile && <p style={{ fontSize:'0.75rem',color:'var(--success)',textAlign:'center' }}>✓ New photo ready to save</p>}

          <div style={{ marginTop:'auto',paddingTop:'2rem',width:'100%' }}>
            <button onClick={handleSignOut} style={{ width:'100%',display:'flex',alignItems:'center',justifyContent:'center',gap:'0.5rem',padding:'0.6rem 1rem',borderRadius:'0.5rem',background:'transparent',border:'1px solid rgba(239,68,68,0.4)',color:'#f87171',fontSize:'0.9rem',fontWeight:600,cursor:'pointer',transition:'all 0.2s' }}
              onMouseEnter={e => { e.currentTarget.style.background='rgba(239,68,68,0.1)'; }}
              onMouseLeave={e => { e.currentTarget.style.background='transparent'; }}>
              <LogOut size={16} /> Sign Out
            </button>
          </div>
        </div>

        {/* Form Content */}
        <div style={{ padding:'2.5rem', maxHeight: '75vh', overflowY: 'auto' }}>
          <h2 style={{ marginBottom:'1.5rem',color:'var(--primary)',fontSize:'1.25rem',fontWeight:700 }}>Personal Details</h2>
          {message && <div style={{ color:'var(--success)',marginBottom:'1rem',padding:'0.75rem',backgroundColor:'rgba(16,185,129,0.1)',borderRadius:'0.5rem',border:'1px solid rgba(16,185,129,0.2)' }}>✓ {message}</div>}
          {errorMsg && <div style={{ color:'var(--danger)',marginBottom:'1rem',padding:'0.75rem',backgroundColor:'rgba(239,68,68,0.1)',borderRadius:'0.5rem',border:'1px solid rgba(239,68,68,0.2)' }}>{errorMsg}</div>}

          <form onSubmit={updateProfile} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div className="input-group" style={{ marginBottom: 0 }}>
              <label>Full Name</label>
              <input type="text" className="input-field" value={profileData.full_name} onChange={e => setProfileData({...profileData,full_name:e.target.value})} required />
            </div>
            <div className="input-group" style={{ marginBottom: 0 }}>
              <label>Email Address <span style={{ color:'var(--text-muted)',fontSize:'0.8rem' }}>(read-only)</span></label>
              <input type="email" className="input-field" value={user?.email} disabled style={{ opacity:0.5,cursor:'not-allowed' }} />
            </div>
            <div className="input-group" style={{ marginBottom: 0 }}>
              <label>Phone Number</label>
              <input type="tel" className="input-field" placeholder="+237 6XX XXX XXX" value={profileData.phone_number} onChange={e => setProfileData({...profileData,phone_number:e.target.value})} />
            </div>
            <div className="input-group" style={{ marginBottom: 0 }}>
              <label>Date of Birth</label>
              <input type="date" className="input-field" value={profileData.date_of_birth} onChange={e => setProfileData({...profileData,date_of_birth:e.target.value})} />
            </div>

            {/* Stylist Professional Section */}
            {role === 'stylist' && (
              <>
                <div style={{ height: '1px', background: 'linear-gradient(90deg, transparent, var(--border-light), transparent)', margin: '1rem 0' }} />
                <h2 style={{ marginBottom:'0.5rem',color:'var(--primary)',fontSize:'1.25rem',fontWeight:700 }}>Professional Details</h2>
                
                <div className="input-group" style={{ marginBottom: 0 }}>
                  <label>Bio / Introduction</label>
                  <textarea
                    className="input-field"
                    rows={4}
                    placeholder="Tell clients about your experience, signature styles, and what sets you apart…"
                    value={stylistData.bio}
                    onChange={e => setStylistData({ ...stylistData, bio: e.target.value })}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div className="input-group" style={{ marginBottom: 0 }}>
                    <label>Years of Experience</label>
                    <input
                      type="number" min="0" max="50"
                      className="input-field"
                      placeholder="e.g. 5"
                      value={stylistData.years_experience}
                      onChange={e => setStylistData({ ...stylistData, years_experience: e.target.value })}
                    />
                  </div>
                  <div className="input-group" style={{ marginBottom: 0 }}>
                    <label>Specialties</label>
                    <input
                      type="text"
                      className="input-field"
                      placeholder="e.g. Braids, Locs, Fades"
                      value={stylistData.specialties}
                      onChange={e => setStylistData({ ...stylistData, specialties: e.target.value })}
                    />
                  </div>
                </div>

                <div className="input-group" style={{ marginBottom: 0 }}>
                  <label>Business Address</label>
                  <div style={{ position: 'relative' }}>
                    <MapPin size={16} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', pointerEvents: 'none' }} />
                    <input
                      type="text"
                      className="input-field"
                      style={{ paddingLeft: '2.75rem' }}
                      placeholder="e.g. 123 Avenue Kennedy, Yaoundé"
                      value={stylistData.business_address}
                      onChange={e => setStylistData({ ...stylistData, business_address: e.target.value })}
                    />
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setStylistData({ ...stylistData, is_home_service_available: !stylistData.is_home_service_available })}
                  style={{
                    width: '100%', display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem',
                    borderRadius: 'var(--radius-md)', cursor: 'pointer', textAlign: 'left',
                    border: `1px solid ${stylistData.is_home_service_available ? 'rgba(212,175,55,0.4)' : 'var(--border-color)'}`,
                    background: stylistData.is_home_service_available ? 'var(--primary-light)' : 'rgba(255,255,255,0.02)',
                    transition: 'all 0.25s', margin: '0.5rem 0'
                  }}>
                  <div style={{ width: 44, height: 44, borderRadius: 'var(--radius-md)', background: stylistData.is_home_service_available ? 'rgba(212,175,55,0.2)' : 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Home size={20} color={stylistData.is_home_service_available ? 'var(--primary)' : 'var(--text-muted)'} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontWeight: 700, color: stylistData.is_home_service_available ? 'var(--primary)' : 'var(--text-main)', marginBottom: '0.1rem', fontSize: '0.9rem' }}>Home Service Available</p>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Allow clients to book you at their home or office</p>
                  </div>
                  {/* Toggle switch */}
                  <div style={{
                    width: 48, height: 26, borderRadius: '99px', flexShrink: 0, transition: 'all 0.25s',
                    background: stylistData.is_home_service_available ? 'var(--primary)' : 'var(--border-light)',
                    position: 'relative'
                  }}>
                    <div style={{
                      position: 'absolute', top: 3, left: stylistData.is_home_service_available ? 25 : 3,
                      width: 20, height: 20, borderRadius: '50%', background: '#fff', transition: 'left 0.25s',
                      boxShadow: '0 1px 3px rgba(0,0,0,0.3)'
                    }} />
                  </div>
                </button>
              </>
            )}

            <button type="submit" className="btn btn-primary" style={{ width:'100%',marginTop:'1rem',padding:'0.85rem' }} disabled={saving}>
              {saving ? 'Saving...' : 'Save Profile Changes'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;
