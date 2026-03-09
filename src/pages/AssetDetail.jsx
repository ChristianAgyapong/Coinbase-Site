import { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
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
  bitcoin:      '#F59E0B',
  ethereum:     '#6366F1',
  tether:       '#14B8A6',
  'binance-coin': '#EAB308',
  solana:       '#8B5CF6',
  'usd-coin':   '#3B82F6',
  cardano:      '#1D4ED8',
  ripple:       '#0EA5E9',
  dogecoin:     '#F59E0B',
  polkadot:     '#EC4899',
};

// Fake mini sparkline for each coin
function Sparkline({ positive }) {
  const up   = 'M0,60 C20,55 35,42 55,35 C75,28 85,32 105,22 C125,12 135,8 160,5 C175,3 185,10 200,8';
  const down = 'M0,8  C20,12 35,20 55,28 C75,36 85,30 105,38 C125,46 135,52 160,56 C175,58 185,54 200,58';
  const color = positive ? '#16A34A' : '#DC2626';
  return (
    <svg width="200" height="64" viewBox="0 0 200 64" fill="none" preserveAspectRatio="none">
      <defs>
        <linearGradient id="sg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.18"/>
          <stop offset="100%" stopColor={color} stopOpacity="0"/>
        </linearGradient>
      </defs>
      <path d={positive ? up : down} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round"/>
    </svg>
  );
}

