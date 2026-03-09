import { useState, useEffect, useRef } from 'react';

/*  Real Contentful CDN image assets  */
const IMG = {
  cryptocurrency: 'https://images.ctfassets.net/q5ulk4bp65r7/5FbQ4oiMCnZMZZ1udW3jYZ/fd738c69fc6508d3286163661713f684/Learn_Illustration_What_is_a_Crypto_Wallet.png?w=768&fm=png',
  bitcoin:        'https://images.ctfassets.net/q5ulk4bp65r7/lUIdMeDm9tf33LZNjPqz8/a44f28b20bd9846efc62cf5a230d875a/Learn_Illustration_Ultimate_Guide_Bitcoin.webp?w=768&fm=png',
  ethereum:       'https://images.ctfassets.net/q5ulk4bp65r7/3thWklmvu2WmAHJh0k1AcC/51521feeef170d94a446fbec6f262912/what-is-ethereum.png?w=768&fm=png',
  defi:           'https://images.ctfassets.net/q5ulk4bp65r7/2lrWtXLcleZPbsnzZnEeLB/bbd5a35075619f07e083fce5fdbf15f9/Learn_Illustration_What_is_DeFi.jpg?w=768&fm=png',
  stablecoin:     'https://images.ctfassets.net/q5ulk4bp65r7/3hETt7h2hfvnOnVVrJIvlO/b7204c2b9a1a35d39d0dd396d2cf49bb/Learn_Illustration_What_is_a_stablecoin.jpg?w=768&fm=png',
  earnRewards:    'https://images.ctfassets.net/q5ulk4bp65r7/17lOB5yasBrHeYboCtkgh6/2cc330655a4443711570e8e222b412c2/Earning-Rewards.png?w=768&fm=png',
  blockchain:     'https://images.ctfassets.net/q5ulk4bp65r7/70c1NBb3A7nvNpx38gSvtd/725e6c5da4960a5a17657c02b80dd596/Learn_Illustration_Ultimate_Guide_Blockchain.png?w=768&fm=png',
  nft:            'https://images.ctfassets.net/q5ulk4bp65r7/3nIT36ObLVXq6CIlnXLmXv/d1d5bde731457c87808aca7cc69a984d/what-are-nfts.png?w=768&fm=png',
};

/*  Page data  */
const FEATURED = {
  id: 'feat-1',
  tag: 'VIDEO TUTORIAL',
  img: 'blockchain',
  isVideo: true,
  title: 'When is the best time to invest in crypto?',
  excerpt: 'The most popular question for any new crypto investor. Here is what you need to know about crypto market cycles, dollar-cost averaging, and how to decide when to buy.',
  readTime: '5 min read',
};

const POPULAR = [
  { id: 'pop-1', tag: "BEGINNER'S GUIDE", title: 'What is cryptocurrency?' },
  { id: 'pop-2', tag: 'GETTING STARTED',  title: 'How to earn crypto rewards' },
  { id: 'pop-3', tag: 'GETTING STARTED',  title: 'How to add crypto to your Coinbase wallet' },
  { id: 'pop-4', tag: 'TAX & CRYPTO',     title: 'Tax forms, explained: A guide to U.S. tax forms and crypto reports' },
  { id: 'pop-5', tag: 'GETTING STARTED',  title: "Beginner's guide to dapps" },
];

const CRYPTO_BASICS_LARGE = [
  {
    id: 'cbl-1', tag: "BEGINNER'S GUIDE", img: 'cryptocurrency',
    title: 'What is cryptocurrency?',
    excerpt: 'Cryptocurrency is a digital or virtual currency that uses cryptography for security and operates on decentralised networks called blockchains.',
  },
  {
    id: 'cbl-2', tag: "BEGINNER'S GUIDE", img: 'bitcoin',
    title: 'What is Bitcoin?',
    excerpt: "Bitcoin is the first and most widely used cryptocurrency. Discover how it works, who created it, and why it's valuable.",
  },
];

const CRYPTO_BASICS_SMALL = [
  { id: 'cbs-1', tag: "BEGINNER'S GUIDE", img: 'ethereum',    title: 'What is Ethereum?' },
  { id: 'cbs-2', tag: 'DEFI',             img: 'defi',        title: 'What is DeFi?' },
  { id: 'cbs-3', tag: "BEGINNER'S GUIDE", img: 'stablecoin',  title: 'What is a stablecoin?' },
  { id: 'cbs-4', tag: 'NFTs',             img: 'nft',         title: 'What are NFTs?' },
];

