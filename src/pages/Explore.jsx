import { Link } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import { useLivePrices } from '../context/LivePricesContext';

function useReveal(options = {}) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) { el.classList.add('is-visible'); obs.unobserve(el); }
      },
      { threshold: 0.12, ...options }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return ref;
}

const coinColors = {
  bitcoin:        '#F59E0B',
  ethereum:       '#6366F1',
  tether:         '#14B8A6',
  'binance-coin': '#EAB308',
  binancecoin:    '#EAB308',
  solana:         '#8B5CF6',
  'usd-coin':     '#3B82F6',
  usdcoin:        '#3B82F6',
  cardano:        '#1D4ED8',
  ripple:         '#0EA5E9',
  dogecoin:       '#F59E0B',
  polkadot:       '#EC4899',
};

const MARKET_STATS = [
  {
    label: 'Total market cap',
    value: '$2.41T',
    change: -0.93,
    path: 'M0,52 C18,50 36,53 56,56 C76,59 96,57 116,60 C136,63 156,61 176,65 C196,69 216,67 236,72 C256,77 272,80 290,85',
  },
  {
    label: 'Trade volume',
    value: '$104.0B',
    change: -45.84,
    path: 'M0,18 C18,20 36,22 56,26 C76,30 96,34 116,41 C136,49 156,55 176,62 C196,70 216,74 246,80 C266,84 278,87 290,90',
  },
  {
    label: 'Buy-sell ratio',
    value: '0.77',
    change: -8.68,
    path: 'M0,32 C18,31 36,33 56,32 C76,31 96,36 116,34 C136,32 152,52 168,66 C184,76 210,73 238,77 C262,75 278,79 290,85',
  },
  {
    label: 'BTC dominance',
    value: '60.08%',
    change: -0.48,
    path: 'M0,48 C18,47 36,46 56,47 C76,48 96,45 116,44 C136,43 156,45 176,44 C196,43 216,45 238,44 C262,43 278,45 290,43',
  },
];

function MiniSparkline({ path, up, id }) {
  const color = up ? '#16A34A' : '#DC2626';
  const gradId = `spark-${id}`;
  return (
    <svg width="100%" height="56" viewBox="0 0 290 96" preserveAspectRatio="none">
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.15"/>
          <stop offset="100%" stopColor={color} stopOpacity="0.01"/>
        </linearGradient>
      </defs>
      <path d={path + ' L290,96 L0,96 Z'} fill={`url(#${gradId})`}/>
      <path d={path} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round"/>
    </svg>
  );
}

function NavArrows({ onPrev, onNext, prevDisabled, nextDisabled, size = 32 }) {
  const btn = (disabled, onClick, dir) => (
    <button onClick={onClick} disabled={disabled} style={{
      width: size, height: size, borderRadius: '50%',
      border: '1.5px solid #E5E7EB', background: '#fff',
      cursor: disabled ? 'default' : 'pointer',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      opacity: disabled ? 0.35 : 1, flexShrink: 0,
    }}>
      <svg width={size * 0.43} height={size * 0.43} viewBox="0 0 24 24" fill="none" stroke="#374151" strokeWidth="2.5" strokeLinecap="round">
        <path d={dir === 'prev' ? 'M15 18l-6-6 6-6' : 'M9 18l6-6-6-6'}/>
      </svg>
    </button>
  );
  return (
    <div style={{ display: 'flex', gap: '6px' }}>
      {btn(prevDisabled, onPrev, 'prev')}
      {btn(nextDisabled, onNext, 'next')}
    </div>
  );
}

