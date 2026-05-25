import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../lib/AuthContext';
import { Plus, Trash2, Camera, Image as ImageIcon } from 'lucide-react';

const ManageServices = () => {
  const { user } = useAuth();
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [saving, setSaving] = useState(false);
  
  const [imageFile, setImageFile] = useState(null);
  const [newService, setNewService] = useState({
    name: '',
    description: '',
    price: '',
    duration_minutes: '30'
  });

  useEffect(() => {
    if (user) {
      fetchServices();
    }
  }, [user]);

  const fetchServices = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('services')
      .select('*')
      .eq('stylist_id', user.id)
      .order('created_at', { ascending: false });

    if (!error && data) {
      setServices(data);
    }
    setLoading(false);
  };

  const uploadImage = async () => {
    if (!imageFile) return null;
    const fileExt = imageFile.name.split('.').pop();
    const fileName = `service-${user.id}-${Date.now()}.${fileExt}`;
    const { error } = await supabase.storage.from('avatars').upload(fileName, imageFile, { upsert: true });
    if (error) throw error;
    return supabase.storage.from('avatars').getPublicUrl(fileName).data.publicUrl;
  };

  const handleAddService = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const imageUrl = await uploadImage();

      const { error } = await supabase
        .from('services')
        .insert([{
          stylist_id: user.id,
          name: newService.name,
          description: newService.description,
          price: parseFloat(newService.price),
          duration_minutes: parseInt(newService.duration_minutes),
          image_url: imageUrl
        }]);

      if (error) throw error;

      setNewService({ name: '', description: '', price: '', duration_minutes: '30' });
      setImageFile(null);
      setIsAdding(false);
      fetchServices();
    } catch (err) {
      alert("Error adding service: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this service?')) {
      const { error } = await supabase.from('services').delete().eq('id', id);
      if (!error) {
        fetchServices();
      }
    }
  };

  const previewUrl = imageFile ? URL.createObjectURL(imageFile) : null;

  return (
    <div className="container" style={{ padding: '2.5rem 1.5rem', maxWidth: '860px' }}>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 style={{ fontSize: '2.5rem' }}>My Services</h1>
          <p style={{ color: 'var(--text-muted)' }}>Manage the services you offer to clients.</p>
        </div>
        <button onClick={() => setIsAdding(!isAdding)} className="btn btn-primary flex items-center" style={{ gap: '0.5rem' }}>
          <Plus size={18} /> {isAdding ? 'Cancel' : 'Add New Service'}
        </button>
      </div>

      {isAdding && (
        <div className="card animate-fade-in" style={{ marginBottom: '2.5rem', border: '1px solid var(--primary)', padding: '2rem' }}>
          <h2 style={{ marginBottom: '1.5rem' }}>Create a Service</h2>
          <form onSubmit={handleAddService} style={{ display: 'grid', gap: '1.5rem', gridTemplateColumns: '1fr 2fr' }}>
            
            {/* Image Upload Column */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
              <div style={{ width: '100%', aspectRatio: '1', borderRadius: '0.75rem', overflow: 'hidden', border: '2px dashed var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.2)', position: 'relative' }}>
                {previewUrl ? (
                  <img src={previewUrl} alt="preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <div style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
                    <ImageIcon size={32} style={{ margin: '0 auto 0.5rem', opacity: 0.5 }} />
                    <p style={{ fontSize: '0.85rem' }}>Service Image</p>
                  </div>
                )}
                <label style={{ position: 'absolute', bottom: '0.5rem', right: '0.5rem', backgroundColor: 'var(--primary)', color: '#000', padding: '0.5rem', borderRadius: '50%', cursor: 'pointer', boxShadow: '0 2px 8px rgba(0,0,0,0.4)' }}>
                  <Camera size={18} />
                  <input type="file" accept="image/*" style={{ display: 'none' }} onChange={e => setImageFile(e.target.files[0])} />
                </label>
              </div>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textAlign: 'center' }}>Upload a picture representing this service</p>
            </div>

            {/* Form Details Column */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div className="input-group">
                <label>Service Name</label>
                <input type="text" className="input-field" required value={newService.name} onChange={e => setNewService({...newService, name: e.target.value})} placeholder="e.g. Classic Fade or Braids" />
              </div>
              <div className="input-group">
                <label>Description (Optional)</label>
                <textarea className="input-field" rows="3" value={newService.description} onChange={e => setNewService({...newService, description: e.target.value})} placeholder="Describe what the service includes..." />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="input-group">
                  <label>Price (XAF)</label>
                  <input type="number" className="input-field" required min="0" step="100" value={newService.price} onChange={e => setNewService({...newService, price: e.target.value})} placeholder="1500" />
                </div>
                <div className="input-group">
                  <label>Duration (Minutes)</label>
                  <input type="number" className="input-field" required min="15" step="15" value={newService.duration_minutes} onChange={e => setNewService({...newService, duration_minutes: e.target.value})} />
                </div>
              </div>
              <button type="submit" className="btn btn-primary" style={{ marginTop: '0.5rem' }} disabled={saving}>
                {saving ? 'Saving...' : 'Save Service'}
              </button>
            </div>
          </form>
        </div>
      )}

      {loading ? (
        <p style={{ color: 'var(--text-muted)' }}>Loading services...</p>
      ) : services.length === 0 ? (
        <div className="card text-center" style={{ padding: '4rem' }}>
          <ImageIcon size={48} style={{ color: 'var(--primary)', margin: '0 auto 1rem', opacity: 0.5 }} />
          <p style={{ color: 'var(--text-muted)' }}>You haven't added any services yet.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
          {services.map(service => (
            <div key={service.id} className="card" style={{ padding: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
              <div style={{ height: '160px', backgroundColor: 'rgba(212,175,55,0.1)', position: 'relative' }}>
                {service.image_url ? (
                  <img src={service.image_url} alt={service.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)', opacity: 0.5 }}>
                    <ImageIcon size={48} />
                  </div>
                )}
                <div style={{ position: 'absolute', top: '0.5rem', right: '0.5rem' }}>
                  <button onClick={() => handleDelete(service.id)} className="btn btn-outline" style={{ backgroundColor: 'rgba(0,0,0,0.6)', borderColor: 'var(--danger)', color: 'var(--danger)', padding: '0.5rem', backdropFilter: 'blur(4px)' }}>
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
              <div style={{ padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                <h3 style={{ fontSize: '1.25rem', marginBottom: '0.25rem' }}>{service.name}</h3>
                {service.description && <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1rem', flex: 1 }}>{service.description}</p>}
                
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto', paddingTop: '1rem', borderTop: '1px solid var(--border-color)' }}>
                  <span style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--primary)' }}>XAF {service.price}</span>
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{service.duration_minutes} mins</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ManageServices;
