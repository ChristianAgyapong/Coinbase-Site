import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { cryptoData } from '../data/cryptoData';
import { useAuth } from '../context/AuthContext';

// ── Static portfolio data ─────────────────────────────────────
const PORTFOLIO_ASSETS = [
  { name: 'Crypto',       initial: '₿', color: '#D97706', bg: '#FEF3C7', value: 14186.12, change: null   },
  { name: 'Stocks',       initial: 'S', color: '#2563EB', bg: '#DBEAFE', value: 8133.98,  change: null   },
  { name: 'Derivatives',  initial: 'D', color: '#7C3AED', bg: '#EDE9FE', value: 148.84,   change: 148.84 },
  { name: 'Predictions',  initial: 'P', color: '#059669', bg: '#D1FAE5', value: 42.69,    change: 42.69  },
  { name: 'Cash',         initial: '$', color: '#0891B2', bg: '#CFFAFE', value: 10124.22, change: null   },
];

const RECENT_TXS = [
  { type: 'Buy',  coin: 'Bitcoin',  symbol: 'BTC', amount: '0.0124 BTC', value: 841.28,   date: 'Today, 9:42 AM' },
  { type: 'Sell', coin: 'Ethereum', symbol: 'ETH', amount: '0.5 ETH',    value: 1771.09,  date: 'Yesterday'      },
  { type: 'Buy',  coin: 'Solana',   symbol: 'SOL', amount: '4.2 SOL',    value: 749.43,   date: 'Mar 5'          },
  { type: 'Buy',  coin: 'Cardano',  symbol: 'ADA', amount: '1,200 ADA',  value: 816.00,   date: 'Mar 3'          },
];

const PERIODS = ['1H', '1D', '1W', '1M', '1Y', 'All'];

// Smooth upward chart path (viewBox 0 0 600 160)
const CHART_PATH = 'M0 142 C30 135,60 125,95 115 S145 120,175 108 S220 90,255 78 S295 88,325 72 S370 52,405 44 S450 48,480 35 S530 28,560 22 S585 20,600 18';
const CHART_FILL = CHART_PATH + ' L600 160 L0 160 Z';

// ── Reveal hook/component ─────────────────────────────────────
function useReveal() {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { el.classList.add('is-visible'); obs.unobserve(el); } },
      { threshold: 0.05 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return ref;
}

function Reveal({ children, className = 'reveal-fade-up', delay = 0, style = {} }) {
  const ref = useReveal();
  return (
    <div ref={ref} className={`reveal ${className}`} style={{ transitionDelay: `${delay}ms`, ...style }}>
      {children}
    </div>
  );
}

