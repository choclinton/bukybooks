const Terms = () => {
  return (
    <div className="container" style={{ padding: '4rem 1.5rem', maxWidth: '800px' }}>
      <h1 style={{ fontSize: '3rem', marginBottom: '2rem' }}>Terms of Service</h1>
      
      <div className="card" style={{ padding: '2.5rem' }}>
        <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>Last updated: {new Date().toLocaleDateString()}</p>
        
        <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>1. Acceptance of Terms</h2>
        <p style={{ color: 'var(--text-muted)', lineHeight: '1.6', marginBottom: '2rem' }}>
          By accessing and using LUXE CUTS, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our platform.
        </p>

        <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>2. Booking and Cancellations</h2>
        <p style={{ color: 'var(--text-muted)', lineHeight: '1.6', marginBottom: '2rem' }}>
          Appointments must be booked through the platform. Stylists reserve the right to approve or reject appointments. Cancellations must be made at least 24 hours in advance.
        </p>

        <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>3. Payments</h2>
        <p style={{ color: 'var(--text-muted)', lineHeight: '1.6', marginBottom: '2rem' }}>
          All payments are processed securely via Fapshi. LUXE CUTS holds the funds until the service is completed to ensure satisfaction for both parties.
        </p>

        <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>4. Professional Conduct</h2>
        <p style={{ color: 'var(--text-muted)', lineHeight: '1.6', marginBottom: '2rem' }}>
          We expect all users, both clients and professionals, to maintain respectful behavior. Any harassment or inappropriate conduct will result in immediate termination of the account.
        </p>
      </div>
    </div>
  );
};

export default Terms;