function Explore() {
  const [searchTerm,   setSearchTerm]   = useState('');
  const [statsOffset,  setStatsOffset]  = useState(0);
  const [moversOffset, setMoversOffset] = useState(0);
  const [searchFocused, setSearchFocused] = useState(false);

  const statsGridRef  = useReveal();
  const sidebarRef    = useReveal();
  const tableRef      = useReveal();

  const cryptoData = useLivePrices() ?? [];

  const STATS_PER_PAGE  = 3;
  const MOVERS_PER_PAGE = 2;

  const topMovers = [...cryptoData].sort((a, b) => Math.abs(b.change24h) - Math.abs(a.change24h));
  const visibleStats  = MARKET_STATS.slice(statsOffset,  statsOffset  + STATS_PER_PAGE);
  const visibleMovers = topMovers.slice(moversOffset, moversOffset + MOVERS_PER_PAGE);

  const filteredCrypto = cryptoData.filter(c =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.symbol.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const fmt = (n) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(n);

  const fmtMC = (mc) => {
    if (mc >= 1e12) return `$${(mc / 1e12).toFixed(2)}T`;
    if (mc >= 1e9)  return `$${(mc / 1e9).toFixed(2)}B`;
    return `$${(mc / 1e6).toFixed(2)}M`;
  };

  return (
    <div style={{ minHeight: '100vh', background: '#fff' }}>

      {/* ══════════ TOP PANEL ══════════ */}
      <div style={{ borderBottom: '1px solid #E5E7EB' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '32px 24px 0', display: 'grid', gridTemplateColumns: '1fr 296px', gap: '28px', alignItems: 'start' }} className="explore-hero-grid">

          {/* ── LEFT: title, search, market stats ── */}
          <div>
            {/* Title row */}
            <div style={{ marginBottom: '18px' }} className="hero-anim-up">
              <h1 style={{ fontSize: 'clamp(1.5rem, 3vw, 2rem)', fontWeight: '800', color: '#111827', letterSpacing: '-0.025em', margin: '0 0 5px' }}>
                Explore crypto
              </h1>
              <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.875rem', color: '#6B7280', flexWrap: 'wrap' }}>
                <span>Coinbase 50 Index is down</span>
                <span style={{ color: '#DC2626', fontWeight: '700', display: 'inline-flex', alignItems: 'center', gap: '2px' }}>
                  ↘ 1.18%
                </span>
                <span>(24hrs)</span>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
              </div>
            </div>

            {/* Pill search bar */}
            <div style={{ position: 'relative', marginBottom: '28px' }} className="hero-anim-up hero-delay-1">
              <div style={{ position: 'absolute', top: '50%', left: '18px', transform: 'translateY(-50%)', pointerEvents: 'none' }}>
                <svg width="17" height="17" fill="none" stroke="#9CA3AF" strokeWidth="2.2" strokeLinecap="round" viewBox="0 0 24 24">
                  <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
                </svg>
              </div>
              <input
                type="text"
                placeholder="Search for an asset"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setSearchFocused(false)}
                style={{
                  width: '100%', boxSizing: 'border-box',
                  padding: '13px 20px 13px 48px',
                  border: `1.5px solid ${searchFocused ? '#1652F0' : '#E5E7EB'}`,
                  borderRadius: '99px',
                  fontSize: '0.9375rem', color: '#111827',
                  background: '#F9FAFB', outline: 'none',
                  transition: 'border-color 0.15s',
                }}
              />
            </div>

            {/* Market stats */}
            <div style={{ paddingBottom: '28px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                <h2 style={{ fontSize: '1.125rem', fontWeight: '800', color: '#111827', margin: 0, letterSpacing: '-0.02em' }}>Market stats</h2>
                <NavArrows
                  onPrev={() => setStatsOffset(s => Math.max(0, s - 1))}
                  onNext={() => setStatsOffset(s => Math.min(MARKET_STATS.length - STATS_PER_PAGE, s + 1))}
                  prevDisabled={statsOffset === 0}
                  nextDisabled={statsOffset >= MARKET_STATS.length - STATS_PER_PAGE}
                />
              </div>
              <p style={{ fontSize: '0.875rem', color: '#4B5563', lineHeight: '1.65', margin: '0 0 4px' }}>
                The overall crypto market is growing this week. As of today, the total crypto market capitalization is $2.41 trillion, representing a 0.48% increase from last week.
              </p>
              <a href="#" style={{ fontSize: '0.875rem', color: '#1652F0', fontWeight: '600', textDecoration: 'none' }}>Read more</a>

              <div ref={statsGridRef} style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', marginTop: '16px' }} className="reveal reveal-fade-up">
                {visibleStats.map((stat, i) => (
                  <div key={stat.label} style={{ background: '#F9FAFB', borderRadius: '12px', overflow: 'hidden', border: '1px solid #F3F4F6' }}>
                    <div style={{ padding: '12px 12px 4px' }}>
                      <p style={{ fontSize: '0.75rem', color: '#6B7280', margin: '0 0 3px', fontWeight: '500' }}>{stat.label}</p>
                      <p style={{ fontSize: '0.9375rem', fontWeight: '800', color: '#111827', margin: '0 0 2px', letterSpacing: '-0.02em' }}>{stat.value}</p>
                      <p style={{ fontSize: '0.8125rem', fontWeight: '700', color: stat.change >= 0 ? '#16A34A' : '#DC2626', margin: 0 }}>
                        {stat.change >= 0 ? '↗' : '↘'} {Math.abs(stat.change).toFixed(2)}%
                      </p>
                    </div>
                    <MiniSparkline path={stat.path} up={stat.change >= 0} id={`stat-${statsOffset}-${i}`}/>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ── RIGHT sidebar ── */}
          <div ref={sidebarRef} style={{ display: 'flex', flexDirection: 'column', gap: '16px', paddingBottom: '28px' }} className="reveal reveal-right">

            {/* Get started card */}
            <div style={{ background: '#1652F0', borderRadius: '16px', padding: '22px', position: 'relative', overflow: 'hidden' }}>
              {/* Decorative rings */}
              <div style={{ position: 'absolute', top: '-28px', right: '-28px', width: '120px', height: '120px', borderRadius: '50%', border: '22px solid rgba(255,255,255,0.1)', pointerEvents: 'none' }}/>
              {/* Coin illustration */}
              <div style={{ position: 'absolute', top: '14px', right: '16px', display: 'flex', gap: '6px', alignItems: 'flex-start' }}>
                <div style={{ width: '46px', height: '46px', borderRadius: '50%', background: 'linear-gradient(135deg,#F59E0B,#D97706)', border: '3px solid rgba(255,255,255,0.35)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 6px 16px rgba(0,0,0,0.28)', zIndex: 1 }}>
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2l3 7h7l-5.5 4 2 7L12 16l-6.5 4 2-7L2 9h7z"/></svg>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', marginTop: '4px' }}>
                  <div style={{ width: '20px', height: '20px', borderRadius: '50%', background: '#4ADE80', border: '2px solid rgba(255,255,255,0.5)' }}/>
                  <div style={{ width: '14px', height: '14px', borderRadius: '50%', background: 'rgba(255,255,255,0.4)', border: '2px solid rgba(255,255,255,0.35)' }}/>
                </div>
              </div>

              <p style={{ fontSize: '1.0625rem', fontWeight: '800', color: '#fff', margin: '0 0 5px', paddingRight: '86px' }}>Get started</p>
              <p style={{ fontSize: '0.875rem', color: 'rgba(255,255,255,0.82)', margin: '0 0 18px', lineHeight: '1.5' }}>Create your account today</p>
              <Link to="/signup" style={{ display: 'inline-block', background: '#fff', color: '#111827', fontWeight: '700', fontSize: '0.875rem', padding: '9px 22px', borderRadius: '9px', textDecoration: 'none' }}
                onMouseEnter={e => e.currentTarget.style.background = '#F3F4F6'}
                onMouseLeave={e => e.currentTarget.style.background = '#fff'}
              >
                Sign up
              </Link>
            </div>

            {/* Top movers */}
            <div style={{ border: '1px solid #E5E7EB', borderRadius: '16px', padding: '18px', background: '#fff' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '3px' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: '800', color: '#111827', margin: 0 }}>Top movers</h3>
                <NavArrows
                  onPrev={() => setMoversOffset(m => Math.max(0, m - MOVERS_PER_PAGE))}
                  onNext={() => setMoversOffset(m => Math.min(topMovers.length - MOVERS_PER_PAGE, m + MOVERS_PER_PAGE))}
                  prevDisabled={moversOffset === 0}
                  nextDisabled={moversOffset >= topMovers.length - MOVERS_PER_PAGE}
                  size={28}
                />
              </div>
              <p style={{ fontSize: '0.8125rem', color: '#6B7280', margin: '0 0 14px' }}>24hr change</p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                {visibleMovers.map(crypto => {
                  const isUp = crypto.change24h >= 0;
                  const col  = coinColors[crypto.id] || '#6B7280';
                  return (
                    <Link key={crypto.id} to={`/asset/${crypto.id}`}
                      style={{ textDecoration: 'none', background: '#F9FAFB', borderRadius: '12px', padding: '12px 10px', display: 'flex', flexDirection: 'column', gap: '6px', border: '1px solid #F3F4F6', transition: 'background 0.12s' }}
                      onMouseEnter={e => e.currentTarget.style.background = '#F3F4F6'}
                      onMouseLeave={e => e.currentTarget.style.background = '#F9FAFB'}
                    >
                      <div style={{ width: 36, height: 36, borderRadius: '50%', background: col, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <span style={{ color: '#fff', fontWeight: '800', fontSize: '11px' }}>{crypto.symbol.slice(0,2).toUpperCase()}</span>
                      </div>
                      <p style={{ fontSize: '0.8125rem', fontWeight: '700', color: '#111827', margin: 0 }}>{crypto.symbol}</p>
                      <p style={{ fontSize: '0.9375rem', fontWeight: '800', color: isUp ? '#16A34A' : '#DC2626', margin: 0 }}>
                        {isUp ? '↗' : '↘'} {Math.abs(crypto.change24h).toFixed(2)}%
                      </p>
                      <p style={{ fontSize: '0.75rem', color: '#6B7280', margin: 0 }}>{fmt(crypto.price)}</p>
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ══════════ ASSETS TABLE ══════════ */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '32px 24px 56px' }}>

        <div ref={tableRef} style={{ border: '1.5px solid #E5E7EB', borderRadius: '16px', overflow: 'hidden' }} className="reveal reveal-fade-up">
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#F9FAFB', borderBottom: '1px solid #E5E7EB' }}>
                  {['Name', 'Price', '24h Change', 'Market Cap', ''].map(h => (
                    <th key={h} style={{
                      padding: '14px 20px',
                      textAlign: h === '' ? 'right' : 'left',
                      fontSize: '0.75rem', fontWeight: '700', color: '#6B7280',
                      textTransform: 'uppercase', letterSpacing: '0.05em', whiteSpace: 'nowrap',
                    }} className={h === 'Market Cap' ? 'hide-mobile-col' : ''}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredCrypto.map((crypto, idx) => {
                  const isUp = crypto.change24h >= 0;
                  const iconColor = coinColors[crypto.id] || '#6B7280';
                  return (
                    <tr key={crypto.id} style={{ borderBottom: idx < filteredCrypto.length - 1 ? '1px solid #F3F4F6' : 'none' }}>
                      <td style={{ padding: '16px 20px', whiteSpace: 'nowrap' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <div style={{ width: 40, height: 40, borderRadius: '50%', background: iconColor, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                            <span style={{ color: '#fff', fontWeight: '800', fontSize: '13px' }}>{crypto.symbol.slice(0,2).toUpperCase()}</span>
                          </div>
                          <div>
                            <div style={{ fontSize: '0.9375rem', fontWeight: '700', color: '#111827' }}>{crypto.name}</div>
                            <div style={{ fontSize: '0.8125rem', color: '#6B7280' }}>{crypto.symbol}</div>
                          </div>
                        </div>
                      </td>
                      <td style={{ padding: '16px 20px', whiteSpace: 'nowrap', fontSize: '0.9375rem', fontWeight: '700', color: '#111827', fontVariantNumeric: 'tabular-nums' }}>
                        {fmt(crypto.price)}
                      </td>
                      <td style={{ padding: '16px 20px', whiteSpace: 'nowrap' }}>
                        <span style={{ fontSize: '0.875rem', fontWeight: '600', color: isUp ? '#16A34A' : '#DC2626', background: isUp ? '#F0FDF4' : '#FEF2F2', padding: '3px 10px', borderRadius: '99px' }}>
                          {isUp ? '+' : ''}{crypto.change24h.toFixed(2)}%
                        </span>
                      </td>
                      <td style={{ padding: '16px 20px', whiteSpace: 'nowrap', fontSize: '0.9375rem', fontWeight: '600', color: '#374151' }} className="hide-mobile-col">
                        {fmtMC(crypto.marketCap)}
                      </td>
                      <td style={{ padding: '16px 20px', whiteSpace: 'nowrap', textAlign: 'right' }}>
                        <Link to={`/asset/${crypto.id}`} style={{ fontSize: '0.8125rem', fontWeight: '700', color: '#1652F0', textDecoration: 'none', background: '#EFF6FF', padding: '6px 14px', borderRadius: '8px' }}>
                          Trade
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {filteredCrypto.length === 0 && (
            <div style={{ textAlign: 'center', padding: '56px 24px' }}>
              <svg width="48" height="48" fill="none" stroke="#D1D5DB" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24" style={{ margin: '0 auto 16px' }}>
                <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
              </svg>
              <p style={{ fontSize: '1.0625rem', fontWeight: '600', color: '#374151', margin: '0 0 6px' }}>No results found</p>
              <p style={{ fontSize: '0.9375rem', color: '#6B7280', margin: 0 }}>Try a different search term</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Explore;
