import { Link } from 'react-router-dom';
import { Star, Clock, MapPin, ShieldCheck } from 'lucide-react';
import { useAuth } from '../lib/AuthContext';

const Home = () => {
  const { user, role } = useAuth();

  return (
    <div style={{ width: '100%' }}>
      {/* Hero Section */}
      <section style={{ 
        padding: '6rem 0', 
        background: 'linear-gradient(180deg, var(--bg-dark) 0%, rgba(212,175,55,0.05) 100%)',
        minHeight: 'calc(100vh - 4rem)',
        display: 'flex',
        alignItems: 'center'
      }}>
        <div className="container animate-fade-in" style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '4rem',
          alignItems: 'center'
        }}>
          <div>
            <h1 style={{ fontSize: '4rem', marginBottom: '1.5rem', letterSpacing: '-1px', lineHeight: '1.1' }}>
              Premium Grooming,<br /> <span style={{ color: 'var(--primary)' }}>At Your Fingertips.</span>
            </h1>
            <p style={{ fontSize: '1.25rem', color: 'var(--text-muted)', marginBottom: '2.5rem' }}>
              Book top-rated African barbers and hairstylists for home visits or salon appointments. Experience luxury styling without the wait.
            </p>
            <div className="flex" style={{ gap: '1rem', flexWrap: 'wrap' }}>
              {!user && (
                <>
                  <Link to="/discover" className="btn btn-primary" style={{ padding: '1rem 2rem', fontSize: '1.125rem' }}>
                    Find a Stylist
                  </Link>
                  <Link to="/register" className="btn btn-outline" style={{ padding: '1rem 2rem', fontSize: '1.125rem' }}>
                    Join as a Professional
                  </Link>
                </>
              )}
              {user && role === 'client' && (
                <Link to="/discover" className="btn btn-primary" style={{ padding: '1rem 2rem', fontSize: '1.125rem' }}>
                  Find a Stylist
                </Link>
              )}
              {user && role === 'stylist' && (
                <Link to="/stylist/dashboard" className="btn btn-primary" style={{ padding: '1rem 2rem', fontSize: '1.125rem' }}>
                  Go to Dashboard
                </Link>
              )}
              {user && role === 'admin' && (
                <Link to="/admin/dashboard" className="btn btn-primary" style={{ padding: '1rem 2rem', fontSize: '1.125rem' }}>
                  Go to Admin Panel
                </Link>
              )}
            </div>
          </div>
          <div style={{ position: 'relative', width: '100%', maxWidth: '600px', margin: '0 auto' }}>
            <div style={{
              position: 'absolute',
              top: '-15px',
              left: '-15px',
              right: '15px',
              bottom: '-15px',
              border: '2px solid var(--primary)',
              borderRadius: '1rem',
              zIndex: 0
            }}></div>
            <img 
              src="/images/hero.png" 
              alt="Premium African Barber" 
              style={{
                width: '100%',
                height: 'auto',
                aspectRatio: '4/3',
                objectFit: 'cover',
                borderRadius: '1rem',
                position: 'relative',
                zIndex: 1,
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7)'
              }}
            />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container" style={{ padding: '5rem 1.5rem' }}>
        <h2 className="text-center" style={{ fontSize: '2.5rem', marginBottom: '3rem' }}>Why Choose BUKYBOOKS?</h2>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
          gap: '2rem' 
        }}>
          
          <div className="card text-center">
            <div style={{ 
              width: '60px', height: '60px', borderRadius: '50%', 
              background: 'rgba(212,175,55,0.1)', color: 'var(--primary)', 
              display: 'flex', alignItems: 'center', justifyContent: 'center', 
              margin: '0 auto 1.5rem' 
            }}>
              <Star size={32} />
            </div>
            <h3 style={{ marginBottom: '1rem' }}>Top Rated Professionals</h3>
            <p style={{ color: 'var(--text-muted)' }}>We vet all our stylists to ensure you get the highest quality service every time.</p>
          </div>

          <div className="card text-center">
            <div style={{ 
              width: '60px', height: '60px', borderRadius: '50%', 
              background: 'rgba(212,175,55,0.1)', color: 'var(--primary)', 
              display: 'flex', alignItems: 'center', justifyContent: 'center', 
              margin: '0 auto 1.5rem' 
            }}>
              <MapPin size={32} />
            </div>
            <h3 style={{ marginBottom: '1rem' }}>Your Place or Ours</h3>
            <p style={{ color: 'var(--text-muted)' }}>Choose between a premium home service or visit the stylist's business location.</p>
          </div>

          <div className="card text-center">
            <div style={{ 
              width: '60px', height: '60px', borderRadius: '50%', 
              background: 'rgba(212,175,55,0.1)', color: 'var(--primary)', 
              display: 'flex', alignItems: 'center', justifyContent: 'center', 
              margin: '0 auto 1.5rem' 
            }}>
              <ShieldCheck size={32} />
            </div>
            <h3 style={{ marginBottom: '1rem' }}>Secure Mobile Payments</h3>
            <p style={{ color: 'var(--text-muted)' }}>Pay seamlessly and securely using MTN Mobile Money or Orange Money via Fapshi.</p>
          </div>

        </div>
      </section>
    </div>
  );
};

export default Home;