const GLOSSARY_TERMS = [
  'Bitcoin', 'Blockchain', 'Cardano', 'Crypto wallet', 'DeFi', 'Ethereum',
  'Fork', 'Inflation', 'Market cap', 'NFT', 'Private key', 'Protocol',
  'Smart contract', 'Token', 'Volatility', 'Memecoin',
];

const TIPS_LARGE = [
  {
    id: 'tl-1', tag: 'GETTING STARTED', img: 'earnRewards',
    title: 'How to earn crypto rewards',
    excerpt: 'Staking, savings accounts, and earn programs  here are all the ways you can put your crypto to work and earn passive income.',
  },
  {
    id: 'tl-2', tag: 'GETTING STARTED', img: 'cryptocurrency',
    title: 'How to set up a crypto wallet',
    excerpt: 'A secure crypto wallet is your first step toward owning digital assets. Follow this step-by-step guide to getting started safely.',
  },
];

const TIPS_SMALL = [
  { id: 'ts-1', tag: "BEGINNER'S GUIDE", img: 'blockchain',  title: 'What is a blockchain?' },
  { id: 'ts-2', tag: 'NFTs',             img: 'nft',         title: "How to buy an NFT: A beginner's guide" },
  { id: 'ts-3', tag: 'DEFI',             img: 'defi',        title: 'What is DeFi and how do I use it?' },
  { id: 'ts-4', tag: "BEGINNER'S GUIDE", img: 'stablecoin',  title: 'What is a stablecoin and why should you care?' },
];

const EARN_LESSONS = [
  { id: 'el-1', tag: "BEGINNER'S GUIDE", img: 'ethereum',    title: 'What is Ethereum?',          reward: '₵79 ETH',  duration: '8 min',  level: 'Beginner' },
  { id: 'el-2', tag: "BEGINNER'S GUIDE", img: 'blockchain',  title: 'What is a blockchain?',       reward: '₵47 BTC',  duration: '8 min',  level: 'Beginner' },
  { id: 'el-3', tag: 'DEFI',             img: 'defi',        title: 'Intro to DeFi',               reward: '₵79 USDC', duration: '12 min', level: 'Intermediate' },
  { id: 'el-4', tag: "BEGINNER'S GUIDE", img: 'bitcoin',     title: 'What is Bitcoin?',            reward: '₵79 BTC',  duration: '10 min', level: 'Beginner' },
  { id: 'el-5', tag: 'GETTING STARTED',  img: 'earnRewards', title: 'How to earn crypto rewards',  reward: '₵47 USDC', duration: '7 min',  level: 'Beginner' },
  { id: 'el-6', tag: "BEGINNER'S GUIDE", img: 'stablecoin',  title: 'What are stablecoins?',       reward: '₵47 USDC', duration: '7 min',  level: 'Beginner' },
];

