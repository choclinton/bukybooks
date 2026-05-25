import { ShieldCheck, Star, Clock } from 'lucide-react';

const About = () => {
  return (
    <div className="container" style={{ padding: '4rem 1.5rem', maxWidth: '900px' }}>
      <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
        <h1 style={{ fontSize: '3rem', marginBottom: '1rem' }}>About <span style={{ color: 'var(--primary)' }}>BUKYBOOKS</span></h1>
        <p style={{ fontSize: '1.2rem', color: 'var(--text-muted)', maxWidth: '600px', margin: '0 auto' }}>
          Redefining grooming and styling for the modern African.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '3rem', alignItems: 'center', marginBottom: '5rem' }}>
        <div style={{ borderRadius: '1rem', overflow: 'hidden', border: '2px solid var(--primary)', position: 'relative' }}>
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)' }}></div>
          <div style={{ height: '400px', backgroundColor: 'var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
             {/* Note: In a real app this would be an image tag */}
            <p style={{ color: 'var(--text-muted)' }}>[About Us Image Placeholder]</p>
          </div>
        </div>
        <div>
          <h2 style={{ fontSize: '2rem', marginBottom: '1.5rem' }}>Our Mission</h2>
          <p style={{ color: 'var(--text-muted)', lineHeight: '1.8', marginBottom: '1.5rem' }}>
            At BUKYBOOKS, we believe that looking your best shouldn't be a hassle. We bridge the gap between talented African barbers and stylists and clients who demand premium, reliable, and secure services.
          </p>
          <p style={{ color: 'var(--text-muted)', lineHeight: '1.8' }}>
            Whether you prefer the vibrant atmosphere of a salon or the quiet luxury of a home service, our platform connects you with verified professionals who treat grooming as an art form.
          </p>
        </div>
      </div>

      <h2 style={{ textAlign: 'center', fontSize: '2rem', marginBottom: '3rem' }}>Our Core Values</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem' }}>
        <div className="card text-center" style={{ padding: '2rem' }}>
          <Star size={40} style={{ color: 'var(--primary)', margin: '0 auto 1.5rem' }} />
          <h3 style={{ marginBottom: '1rem' }}>Excellence</h3>
          <p style={{ color: 'var(--text-muted)' }}>We accept nothing but the best. Our platform features highly rated professionals who are passionate about their craft.</p>
        </div>
        <div className="card text-center" style={{ padding: '2rem' }}>
          <ShieldCheck size={40} style={{ color: 'var(--primary)', margin: '0 auto 1.5rem' }} />
          <h3 style={{ marginBottom: '1rem' }}>Trust</h3>
          <p style={{ color: 'var(--text-muted)' }}>From verified stylist profiles to secure mobile payments, your safety and satisfaction are our top priorities.</p>
        </div>
        <div className="card text-center" style={{ padding: '2rem' }}>
          <Clock size={40} style={{ color: 'var(--primary)', margin: '0 auto 1.5rem' }} />
          <h3 style={{ marginBottom: '1rem' }}>Convenience</h3>
          <p style={{ color: 'var(--text-muted)' }}>Your time is valuable. Book appointments seamlessly and let the stylist come to you, or schedule a salon visit with zero wait time.</p>
        </div>
      </div>
    </div>
  );
};

export default About;
