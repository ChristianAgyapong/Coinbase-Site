import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { cryptoData } from '../data/cryptoData';

/* Convenience wrapper component */
function Reveal({ children, variant = 'reveal-fade-up', delay = '', className = '', style = {} }) {
  const ref = useReveal();
  return (
    <div
      ref={ref}
      className={`reveal ${variant} ${delay} ${className}`}
      style={style}
    >
      {children}
    </div>
  );
}

/* â”€â”€â”€ Data â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
const coinColors = {
  bitcoin:        '#F59E0B',
  ethereum:       '#6366F1',
  tether:         '#14B8A6',
  'binance-coin': '#EAB308',
  solana:         '#8B5CF6',
  'usd-coin':     '#3B82F6',
  cardano:        '#1D4ED8',
  ripple:         '#0EA5E9',
  dogecoin:       '#F59E0B',
  polkadot:       '#EC4899',
};

const CANDLES = [
  [20,80,65,72,88],[36,70,55,62,78],[52,90,72,76,92],[68,65,50,55,70],
  [84,55,40,42,60],[100,45,30,32,50],[116,50,35,38,55],[132,40,22,26,44],
  [148,35,18,21,38],[164,28,15,17,32],[180,22,10,13,26],[196,18,8,10,22],
  [212,25,12,15,28],[228,30,16,20,34],[244,22,10,14,26],[260,15,5,8,18],
  [276,10,2,4,14],[292,18,8,11,22],[308,12,3,6,16],[324,8,1,2,12],[340,5,1,1,8],
];

const FEATURES = [
  {
    icon: <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>,
    title: 'Advanced Charting',
    desc:  'Access 100+ technical indicators, drawing tools, and multiple chart types including candlestick, line, and bar.',
  },
  {
    icon: <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="3" width="20" height="14" rx="2"/><polyline points="8 21 12 17 16 21"/></svg>,
    title: 'Real-Time Order Books',
    desc:  'See live bids and asks with depth charts that update in milliseconds across all supported trading pairs.',
  },
  {
    icon: <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>,
    title: 'Multiple Order Types',
    desc:  'Place market, limit, stop-limit, and trailing stop orders to execute your strategy with precision.',
  },
  {
    icon: <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
    title: 'Institutional Security',
    desc:  'Cold storage, 2FA, and FDIC-insured USD balances keep your assets protected around the clock.',
  },
  {
    icon: <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>,
    title: 'Deep Liquidity',
    desc:  'Trade with tight spreads and minimal slippage thanks to one of the deepest order books in the industry.',
  },
  {
    icon: <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 3h18v18H3z"/><path d="M21 9H3"/><path d="M21 15H3"/><path d="M12 3v18"/></svg>,
    title: 'API Access',
    desc:  'Build and run automated trading strategies with our robust REST and WebSocket APIs.',
  },
];

const BIDS = [['43,210','1.24','53,012.40'],['43,190','0.85','36,711.50'],['43,170','2.10','90,657.00'],['43,155','0.62','26,756.10'],['43,140','1.45','62,553.00']];
const ASKS = [['43,230','0.92','39,771.60'],['43,250','1.55','67,037.50'],['43,270','0.44','19,038.80'],['43,285','0.78','33,762.30'],['43,300','1.20','51,960.00']];

const TIMEFRAMES  = ['1H','1D','1W','1M','1Y'];
const ORDER_TYPES = ['Market','Limit','Stop-Limit'];

const TICKER_ITEMS = [
  { sym: 'BTC', price: '$43,218', chg: '+2.45%', pos: true },
  { sym: 'ETH', price: '$3,542',  chg: '+3.67%', pos: true },
  { sym: 'SOL', price: '$178.42', chg: '+5.23%', pos: true },
  { sym: 'BNB', price: '$612.85', chg: '+1.89%', pos: true },
  { sym: 'ADA', price: '$0.68',   chg: '-1.23%', pos: false },
  { sym: 'XRP', price: '$0.52',   chg: '+1.45%', pos: true },
  { sym: 'DOGE',price: '$0.15',   chg: '-2.34%', pos: false },
  { sym: 'DOT', price: '$7.28',   chg: '+3.12%', pos: true },
];

/* â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
   Sub-components
â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */

