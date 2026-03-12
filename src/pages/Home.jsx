import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { cryptoData } from '../data/cryptoData';
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

function Reveal({ children, variant = 'reveal-fade-up', delay = '', className = '', style = {} }) {
  const ref = useReveal();
  return (
    <div ref={ref} className={`reveal ${variant} ${delay} ${className}`} style={style}>
      {children}
    </div>
  );
}

const coinColors = {
  bitcoin:     '#F59E0B',
  ethereum:    '#6366F1',
  tether:      '#14B8A6',
  binancecoin: '#EAB308',
  solana:      '#8B5CF6',
  usdcoin:     '#3B82F6',
  cardano:     '#1D4ED8',
  ripple:      '#0EA5E9',
  dogecoin:    '#F59E0B',
  polkadot:    '#EC4899',
};

function PhoneMockup() {
  return (
    <div style={{ position: 'relative', maxWidth: '390px', margin: '0 auto', paddingRight: '6%', paddingBottom: '5%' }}>
      <div style={{
        position: 'absolute',
        top: '10%', left: '10%', right: '0%', bottom: '0%',
        background: 'linear-gradient(145deg, #1652F0, #0A3ECF)',
        borderRadius: '28px',
        zIndex: 0,
      }} />
      <div style={{
        position: 'relative', zIndex: 1,
        background: '#ffffff',
        borderRadius: '22px',
        overflow: 'hidden',
        boxShadow: '0 28px 64px rgba(0,0,0,0.18)',
      }}>
        <div style={{ padding: '14px 16px 12px', display: 'flex', alignItems: 'center', gap: '10px', borderBottom: '1px solid #F3F4F6' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '3.5px' }}>
            {[0,1,2].map(i => <div key={i} style={{ width: '16px', height: '1.5px', background: '#374151', borderRadius: '1px' }} />)}
          </div>
          <div style={{ flex: 1, background: '#F9FAFB', border: '1px solid #F3F4F6', borderRadius: '20px', padding: '6px 10px', display: 'flex', alignItems: 'center', gap: '5px' }}>
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2.5"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
            <span style={{ fontSize: '11px', color: '#9CA3AF' }}>Search</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ width: '26px', height: '26px', background: '#1652F0', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ color: '#fff', fontWeight: '900', fontSize: '11px' }}>C</span>
            </div>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#374151" strokeWidth="2" strokeLinecap="round"><rect x="3" y="3" width="4" height="18" rx="1"/><rect x="10" y="8" width="4" height="13" rx="1"/><rect x="17" y="5" width="4" height="16" rx="1"/></svg>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#374151" strokeWidth="2" strokeLinecap="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
          </div>
        </div>

        <div style={{ padding: '16px 16px 4px' }}>
          <p style={{ fontSize: '26px', fontWeight: '800', color: '#111827', letterSpacing: '-0.02em', margin: '0 0 4px' }}>₵33,683.80</p>
          <p style={{ fontSize: '12px', color: '#22C55E', fontWeight: '600', margin: 0 }}>&#8593; ₵131.36 (1.38%) 1D &#8250;</p>
        </div>

        <div style={{ padding: '6px 16px 2px' }}>
          <svg viewBox="0 0 260 68" width="100%" height="68" preserveAspectRatio="none">
            <defs>
              <linearGradient id="cg1" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#1652F0" stopOpacity="0.15"/>
                <stop offset="100%" stopColor="#1652F0" stopOpacity="0.01"/>
              </linearGradient>
            </defs>
            <path d="M0,60 C18,54 30,48 45,40 C60,32 70,36 85,28 C100,20 110,14 125,11 C140,8 150,16 165,10 C180,4 188,1.5 205,1.5 C222,1.5 230,6 240,4 C250,2 255,1.5 260,1 L260,68 L0,68 Z" fill="url(#cg1)"/>
            <path d="M0,60 C18,54 30,48 45,40 C60,32 70,36 85,28 C100,20 110,14 125,11 C140,8 150,16 165,10 C180,4 188,1.5 205,1.5 C222,1.5 230,6 240,4 C250,2 255,1.5 260,1" fill="none" stroke="#1652F0" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            <circle cx="260" cy="1" r="3.5" fill="#1652F0"/>
            <circle cx="260" cy="1" r="7.5" fill="#1652F0" fillOpacity="0.18"/>
          </svg>
        </div>

        <div style={{ display: 'flex', padding: '4px 14px 10px', gap: '0' }}>
          {['1H','1D','1W','1M','1Y','All'].map((t, i) => (
            <span key={t} style={{ fontSize: '11px', fontWeight: '600', padding: '4px 7px', borderRadius: '6px', background: i === 1 ? '#1652F0' : 'transparent', color: i === 1 ? '#fff' : '#9CA3AF', cursor: 'default' }}>{t}</span>
          ))}
        </div>

        <div style={{ height: '1px', background: '#F3F4F6', margin: '0 16px 10px' }}/>

        <div style={{ padding: '0 16px' }}>
          {[
            { ico: 'B', label: 'Crypto',      val: '₵224,140.70', c: '#F59E0B', up: false },
            { ico: 'S', label: 'Stocks',      val: '₵128,516.88', c: '#6366F1', up: false },
            { ico: 'D', label: 'Derivatives', val: '₵2,351.67',   c: '#8B5CF6', up: true  },
            { ico: 'P', label: 'Predictions', val: '₵674.50',     c: '#14B8A6', up: true  },
            { ico: '₵', label: 'Cash',         val: '₵159,962.68', c: '#22C55E', up: false },
          ].map(({ ico, label, val, c, up }) => (
            <div key={label} style={{ display: 'flex', alignItems: 'center', paddingBottom: '10px' }}>
              <div style={{ width: '30px', height: '30px', borderRadius: '8px', background: c + '22', display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: '10px', flexShrink: 0 }}>
                <span style={{ fontSize: '12px', color: c, fontWeight: '800' }}>{ico}</span>
              </div>
              <span style={{ flex: 1, fontSize: '13px', fontWeight: '500', color: '#374151' }}>{label}</span>
              <span style={{ fontSize: '13px', fontWeight: '700', color: up ? '#22C55E' : '#111827', fontVariantNumeric: 'tabular-nums' }}>
                {up ? '\u2191 ' : ''}{val}
              </span>
            </div>
          ))}
        </div>

        <p style={{ padding: '4px 16px 14px', fontSize: '9.5px', color: '#9CA3AF', lineHeight: '1.4' }}>
          Stocks and prediction markets not available in your jurisdiction.
        </p>
      </div>
    </div>
  );
}

