import { Link } from 'react-router-dom';

const COLS = [
  {
    heading: 'Company',
    links: [
      { label: 'About',      to: '/learn' },
      { label: 'Careers',    to: '/learn' },
      { label: 'Affiliates', to: '/learn' },
      { label: 'Blog',       to: '/learn' },
      { label: 'Press',      to: '/learn' },
    ],
  },
  {
    heading: 'Learn',
    links: [
      { label: 'Browse crypto prices',        to: '/explore' },
      { label: 'Coinbase Bytes newsletter',   to: '/learn'   },
      { label: 'Crypto basics',               to: '/learn'   },
      { label: 'Tips & tutorials',            to: '/learn'   },
      { label: 'Market updates',              to: '/explore' },
    ],
  },
  {
    heading: 'Individuals',
    links: [
      { label: 'Buy & sell',        to: '/explore' },
      { label: 'Earn free crypto',  to: '/explore' },
      { label: 'Advanced trading',  to: '/explore' },
      { label: 'Wallet',            to: '/explore' },
      { label: 'Card',              to: '/explore' },
    ],
  },
  {
    heading: 'Businesses',
    links: [
      { label: 'Prime',      to: '/explore' },
      { label: 'Custody',    to: '/explore' },
      { label: 'Asset Hub',  to: '/explore' },
      { label: 'Commerce',   to: '/explore' },
    ],
  },
  {
    heading: 'Developers',
    links: [
      { label: 'Base',            to: '/explore' },
      { label: 'Coinbase Cloud',  to: '/explore' },
      { label: 'Wallet SDK',      to: '/explore' },
      { label: 'Developer docs',  to: '/explore' },
    ],
  },
];

function Footer() {
  return (
    <footer style={{ background: '#fff', borderTop: '1px solid #E5E7EB', marginTop: 'auto' }}>
      {/* Main grid */}
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '64px 32px 48px', display: 'flex', gap: '48px', flexWrap: 'wrap' }}>

        {/* Brand block */}
        <div style={{ minWidth: '200px', flex: '0 0 200px' }} className="footer-brand">
          <Link to="/" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
            <div style={{ width: 34, height: 34, borderRadius: '50%', background: '#7C3AED', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <svg width="22" height="22" viewBox="0 0 28 28" fill="none">
                <path d="M 20.36 20.36 A 9 9 0 1 1 20.36 7.64" fill="none" stroke="white" strokeWidth="4.5" strokeLinecap="round"/>
              </svg>
            </div>
            <span style={{ fontSize: '1.125rem', fontWeight: '800', color: '#111827', letterSpacing: '-0.01em' }}>Coinbase</span>
          </Link>
          <p style={{ fontSize: '0.875rem', color: '#6B7280', lineHeight: '1.6', maxWidth: '180px' }}>
            The most trusted cryptocurrency platform.
          </p>
          {/* App store badges */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '20px' }}>
            <a href="#" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: '#111827', color: '#fff', borderRadius: '8px', padding: '8px 14px', textDecoration: 'none', fontSize: '0.75rem', fontWeight: '600', width: 'fit-content' }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/></svg>
              App Store
            </a>
            <a href="#" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: '#111827', color: '#fff', borderRadius: '8px', padding: '8px 14px', textDecoration: 'none', fontSize: '0.75rem', fontWeight: '600', width: 'fit-content' }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M3.18 23.76c.3.17.64.24.99.2l12.45-12.45L13.07 8l-9.89 15.76zm16.4-12.71L17.3 9.7 13.5 6.53l-1.88 1.88 3.85 3.84-1.36 1.37-3.85-3.84-1.88 1.88 3.17 3.8-2.28 1.31L3.92 3.28c-.34-.34-.52-.8-.48-1.27l.94-.54L19.58 9.3l.01 1.75zm1.51-.87L4.9 3.12C5.5 2.72 6.22 2.5 7 2.5c.77 0 1.49.22 2.1.62l13.19 7.62a3.5 3.5 0 0 1 0 6.06z"/></svg>
              Google Play
            </a>
          </div>
        </div>

        {/* Link columns */}
        <div style={{ flex: 1, display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '32px', minWidth: 0 }} className="footer-cols">
          {COLS.map(({ heading, links }) => (
            <div key={heading}>
              <h4 style={{ fontSize: '0.8125rem', fontWeight: '700', color: '#111827', marginBottom: '16px', letterSpacing: '0.03em', textTransform: 'uppercase' }}>{heading}</h4>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {links.map(({ label, to }) => (
                  <li key={label}>
                    <Link
                      to={to}
                      style={{ fontSize: '0.875rem', color: '#4B5563', textDecoration: 'none', lineHeight: '1.5' }}
                      onMouseEnter={e => { e.currentTarget.style.color = '#7C3AED'; }}
                      onMouseLeave={e => { e.currentTarget.style.color = '#4B5563'; }}
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom bar */}
      <div style={{ borderTop: '1px solid #F3F4F6', background: '#FAFAFA' }}>
          <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '20px 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }} className="footer-bottom-bar">
          {/* Legal */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.8125rem', color: '#9CA3AF' }}>© {new Date().getFullYear()} Coinbase</span>
            {['Privacy', 'Terms', 'Cookies', 'Accessibility'].map((item, i, arr) => (
              <span key={item} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ color: '#D1D5DB' }}>|</span>
                <a
                  href="#"
                  style={{ fontSize: '0.8125rem', color: '#6B7280', textDecoration: 'none' }}
                  onMouseEnter={e => { e.currentTarget.style.color = '#111827'; }}
                  onMouseLeave={e => { e.currentTarget.style.color = '#6B7280'; }}
                >
                  {item}
                </a>
              </span>
            ))}
          </div>
          {/* Social icons */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {/* X / Twitter */}
            <a href="#" style={{ width: 34, height: 34, borderRadius: '50%', background: '#F3F4F6', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#374151', textDecoration: 'none' }}
              onMouseEnter={e => { e.currentTarget.style.background = '#E5E7EB'; }}
              onMouseLeave={e => { e.currentTarget.style.background = '#F3F4F6'; }}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.736-8.845L2.25 2.25h6.956l4.257 5.626L18.244 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
            </a>
            {/* Facebook */}
            <a href="#" style={{ width: 34, height: 34, borderRadius: '50%', background: '#F3F4F6', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#374151', textDecoration: 'none' }}
              onMouseEnter={e => { e.currentTarget.style.background = '#E5E7EB'; }}
              onMouseLeave={e => { e.currentTarget.style.background = '#F3F4F6'; }}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"/></svg>
            </a>
            {/* LinkedIn */}
            <a href="#" style={{ width: 34, height: 34, borderRadius: '50%', background: '#F3F4F6', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#374151', textDecoration: 'none' }}
              onMouseEnter={e => { e.currentTarget.style.background = '#E5E7EB'; }}
              onMouseLeave={e => { e.currentTarget.style.background = '#F3F4F6'; }}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
            </a>
            {/* YouTube */}
            <a href="#" style={{ width: 34, height: 34, borderRadius: '50%', background: '#F3F4F6', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#374151', textDecoration: 'none' }}
              onMouseEnter={e => { e.currentTarget.style.background = '#E5E7EB'; }}
              onMouseLeave={e => { e.currentTarget.style.background = '#F3F4F6'; }}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