/* Live ticker tape at the very top */
function TickerTape() {
  const items = [...TICKER_ITEMS, ...TICKER_ITEMS]; // duplicate for seamless loop
  return (
    <div
      className="ticker-wrap"
      style={{ background: '#0A0B0D', padding: '10px 0', borderBottom: '1px solid #1F2937' }}
    >
      <div className="ticker-inner">
        {items.map((item, i) => (
          <span
            key={i}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '0 28px', fontSize: '12px' }}
          >
            <span style={{ color: '#9CA3AF', fontWeight: '700' }}>{item.sym}</span>
            <span style={{ color: '#E5E7EB', fontWeight: '600', fontVariantNumeric: 'tabular-nums' }}>{item.price}</span>
            <span style={{ color: item.pos ? '#22C55E' : '#EF4444', fontWeight: '600' }}>{item.chg}</span>
            <span style={{ color: '#374151', fontSize: '14px' }}>Â·</span>
          </span>
        ))}
      </div>
    </div>
  );
}

function HeroChart({ activeTime, setActiveTime }) {
  return (
    <div
      className="hero-anim-left"
      style={{ background: '#0A0B0D', borderRadius: '20px', overflow: 'hidden', boxShadow: '0 32px 72px rgba(0,0,0,0.30)' }}
    >
      <div style={{ padding: '16px 20px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <div style={{ width: 26, height: 26, borderRadius: '50%', background: '#F59E0B', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ color: '#fff', fontSize: '10px', fontWeight: '900' }}>BT</span>
          </div>
          <span style={{ color: '#E5E7EB', fontSize: '13px', fontWeight: '700' }}>BTC-USD</span>
          <span style={{ color: '#22C55E', fontSize: '12px', fontWeight: '600' }}>+2.4%</span>
        </div>
        <div style={{ display: 'flex', gap: '4px' }}>
          {TIMEFRAMES.map(t => (
            <button
              key={t}
              onClick={() => setActiveTime(t)}
              style={{
                fontSize: '11px', fontWeight: '600', padding: '3px 9px', borderRadius: '5px',
                border: 'none', cursor: 'pointer',
                background: activeTime === t ? '#374151' : 'transparent',
                color:      activeTime === t ? '#fff'    : '#6B7280',
                transition: 'background 0.2s, color 0.2s',
              }}
            >{t}</button>
          ))}
        </div>
      </div>

      <div style={{ padding: '10px 20px 0' }}>
        <p style={{ color: '#fff', fontSize: '24px', fontWeight: '800', margin: 0, letterSpacing: '-0.02em' }}>$43,218.50</p>
        <p style={{ color: '#22C55E', fontSize: '12px', margin: '2px 0 8px', fontWeight: '600' }}>â–² $1,032.10 (+2.45%)</p>
      </div>

      <svg viewBox="0 0 380 140" width="100%" height="140" preserveAspectRatio="none" style={{ display: 'block' }}>
        {CANDLES.map(([x, hi, lo, o, c]) => {
          const isGreen = c > o;
          const col     = isGreen ? '#22C55E' : '#EF4444';
          return (
            <g key={x}>
              <line x1={x+4} y1={hi} x2={x+4} y2={lo} stroke={col} strokeWidth="1" />
              <rect x={x} y={Math.min(o,c)} width="8" height={Math.abs(c-o)||2} fill={col} rx="1" />
            </g>
          );
        })}
      </svg>

      <div style={{ margin: '0 14px 14px', background: '#111213', borderRadius: '12px', padding: '12px 14px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
          {[{ label:'BIDS', rows:BIDS.slice(0,3), color:'#22C55E' }, { label:'ASKS', rows:ASKS.slice(0,3), color:'#EF4444' }].map(({ label, rows, color }) => (
            <div key={label}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', marginBottom: '6px' }}>
                <span style={{ fontSize: '9px', color: '#6B7280', fontWeight: '700', letterSpacing: '0.06em' }}>{label}</span>
                <span style={{ fontSize: '9px', color: '#6B7280', fontWeight: '700', letterSpacing: '0.06em', textAlign: 'right' }}>SIZE</span>
              </div>
              {rows.map(([p, s]) => (
                <div key={p} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <span style={{ fontSize: '11px', color, fontVariantNumeric: 'tabular-nums' }}>{p}</span>
                  <span style={{ fontSize: '11px', color: '#9CA3AF' }}>{s}</span>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
   Main page
â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
function AdvancedTrading() {
  const [activeTime, setActiveTime] = useState('1D');
  const [orderType,  setOrderType]  = useState('Market');
  const [tradeTab,   setTradeTab]   = useState('buy');
  const [amount,     setAmount]     = useState('');
  const [obTab,      setObTab]      = useState('both');

  const fmt    = (n) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(n);
  const fmtPct = (n) => `${n >= 0 ? '+' : ''}${n.toFixed(2)}%`;

  const estimatedReceive = amount ? (parseFloat(amount) / 43218.5).toFixed(6) : '0';
  const fee              = amount ? (parseFloat(amount) * 0.006).toFixed(2)   : '0.00';
  const total            = amount ? (parseFloat(amount) * 1.006).toFixed(2)   : '0.00';

  return (
    <div style={{ background: '#F9FAFB', minHeight: '100vh' }}>

      {/* â”€â”€ Ticker tape â”€â”€ */}
      <TickerTape />

      {/* â•â• HERO â•â• */}
      <section style={{ background: '#fff', padding: '80px 0', borderBottom: '1px solid #F3F4F6' }}>
        <div
          style={{ maxWidth: '1160px', margin: '0 auto', padding: '0 24px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '64px', alignItems: 'center' }}
          className="hero-grid"
        >
          <HeroChart activeTime={activeTime} setActiveTime={setActiveTime} />

          {/* Hero copy â€” staggered load-in animations */}
          <div className="hero-anim-right">
            <h1
              className="hero-anim-up hero-delay-1"
              style={{ fontSize: 'clamp(2rem, 4vw, 3.25rem)', fontWeight: '800', color: '#111827', lineHeight: '1.1', letterSpacing: '-0.03em', marginBottom: '18px' }}
            >
              Powerful tools,<br />designed<br />for the advanced<br />trader.
            </h1>
            <p
              className="hero-anim-up hero-delay-2"
              style={{ fontSize: '1rem', color: '#D97706', fontWeight: '600', marginBottom: '14px', lineHeight: '1.65' }}
            >
              Powerful analytical tools with the safety and security of Coinbase deliver the ultimate trading experience.
            </p>
            <p
              className="hero-anim-up hero-delay-3"
              style={{ fontSize: '0.9375rem', color: '#6B7280', lineHeight: '1.75', marginBottom: '36px' }}
            >
              Tap into sophisticated charting capabilities, real-time order books, and deep liquidity across hundreds of markets.
            </p>
            <div className="hero-anim-up hero-delay-4" style={{ display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
              <Link
                to="/signup"
                className="at-btn-pulse"
                style={{
                  display: 'inline-block', background: '#111827', color: '#fff',
                  fontWeight: '700', fontSize: '0.9375rem', padding: '14px 30px',
                  borderRadius: '99px', textDecoration: 'none',
                  transition: 'background 0.2s, transform 0.2s',
                }}
                onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.04)'}
                onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
              >
                Start trading
              </Link>
              <Link
                to="/explore"
                style={{
                  display: 'inline-block', background: 'transparent', color: '#111827',
                  fontWeight: '700', fontSize: '0.9375rem', padding: '14px 30px',
                  borderRadius: '99px', textDecoration: 'none', border: '2px solid #E5E7EB',
                  transition: 'border-color 0.2s, background 0.2s, transform 0.2s',
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = '#111827'; e.currentTarget.style.transform = 'scale(1.04)'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = '#E5E7EB'; e.currentTarget.style.transform = 'scale(1)'; }}
              >
                Explore markets
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* â•â• LIVE ORDER BOOK + QUICK TRADE â•â• */}
      <section style={{ padding: '80px 0', background: '#fff', borderBottom: '1px solid #F3F4F6' }}>
        <div style={{ maxWidth: '1160px', margin: '0 auto', padding: '0 24px' }}>

          <Reveal variant="reveal-fade-up">
            <span style={{ fontSize: '12px', fontWeight: '700', color: '#7C3AED', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Live trading</span>
            <h2 style={{ fontSize: 'clamp(1.5rem, 3vw, 2.25rem)', fontWeight: '800', color: '#111827', marginTop: '6px', letterSpacing: '-0.025em', marginBottom: '36px' }}>
              Full-depth order book
            </h2>
          </Reveal>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: '24px', alignItems: 'start' }} className="asset-layout">

            {/* Order Book */}
            <Reveal variant="reveal-left">
              <div style={{ background: '#fff', border: '1px solid #E5E7EB', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 1px 8px rgba(0,0,0,0.04)' }}>
                <div style={{ display: 'flex', borderBottom: '1px solid #F3F4F6', padding: '14px 20px 0', gap: '20px' }}>
                  {['both','bids','asks'].map(t => (
                    <button
                      key={t}
                      onClick={() => setObTab(t)}
                      style={{
                        background: 'none', border: 'none', cursor: 'pointer', paddingBottom: '12px',
                        fontSize: '13px', fontWeight: '600', textTransform: 'capitalize',
                        color:       obTab === t ? '#111827' : '#9CA3AF',
                        borderBottom: obTab === t ? '2px solid #111827' : '2px solid transparent',
                        transition: 'color 0.2s, border-color 0.2s',
                      }}
                    >{t === 'both' ? 'Order Book' : t}</button>
                  ))}
                </div>
                <div style={{ padding: '16px 20px' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px', marginBottom: '10px' }}>
                    {['Price (USD)','Amount (BTC)','Total'].map(h => (
                      <span key={h} style={{ fontSize: '11px', color: '#9CA3AF', fontWeight: '600' }}>{h}</span>
                    ))}
                  </div>
                  {obTab !== 'bids' && ASKS.map(([p, s, tot]) => (
                    <div key={p} className="at-row-hover" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px', padding: '6px 4px', borderRadius: '6px' }}>
                      <span style={{ fontSize: '13px', color: '#EF4444', fontVariantNumeric: 'tabular-nums', fontWeight: '600' }}>{p}</span>
                      <span style={{ fontSize: '13px', color: '#374151', fontVariantNumeric: 'tabular-nums' }}>{s}</span>
                      <span style={{ fontSize: '13px', color: '#374151', fontVariantNumeric: 'tabular-nums' }}>{tot}</span>
                    </div>
                  ))}
                  {obTab === 'both' && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '8px 0', borderTop: '1px solid #F3F4F6', borderBottom: '1px solid #F3F4F6', margin: '4px 0' }}>
                      <span style={{ fontSize: '12px', color: '#9CA3AF' }}>Spread</span>
                      <span style={{ fontSize: '12px', fontWeight: '700', color: '#374151' }}>$12.00 (0.028%)</span>
                    </div>
                  )}
                  {obTab !== 'asks' && BIDS.map(([p, s, tot]) => (
                    <div key={p} className="at-row-hover" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px', padding: '6px 4px', borderRadius: '6px' }}>
                      <span style={{ fontSize: '13px', color: '#22C55E', fontVariantNumeric: 'tabular-nums', fontWeight: '600' }}>{p}</span>
                      <span style={{ fontSize: '13px', color: '#374151', fontVariantNumeric: 'tabular-nums' }}>{s}</span>
                      <span style={{ fontSize: '13px', color: '#374151', fontVariantNumeric: 'tabular-nums' }}>{tot}</span>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>

            {/* Trade Panel */}
            <Reveal variant="reveal-right" delay="reveal-delay-1">
              <div style={{ background: '#fff', border: '1px solid #E5E7EB', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 1px 8px rgba(0,0,0,0.04)' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr' }}>
                  {['buy','sell'].map(t => (
                    <button
                      key={t}
                      onClick={() => setTradeTab(t)}
                      style={{
                        padding: '16px', border: 'none', cursor: 'pointer', fontWeight: '700', fontSize: '14px',
                        transition: 'background 0.25s, color 0.25s',
                        background: tradeTab === t ? (t === 'buy' ? '#DCFCE7' : '#FEE2E2') : '#F9FAFB',
                        color:      tradeTab === t ? (t === 'buy' ? '#16A34A' : '#DC2626') : '#9CA3AF',
                        borderBottom: tradeTab === t ? `2px solid ${t === 'buy' ? '#16A34A' : '#DC2626'}` : '2px solid #F3F4F6',
                      }}
                    >{t === 'buy' ? 'Buy BTC' : 'Sell BTC'}</button>
                  ))}
                </div>
                <div style={{ padding: '20px' }}>
                  <div style={{ display: 'flex', gap: '6px', marginBottom: '18px' }}>
                    {ORDER_TYPES.map(ot => (
                      <button
                        key={ot}
                        onClick={() => setOrderType(ot)}
                        style={{
                          flex: 1, padding: '7px 4px', borderRadius: '8px', fontSize: '11px', fontWeight: '600', cursor: 'pointer',
                          transition: 'background 0.2s, color 0.2s, border-color 0.2s',
                          border: `1px solid ${orderType === ot ? '#111827' : '#E5E7EB'}`,
                          background: orderType === ot ? '#111827' : '#fff',
                          color:      orderType === ot ? '#fff'    : '#374151',
                        }}
                      >{ot}</button>
                    ))}
                  </div>

                  <label style={{ fontSize: '12px', fontWeight: '600', color: '#374151', display: 'block', marginBottom: '6px' }}>Amount (USD)</label>
                  <div style={{ position: 'relative', marginBottom: '14px' }}>
                    <span style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#9CA3AF', fontWeight: '700' }}>$</span>
                    <input
                      type="number"
                      value={amount}
                      onChange={e => setAmount(e.target.value)}
                      placeholder="0.00"
                      style={{
                        width: '100%', padding: '11px 14px 11px 28px',
                        border: '1.5px solid #E5E7EB', borderRadius: '10px',
                        fontSize: '14px', fontWeight: '600', outline: 'none', boxSizing: 'border-box',
                        transition: 'border-color 0.2s',
                      }}
                      onFocus={e  => e.target.style.borderColor = '#7C3AED'}
                      onBlur={e   => e.target.style.borderColor = '#E5E7EB'}
                    />
                  </div>

                  <div style={{ background: '#F9FAFB', borderRadius: '10px', padding: '12px 14px', marginBottom: '16px' }}>
                    {[['You receive', `${estimatedReceive} BTC`], ['Coinbase fee', `$${fee}`], ['Total', `$${total}`]].map(([k, v]) => (
                      <div key={k} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                        <span style={{ fontSize: '12px', color: '#9CA3AF' }}>{k}</span>
                        <span style={{ fontSize: '12px', fontWeight: '700', color: '#111827' }}>{v}</span>
                      </div>
                    ))}
                  </div>

                  <Link
                    to="/signup"
                    style={{
                      display: 'block', textAlign: 'center',
                      background: tradeTab === 'buy' ? '#7C3AED' : '#EF4444',
                      color: '#fff', fontWeight: '700', fontSize: '14px',
                      padding: '13px', borderRadius: '10px', textDecoration: 'none',
                      transition: 'opacity 0.2s, transform 0.2s',
                    }}
                    onMouseEnter={e => e.currentTarget.style.opacity = '0.88'}
                    onMouseLeave={e => e.currentTarget.style.opacity = '1'}
                  >
                    {tradeTab === 'buy' ? 'Buy BTC' : 'Sell BTC'}
                  </Link>
                  <p style={{ fontSize: '11px', color: '#9CA3AF', textAlign: 'center', marginTop: '10px', lineHeight: '1.5' }}>
                    Sign in or create an account to start trading
                  </p>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* â•â• FEATURES GRID â•â• */}
      <section style={{ padding: '80px 0', background: '#F9FAFB', borderBottom: '1px solid #F3F4F6' }}>
        <div style={{ maxWidth: '1160px', margin: '0 auto', padding: '0 24px' }}>
          <Reveal variant="reveal-fade-up" style={{ textAlign: 'center', marginBottom: '56px' }}>
            <span style={{ fontSize: '12px', fontWeight: '700', color: '#7C3AED', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Why advanced?</span>
            <h2 style={{ fontSize: 'clamp(1.75rem, 3.5vw, 2.75rem)', fontWeight: '800', color: '#111827', marginTop: '8px', letterSpacing: '-0.025em' }}>
              Everything you need to trade like a pro
            </h2>
          </Reveal>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px' }} className="features-grid">
            {FEATURES.map(({ icon, title, desc }, i) => {
              const delays = ['reveal-delay-1','reveal-delay-2','reveal-delay-3','reveal-delay-4','reveal-delay-5','reveal-delay-6'];
              return (
                <Reveal key={title} variant="reveal-scale" delay={delays[i]}>
                  <div
                    className="at-card"
                    style={{
                      background: '#fff', border: '1px solid #E5E7EB', borderRadius: '16px',
                      padding: '28px 24px', boxShadow: '0 1px 4px rgba(0,0,0,0.04)', height: '100%',
                    }}
                  >
                    <div style={{ width: 52, height: 52, borderRadius: '14px', background: '#F5F3FF', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#7C3AED', marginBottom: '16px' }}>
                      {icon}
                    </div>
                    <h3 style={{ fontSize: '1rem', fontWeight: '700', color: '#111827', marginBottom: '8px' }}>{title}</h3>
                    <p style={{ fontSize: '0.875rem', color: '#6B7280', lineHeight: '1.65', margin: 0 }}>{desc}</p>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* â•â• MARKETS TABLE â•â• */}
      <section style={{ padding: '72px 0', background: '#fff', borderBottom: '1px solid #F3F4F6' }}>
        <div style={{ maxWidth: '1160px', margin: '0 auto', padding: '0 24px' }}>
          <Reveal variant="reveal-fade-up">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '28px', flexWrap: 'wrap', gap: '12px' }}>
              <div>
                <span style={{ fontSize: '12px', fontWeight: '700', color: '#7C3AED', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Markets</span>
                <h2 style={{ fontSize: 'clamp(1.5rem, 3vw, 2.25rem)', fontWeight: '800', color: '#111827', marginTop: '6px', letterSpacing: '-0.025em' }}>
                  Trade hundreds of assets
                </h2>
              </div>
              <Link to="/explore" style={{ fontSize: '14px', fontWeight: '600', color: '#7C3AED', textDecoration: 'none' }}>View all markets â†’</Link>
            </div>
          </Reveal>

          <Reveal variant="reveal-fade-up" delay="reveal-delay-1">
            <div style={{ border: '1px solid #E5E7EB', borderRadius: '16px', overflow: 'hidden', background: '#fff', boxShadow: '0 1px 8px rgba(0,0,0,0.04)' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1.5fr 1fr 1.5fr 1fr', padding: '14px 24px', background: '#F9FAFB', borderBottom: '1px solid #E5E7EB' }}>
                {['Name','Price','24h Change','Market Cap',''].map(h => (
                  <span key={h} style={{ fontSize: '11px', color: '#9CA3AF', fontWeight: '700', letterSpacing: '0.04em' }}>{h}</span>
                ))}
              </div>
              {cryptoData.map((coin, idx) => {
                const isPos = coin.change24h >= 0;
                const color = coinColors[coin.id] || '#6B7280';
                return (
                  <Link to={`/asset/${coin.id}`} key={coin.id} style={{ textDecoration: 'none' }}>
                    <div
                      className="at-row-hover"
                      style={{
                        display: 'grid', gridTemplateColumns: '2fr 1.5fr 1fr 1.5fr 1fr',
                        padding: '16px 24px', cursor: 'pointer',
                        borderBottom: idx < cryptoData.length - 1 ? '1px solid #F3F4F6' : 'none',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{ width: 36, height: 36, borderRadius: '50%', background: color, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                          <span style={{ color: '#fff', fontWeight: '800', fontSize: '11px' }}>{coin.symbol.slice(0,2)}</span>
                        </div>
                        <div>
                          <p style={{ fontSize: '14px', fontWeight: '700', color: '#111827', margin: 0 }}>{coin.name}</p>
                          <p style={{ fontSize: '12px', color: '#9CA3AF', margin: 0 }}>{coin.symbol}</p>
                        </div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        <span style={{ fontSize: '14px', fontWeight: '600', color: '#111827', fontVariantNumeric: 'tabular-nums' }}>{fmt(coin.price)}</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        <span style={{ fontSize: '13px', fontWeight: '600', color: isPos ? '#16A34A' : '#DC2626', fontVariantNumeric: 'tabular-nums' }}>{fmtPct(coin.change24h)}</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        <span style={{ fontSize: '13px', color: '#374151', fontVariantNumeric: 'tabular-nums' }}>${(coin.marketCap / 1e9).toFixed(1)}B</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                        <span style={{ fontSize: '12px', fontWeight: '700', color: '#7C3AED', background: '#F5F3FF', padding: '6px 14px', borderRadius: '99px', transition: 'background 0.2s, color 0.2s' }}>Trade</span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </Reveal>
        </div>
      </section>

      {/* â•â• STATS BAND â•â• */}
      <section style={{ padding: '72px 0', background: '#0A0B0D' }}>
        <div style={{ maxWidth: '1160px', margin: '0 auto', padding: '0 24px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '32px', textAlign: 'center' }} className="stats-grid">
            {[
              { value: '$150B+', label: 'Trading volume per quarter' },
              { value: '200+',   label: 'Tradable assets' },
              { value: '0.5%',   label: 'Average spread' },
            ].map(({ value, label }, i) => {
              const delays = ['reveal-delay-1', 'reveal-delay-2', 'reveal-delay-3'];
              return (
                <Reveal key={value} variant="reveal-fade-up" delay={delays[i]}>
                  <p style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: '800', color: '#fff', margin: '0 0 6px', letterSpacing: '-0.03em' }}>{value}</p>
                  <p style={{ fontSize: '0.9375rem', color: '#9CA3AF', margin: 0 }}>{label}</p>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* â•â• CTA BANNER â•â• */}
      <section style={{ padding: '88px 0', background: '#7C3AED' }}>
        <div style={{ maxWidth: '700px', margin: '0 auto', padding: '0 24px', textAlign: 'center' }}>
          <Reveal variant="reveal-scale">
            <h2 style={{ fontSize: 'clamp(1.75rem, 4vw, 2.75rem)', fontWeight: '800', color: '#fff', letterSpacing: '-0.025em', marginBottom: '16px', lineHeight: '1.2' }}>
              Ready to trade like a pro?
            </h2>
            <p style={{ fontSize: '1rem', color: 'rgba(255,255,255,0.80)', marginBottom: '36px', lineHeight: '1.7' }}>
              Join millions of traders on the most trusted crypto exchange and start using advanced tools today.
            </p>
            <div style={{ display: 'flex', gap: '14px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link
                to="/signup"
                style={{
                  display: 'inline-block', background: '#fff', color: '#7C3AED',
                  fontWeight: '700', fontSize: '1rem', padding: '14px 32px',
                  borderRadius: '99px', textDecoration: 'none',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.05)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.18)'; }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)';    e.currentTarget.style.boxShadow = 'none'; }}
              >
                Create free account
              </Link>
              <Link
                to="/explore"
                style={{
                  display: 'inline-block', background: 'transparent', color: '#fff',
                  fontWeight: '700', fontSize: '1rem', padding: '14px 32px',
                  borderRadius: '99px', textDecoration: 'none', border: '2px solid rgba(255,255,255,0.45)',
                  transition: 'border-color 0.2s, transform 0.2s',
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = '#fff'; e.currentTarget.style.transform = 'scale(1.05)'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.45)'; e.currentTarget.style.transform = 'scale(1)'; }}
              >
                Explore markets
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

    </div>
  );
}

export default AdvancedTrading;
