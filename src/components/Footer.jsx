import { Link } from 'react-router-dom';
import { Scissors } from 'lucide-react';

const InstagramIcon = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);

const TwitterIcon = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
  </svg>
);

const FacebookIcon = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
);

const Footer = () => {
  return (
    <footer style={{ backgroundColor: 'var(--bg-dark)', borderTop: '1px solid var(--border-color)', paddingTop: '4rem', paddingBottom: '2rem', marginTop: 'auto' }}>
      <div className="container" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '3rem', marginBottom: '3rem' }}>
        
        {/* Brand */}
        <div>
          <Link to="/" className="nav-logo flex items-center gap-2" style={{ marginBottom: '1rem', display: 'inline-flex' }}>
            <Scissors size={24} color="var(--primary)" />
            BUKYBOOKS
          </Link>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: '1.6', marginBottom: '1.5rem' }}>
            Premium grooming and styling services at your fingertips. Choose home service or salon visits with top-rated African professionals.
          </p>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <a href="#" style={{ color: 'var(--text-muted)', transition: 'color 0.2s' }} onMouseEnter={e => e.currentTarget.style.color = 'var(--primary)'} onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}><InstagramIcon size={20} /></a>
            <a href="#" style={{ color: 'var(--text-muted)', transition: 'color 0.2s' }} onMouseEnter={e => e.currentTarget.style.color = 'var(--primary)'} onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}><TwitterIcon size={20} /></a>
            <a href="#" style={{ color: 'var(--text-muted)', transition: 'color 0.2s' }} onMouseEnter={e => e.currentTarget.style.color = 'var(--primary)'} onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}><FacebookIcon size={20} /></a>
          </div>
        </div>

        {/* Links 1 */}
        <div>
          <h3 style={{ fontSize: '1.1rem', marginBottom: '1.5rem', color: 'var(--text-main)' }}>Platform</h3>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <li><Link to="/discover" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontSize: '0.9rem', transition: 'color 0.2s' }} onMouseEnter={e => e.currentTarget.style.color = 'var(--primary)'} onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}>Find a Stylist</Link></li>
            <li><Link to="/register" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontSize: '0.9rem', transition: 'color 0.2s' }} onMouseEnter={e => e.currentTarget.style.color = 'var(--primary)'} onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}>Join as a Professional</Link></li>
            <li><Link to="/about" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontSize: '0.9rem', transition: 'color 0.2s' }} onMouseEnter={e => e.currentTarget.style.color = 'var(--primary)'} onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}>About Us</Link></li>
          </ul>
        </div>

        {/* Links 2 */}
        <div>
          <h3 style={{ fontSize: '1.1rem', marginBottom: '1.5rem', color: 'var(--text-main)' }}>Support</h3>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <li><Link to="/contact" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontSize: '0.9rem', transition: 'color 0.2s' }} onMouseEnter={e => e.currentTarget.style.color = 'var(--primary)'} onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}>Contact Us</Link></li>
            <li><Link to="/faq" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontSize: '0.9rem', transition: 'color 0.2s' }} onMouseEnter={e => e.currentTarget.style.color = 'var(--primary)'} onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}>FAQ</Link></li>
            <li><Link to="/terms" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontSize: '0.9rem', transition: 'color 0.2s' }} onMouseEnter={e => e.currentTarget.style.color = 'var(--primary)'} onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}>Terms of Service</Link></li>
            <li><Link to="/privacy" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontSize: '0.9rem', transition: 'color 0.2s' }} onMouseEnter={e => e.currentTarget.style.color = 'var(--primary)'} onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}>Privacy Policy</Link></li>
          </ul>
        </div>

        {/* Contact info */}
        <div>
          <h3 style={{ fontSize: '1.1rem', marginBottom: '1.5rem', color: 'var(--text-main)' }}>Get in Touch</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '0.5rem' }}>support@bukybooks.com</p>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '0.5rem' }}>+237 670 000 000</p>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Yaoundé, Cameroon</p>
        </div>
      </div>

      <div className="container" style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '2rem', textAlign: 'center' }}>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>&copy; {new Date().getFullYear()} BUKYBOOKS. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