/*  Responsive width hook  */
function useWindowWidth() {
  const [width, setWidth] = useState(() =>
    typeof window !== 'undefined' ? window.innerWidth : 1200
  );
  useEffect(() => {
    const handler = () => setWidth(window.innerWidth);
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, []);
  return width;
}

/*  Scroll-reveal hook  */
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

/*  Newsletter Modal  */
function NewsletterModal({ onClose }) {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email.trim()) setSubscribed(true);
  };

  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 1000,
        background: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(4px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '16px',
      }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div style={{
        background: '#fff', borderRadius: '16px', overflow: 'hidden',
        width: '100%', maxWidth: '440px', boxShadow: '0 24px 64px rgba(0,0,0,0.22)',
        animation: 'modalIn 0.25s ease',
      }}>
        <div style={{ position: 'relative', height: '220px', overflow: 'hidden' }}>
          <div style={{
            height: '100%',
            background: 'linear-gradient(135deg,#c0d0e8 0%,#9fb8d8 50%,#7a9fc9 100%)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <div style={{
              width: '100px', height: '170px', background: '#1a1a2e',
              borderRadius: '16px', border: '3px solid #333',
              display: 'flex', flexDirection: 'column', overflow: 'hidden',
              boxShadow: '0 12px 32px rgba(0,0,0,0.35)',
              transform: 'rotate(-5deg)',
            }}>
              <div style={{ background: '#1652F0', padding: '8px 6px 4px', fontSize: '0.5rem', color: '#fff', fontWeight: '700' }}>
                Coinbase Bytes
              </div>
              <div style={{ padding: '6px', flex: 1, background: '#fff' }}>
                <div style={{ fontSize: '0.45rem', fontWeight: '800', color: '#111', lineHeight: '1.3', marginBottom: '4px' }}>
                  Ethereum hits new all-time high
                </div>
                <div style={{ height: '50px', background: 'linear-gradient(135deg,#627EEA,#9333EA)', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem' }}>
                  Ξ
                </div>
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              position: 'absolute', top: '12px', right: '12px',
              width: '28px', height: '28px', borderRadius: '50%',
              background: 'rgba(255,255,255,0.9)', border: 'none',
              cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '1rem', color: '#374151', fontWeight: '700',
              boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
            }}
          >x</button>
        </div>

        <div style={{ padding: '28px' }}>
          <p style={{ color: '#1652F0', fontWeight: '700', fontSize: '0.875rem', marginBottom: '8px' }}>Coinbase Bytes</p>
          <h2 style={{ fontSize: '1.625rem', fontWeight: '900', color: '#111827', marginBottom: '20px', lineHeight: 1.2 }}>
            The week's crypto news, explained
          </h2>

          {subscribed ? (
            <div style={{ textAlign: 'center', padding: '16px 0' }}>
              <div style={{ fontSize: '2rem', marginBottom: '8px' }}>check</div>
              <p style={{ fontWeight: '700', color: '#059669' }}>You are subscribed!</p>
              <p style={{ color: '#6B7280', fontSize: '0.875rem', marginTop: '4px' }}>Check your inbox for a confirmation email.</p>
            </div>
          ) : (
            <form onSubmit={handleSubscribe}>
              <div style={{ display: 'flex', gap: '8px' }}>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="Your email address"
                  required
                  style={{
                    flex: 1, padding: '11px 14px', border: '1.5px solid #D1D5DB',
                    borderRadius: '8px', fontSize: '0.9375rem', outline: 'none',
                    color: '#111827',
                  }}
                />
                <button
                  type="submit"
                  style={{
                    background: '#1652F0', color: '#fff', border: 'none',
                    borderRadius: '8px', padding: '11px 20px',
                    fontWeight: '700', fontSize: '0.9375rem', cursor: 'pointer',
                    whiteSpace: 'nowrap',
                  }}
                >Subscribe</button>
              </div>
              <p style={{ fontSize: '0.75rem', color: '#9CA3AF', marginTop: '10px' }}>
                Learn how we collect your information by visiting our{' '}
                <span style={{ color: '#1652F0', cursor: 'pointer' }}>Privacy Policy</span>
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

/*  Tag label  */
function TagLabel({ tag }) {
  const colors = {
    "BEGINNER'S GUIDE": { bg: '#EEF2FF', color: '#1652F0' },
    'GETTING STARTED':  { bg: '#F0FDF4', color: '#16A34A' },
    'TAX & CRYPTO':     { bg: '#F9FAFB', color: '#374151' },
    'MARKET UPDATE':    { bg: '#FFF7ED', color: '#C2410C' },
    'VIDEO TUTORIAL':   { bg: '#FEF3C7', color: '#D97706' },
    FUTURES:            { bg: '#EEF2FF', color: '#7C3AED' },
    DEFI:               { bg: '#F5F3FF', color: '#7C3AED' },
    NFTs:               { bg: '#FDF4FF', color: '#9333EA' },
    GLOSSARY:           { bg: '#FFF7ED', color: '#D97706' },
    SECURITY:           { bg: '#F0FDF4', color: '#059669' },
    'ADVANCED TRADING': { bg: '#F0FDF4', color: '#059669' },
  };
  const s = colors[tag] || { bg: '#F3F4F6', color: '#374151' };
  return (
    <span style={{
      display: 'inline-block', fontSize: '0.6875rem', fontWeight: '700',
      letterSpacing: '0.06em', padding: '2px 8px', borderRadius: '4px',
      background: s.bg, color: s.color, textTransform: 'uppercase',
    }}>{tag}</span>
  );
}

/*  Article thumbnail with real image  */
function ArticleThumb({ src, alt = '', height = 200, isVideo = false }) {
  return (
    <div style={{ height, overflow: 'hidden', background: '#F3F4F6', position: 'relative', flexShrink: 0 }}>
      <img
        src={src}
        alt={alt}
        style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
      />
      {isVideo && (
        <div style={{
          position: 'absolute', inset: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <div style={{
            width: '60px', height: '60px', borderRadius: '50%',
            background: 'rgba(255,255,255,0.92)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 4px 20px rgba(0,0,0,0.28)',
          }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="#1652F0" style={{ marginLeft: '3px' }}>
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        </div>
      )}
    </div>
  );
}

/*  Large article card (2-col, with excerpt)  */
function ArticleLargeCard({ article, hovered, onEnter, onLeave }) {
  return (
    <div
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      style={{
        cursor: 'pointer', borderRadius: '12px', overflow: 'hidden',
        border: hovered ? '1.5px solid #D1D5DB' : '1.5px solid #E5E7EB',
        background: '#fff',
        transform: hovered ? 'translateY(-3px)' : 'none',
        boxShadow: hovered ? '0 8px 28px rgba(0,0,0,0.08)' : 'none',
        transition: 'all 0.2s',
      }}
    >
      <ArticleThumb src={IMG[article.img]} alt={article.title} height={260} />
      <div style={{ padding: '18px 20px 24px' }}>
        <TagLabel tag={article.tag} />
        <h3 style={{
          fontSize: '1.125rem', fontWeight: '800', color: '#111827',
          marginTop: '10px', marginBottom: '10px', lineHeight: 1.3,
          textDecoration: hovered ? 'underline' : 'none', transition: 'text-decoration 0.15s',
        }}>{article.title}</h3>
        {article.excerpt && (
          <p style={{ color: '#6B7280', fontSize: '0.9rem', lineHeight: '1.65', margin: 0 }}>
            {article.excerpt}
          </p>
        )}
      </div>
    </div>
  );
}

/*  Small article card (4-col)  */
function ArticleSmallCard({ article, hovered, onEnter, onLeave }) {
  return (
    <div
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      style={{
        cursor: 'pointer', borderRadius: '10px', overflow: 'hidden',
        border: hovered ? '1.5px solid #D1D5DB' : '1.5px solid #E5E7EB',
        background: '#fff',
        transform: hovered ? 'translateY(-2px)' : 'none',
        boxShadow: hovered ? '0 6px 20px rgba(0,0,0,0.07)' : 'none',
        transition: 'all 0.18s',
      }}
    >
      <ArticleThumb src={IMG[article.img]} alt={article.title} height={140} />
      <div style={{ padding: '12px 14px 16px' }}>
        <TagLabel tag={article.tag} />
        <p style={{
          fontWeight: '700', fontSize: '0.875rem', color: '#111827',
          marginTop: '8px', lineHeight: '1.4',
          textDecoration: hovered ? 'underline' : 'none',
        }}>{article.title}</p>
      </div>
    </div>
  );
}

/*  Category shortcut card  */
function CategoryShortcut({ label, icon, iconBg, iconColor }) {
  const [hov, setHov] = useState(false);
  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '12px 14px',
        border: hov ? '1.5px solid #C7D2FE' : '1.5px solid #E5E7EB',
        borderRadius: '12px',
        cursor: 'pointer',
        background: hov ? '#FAFBFF' : '#fff',
        boxShadow: hov ? '0 4px 14px rgba(22,82,240,0.08)' : 'none',
        transform: hov ? 'translateY(-1px)' : 'none',
        transition: 'all 0.18s',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0 }}>
        <div style={{
          width: '36px', height: '36px', borderRadius: '8px',
          background: iconBg, flexShrink: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: iconColor,
        }}>
          {icon}
        </div>
        <span style={{ fontWeight: '700', fontSize: '0.8125rem', color: '#111827', lineHeight: 1.25 }}>{label}</span>
      </div>
      <span style={{ color: '#1652F0', fontWeight: '600', fontSize: '0.75rem', whiteSpace: 'nowrap', flexShrink: 0, marginLeft: '6px' }}>
        See more &rarr;
      </span>
    </div>
  );
}

/*  Glossary tag cloud section (full-width gray bg)  */
function GlossarySection() {
  const revRef = useReveal();
  const [hovTerm, setHovTerm] = useState(null);
  const w = useWindowWidth();
  const isMobile = w <= 640;
  return (
    <div style={{ background: '#F3F4F6', borderTop: '1px solid #E5E7EB', borderBottom: '1px solid #E5E7EB' }}>
      <div style={{ maxWidth: '1120px', margin: '0 auto', padding: '52px 24px' }}>
        <h2 style={{
          fontSize: 'clamp(1.25rem,3vw,1.625rem)', fontWeight: '800',
          color: '#111827', letterSpacing: '-0.02em', marginBottom: '6px',
        }}>Crypto glossary</h2>
        <p style={{ color: '#6B7280', fontSize: isMobile ? '0.875rem' : '0.9375rem', lineHeight: 1.6, marginBottom: '28px' }}>
          Want to expand your crypto vocabulary? Get started with the essential terms.
        </p>
        <div
          ref={revRef}
          className="reveal reveal-fade-up"
          style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}
        >
          {GLOSSARY_TERMS.map(term => (
            <button
              key={term}
              onMouseEnter={() => setHovTerm(term)}
              onMouseLeave={() => setHovTerm(null)}
              style={{
                padding: '8px 20px',
                border: hovTerm === term ? '1.5px solid #1652F0' : '1.5px solid #D1D5DB',
                borderRadius: '99px',
                background: hovTerm === term ? '#EEF2FF' : '#fff',
                color: hovTerm === term ? '#1652F0' : '#374151',
                fontWeight: '600',
                fontSize: '0.9375rem',
                cursor: 'pointer',
                transition: 'all 0.15s',
              }}
            >{term}</button>
          ))}
        </div>
        <div style={{ textAlign: 'center', marginTop: '32px' }}>
          <button
            style={{
              background: '#1652F0', color: '#fff', border: 'none',
              borderRadius: '8px', padding: '11px 32px',
              fontWeight: '700', fontSize: '0.9375rem', cursor: 'pointer',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = '#0E40C7'; }}
            onMouseLeave={e => { e.currentTarget.style.background = '#1652F0'; }}
          >
            See more
          </button>
        </div>
      </div>
    </div>
  );
}

/*  Article section (2 large + 4 small + see-more button)  */
function ArticleSection({ id, title, subtitle, largeArticles, smallArticles, seeMoreText, hoveredCard, setHoveredCard }) {
  const revLarge = useReveal();
  const revSmall = useReveal();
  const w = useWindowWidth();
  const isMobile = w <= 640;
  const isTablet = w <= 900;
  return (
    <div id={id} style={{ padding: '48px 0 36px', borderTop: '1px solid #E5E7EB' }}>
      <h2 style={{
        fontSize: 'clamp(1.25rem,3vw,1.625rem)', fontWeight: '800',
        color: '#111827', letterSpacing: '-0.02em',
        marginBottom: subtitle ? '6px' : '28px',
      }}>{title}</h2>
      {subtitle && (
        <p style={{ color: '#6B7280', fontSize: '0.9375rem', lineHeight: 1.6, marginBottom: '28px' }}>
          {subtitle}
        </p>
      )}

      <div
        ref={revLarge}
        className="reveal reveal-fade-up"
        style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: isMobile ? '16px' : '24px', marginBottom: '24px' }}
      >
        {largeArticles.map(article => (
          <ArticleLargeCard
            key={article.id}
            article={article}
            hovered={hoveredCard === article.id}
            onEnter={() => setHoveredCard(article.id)}
            onLeave={() => setHoveredCard(null)}
          />
        ))}
      </div>

      {smallArticles && smallArticles.length > 0 && (
        <div
          ref={revSmall}
          className="reveal reveal-fade-up"
          style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr 1fr' : isTablet ? 'repeat(2,1fr)' : 'repeat(4,1fr)', gap: isMobile ? '12px' : '20px', marginBottom: '28px' }}
        >
          {smallArticles.map(article => (
            <ArticleSmallCard
              key={article.id}
              article={article}
              hovered={hoveredCard === article.id}
              onEnter={() => setHoveredCard(article.id)}
              onLeave={() => setHoveredCard(null)}
            />
          ))}
        </div>
      )}

      <div style={{ textAlign: 'center', paddingTop: '8px' }}>
        <button
          style={{
            background: '#EEF2FF', color: '#1652F0',
            border: '1.5px solid #C7D2FE',
            borderRadius: '99px', padding: '11px 32px',
            fontWeight: '700', fontSize: '0.9375rem', cursor: 'pointer',
          }}
          onMouseEnter={e => { e.currentTarget.style.background = '#E0E7FF'; }}
          onMouseLeave={e => { e.currentTarget.style.background = '#EEF2FF'; }}
        >
          {seeMoreText} &rsaquo;
        </button>
      </div>
    </div>
  );
}

