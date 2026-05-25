import { Mail, Phone, MapPin } from 'lucide-react';
import { useState } from 'react';

const Contact = () => {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    setStatus('sending');
    // Mock API call
    setTimeout(() => {
      setStatus('success');
      setForm({ name: '', email: '', message: '' });
      setTimeout(() => setStatus(null), 5000);
    }, 1500);
  };

  return (
    <div className="container" style={{ padding: '4rem 1.5rem', maxWidth: '1000px' }}>
      <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
        <h1 style={{ fontSize: '3rem', marginBottom: '1rem' }}>Contact Us</h1>
        <p style={{ fontSize: '1.2rem', color: 'var(--text-muted)', maxWidth: '600px', margin: '0 auto' }}>
          Have a question or need support? We're here to help. Reach out to our team.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', alignItems: 'flex-start' }}>
        
        {/* Contact Info */}
        <div>
          <h2 style={{ fontSize: '2rem', marginBottom: '2rem' }}>Get in Touch</h2>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: 'rgba(212,175,55,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)', flexShrink: 0 }}>
                <Mail size={24} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.2rem', marginBottom: '0.25rem' }}>Email Support</h3>
                <p style={{ color: 'var(--text-muted)' }}>support@bukybooks.com</p>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '0.25rem' }}>We aim to respond within 24 hours.</p>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: 'rgba(212,175,55,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)', flexShrink: 0 }}>
                <Phone size={24} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.2rem', marginBottom: '0.25rem' }}>Phone</h3>
                <p style={{ color: 'var(--text-muted)' }}>+237 670 000 000</p>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '0.25rem' }}>Mon-Fri, 9am to 6pm WAT</p>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: 'rgba(212,175,55,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)', flexShrink: 0 }}>
                <MapPin size={24} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.2rem', marginBottom: '0.25rem' }}>Headquarters</h3>
                <p style={{ color: 'var(--text-muted)' }}>Avenue Kennedy<br/>Yaoundé, Cameroon</p>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="card" style={{ padding: '2.5rem' }}>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>Send a Message</h2>
          
          {status === 'success' && (
            <div style={{ padding: '1rem', backgroundColor: 'rgba(16,185,129,0.1)', color: 'var(--success)', borderRadius: '0.5rem', marginBottom: '1.5rem', border: '1px solid rgba(16,185,129,0.2)' }}>
              ✓ Your message has been sent successfully! We will get back to you soon.
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <label>Your Name</label>
              <input type="text" className="input-field" required value={form.name} onChange={e => setForm({...form, name: e.target.value})} placeholder="John Doe" />
            </div>
            <div className="input-group">
              <label>Email Address</label>
              <input type="email" className="input-field" required value={form.email} onChange={e => setForm({...form, email: e.target.value})} placeholder="john@example.com" />
            </div>
            <div className="input-group">
              <label>Message</label>
              <textarea className="input-field" required rows="5" value={form.message} onChange={e => setForm({...form, message: e.target.value})} placeholder="How can we help you?" style={{ resize: 'vertical' }}></textarea>
            </div>
            <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '1rem' }} disabled={status === 'sending'}>
              {status === 'sending' ? 'Sending...' : 'Send Message'}
            </button>
          </form>
        </div>

      </div>
    </div>
  );
};

export default Contact;