function Home() {
  const [activeTab, setActiveTab] = useState('tradable');
  const liveData = useLivePrices();
  const topCryptos = (liveData ?? cryptoData).slice(0, 4);

  const exploreRef     = useReveal();
  const advancedRef    = useReveal();
  const coinbaseOneRef = useReveal();
  const learnHdrRef    = useReveal();
  const featHdrRef     = useReveal();
  const ctaRef         = useReveal();

  const formatPrice = (price) =>
    '₵' + new Intl.NumberFormat('en-GH', {
      minimumFractionDigits: 2, maximumFractionDigits: 2,
    }).format(price);

  return (
    <div style={{ overflowX: 'hidden' }} className="home-page">

      {/* HERO */}
      <section style={{ background: '#ffffff', padding: '56px 0 80px' }}>
        <div style={{ maxWidth: '1160px', margin: '0 auto', padding: '0 24px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '56px', alignItems: 'center' }} className="hero-grid">
          <div className="hero-anim-left home-hero-mockup">
            <PhoneMockup />
          </div>
          <div className="hero-anim-right">
            <h1 style={{ fontSize: 'clamp(2.25rem, 5vw, 3.75rem)', fontWeight: '800', color: '#111827', lineHeight: '1.1', letterSpacing: '-0.035em', marginBottom: '16px' }}>
              The future of<br />finance is here..
            </h1>
            <p style={{ fontSize: '1rem', color: '#D97706', fontWeight: '600', marginBottom: '32px', lineHeight: '1.6' }}>
              Trade crypto and more on a platform you can trust.
            </p>
            <Link
              to="/signup"
              style={{ display: 'inline-flex', alignItems: 'center', background: '#1652F0', color: '#fff', fontWeight: '700', fontSize: '1rem', padding: '14px 32px', borderRadius: '8px', textDecoration: 'none' }}
            >
              Get started
            </Link>
          </div>
        </div>
      </section>


      {/* EXPLORE CRYPTO */}
      <section style={{ background: '#F9FAFB', padding: '80px 0', borderTop: '1px solid #F3F4F6' }}>
        <div ref={exploreRef} style={{ maxWidth: '1160px', margin: '0 auto', padding: '0 24px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '56px', alignItems: 'center' }} className="explore-grid reveal reveal-fade-up">
          <div>
            <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: '800', color: '#111827', letterSpacing: '-0.025em', lineHeight: '1.15', marginBottom: '16px' }}>
              Explore crypto<br />like Bitcoin
            </h2>
            <p style={{ fontSize: '1.0625rem', color: '#6B7280', lineHeight: '1.7', marginBottom: '32px' }}>
              Simply and securely buy, sell, and manage hundreds of cryptocurrencies.
            </p>
            <Link to="/explore" style={{ display: 'inline-block', background: '#1652F0', color: '#fff', fontWeight: '700', fontSize: '0.9375rem', padding: '13px 28px', borderRadius: '8px', textDecoration: 'none' }}>
              See more assets
            </Link>
          </div>

          <div className="home-explore-panel" style={{ background: 'linear-gradient(145deg, #1652F0, #0A3ECF)', borderRadius: '20px', padding: '20px', boxShadow: '0 20px 48px rgba(22,82,240,0.35)' }}>
            <div className="home-explore-tabs" style={{ display: 'flex', gap: '3px', marginBottom: '16px', background: 'rgba(255,255,255,0.12)', padding: '4px', borderRadius: '10px' }}>
              {[['tradable','Tradable'],['gainers','Top Gainers'],['new','New']].map(([k, lbl]) => (
                <button key={k} onClick={() => setActiveTab(k)} style={{ flex: 1, padding: '8px 4px', borderRadius: '7px', border: 'none', cursor: 'pointer', fontSize: '11px', fontWeight: '600', background: activeTab === k ? '#ffffff' : 'transparent', color: activeTab === k ? '#1652F0' : 'rgba(255,255,255,0.65)', transition: 'all 0.15s', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {lbl}
                </button>
              ))}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {topCryptos.map((crypto) => {
                const isUp = crypto.change24h >= 0;
                const iconColor = coinColors[crypto.id] || '#6B7280';
                return (
                  <Link key={crypto.id} to={'/asset/' + crypto.id}
                    style={{ display: 'flex', alignItems: 'center', padding: '10px 8px', borderRadius: '10px', textDecoration: 'none', background: 'transparent', transition: 'background 0.15s' }}
                    onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.10)'; }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
                  >
                    <div style={{ width: '34px', height: '34px', borderRadius: '50%', background: iconColor, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginRight: '10px' }}>
                      <span style={{ color: '#fff', fontWeight: '800', fontSize: '11px' }}>{crypto.symbol.slice(0,2).toUpperCase()}</span>
                    </div>
                    <div style={{ flex: 1 }}>
                      <p style={{ fontSize: '13px', fontWeight: '600', color: '#ffffff', margin: 0 }}>{crypto.name}</p>
                      <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.55)', margin: 0 }}>{crypto.symbol}</p>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <p style={{ fontSize: '13px', fontWeight: '700', color: '#ffffff', margin: 0, fontVariantNumeric: 'tabular-nums' }}>{formatPrice(crypto.price)}</p>
                      <p style={{ fontSize: '11px', fontWeight: '600', color: isUp ? '#4ADE80' : '#F87171', margin: 0 }}>{isUp ? '\u2191' : '\u2193'} {Math.abs(crypto.change24h).toFixed(2)}%</p>
                    </div>
                  </Link>
                );
              })}
            </div>
            <div style={{ textAlign: 'center', marginTop: '14px', paddingTop: '14px', borderTop: '1px solid rgba(255,255,255,0.15)' }}>
              <Link to="/explore" style={{ fontSize: '13px', fontWeight: '600', color: '#ffffff', textDecoration: 'none', opacity: 0.85 }}>View all assets &#8594;</Link>
            </div>
          </div>
        </div>
      </section>

      {/* ADVANCED TRADER */}
      <section style={{ padding: '88px 0', background: '#ffffff', borderTop: '1px solid #F3F4F6' }}>
        <div ref={advancedRef} style={{ maxWidth: '1160px', margin: '0 auto', padding: '0 24px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '56px', alignItems: 'center' }} className="hero-grid reveal reveal-left">
          {/* Trading chart mockup */}
          <div style={{ background: 'linear-gradient(145deg, #1652F0, #0A3ECF)', borderRadius: '20px', padding: '0', overflow: 'hidden', boxShadow: '0 24px 60px rgba(22,82,240,0.35)', minHeight: '300px', position: 'relative' }}>
            <div style={{ padding: '14px 16px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                <div style={{ width: '22px', height: '22px', borderRadius: '50%', background: '#F59E0B', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <span style={{ color: '#fff', fontSize: '9px', fontWeight: '900' }}>BT</span>
                </div>
                <span style={{ color: '#E5E7EB', fontSize: '12px', fontWeight: '700' }}>BTC-GHS</span>
                <span style={{ color: '#22C55E', fontSize: '11px', fontWeight: '600' }}>+2.4%</span>
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                {['1H','1D','1W'].map((t,i) => <span key={t} style={{ fontSize: '10px', color: i===1?'#fff':'#6B7280', background: i===1?'#374151':'transparent', padding: '2px 7px', borderRadius: '4px', cursor: 'default' }}>{t}</span>)}
              </div>
            </div>
            <div style={{ padding: '8px 16px 0' }}>
              <p style={{ color: '#fff', fontSize: '20px', fontWeight: '800', margin: '0', letterSpacing: '-0.02em' }}>₵43,218.50</p>
              <p style={{ color: '#22C55E', fontSize: '11px', margin: '0 0 6px', fontWeight: '600' }}>▲ ₵1,032.10 (+2.45%)</p>
            </div>
            <svg viewBox="0 0 380 130" width="100%" height="130" preserveAspectRatio="none" style={{ display: 'block' }}>
              <defs>
                <linearGradient id="cg2" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#22C55E" stopOpacity="0.25"/>
                  <stop offset="100%" stopColor="#22C55E" stopOpacity="0.02"/>
                </linearGradient>
              </defs>
              {/* Candlesticks */}
              {[
                [20,80,65,72,88],[36,70,55,62,78],[52,90,72,76,92],[68,65,50,55,70],
                [84,55,40,42,60],[100,45,30,32,50],[116,50,35,38,55],[132,40,22,26,44],
                [148,35,18,21,38],[164,28,15,17,32],[180,22,10,13,26],[196,18,8,10,22],
                [212,25,12,15,28],[228,30,16,20,34],[244,22,10,14,26],[260,15,5,8,18],
                [276,10,2,4,14],[292,18,8,11,22],[308,12,3,6,16],[324,8,1,2,12],[340,5,1,1,8]
              ].map(([x, hi, lo, o, c], i) => {
                const isGreen = c > o;
                const col = isGreen ? '#22C55E' : '#EF4444';
                const bodyTop = Math.min(o, c); const bodyH = Math.abs(c - o) || 2;
                return (
                  <g key={x}>
                    <line x1={x+4} y1={hi} x2={x+4} y2={lo} stroke={col} strokeWidth="1"/>
                    <rect x={x} y={bodyTop} width="8" height={bodyH} fill={col} rx="1"/>
                  </g>
                );
              })}
            </svg>
            {/* Order book panel */}
            <div style={{ margin: '0 12px 12px', background: '#111213', borderRadius: '10px', padding: '10px 12px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                <div>
                  <p style={{ fontSize: '9px', color: '#6B7280', fontWeight: '700', letterSpacing: '0.05em', margin: '0 0 6px' }}>BIDS</p>
                  {[['43,210','1.24'],['43,190','0.85'],['43,170','2.10']].map(([p,s]) => (
                    <div key={p} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '3px' }}>
                      <span style={{ fontSize: '10px', color: '#22C55E', fontVariantNumeric: 'tabular-nums' }}>{p}</span>
                      <span style={{ fontSize: '10px', color: '#9CA3AF' }}>{s}</span>
                    </div>
                  ))}
                </div>
                <div>
                  <p style={{ fontSize: '9px', color: '#6B7280', fontWeight: '700', letterSpacing: '0.05em', margin: '0 0 6px' }}>ASKS</p>
                  {[['43,230','0.92'],['43,250','1.55'],['43,270','0.44']].map(([p,s]) => (
                    <div key={p} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '3px' }}>
                      <span style={{ fontSize: '10px', color: '#EF4444', fontVariantNumeric: 'tabular-nums' }}>{p}</span>
                      <span style={{ fontSize: '10px', color: '#9CA3AF' }}>{s}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          {/* Text */}
          <div>
            <h2 style={{ fontSize: 'clamp(1.875rem, 4vw, 3rem)', fontWeight: '800', color: '#111827', lineHeight: '1.12', letterSpacing: '-0.03em', marginBottom: '16px' }}>
              Powerful tools, designed<br />for the advanced trader.
            </h2>
            <p style={{ fontSize: '1rem', color: '#D97706', fontWeight: '600', marginBottom: '12px', lineHeight: '1.6' }}>
              Powerful analytical tools with the safety and security of Coinbase deliver the ultimate trading experience.
            </p>
            <p style={{ fontSize: '0.9375rem', color: '#6B7280', lineHeight: '1.7', marginBottom: '32px' }}>
              Tap into sophisticated charting capabilities, real-time order books, and deep liquidity across hundreds of markets.
            </p>
            <Link to="/advanced-trading" style={{ display: 'inline-block', background: '#111827', color: '#fff', fontWeight: '700', fontSize: '0.9375rem', padding: '13px 28px', borderRadius: '99px', textDecoration: 'none' }}>
              Start trading
            </Link>
          </div>
        </div>
      </section>

      {/* COINBASE ONE — ZERO FEES */}
      <section style={{ padding: '88px 0', background: '#ffffff' }}>
        <div ref={coinbaseOneRef} style={{ maxWidth: '1160px', margin: '0 auto', padding: '0 24px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '56px', alignItems: 'center' }} className="explore-grid reveal reveal-right">
          {/* Text */}
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', border: '1.5px solid #E5E7EB', borderRadius: '99px', padding: '5px 12px', marginBottom: '20px' }}>
              <div style={{ width: '14px', height: '14px', borderRadius: '50%', background: '#1652F0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ color: '#fff', fontSize: '7px', fontWeight: '900' }}>C</span>
              </div>
              <span style={{ fontSize: '11px', fontWeight: '700', color: '#374151', letterSpacing: '0.05em', textTransform: 'uppercase' }}>COINBASE ONE</span>
            </div>
            <h2 style={{ fontSize: 'clamp(2rem, 4.5vw, 3.25rem)', fontWeight: '800', color: '#111827', lineHeight: '1.1', letterSpacing: '-0.035em', marginBottom: '16px' }}>
              Zero trading fees,<br />more rewards.
            </h2>
            <p style={{ fontSize: '1rem', color: '#D97706', fontWeight: '600', marginBottom: '12px', lineHeight: '1.6' }}>
              Get more out of crypto with one membership: zero trading fees, boosted rewards, priority support, and more.
            </p>
            <Link to="/signup" style={{ display: 'inline-block', background: '#111827', color: '#fff', fontWeight: '700', fontSize: '0.9375rem', padding: '13px 28px', borderRadius: '99px', textDecoration: 'none', marginTop: '8px' }}>
              Claim free trial
            </Link>
          </div>
          {/* Phone mockup */}
          <div style={{ background: '#F3F4F6', borderRadius: '24px', padding: '28px 24px', boxShadow: '0 8px 32px rgba(0,0,0,0.08)', maxWidth: '340px', margin: '0 auto', width: '100%' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <span style={{ fontSize: '12px', fontWeight: '700', color: '#111827' }}>3:57</span>
              <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
                <svg width="15" height="10" viewBox="0 0 15 10"><rect x="0" y="5" width="3" height="5" rx="0.5" fill="#374151"/><rect x="4" y="3" width="3" height="7" rx="0.5" fill="#374151"/><rect x="8" y="1" width="3" height="9" rx="0.5" fill="#374151"/><rect x="12" y="0" width="3" height="10" rx="0.5" fill="#E5E7EB"/></svg>
                <svg width="16" height="11" viewBox="0 0 16 11" fill="none"><path d="M8 2.5C10.5 2.5 12.7 3.6 14.2 5.4L15.5 4C13.6 1.7 10.9 0 8 0C5.1 0 2.4 1.7 0.5 4L1.8 5.4C3.3 3.6 5.5 2.5 8 2.5Z" fill="#374151"/><path d="M8 5.5C9.6 5.5 11 6.2 12 7.4L13.3 6C11.9 4.5 10 3.5 8 3.5C6 3.5 4.1 4.5 2.7 6L4 7.4C5 6.2 6.4 5.5 8 5.5Z" fill="#374151"/><circle cx="8" cy="10" r="1.5" fill="#374151"/></svg>
                <div style={{ width: '22px', height: '11px', border: '1.5px solid #374151', borderRadius: '3px', padding: '1.5px' }}><div style={{ width: '75%', height: '100%', background: '#374151', borderRadius: '1.5px' }}/></div>
              </div>
            </div>
            <div style={{ textAlign: 'center', padding: '24px 0 28px' }}>
              <div style={{ position: 'relative', width: '72px', height: '72px', margin: '0 auto 16px' }}>
                <div style={{ width: '72px', height: '72px', borderRadius: '50%', background: 'linear-gradient(135deg, #1652F0, #0A3ECF)' }}/>
                <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5"/></svg>
                </div>
                <div style={{ position: 'absolute', bottom: '-4px', right: '-4px', width: '22px', height: '22px', borderRadius: '50%', background: '#22C55E', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid #fff' }}>
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5"/></svg>
                </div>
              </div>
              <p style={{ fontSize: '15px', fontWeight: '700', color: '#111827', margin: '0 0 4px' }}>Trade successful!</p>
              <p style={{ fontSize: '12px', color: '#6B7280', margin: 0 }}>You got 0.010423 BTC</p>
            </div>
            <div style={{ background: '#ffffff', borderRadius: '12px', padding: '12px 14px', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: '#1652F0', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <span style={{ color: '#fff', fontSize: '9px', fontWeight: '900' }}>C</span>
              </div>
              <div>
                <p style={{ fontSize: '11px', fontWeight: '700', color: '#111827', margin: 0 }}>₵706.14 — No trading fees with Coinbase One</p>
              </div>
            </div>
            <div style={{ background: '#ffffff', borderRadius: '12px', padding: '12px 14px', display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
              <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: '#8B5CF6', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round"><path d="M12 2l3 7h7l-5.5 4 2 7L12 16l-6.5 4 2-7L2 9h7z"/></svg>
              </div>
              <div>
                <p style={{ fontSize: '11px', fontWeight: '700', color: '#111827', margin: '0 0 2px' }}>Exclusive member benefits</p>
                <p style={{ fontSize: '10px', color: '#6B7280', margin: '0 0 4px', lineHeight: '1.4' }}>Coinbase One members get boosted staking rewards.</p>
                <a href="#" style={{ fontSize: '10px', color: '#1652F0', fontWeight: '600', textDecoration: 'none' }}>Learn more</a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* NEW TO CRYPTO — LEARN BASICS */}
      <section style={{ padding: '80px 0 72px', background: '#F3F4F6' }}>
        <div style={{ maxWidth: '1160px', margin: '0 auto', padding: '0 24px' }}>
          {/* Header row */}
          <div ref={learnHdrRef} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '48px', alignItems: 'flex-end', marginBottom: '40px' }} className="explore-grid reveal reveal-fade-up">
            <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: '800', color: '#111827', lineHeight: '1.12', letterSpacing: '-0.03em', margin: 0 }}>
              New to crypto?<br />Learn some<br />crypto basics
            </h2>
            <div>
              <p style={{ fontSize: '0.9375rem', color: '#6B7280', lineHeight: '1.65', marginBottom: '20px' }}>
                Beginner guides, practical tips, and market updates for first-timers, experienced investors, and everyone in between
              </p>
              <Link to="/learn" style={{ display: 'inline-block', background: '#111827', color: '#fff', fontWeight: '700', fontSize: '0.9375rem', padding: '12px 26px', borderRadius: '99px', textDecoration: 'none' }}>
                Read More
              </Link>
            </div>
          </div>
          {/* Article cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px' }} className="article-grid">
            {[
              {
                bg: '#0A0B0D',
                illustration: (
                  <svg viewBox="0 0 260 140" width="100%" height="140">
                    <rect width="260" height="140" fill="#0A0B0D"/>
                    <circle cx="130" cy="70" r="50" fill="none" stroke="#1652F0" strokeWidth="1.5" strokeDasharray="6 3" opacity="0.6"/>
                    <circle cx="130" cy="70" r="35" fill="none" stroke="#3B82F6" strokeWidth="1" strokeDasharray="4 4" opacity="0.5"/>
                    <circle cx="130" cy="70" r="22" fill="#1652F0" opacity="0.9"/>
                    <text x="130" y="77" textAnchor="middle" fill="#fff" fontSize="22" fontWeight="900">₵</text>
                    {[[70,30,'#EF4444'],[180,35,'#F59E0B'],[195,95,'#22C55E'],[70,110,'#8B5CF6'],[155,115,'#3B82F6']].map(([cx,cy,c],i)=>(
                      <circle key={i} cx={cx} cy={cy} r="7" fill={c} opacity="0.9"/>
                    ))}
                    <line x1="130" y1="48" x2="130" y2="30" stroke="#1652F0" strokeWidth="1.5" opacity="0.4"/>
                    <line x1="130" y1="48" x2="180" y2="35" stroke="#1652F0" strokeWidth="1" opacity="0.3" strokeDasharray="3 2"/>
                    <line x1="130" y1="48" x2="70" y2="30" stroke="#1652F0" strokeWidth="1" opacity="0.3" strokeDasharray="3 2"/>
                  </svg>
                ),
                title: 'USDC: The digital dollar for the global crypto economy',
                desc: 'Coinbase believes crypto will be part of the solution for creating an open financial system that is both more efficient and more...',
              },
              {
                bg: '#3B82F6',
                illustration: (
                  <svg viewBox="0 0 260 140" width="100%" height="140">
                    <rect width="260" height="140" fill="#3B82F6"/>
                    <rect x="80" y="30" width="100" height="68" rx="8" fill="#fff" opacity="0.95"/>
                    <rect x="90" y="38" width="80" height="8" rx="3" fill="#E5E7EB"/>
                    <rect x="90" y="52" width="60" height="6" rx="2" fill="#F3F4F6"/>
                    <rect x="90" y="64" width="70" height="6" rx="2" fill="#F3F4F6"/>
                    <rect x="95" y="78" width="30" height="12" rx="6" fill="#1652F0"/>
                    <text x="110" y="88" textAnchor="middle" fill="#fff" fontSize="7" fontWeight="700">PAY</text>
                    <circle cx="100" cy="115" r="9" fill="#F59E0B" opacity="0.9"/>
                    <text x="100" y="119" textAnchor="middle" fill="#fff" fontSize="9" fontWeight="900">₵</text>
                    <circle cx="160" cy="115" r="9" fill="#F59E0B" opacity="0.9"/>
                    <text x="160" y="119" textAnchor="middle" fill="#fff" fontSize="9" fontWeight="900">₵</text>
                    {[[68,28],[190,28],[68,112],[190,112]].map(([cx,cy],i)=>(
                      <g key={i}><line x1={cx} y1={cy} x2="130" y2="70" stroke="#fff" strokeWidth="0.8" opacity="0.3"/></g>
                    ))}
                  </svg>
                ),
                title: 'Can crypto really replace your bank account?',
                desc: "If you're a big enough fan of crypto, you've probably heard the phrase \"be your own bank\" or the term \"bankless\" — the idea being that...",
              },
              {
                bg: '#D1FAE5',
                illustration: (
                  <svg viewBox="0 0 260 140" width="100%" height="140">
                    <rect width="260" height="140" fill="#D1FAE5"/>
                    <circle cx="130" cy="65" r="30" fill="#F59E0B" opacity="0.95"/>
                    <text x="130" y="73" textAnchor="middle" fill="#fff" fontSize="24" fontWeight="900">₿</text>
                    {[[60,50,'#E5E7EB'],[185,45,'#F3F4F6'],[55,90,'#E5E7EB'],[195,90,'#F3F4F6'],[90,115,'#E5E7EB'],[165,115,'#F3F4F6']].map(([cx,cy,c],i)=>(
                      <g key={i}>
                        <rect x={cx-10} y={cy-10} width="20" height="20" rx="4" fill={c}/>
                        {i%2===0
                          ? <text x={cx} y={cy+5} textAnchor="middle" fill="#374151" fontSize="11" fontWeight="700">▣</text>
                          : <text x={cx} y={cy+5} textAnchor="middle" fill="#6B7280" fontSize="11" fontWeight="700">◈</text>
                        }
                      </g>
                    ))}
                    <path d="M60 55 Q90 60 100 65" stroke="#9CA3AF" strokeWidth="1.5" fill="none" strokeDasharray="3 2"/>
                    <path d="M185 50 Q165 55 160 65" stroke="#9CA3AF" strokeWidth="1.5" fill="none" strokeDasharray="3 2"/>
                    <path d="M90 35 Q95 48 100 55" stroke="#D97706" strokeWidth="1.5" fill="none" opacity="0.6"/>
                    <circle cx="130" cy="108" r="5" fill="#111827" opacity="0.6"/>
                    <line x1="130" y1="95" x2="130" y2="103" stroke="#111827" strokeWidth="1.5" opacity="0.4"/>
                  </svg>
                ),
                title: 'When is the best time to invest in crypto?',
                desc: 'Cryptocurrencies like Bitcoin can experience daily (or even hourly) price volatility. As with any kind of investment, volatility may cause...',
              },
            ].map(({ bg, illustration, title, desc }, idx) => (
              <Reveal key={title} variant="reveal-scale" delay={`reveal-delay-${idx + 1}`} style={{ display: 'flex', flexDirection: 'column' }}>
              <Link to="/learn" style={{ display: 'block', textDecoration: 'none', background: '#fff', borderRadius: '16px', overflow: 'hidden', transition: 'box-shadow 0.2s', flex: 1 }}
                onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.10)'; }}
                onMouseLeave={e => { e.currentTarget.style.boxShadow = 'none'; }}
              >
                <div style={{ background: bg, overflow: 'hidden' }}>
                  {illustration}
                </div>
                <div style={{ padding: '20px' }}>
                  <h3 style={{ fontSize: '1rem', fontWeight: '700', color: '#111827', margin: '0 0 10px', lineHeight: '1.4' }}>{title}</h3>
                  <p style={{ fontSize: '0.875rem', color: '#6B7280', margin: 0, lineHeight: '1.6' }}>{desc}</p>
                </div>
              </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section style={{ padding: '88px 0', background: '#ffffff' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 24px' }}>
          <div ref={featHdrRef} style={{ textAlign: 'center', marginBottom: '56px' }} className="reveal reveal-fade-up">
            <h2 style={{ fontSize: 'clamp(1.875rem, 4vw, 2.625rem)', fontWeight: '800', color: '#111827', lineHeight: '1.2', letterSpacing: '-0.02em', margin: '0 0 14px' }}>
              Create your cryptocurrency<br />portfolio today
            </h2>
            <p style={{ fontSize: '1.0625rem', color: '#6B7280', maxWidth: '460px', margin: '0 auto', lineHeight: '1.65' }}>
              Coinbase has a variety of features that make it the best place to start trading
            </p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '48px' }}>
            {[
              { bg: '#EFF6FF', icon: '#2563EB', label: 'Manage your portfolio', desc: 'Buy and sell popular digital currencies, keep track of them in one place.', svg: 'M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z' },
              { bg: '#F5F3FF', icon: '#7C3AED', label: 'Recurring buys', desc: 'Invest in cryptocurrency slowly over time by scheduling buys daily, weekly, or monthly.', svg: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z' },
              { bg: '#F0FDF4', icon: '#16A34A', label: 'Mobile apps', desc: 'Stay on top of the markets with the Coinbase app for Android or iOS.', svg: 'M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z' },
            ].map(({ bg, icon, label, desc, svg }, idx) => (
              <Reveal key={label} variant="reveal-fade-up" delay={`reveal-delay-${idx + 1}`}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ width: '64px', height: '64px', background: bg, borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
                  <svg width="28" height="28" fill="none" stroke={icon} strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d={svg}/></svg>
                </div>
                <h3 style={{ fontSize: '1.125rem', fontWeight: '700', color: '#111827', margin: '0 0 10px' }}>{label}</h3>
                <p style={{ fontSize: '0.9375rem', color: '#6B7280', lineHeight: '1.65', margin: 0 }}>{desc}</p>
              </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* STATS */}
      <section style={{ background: '#F9FAFB', borderTop: '1px solid #F3F4F6', borderBottom: '1px solid #F3F4F6', padding: '56px 24px' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '32px', textAlign: 'center' }}>
          {[{ value: '₵100B+', label: 'Total assets traded' }, { value: '100+', label: 'Countries supported' }, { value: '50M+', label: 'Verified users' }].map(({ value, label }, idx) => (
            <Reveal key={label} variant="reveal-fade-up" delay={`reveal-delay-${idx + 1}`}>
            <div>
              <p style={{ fontSize: 'clamp(2rem, 3.5vw, 2.5rem)', fontWeight: '800', color: '#111827', margin: '0 0 6px', letterSpacing: '-0.02em' }}>{value}</p>
              <p style={{ fontSize: '0.9375rem', color: '#6B7280', margin: 0 }}>{label}</p>
            </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* LEARN & EARN CTA */}
      <section style={{ padding: '80px 24px', background: '#ffffff' }}>
        <div ref={ctaRef} style={{ maxWidth: '820px', margin: '0 auto', background: '#1652F0', borderRadius: '20px', padding: 'clamp(40px, 6vw, 72px) clamp(24px, 5vw, 64px)', textAlign: 'center' }} className="reveal reveal-scale">
          <p style={{ fontSize: '0.75rem', fontWeight: '700', letterSpacing: '0.1em', color: 'rgba(255,255,255,0.65)', textTransform: 'uppercase', margin: '0 0 14px' }}>LEARN &amp; EARN</p>
          <h2 style={{ fontSize: 'clamp(1.5rem, 4vw, 2.25rem)', fontWeight: '800', color: '#ffffff', lineHeight: '1.25', margin: '0 0 14px', letterSpacing: '-0.02em' }}>
            Earn up to ₵1,580 in rewards
          </h2>
          <p style={{ fontSize: '1.0625rem', color: 'rgba(255,255,255,0.8)', lineHeight: '1.65', maxWidth: '460px', margin: '0 auto 32px' }}>
            Discover how specific cryptocurrencies work and get a bit of each crypto to try out for yourself.
          </p>
          <Link to="/learn" style={{ display: 'inline-block', background: '#ffffff', color: '#1652F0', fontWeight: '700', fontSize: '0.9375rem', padding: '13px 32px', borderRadius: '8px', textDecoration: 'none' }}>
            Start earning
          </Link>
        </div>
      </section>

    </div>
  );
}

export default Home;
