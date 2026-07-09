import React from 'react';
import { Link } from 'react-router-dom';

const LAST_UPDATED = 'July 8, 2026';
const CONTACT_EMAIL = 'contact.starithm@gmail.com';

export default function PrivacyPolicy() {
  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0a', color: '#e0e0e0', fontFamily: 'system-ui, sans-serif' }}>
      {/* Nav */}
      <div style={{ borderBottom: '1px solid #1a1a1a', padding: '0.75rem 2rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <Link to="/" style={{ color: '#770ff5', textDecoration: 'none', fontSize: '0.875rem', fontWeight: 600 }}>
          ← Starithm
        </Link>
      </div>

      <div style={{ maxWidth: 760, margin: '0 auto', padding: '3rem 2rem 5rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '0.5rem', color: '#ffffff' }}>Privacy Policy</h1>
        <p style={{ color: '#555', fontSize: '0.85rem', marginBottom: '3rem' }}>Last updated: {LAST_UPDATED}</p>

        <Section title="1. Who We Are">
          <p>Starithm is an astronomical event intelligence platform that aggregates and analyses real-time multi-messenger alerts (gravitational waves, gamma-ray bursts, neutrinos, fast radio bursts, and X-ray transients). We are operated as an independent research project. If you have questions about this policy, contact us at <a href={`mailto:${CONTACT_EMAIL}`} style={{ color: '#a78bfa' }}>{CONTACT_EMAIL}</a>.</p>
        </Section>

        <Section title="2. Information We Collect">
          <p><strong style={{ color: '#fff' }}>Account information.</strong> When you sign in with GitHub, Google, or LinkedIn, we receive your name and email address from the OAuth provider. We store these in our database to identify your account.</p>
          <p><strong style={{ color: '#fff' }}>Profile information.</strong> You may optionally add your institution or ORCID iD to your profile.</p>
          <p><strong style={{ color: '#fff' }}>Comments and observations.</strong> Any comments or photometry data you submit on event pages are stored and displayed publicly alongside your display name and institution.</p>
          <p><strong style={{ color: '#fff' }}>Usage data.</strong> We collect standard server logs (IP address, browser, pages visited) for debugging and security purposes. We use Vercel Analytics for aggregate, anonymised traffic statistics.</p>
        </Section>

        <Section title="3. How We Use Your Information">
          <ul style={{ paddingLeft: '1.25rem', lineHeight: 2 }}>
            <li>To identify you when you post comments or observations</li>
            <li>To display your name and institution alongside your contributions</li>
            <li>To send transactional emails if you opt in to event alerts (future feature)</li>
            <li>To improve the platform through anonymised analytics</li>
          </ul>
          <p>We do not sell your data. We do not use your data for advertising.</p>
        </Section>

        <Section title="4. Third-Party Services">
          <p>We use the following third-party services that may process your data:</p>
          <ul style={{ paddingLeft: '1.25rem', lineHeight: 2 }}>
            <li><strong style={{ color: '#fff' }}>Clerk</strong> — authentication and user management (clerk.com)</li>
            <li><strong style={{ color: '#fff' }}>CockroachDB</strong> — database hosting (cockroachlabs.com)</li>
            <li><strong style={{ color: '#fff' }}>Render</strong> — backend hosting (render.com)</li>
            <li><strong style={{ color: '#fff' }}>Vercel</strong> — frontend hosting and analytics (vercel.com)</li>
            <li><strong style={{ color: '#fff' }}>Anthropic</strong> — AI-generated event summaries (anthropic.com)</li>
          </ul>
          <p>Each of these services has its own privacy policy governing how they handle data.</p>
        </Section>

        <Section title="5. OAuth Providers">
          <p>When you log in via GitHub, Google, or LinkedIn, we only request access to your public profile information (name and email). We do not request access to your repositories, contacts, connections, or any other data beyond what is needed to create your account.</p>
        </Section>

        <Section title="6. Data Retention">
          <p>We retain your account information for as long as your account is active. If you delete your account, we delete your account record and all comments associated with it. Anonymised server logs may be retained for up to 90 days.</p>
        </Section>

        <Section title="7. Your Rights">
          <p>You may request to access, correct, or delete your personal data at any time by emailing <a href={`mailto:${CONTACT_EMAIL}`} style={{ color: '#a78bfa' }}>{CONTACT_EMAIL}</a>. You can also delete your account directly from your profile settings, which will remove all your data from our systems.</p>
        </Section>

        <Section title="8. Cookies">
          <p>We use cookies only for authentication session management (via Clerk). We do not use tracking or advertising cookies.</p>
        </Section>

        <Section title="9. Children's Privacy">
          <p>Starithm is intended for researchers and astronomy enthusiasts aged 16 and over. We do not knowingly collect data from children under 16.</p>
        </Section>

        <Section title="10. Changes to This Policy">
          <p>We may update this policy from time to time. The date at the top of this page reflects the latest revision. Continued use of the platform after changes constitutes acceptance of the updated policy.</p>
        </Section>

        <Section title="11. Contact">
          <p>For any privacy-related questions or requests, contact us at <a href={`mailto:${CONTACT_EMAIL}`} style={{ color: '#a78bfa' }}>{CONTACT_EMAIL}</a>.</p>
        </Section>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: '2.5rem' }}>
      <h2 style={{ fontSize: '1.05rem', fontWeight: 600, color: '#ffffff', marginBottom: '0.75rem', borderBottom: '1px solid #1e1e1e', paddingBottom: '0.5rem' }}>{title}</h2>
      <div style={{ fontSize: '0.9rem', color: '#aaaaaa', lineHeight: 1.8, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        {children}
      </div>
    </div>
  );
}