function AssetDetail() {
  const { id } = useParams();
  const liveData = useLivePrices() ?? [];
  const crypto = liveData.find((c) => c.id === id);
  const [tradeTab, setTradeTab]       = useState('buy');
  const [orderType, setOrderType]     = useState('market');
  const [spendAmount, setSpendAmount] = useState('');
  const [focused, setFocused]         = useState(false);
  const aboutRef = useReveal();

  if (!crypto) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#111827', marginBottom: '16px' }}>Asset not found</h2>
          <Link to="/explore" style={{ color: '#7C3AED' }}>Back to Explore</Link>
        </div>
      </div>
    );
  }

  const fmt = (n) => '₵' + new Intl.NumberFormat('en-GH', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(n);
  const isPositive = crypto.change24h >= 0;
  const iconColor  = coinColors[crypto.id] || '#6B7280';

  const spend   = parseFloat(spendAmount) || 0;
  const receive = spend > 0 ? (spend / crypto.price).toFixed(6) : '0';
  const fee     = spend > 0 ? (spend * 0.006).toFixed(2) : '0.00';
  const total   = spend > 0 ? (spend + spend * 0.006).toFixed(2) : '0.00';

  const ORDER_TYPES = ['Market', 'Limit', 'Stop'];

  return (
    <div style={{ background: '#F9FAFB', minHeight: '100vh', padding: '32px 0 64px' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px' }}>

        {/* Main two-col */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: '24px', alignItems: 'start' }} className="asset-layout">

          {/* ── LEFT COLUMN ── */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }} className="hero-anim-left">

            {/* Header card */}
            <div style={{ background: '#fff', border: '1px solid #E5E7EB', borderRadius: '16px', padding: '28px 28px 24px', boxShadow: '0 1px 8px rgba(0,0,0,0.04)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }} className="asset-header-flex">
                <div style={{ width: 56, height: 56, borderRadius: '16px', background: iconColor, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <span style={{ color: '#fff', fontWeight: '800', fontSize: '1.125rem' }}>{crypto.symbol.slice(0,2).toUpperCase()}</span>
                </div>
                <div>
                  <h1 style={{ fontSize: '1.75rem', fontWeight: '800', color: '#111827', letterSpacing: '-0.025em', lineHeight: 1.2, margin: 0 }}>{crypto.name}</h1>
                  <span style={{ fontSize: '0.875rem', color: '#9CA3AF', fontWeight: '600' }}>{crypto.symbol}</span>
                </div>
                <div style={{ marginLeft: 'auto', textAlign: 'right' }} className="asset-price-group">
                  <p style={{ fontSize: '2rem', fontWeight: '800', color: '#111827', letterSpacing: '-0.03em', margin: 0, lineHeight: 1.1 }}>{fmt(crypto.price)}</p>
                  <span style={{ fontSize: '0.9375rem', fontWeight: '700', color: isPositive ? '#16A34A' : '#DC2626' }}>
                    {isPositive ? '+' : ''}{crypto.change24h.toFixed(2)}% <span style={{ fontSize: '0.8125rem', fontWeight: '500', color: '#9CA3AF' }}>24h</span>
                  </span>
                </div>
              </div>

              {/* Chart area */}
              <div style={{ background: '#F9FAFB', borderRadius: '12px', padding: '20px 20px 8px', marginBottom: '20px', position: 'relative', overflow: 'hidden' }}>
                {/* Time tabs */}
                <div style={{ display: 'flex', gap: '4px', marginBottom: '16px' }}>
                  {['1H','1D','1W','1M','1Y','All'].map((t, i) => (
                    <button key={t} style={{ padding: '4px 10px', fontSize: '0.75rem', fontWeight: '600', borderRadius: '6px', border: 'none', cursor: 'pointer', background: i === 1 ? '#7C3AED' : 'transparent', color: i === 1 ? '#fff' : '#6B7280' }}>{t}</button>
                  ))}
                </div>
                {/* SVG chart */}
                <div style={{ width: '100%', height: '140px', position: 'relative' }}>
                  <svg width="100%" height="140" viewBox="0 0 800 140" preserveAspectRatio="none">
                    <defs>
                      <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor={isPositive ? '#16A34A' : '#DC2626'} stopOpacity="0.14"/>
                        <stop offset="100%" stopColor={isPositive ? '#16A34A' : '#DC2626'} stopOpacity="0"/>
                      </linearGradient>
                    </defs>
                    {isPositive
                      ? <>
                          <path d="M0,120 C40,115 80,100 130,88 C180,76 220,82 270,66 C320,50 360,44 410,32 C460,20 500,28 550,16 C600,4 640,8 700,6 C740,5 770,7 800,5 L800,140 L0,140 Z" fill="url(#chartGrad)"/>
                          <path d="M0,120 C40,115 80,100 130,88 C180,76 220,82 270,66 C320,50 360,44 410,32 C460,20 500,28 550,16 C600,4 640,8 700,6 C740,5 770,7 800,5" fill="none" stroke={isPositive ? '#16A34A' : '#DC2626'} strokeWidth="2.5" strokeLinecap="round"/>
                        </>
                      : <>
                          <path d="M0,10 C40,12 80,20 130,32 C180,44 220,38 270,52 C320,66 360,72 410,86 C460,100 500,92 550,106 C600,118 640,115 700,120 C740,124 770,122 800,125 L800,140 L0,140 Z" fill="url(#chartGrad)"/>
                          <path d="M0,10 C40,12 80,20 130,32 C180,44 220,38 270,52 C320,66 360,72 410,86 C460,100 500,92 550,106 C600,118 640,115 700,120 C740,124 770,122 800,125" fill="none" stroke="#DC2626" strokeWidth="2.5" strokeLinecap="round"/>
                        </>
                    }
                    {/* Hover dot at end */}
                    <circle cx="800" cy={isPositive ? '5' : '125'} r="5" fill={isPositive ? '#16A34A' : '#DC2626'}/>
                    <circle cx="800" cy={isPositive ? '5' : '125'} r="9" fill={isPositive ? '#16A34A' : '#DC2626'} fillOpacity="0.2"/>
                  </svg>
                </div>
              </div>

              {/* Stats row */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' }} className="asset-stats-grid">
                {[
                  { label: 'Market Cap',   value: `₵${(crypto.marketCap / 1e9).toFixed(2)}B` },
                  { label: '24h Volume',   value: `₵${(crypto.volume24h / 1e9).toFixed(2)}B` },
                  { label: '24h High',     value: fmt(crypto.price * 1.018) },
                  { label: '24h Low',      value: fmt(crypto.price * 0.978) },
                ].map(({ label, value }) => (
                  <div key={label} style={{ background: '#F9FAFB', borderRadius: '10px', padding: '12px 14px', border: '1px solid #F3F4F6' }}>
                    <p style={{ fontSize: '0.7rem', fontWeight: '600', color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.05em', margin: '0 0 4px' }}>{label}</p>
                    <p style={{ fontSize: '0.9375rem', fontWeight: '700', color: '#111827', margin: 0 }}>{value}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* About card */}
            <div ref={aboutRef} style={{ background: '#fff', border: '1px solid #E5E7EB', borderRadius: '16px', padding: '24px 28px', boxShadow: '0 1px 8px rgba(0,0,0,0.04)' }} className="reveal reveal-fade-up">
              <h2 style={{ fontSize: '1.125rem', fontWeight: '700', color: '#111827', marginBottom: '12px' }}>About {crypto.name}</h2>
              <p style={{ fontSize: '0.9375rem', color: '#4B5563', lineHeight: '1.75', margin: 0 }}>{crypto.description}</p>
            </div>
          </div>

          {/* ── RIGHT COLUMN — Trade Panel ── */}
          <div style={{ background: '#fff', border: '1px solid #E5E7EB', borderRadius: '16px', boxShadow: '0 1px 8px rgba(0,0,0,0.04)', overflow: 'hidden', position: 'sticky', top: '80px' }} className="hero-anim-right">

            {/* Buy / Sell tabs */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', borderBottom: '1px solid #F3F4F6' }}>
              {['buy','sell'].map(tab => (
                <button
                  key={tab}
                  onClick={() => setTradeTab(tab)}
                  style={{ padding: '16px', background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.9375rem', fontWeight: '700', color: tradeTab === tab ? (tab === 'buy' ? '#7C3AED' : '#DC2626') : '#9CA3AF', borderBottom: tradeTab === tab ? `2px solid ${tab === 'buy' ? '#7C3AED' : '#DC2626'}` : '2px solid transparent', transition: 'all 0.15s' }}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>

            <div style={{ padding: '20px' }}>

              {/* Order type */}
              <div style={{ marginBottom: '16px' }}>
                <label style={{ fontSize: '0.75rem', fontWeight: '600', color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.04em', display: 'block', marginBottom: '6px' }}>Order Type</label>
                <div style={{ display: 'flex', gap: '6px' }}>
                  {ORDER_TYPES.map(t => (
                    <button
                      key={t}
                      onClick={() => setOrderType(t.toLowerCase())}
                      style={{ flex: 1, padding: '7px', fontSize: '0.8125rem', fontWeight: '600', borderRadius: '8px', border: '1.5px solid', borderColor: orderType === t.toLowerCase() ? '#7C3AED' : '#E5E7EB', background: orderType === t.toLowerCase() ? '#F5F3FF' : '#fff', color: orderType === t.toLowerCase() ? '#7C3AED' : '#374151', cursor: 'pointer' }}
                    >{t}</button>
                  ))}
                </div>
              </div>

              {/* Spend input */}
              <div style={{ marginBottom: '12px' }}>
                <label style={{ fontSize: '0.75rem', fontWeight: '600', color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.04em', display: 'block', marginBottom: '6px' }}>
                  {tradeTab === 'buy' ? 'Spend (GHS)' : 'Sell Amount (GHS)'}
                </label>
                <div style={{ display: 'flex', alignItems: 'center', border: `1.5px solid ${focused ? '#7C3AED' : '#E5E7EB'}`, borderRadius: '10px', overflow: 'hidden', transition: 'border-color 0.15s' }}>
                  <span style={{ padding: '0 12px', color: '#9CA3AF', fontSize: '1rem', fontWeight: '600', flexShrink: 0 }}>₵</span>
                  <input
                    type="number"
                    min="0"
                    placeholder="0.00"
                    value={spendAmount}
                    onChange={e => setSpendAmount(e.target.value)}
                    onFocus={() => setFocused(true)}
                    onBlur={() => setFocused(false)}
                    style={{ flex: 1, border: 'none', outline: 'none', padding: '13px 12px 13px 0', fontSize: '1rem', fontWeight: '600', color: '#111827', background: 'transparent' }}
                  />
                  <div style={{ display: 'flex', gap: '4px', padding: '0 10px', flexShrink: 0 }}>
                    {['₵395','₵1580','₵7900'].map(amt => (
                      <button key={amt} onClick={() => setSpendAmount(amt.replace('₵',''))}
                        style={{ padding: '4px 7px', fontSize: '0.7rem', fontWeight: '700', borderRadius: '6px', border: '1px solid #E5E7EB', background: '#F9FAFB', color: '#374151', cursor: 'pointer' }}>
                        {amt}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Receive display */}
              <div style={{ background: '#F9FAFB', border: '1px solid #F3F4F6', borderRadius: '10px', padding: '12px 14px', marginBottom: '16px' }}>
                <p style={{ fontSize: '0.75rem', fontWeight: '600', color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.04em', margin: '0 0 4px' }}>
                  {tradeTab === 'buy' ? `Receive (${crypto.symbol})` : 'Receive (GHS)'}
                </p>
                <p style={{ fontSize: '1.125rem', fontWeight: '700', color: '#111827', margin: 0 }}>
                  {tradeTab === 'buy'
                    ? `${receive} ${crypto.symbol}`
                    : `₵${spend > 0 ? (spend - spend * 0.006).toFixed(2) : '0.00'}`}
                </p>
              </div>

              {/* Price & fee breakdown */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '20px', padding: '12px 14px', background: '#FAFAFA', borderRadius: '10px', border: '1px solid #F3F4F6' }}>
                {[
                  { label: `${crypto.symbol} price`, value: fmt(crypto.price) },
                  { label: 'Coinbase fee (0.6%)', value: `₵${fee}` },
                  { label: 'Total', value: `₵${total}`, bold: true },
                ].map(({ label, value, bold }) => (
                  <div key={label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.8125rem', color: '#6B7280', fontWeight: bold ? '700' : '500' }}>{label}</span>
                    <span style={{ fontSize: '0.8125rem', color: bold ? '#111827' : '#374151', fontWeight: bold ? '700' : '600' }}>{value}</span>
                  </div>
                ))}
              </div>

              {/* CTA button */}
              <button
                style={{
                  width: '100%', padding: '14px', borderRadius: '10px', border: 'none', cursor: 'pointer',
                  fontWeight: '700', fontSize: '0.9375rem',
                  background: tradeTab === 'buy' ? '#7C3AED' : '#DC2626',
                  color: '#fff',
                  opacity: spend <= 0 ? 0.55 : 1,
                }}
                onMouseEnter={e => { if (spend > 0) e.currentTarget.style.filter = 'brightness(0.92)'; }}
                onMouseLeave={e => { e.currentTarget.style.filter = 'none'; }}
              >
                {tradeTab === 'buy' ? `Buy ${crypto.symbol}` : `Sell ${crypto.symbol}`}
              </button>

              {/* Disclaimer */}
              <p style={{ fontSize: '0.7rem', color: '#9CA3AF', textAlign: 'center', marginTop: '12px', lineHeight: '1.5', margin: '12px 0 0' }}>
                By placing this order you agree to our{' '}
                <Link to="/learn" style={{ color: '#7C3AED', textDecoration: 'none' }}>User Agreement</Link>.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AssetDetail;