// ── Dashboard ─────────────────────────────────────────────────
export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activePeriod, setActivePeriod] = useState('1D');
  const [activeTab, setActiveTab] = useState('buy');
  const [selectedCoin, setSelectedCoin] = useState('bitcoin');
  const [buyAmount, setBuyAmount] = useState('');

  const selectedCoinData = cryptoData.find(c => c.id === selectedCoin);
  const estimatedReceive = buyAmount && selectedCoinData
    ? (parseFloat(buyAmount) / selectedCoinData.price).toFixed(6)
    : null;

  const displayName = user?.email?.split('@')[0] ?? 'there';

  return (
    <div style={{ background: '#F3F4F6', minHeight: 'calc(100vh - 65px)' }}>

      {/* ── Page header ── */}
      <div style={{ background: '#fff', borderBottom: '1px solid #E5E7EB' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '20px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <h1 style={{ fontSize: 'clamp(1.1rem,3vw,1.375rem)', fontWeight: '800', color: '#111827', margin: 0, letterSpacing: '-0.02em' }}>
              Good morning, <span style={{ color: '#1652F0' }}>{displayName}</span> 👋
            </h1>
            <p style={{ color: '#6B7280', fontSize: '0.875rem', margin: '3px 0 0', fontWeight: '500' }}>
              March 8, 2026 · Your portfolio at a glance
            </p>
          </div>
          <Link to="/explore" style={{ padding: '7px 16px', background: '#F3F4F6', color: '#6B7280', borderRadius: '8px', fontWeight: '600', fontSize: '0.8125rem', textDecoration: 'none', border: '1px solid #E5E7EB' }}>
            Explore Markets
          </Link>
        </div>
      </div>

      {/* ── Main 2-column grid ── */}
      <div
        className="dashboard-grid"
        style={{ maxWidth: '1280px', margin: '0 auto', padding: '28px 24px', display: 'grid', gridTemplateColumns: 'minmax(0,1.6fr) 360px', gap: '22px', alignItems: 'start' }}
      >
        {/* ────────── LEFT COLUMN ────────── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

          {/* Portfolio card */}
          <Reveal delay={0}>
            <div style={{ background: '#fff', borderRadius: '20px', border: '1px solid #E5E7EB', overflow: 'hidden' }}>
              <div style={{ padding: '26px 28px 0' }}>
                <p style={{ color: '#9CA3AF', fontSize: '0.75rem', fontWeight: '700', margin: '0 0 4px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Total Portfolio Value</p>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '14px', flexWrap: 'wrap' }}>
                  <span style={{ fontSize: 'clamp(1.75rem,4vw,2.25rem)', fontWeight: '800', color: '#111827', letterSpacing: '-0.03em' }}>$33,683.80</span>
                  <span style={{ color: '#22C55E', fontWeight: '700', fontSize: '0.9375rem' }}>▲ $131.36 (1.38%) today</span>
                </div>
                {/* Period selector */}
                <div style={{ display: 'flex', gap: '3px', marginTop: '20px', marginBottom: '4px' }}>
                  {PERIODS.map(p => (
                    <button
                      key={p}
                      onClick={() => setActivePeriod(p)}
                      style={{ padding: '5px 12px', borderRadius: '99px', border: 'none', cursor: 'pointer', fontWeight: '700', fontSize: '0.8125rem', background: activePeriod === p ? '#1652F0' : 'transparent', color: activePeriod === p ? '#fff' : '#6B7280', transition: 'all 0.15s' }}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>

              {/* Chart */}
              <div style={{ padding: '4px 0 0' }}>
                <svg viewBox="0 0 600 160" style={{ width: '100%', height: '130px', display: 'block' }} preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#1652F0" stopOpacity="0.16" />
                      <stop offset="100%" stopColor="#1652F0" stopOpacity="0.01" />
                    </linearGradient>
                  </defs>
                  <path d={CHART_FILL} fill="url(#chartGrad)" />
                  <path d={CHART_PATH} fill="none" stroke="#1652F0" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>

              {/* Asset breakdown */}
              <div style={{ padding: '4px 28px 22px', borderTop: '1px solid #F3F4F6' }}>
                {PORTFOLIO_ASSETS.map((a) => (
                  <div key={a.name} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '13px 0', borderBottom: '1px solid #F9FAFB' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{ width: 36, height: 36, borderRadius: '50%', background: a.bg, color: a.color, fontWeight: '800', fontSize: '0.9rem', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        {a.initial}
                      </div>
                      <span style={{ fontWeight: '600', color: '#374151', fontSize: '0.9375rem' }}>{a.name}</span>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      {a.change !== null ? (
                        <span style={{ color: '#22C55E', fontWeight: '700', fontSize: '0.9375rem' }}>↑ ${a.change.toFixed(2)}</span>
                      ) : (
                        <span style={{ color: '#111827', fontWeight: '700', fontSize: '0.9375rem' }}>
                          ${a.value.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
                <p style={{ fontSize: '0.75rem', color: '#9CA3AF', margin: '12px 0 0', lineHeight: '1.55' }}>
                  Stocks and prediction markets not available in your jurisdiction.
                </p>
              </div>
            </div>
          </Reveal>

          {/* Crypto watchlist table */}
          <Reveal delay={80}>
            <div style={{ background: '#fff', borderRadius: '20px', border: '1px solid #E5E7EB', padding: '24px 28px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>
                <h2 style={{ fontSize: '1.0625rem', fontWeight: '800', color: '#111827', margin: 0 }}>Watchlist</h2>
                <Link to="/explore" style={{ fontSize: '0.875rem', fontWeight: '600', color: '#1652F0', textDecoration: 'none' }}>View all →</Link>
              </div>
              <div className="table-scroll-wrap">
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr>
                    {['Asset', 'Price', '24h', 'Market Cap'].map(h => (
                      <th key={h} style={{ textAlign: h === 'Asset' ? 'left' : 'right', padding: '8px 10px', fontSize: '0.7rem', fontWeight: '700', color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.07em', borderBottom: '1px solid #F3F4F6' }}>
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {cryptoData.map((coin, i) => (
                    <tr
                      key={coin.id}
                      onClick={() => navigate(`/asset/${coin.id}`)}
                      style={{ cursor: 'pointer', transition: 'background 0.1s' }}
                      onMouseEnter={e => { e.currentTarget.style.background = '#F9FAFB'; }}
                      onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
                    >
                      <td style={{ padding: '12px 10px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <div style={{ width: 32, height: 32, borderRadius: '50%', background: `hsl(${i * 36},68%,92%)`, color: `hsl(${i * 36},55%,42%)`, fontWeight: '800', fontSize: '0.6875rem', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                            {coin.symbol.slice(0, 3)}
                          </div>
                          <div>
                            <p style={{ margin: 0, fontWeight: '700', color: '#111827', fontSize: '0.875rem' }}>{coin.name}</p>
                            <p style={{ margin: 0, color: '#9CA3AF', fontSize: '0.75rem' }}>{coin.symbol}</p>
                          </div>
                        </div>
                      </td>
                      <td style={{ textAlign: 'right', padding: '12px 10px', fontWeight: '700', color: '#111827', fontSize: '0.875rem', fontVariantNumeric: 'tabular-nums' }}>
                        ${coin.price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </td>
                      <td style={{ textAlign: 'right', padding: '12px 10px', fontWeight: '700', fontSize: '0.875rem', color: coin.change24h >= 0 ? '#22C55E' : '#EF4444' }}>
                        {coin.change24h >= 0 ? '▲' : '▼'} {Math.abs(coin.change24h).toFixed(2)}%
                      </td>
                      <td style={{ textAlign: 'right', padding: '12px 10px', color: '#6B7280', fontSize: '0.8125rem', fontVariantNumeric: 'tabular-nums' }}>
                        ${(coin.marketCap / 1e9).toFixed(1)}B
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              </div>
            </div>
          </Reveal>
        </div>

        {/* ────────── RIGHT COLUMN ────────── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

          {/* Quick Trade */}
          <Reveal delay={120}>
            <div style={{ background: '#fff', borderRadius: '20px', border: '1px solid #E5E7EB', padding: '24px' }}>
              <h2 style={{ fontSize: '1.0625rem', fontWeight: '800', color: '#111827', margin: '0 0 18px' }}>Quick Trade</h2>

              {/* Buy / Sell toggle */}
              <div style={{ display: 'flex', background: '#F3F4F6', borderRadius: '12px', padding: '4px', marginBottom: '18px' }}>
                {['buy', 'sell'].map(tab => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    style={{ flex: 1, padding: '8px', borderRadius: '9px', border: 'none', cursor: 'pointer', fontWeight: '700', fontSize: '0.875rem', background: activeTab === tab ? '#fff' : 'transparent', color: activeTab === tab ? '#111827' : '#6B7280', boxShadow: activeTab === tab ? '0 1px 4px rgba(0,0,0,0.08)' : 'none', transition: 'all 0.15s', textTransform: 'capitalize' }}
                  >
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  </button>
                ))}
              </div>

              {/* Coin selector */}
              <label style={{ display: 'block', color: '#374151', fontWeight: '600', fontSize: '0.8125rem', marginBottom: '6px' }}>Asset</label>
              <select
                value={selectedCoin}
                onChange={e => setSelectedCoin(e.target.value)}
                style={{ width: '100%', padding: '11px 14px', borderRadius: '10px', border: '1.5px solid #E5E7EB', fontSize: '0.9375rem', fontWeight: '600', color: '#111827', marginBottom: '14px', background: '#fff', cursor: 'pointer', outline: 'none', boxSizing: 'border-box' }}
                onFocus={e => { e.target.style.borderColor = '#1652F0'; }}
                onBlur={e => { e.target.style.borderColor = '#E5E7EB'; }}
              >
                {cryptoData.map(c => (
                  <option key={c.id} value={c.id}>{c.name} ({c.symbol})</option>
                ))}
              </select>

              {/* Amount */}
              <label style={{ display: 'block', color: '#374151', fontWeight: '600', fontSize: '0.8125rem', marginBottom: '6px' }}>Amount (USD)</label>
              <div style={{ position: 'relative', marginBottom: '14px' }}>
                <span style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#9CA3AF', fontWeight: '700', fontSize: '1rem', pointerEvents: 'none' }}>$</span>
                <input
                  type="number"
                  min="0"
                  placeholder="0.00"
                  value={buyAmount}
                  onChange={e => setBuyAmount(e.target.value)}
                  style={{ width: '100%', padding: '11px 14px 11px 28px', borderRadius: '10px', border: '1.5px solid #E5E7EB', fontSize: '0.9375rem', color: '#111827', outline: 'none', boxSizing: 'border-box', fontWeight: '600', background: '#fff' }}
                  onFocus={e => { e.target.style.borderColor = '#1652F0'; }}
                  onBlur={e => { e.target.style.borderColor = '#E5E7EB'; }}
                />
              </div>

              {/* Estimated receive */}
              {estimatedReceive && (
                <div style={{ background: '#EFF4FF', borderRadius: '10px', padding: '10px 14px', marginBottom: '14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.8125rem', color: '#6B7280', fontWeight: '600' }}>You receive ≈</span>
                  <span style={{ fontSize: '0.9375rem', fontWeight: '800', color: '#1652F0' }}>{estimatedReceive} {selectedCoinData?.symbol}</span>
                </div>
              )}

              <button
                style={{ width: '100%', padding: '13px', background: activeTab === 'buy' ? '#1652F0' : '#EF4444', color: '#fff', border: 'none', borderRadius: '12px', fontWeight: '800', fontSize: '1rem', cursor: 'pointer', transition: 'opacity 0.15s', letterSpacing: '0.01em' }}
                onMouseEnter={e => { e.currentTarget.style.opacity = '0.88'; }}
                onMouseLeave={e => { e.currentTarget.style.opacity = '1'; }}
              >
                {activeTab === 'buy' ? `Buy ${selectedCoinData?.symbol ?? ''}` : `Sell ${selectedCoinData?.symbol ?? ''}`}
              </button>

              {selectedCoinData && (
                <p style={{ textAlign: 'center', fontSize: '0.8125rem', color: '#9CA3AF', margin: '10px 0 0', fontWeight: '600' }}>
                  1 {selectedCoinData.symbol} = ${selectedCoinData.price.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </p>
              )}
            </div>
          </Reveal>

          {/* Recent Activity */}
          <Reveal delay={160}>
            <div style={{ background: '#fff', borderRadius: '20px', border: '1px solid #E5E7EB', padding: '24px' }}>
              <h2 style={{ fontSize: '1.0625rem', fontWeight: '800', color: '#111827', margin: '0 0 16px' }}>Recent Activity</h2>
              {RECENT_TXS.map((tx, i) => (
                <div
                  key={i}
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 0', borderBottom: i < RECENT_TXS.length - 1 ? '1px solid #F3F4F6' : 'none' }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ width: 36, height: 36, borderRadius: '50%', background: tx.type === 'Buy' ? '#DCFCE7' : '#FEE2E2', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: '16px' }}>
                      {tx.type === 'Buy' ? '↓' : '↑'}
                    </div>
                    <div>
                      <p style={{ margin: 0, fontWeight: '700', color: '#111827', fontSize: '0.875rem' }}>{tx.type} {tx.coin}</p>
                      <p style={{ margin: 0, color: '#9CA3AF', fontSize: '0.75rem' }}>{tx.date}</p>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <p style={{ margin: 0, fontWeight: '700', color: '#111827', fontSize: '0.875rem' }}>
                      ${tx.value.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </p>
                    <p style={{ margin: 0, color: '#9CA3AF', fontSize: '0.75rem' }}>{tx.amount}</p>
                  </div>
                </div>
              ))}
            </div>
          </Reveal>

          {/* Verify identity banner */}
          <Reveal className="reveal-scale" delay={200}>
            <div style={{ background: 'linear-gradient(135deg,#1652F0 0%,#0A38B8 100%)', borderRadius: '20px', padding: '24px', color: '#fff' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'rgba(255,255,255,0.18)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', flexShrink: 0 }}>🔒</div>
                <p style={{ margin: 0, fontWeight: '800', fontSize: '1rem' }}>Verify your identity</p>
              </div>
              <p style={{ margin: '0 0 18px', fontSize: '0.8125rem', color: 'rgba(255,255,255,0.78)', lineHeight: '1.6' }}>
                Complete identity verification to unlock higher limits and all platform features.
              </p>
              <button
                style={{ background: '#fff', color: '#1652F0', border: 'none', borderRadius: '99px', padding: '9px 20px', fontWeight: '800', fontSize: '0.875rem', cursor: 'pointer', transition: 'opacity 0.15s' }}
                onMouseEnter={e => { e.currentTarget.style.opacity = '0.88'; }}
                onMouseLeave={e => { e.currentTarget.style.opacity = '1'; }}
              >
                Verify now →
              </button>
            </div>
          </Reveal>
        </div>
      </div>
    </div>
  );
}
