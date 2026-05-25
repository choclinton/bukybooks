const Privacy = () => {
  return (
    <div className="container" style={{ padding: '4rem 1.5rem', maxWidth: '800px' }}>
      <h1 style={{ fontSize: '3rem', marginBottom: '2rem' }}>Privacy Policy</h1>
      
      <div className="card" style={{ padding: '2.5rem' }}>
        <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>Last updated: {new Date().toLocaleDateString()}</p>
        
        <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>1. Information We Collect</h2>
        <p style={{ color: 'var(--text-muted)', lineHeight: '1.6', marginBottom: '2rem' }}>
          We collect information you provide directly to us, such as your name, email address, phone number, and location details when you use our home service booking features.
        </p>

        <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>2. How We Use Your Information</h2>
        <p style={{ color: 'var(--text-muted)', lineHeight: '1.6', marginBottom: '2rem' }}>
          We use the information we collect to facilitate bookings, process payments, and improve our platform. We also use your contact details to send appointment reminders and updates.
        </p>

        <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>3. Information Sharing</h2>
        <p style={{ color: 'var(--text-muted)', lineHeight: '1.6', marginBottom: '2rem' }}>
          We share your necessary details (name and appointment location) with your selected stylist to ensure the service can be provided. We do not sell your personal data to third parties.
        </p>

        <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>4. Data Security</h2>
        <p style={{ color: 'var(--text-muted)', lineHeight: '1.6', marginBottom: '2rem' }}>
          We use Supabase's secure infrastructure to protect your data. Your payment information is securely processed by Fapshi and is never stored on our servers.
        </p>
      </div>
    </div>
  );
};

export default Privacy;