/*  Main Learn component  */
function Learn() {
  const [showModal, setShowModal]     = useState(true);
  const [hoveredCard, setHoveredCard] = useState(null);
  const [hoveredEarn, setHoveredEarn] = useState(null);

  const ctaBannerRef = useReveal();
  const featuredRef  = useReveal();
  const w = useWindowWidth();
  const isMobile = w <= 640;
  const isTablet = w <= 900;

  return (
    <div style={{ minHeight: '100vh', background: '#fff', color: '#111827', fontFamily: 'inherit' }}>

      {showModal && <NewsletterModal onClose={() => setShowModal(false)} />}

      {/* Page header */}
      <div style={{ borderBottom: '1px solid #E5E7EB', paddingTop: isMobile ? '32px' : '56px', paddingBottom: isMobile ? '24px' : '40px' }}>
        <div style={{ maxWidth: '1120px', margin: '0 auto', padding: '0 24px' }} className="hero-anim-up">
          <h1 style={{
            fontSize: 'clamp(1.75rem,4.5vw,2.75rem)', fontWeight: '900',
            letterSpacing: '-0.035em', marginBottom: '10px', color: '#111827',
          }}>
            Crypto questions, answered
          </h1>
          <p style={{ color: '#6B7280', fontSize: '1rem', lineHeight: 1.65, maxWidth: '580px' }}>
            Beginner guides, practical tips, and market updates for first-timers,
            experienced investors, and everyone in between
          </p>
        </div>
      </div>

      {/* Main scrollable content */}
      <div style={{ maxWidth: '1120px', margin: '0 auto', padding: '0 24px' }}>

        {/* Featured + Popular */}
        <div
          ref={featuredRef}
          className="reveal reveal-fade-up"
          style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr' : '1fr 320px',
            gap: isMobile ? '32px' : '48px',
            padding: isMobile ? '28px 0 24px' : '40px 0 36px',
            borderBottom: '1px solid #E5E7EB',
          }}
        >
          <div>
            <h2 style={{ fontSize: '0.8125rem', fontWeight: '700', color: '#9CA3AF', letterSpacing: '0.08em', marginBottom: '20px', textTransform: 'uppercase' }}>Featured</h2>
            <div
              style={{ cursor: 'pointer' }}
              onMouseEnter={e => { const h = e.currentTarget.querySelector('h3'); if (h) h.style.textDecoration = 'underline'; }}
              onMouseLeave={e => { const h = e.currentTarget.querySelector('h3'); if (h) h.style.textDecoration = 'none'; }}
            >
              <div style={{ borderRadius: '14px', overflow: 'hidden', marginBottom: '20px' }}>
                <ArticleThumb src={IMG[FEATURED.img]} alt={FEATURED.title} height={isMobile ? 200 : 310} isVideo={FEATURED.isVideo} />
              </div>
              <TagLabel tag={FEATURED.tag} />
              <h3 style={{
                fontSize: 'clamp(1.25rem,3vw,1.75rem)', fontWeight: '800', color: '#111827',
                marginTop: '12px', marginBottom: '12px', letterSpacing: '-0.025em', lineHeight: 1.25,
                textDecoration: 'none', transition: 'text-decoration 0.15s',
              }}>{FEATURED.title}</h3>
              <p style={{ color: '#6B7280', fontSize: '0.9375rem', lineHeight: '1.65', marginBottom: '14px' }}>{FEATURED.excerpt}</p>
              <span style={{ color: '#9CA3AF', fontSize: '0.8125rem' }}>{FEATURED.readTime}</span>
            </div>
          </div>

          <div>
            <h2 style={{ fontSize: '0.8125rem', fontWeight: '700', color: '#9CA3AF', letterSpacing: '0.08em', marginBottom: '20px', textTransform: 'uppercase' }}>Popular</h2>
            <div>
              {POPULAR.map((a, i) => (
                <div
                  key={a.id}
                  style={{ padding: '14px 0', borderBottom: i < POPULAR.length - 1 ? '1px solid #F3F4F6' : 'none', cursor: 'pointer' }}
                  onMouseEnter={e => { const p = e.currentTarget.querySelector('p'); if (p) p.style.textDecoration = 'underline'; }}
                  onMouseLeave={e => { const p = e.currentTarget.querySelector('p'); if (p) p.style.textDecoration = 'none'; }}
                >
                  <TagLabel tag={a.tag} />
                  <p style={{ fontWeight: '700', fontSize: '0.9375rem', color: '#111827', marginTop: '6px', lineHeight: '1.4', textDecoration: 'none' }}>{a.title}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Category shortcut row */}
        <div style={{ padding: isMobile ? '20px 0' : '32px 0', borderBottom: '1px solid #E5E7EB' }}>
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr 1fr' : isTablet ? 'repeat(2,1fr)' : 'repeat(4,1fr)', gap: isMobile ? '10px' : '16px' }}>
            <CategoryShortcut
              label="Crypto basics" iconBg="#EEF2FF" iconColor="#1652F0"
              icon={<svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C8.13 2 5 5.13 5 9c0 2.74 1.57 5.12 3.88 6.34L9 17h6l.12-1.66C17.43 14.12 19 11.74 19 9c0-3.87-3.13-7-7-7zm-1 14v3h2v-3h-2zm1-12c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5z"/></svg>}
            />
            <CategoryShortcut
              label="Tips and tutorials" iconBg="#FFF7ED" iconColor="#D97706"
              icon={<svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M14 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6zM6 20V4h7v5h5v11H6zm2-4h8v2H8v-2zm0-4h8v2H8v-2z"/></svg>}
            />
            <CategoryShortcut
              label="Advanced trading" iconBg="#F0FDF4" iconColor="#10B981"
              icon={<svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M4 18h2v-6H4v6zm4 0h2V9H8v9zm4 0h2v-3h-2v3zm4 0h2V5h-2v13z"/></svg>}
            />
            <CategoryShortcut
              label="Futures" iconBg="#F5F3FF" iconColor="#7C3AED"
              icon={<svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67V7z"/></svg>}
            />
          </div>
        </div>

        {/* Crypto basics section */}
        <ArticleSection
          id="crypto-basics"
          title="Crypto basics"
          subtitle="New to crypto? Not for long  start with these guides and explainers"
          largeArticles={CRYPTO_BASICS_LARGE}
          smallArticles={CRYPTO_BASICS_SMALL}
          seeMoreText="See more crypto basics"
          hoveredCard={hoveredCard}
          setHoveredCard={setHoveredCard}
        />

      </div>

      {/* Glossary  full-width gray strip */}
      <GlossarySection />

      {/* Continue main content */}
      <div style={{ maxWidth: '1120px', margin: '0 auto', padding: '0 24px' }}>

        {/* Tips and tutorials section */}
        <ArticleSection
          id="tips-tutorials"
          title="Tips and tutorials"
          subtitle="Get practical, step-by-step answers to all things crypto"
          largeArticles={TIPS_LARGE}
          smallArticles={TIPS_SMALL}
          seeMoreText="See more tips and tutorials"
          hoveredCard={hoveredCard}
          setHoveredCard={setHoveredCard}
        />

        {/* Earn while you learn */}
        <div style={{ borderTop: '1px solid #E5E7EB', paddingTop: '48px', paddingBottom: '56px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="#1652F0">
              <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z" />
            </svg>
            <h2 style={{ fontSize: 'clamp(1.25rem,3vw,1.625rem)', fontWeight: '800', color: '#111827', letterSpacing: '-0.02em' }}>
              Earn while you learn
            </h2>
          </div>
          <p style={{ color: '#6B7280', fontSize: '0.9375rem', marginBottom: '28px', lineHeight: 1.6 }}>
            Watch short videos, answer a few questions, and earn real crypto rewards  up to ₵1,580.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : isTablet ? 'repeat(2,1fr)' : 'repeat(3,1fr)', gap: isMobile ? '16px' : '20px' }}>
            {EARN_LESSONS.map((lesson, idx) => (
              <Reveal key={lesson.id} variant="reveal-scale" delay={`reveal-delay-${(idx % 6) + 1}`} style={{ display: 'flex', flexDirection: 'column' }}>
                <div
                  onMouseEnter={() => setHoveredEarn(lesson.id)}
                  onMouseLeave={() => setHoveredEarn(null)}
                  style={{
                    background: '#fff',
                    border: hoveredEarn === lesson.id ? '1.5px solid #D1D5DB' : '1.5px solid #E5E7EB',
                    borderRadius: '16px', overflow: 'hidden',
                    transform: hoveredEarn === lesson.id ? 'translateY(-3px)' : 'none',
                    boxShadow: hoveredEarn === lesson.id ? '0 8px 24px rgba(0,0,0,0.08)' : '0 1px 3px rgba(0,0,0,0.04)',
                    transition: 'all 0.2s', cursor: 'pointer', flex: 1,
                  }}
                >
                  <ArticleThumb src={IMG[lesson.img]} alt={lesson.title} height={130} />
                  <div style={{ padding: '16px' }}>
                    <TagLabel tag={lesson.tag} />
                    <h3 style={{ color: '#111827', fontWeight: '700', fontSize: '0.9375rem', margin: '8px 0 12px', lineHeight: 1.35 }}>{lesson.title}</h3>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span style={{ background: '#EEF2FF', color: '#1652F0', fontSize: '0.75rem', fontWeight: '700', padding: '3px 10px', borderRadius: '99px' }}>
                          Earn {lesson.reward}
                        </span>
                        <span style={{ color: '#9CA3AF', fontSize: '0.75rem' }}>{lesson.duration}</span>
                      </div>
                      <button
                        style={{ background: '#1652F0', color: '#fff', border: 'none', borderRadius: '8px', padding: '6px 18px', fontSize: '0.8125rem', fontWeight: '700', cursor: 'pointer' }}
                        onMouseEnter={e => { e.currentTarget.style.background = '#0E40C7'; }}
                        onMouseLeave={e => { e.currentTarget.style.background = '#1652F0'; }}
                      >Start</button>
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>

      </div>

      {/* Coinbase Bytes subscribe banner */}
      <div style={{ background: '#F9FAFB', borderTop: '1px solid #E5E7EB', borderBottom: '1px solid #E5E7EB' }}>
        <div style={{ maxWidth: '1120px', margin: '0 auto', padding: '44px 24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '24px' }}>
            <div>
              <p style={{ color: '#1652F0', fontWeight: '700', fontSize: '0.875rem', marginBottom: '6px' }}>Coinbase Bytes</p>
              <h3 style={{ fontSize: 'clamp(1.125rem,2.5vw,1.5rem)', fontWeight: '800', color: '#111827', letterSpacing: '-0.02em', marginBottom: '8px' }}>
                The week's crypto news, explained
              </h3>
              <p style={{ color: '#6B7280', fontSize: '0.9375rem' }}>Get the top stories summarised in your inbox every week.</p>
            </div>
            <button
              style={{ background: '#1652F0', color: '#fff', border: 'none', borderRadius: '10px', padding: '12px 28px', fontWeight: '700', fontSize: '0.9375rem', cursor: 'pointer', flexShrink: 0 }}
              onClick={() => setShowModal(true)}
              onMouseEnter={e => { e.currentTarget.style.background = '#0E40C7'; }}
              onMouseLeave={e => { e.currentTarget.style.background = '#1652F0'; }}
            >Subscribe</button>
          </div>
        </div>
      </div>

      {/* CTA gradient banner */}
      <div style={{ maxWidth: '1120px', margin: '0 auto', padding: '48px 24px 80px' }}>
        <div ref={ctaBannerRef} style={{
          background: 'linear-gradient(135deg,#1652F0 0%,#7C3AED 100%)',
          borderRadius: '20px',
          padding: 'clamp(36px,5vw,52px) clamp(24px,5vw,60px)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          flexWrap: 'wrap', gap: '24px',
        }} className="reveal reveal-scale">
          <div>
            <h2 style={{ fontSize: 'clamp(1.25rem,3vw,1.75rem)', fontWeight: '900', letterSpacing: '-0.025em', marginBottom: '10px', color: '#fff' }}>
              Ready to start learning?
            </h2>
            <p style={{ color: 'rgba(255,255,255,0.78)', fontSize: '0.9375rem', lineHeight: '1.6', maxWidth: '480px' }}>
              Sign up today and start earning crypto while you learn. Join millions of students worldwide building their knowledge and portfolio.
            </p>
          </div>
          <button
            style={{ background: '#fff', color: '#1652F0', fontWeight: '800', fontSize: '0.9375rem', padding: '13px 28px', borderRadius: '10px', border: 'none', cursor: 'pointer', flexShrink: 0 }}
            onMouseEnter={e => { e.currentTarget.style.background = '#EEF2FF'; }}
            onMouseLeave={e => { e.currentTarget.style.background = '#fff'; }}
          >
            Get started for free
          </button>
        </div>
      </div>

    </div>
  );
}

export default Learn;