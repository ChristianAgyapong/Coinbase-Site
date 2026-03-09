import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function useReveal(options = {}) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) { el.classList.add('is-visible'); obs.unobserve(el); }
      },
      { threshold: 0.05, ...options }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return ref;
}

const ACCOUNT_TYPES = [
  {
    id: 'personal',
    label: 'Personal',
    desc: 'Trade crypto as an individual.',
    icon: (
      <svg width="38" height="38" viewBox="0 0 38 38" fill="none">
        <circle cx="19" cy="13" r="7.5" fill="#4A90D9" />
        <path d="M4 34c0-8.284 6.716-15 15-15s15 6.716 15 15" stroke="#4A90D9" strokeWidth="2.2" strokeLinecap="round" fill="none" />
        <rect x="11" y="28" width="9" height="8" rx="2" fill="#1E293B" />
        <path d="M13 32l2.5 2.5L19 28" stroke="#4A90D9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    id: 'business',
    label: 'Business',
    desc: 'Manage teams and portfolios, accept crypto payments, access APIs, and more',
    icon: (
      <svg width="38" height="38" viewBox="0 0 38 38" fill="none">
        <circle cx="13" cy="14" r="6.5" fill="#9CA3AF" />
        <circle cx="25" cy="14" r="6.5" fill="#6B7280" />
        <path d="M2 34c0-6.075 4.925-11 11-11" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" fill="none" />
        <path d="M36 34c0-6.075-4.925-11-11-11" stroke="#6B7280" strokeWidth="2" strokeLinecap="round" fill="none" />
        <circle cx="25" cy="27" r="7.5" fill="#0A0B0D" stroke="#2D3748" strokeWidth="1.5" />
        <circle cx="25" cy="27" r="5" fill="#F59E0B" />
        <text x="25" y="31" textAnchor="middle" fill="#fff" fontSize="8" fontWeight="900">C</text>
      </svg>
    ),
  },
  {
    id: 'developer',
    label: 'Developer',
    desc: 'Build onchain using developer tooling.',
    icon: (
      <svg width="38" height="38" viewBox="0 0 38 38" fill="none">
        <polygon points="19,3 35,12 35,30 19,39 3,30 3,12" fill="none" stroke="#3B82F6" strokeWidth="1.8" />
        <polygon points="19,10 28,15 28,25 19,30 10,25 10,15" fill="#3B82F6" opacity="0.35" />
        <polygon points="19,16 24,19 24,25 19,28 14,25 14,19" fill="#60A5FA" opacity="0.9" />
      </svg>
    ),
  },
];

function SignUp() {
  const [step, setStep] = useState(1);
  const [accountType, setAccountType] = useState(null);
  const [email, setEmail] = useState('');
  const [hoveredType, setHoveredType] = useState(null);
  const navigate = useNavigate();
  const { login } = useAuth();
  const formRef = useReveal();

  const handleSelectType = (typeId) => {
    setAccountType(typeId);
    setStep(2);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    login(email);
    navigate('/dashboard');
  };

  return (
    <div style={{ minHeight: '100vh', background: '#0A0B0D', display: 'flex', flexDirection: 'column' }}>
      {/* Logo */}
      <div style={{ padding: '22px 28px' }}>
        <Link to="/" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center' }}>
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
            <circle cx="14" cy="14" r="14" fill="#fff" />
            <path d="M 20.36 20.36 A 9 9 0 1 1 20.36 7.64" fill="none" stroke="#7C3AED" strokeWidth="4.5" strokeLinecap="round"/>
          </svg>
        </Link>
      </div>

      {/* Main content */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px 24px 48px' }}>
        <div ref={formRef} style={{ width: '100%', maxWidth: '480px' }} className="reveal reveal-fade-up">

          {/* ── STEP 1: Account type picker ── */}
          {step === 1 && (
            <div>
              <h1 style={{ color: '#fff', fontSize: 'clamp(1.5rem, 5vw, 2rem)', fontWeight: '800', marginBottom: '28px', lineHeight: '1.25', letterSpacing: '-0.025em' }}>
                What kind of account are you creating?
              </h1>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {ACCOUNT_TYPES.map((type) => (
                  <button
                    key={type.id}
                    onClick={() => handleSelectType(type.id)}
                    onMouseEnter={() => setHoveredType(type.id)}
                    onMouseLeave={() => setHoveredType(null)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '18px',
                      background: hoveredType === type.id ? '#18191C' : '#111213',
                      border: `1px solid ${hoveredType === type.id ? '#3A3B40' : '#232427'}`,
                      borderRadius: '12px',
                      padding: '18px 20px',
                      cursor: 'pointer',
                      textAlign: 'left',
                      width: '100%',
                      transition: 'background 0.15s, border-color 0.15s',
                    }}
                  >
                    <div style={{ flexShrink: 0 }}>{type.icon}</div>
                    <div>
                      <p style={{ color: '#F9FAFB', fontWeight: '700', fontSize: '1rem', margin: '0 0 4px' }}>{type.label}</p>
                      <p style={{ color: '#9CA3AF', fontSize: '0.875rem', margin: 0, lineHeight: '1.55' }}>{type.desc}</p>
                    </div>
                  </button>
                ))}
              </div>
              <p style={{ textAlign: 'center', marginTop: '28px', fontSize: '0.875rem', color: '#6B7280' }}>
                Already have an account?{' '}
                <Link to="/signin" style={{ color: '#60A5FA', fontWeight: '600', textDecoration: 'none' }}>Sign in</Link>
              </p>
            </div>
          )}

          {/* ── STEP 2: Email + social ── */}
          {step === 2 && (
            <div>
              <h1 style={{ color: '#fff', fontSize: 'clamp(1.5rem, 5vw, 2rem)', fontWeight: '800', marginBottom: '8px', letterSpacing: '-0.025em' }}>
                Create your account
              </h1>
              <p style={{ color: '#9CA3AF', fontSize: '0.9375rem', marginBottom: '28px', lineHeight: '1.55' }}>
                Access all that Coinbase has to offer with a single account.
              </p>

              <form onSubmit={handleSubmit}>
                <label style={{ display: 'block', color: '#E5E7EB', fontWeight: '600', fontSize: '0.875rem', marginBottom: '8px' }}>
                  Email
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your email address"
                  style={{
                    width: '100%',
                    background: 'transparent',
                    border: '1.5px solid #374151',
                    borderRadius: '10px',
                    padding: '14px 16px',
                    color: '#fff',
                    fontSize: '0.9375rem',
                    outline: 'none',
                    boxSizing: 'border-box',
                    marginBottom: '14px',
                  }}
                  onFocus={e => { e.target.style.borderColor = '#4A90D9'; }}
                  onBlur={e => { e.target.style.borderColor = '#374151'; }}
                />
                <button
                  type="submit"
                  style={{
                    width: '100%',
                    background: '#2C5282',
                    color: '#fff',
                    fontWeight: '700',
                    fontSize: '1rem',
                    padding: '14px',
                    borderRadius: '10px',
                    border: 'none',
                    cursor: 'pointer',
                    marginBottom: '20px',
                    letterSpacing: '0.01em',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background = '#2A4A75'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = '#2C5282'; }}
                >
                  Continue
                </button>
              </form>

              {/* OR */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px' }}>
                <div style={{ flex: 1, height: '1px', background: '#232427' }} />
                <span style={{ color: '#6B7280', fontSize: '0.8125rem', fontWeight: '600', letterSpacing: '0.06em' }}>OR</span>
                <div style={{ flex: 1, height: '1px', background: '#232427' }} />
              </div>

              {/* Social */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '28px' }}>
                {[
                  {
                    label: 'Sign up with Google',
                    icon: (
                      <svg width="20" height="20" viewBox="0 0 24 24">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                      </svg>
                    ),
                  },
                  {
                    label: 'Sign up with Apple',
                    icon: (
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="#fff">
                        <path d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701" />
                      </svg>
                    ),
                  },
                ].map(({ label, icon }) => (
                  <button
                    key={label}
                    type="button"
                    style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', background: '#111213', border: '1px solid #232427', borderRadius: '10px', padding: '13px', color: '#fff', fontWeight: '700', fontSize: '1rem', cursor: 'pointer' }}
                    onMouseEnter={e => { e.currentTarget.style.background = '#18191C'; }}
                    onMouseLeave={e => { e.currentTarget.style.background = '#111213'; }}
                  >
                    {icon}
                    {label}
                  </button>
                ))}
              </div>

              <p style={{ textAlign: 'center', fontSize: '0.875rem', color: '#6B7280' }}>
                Already have an account?{' '}
                <Link to="/signin" style={{ color: '#60A5FA', fontWeight: '600', textDecoration: 'none' }}>Sign in</Link>
              </p>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

export default SignUp;

