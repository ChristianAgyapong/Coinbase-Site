import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTransactions } from '../context/TransactionsContext';

// ── Static portfolio data ─────────────────────────────────────
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
  const {
    transactions,
    addTransaction,
    deleteTransaction,
    savingsGoals,
    addSavingsGoal,
    contributeToGoal,
    paymentRequests,
    addPaymentRequest,
    collectPayment,
    balance,
    totalIncome,
    totalExpenses,
  } = useTransactions();
  
  const [activePeriod, setActivePeriod] = useState('1D');
  
  // Transaction Form State
  const [txDescription, setTxDescription] = useState('');
  const [txAmount, setTxAmount] = useState('');
  const [txType, setTxType] = useState('expense');

  // Savings state
  const [goalName, setGoalName] = useState('');
  const [goalTarget, setGoalTarget] = useState('');
  const [goalContribution, setGoalContribution] = useState('');
  const [selectedGoalId, setSelectedGoalId] = useState('');

  // Payment collection state
  const [requestTitle, setRequestTitle] = useState('');
  const [requestPurpose, setRequestPurpose] = useState('');
  const [requestTarget, setRequestTarget] = useState('');
  const [selectedRequestId, setSelectedRequestId] = useState('');
  const [collectionAmount, setCollectionAmount] = useState('');

  const displayName = user?.email?.split('@')[0] ?? 'there';
  const todayStr = new Intl.DateTimeFormat('en-GH', { month: 'long', day: 'numeric', year: 'numeric' }).format(new Date());

  const handleAddTransaction = (e) => {
    e.preventDefault();
    if (!txDescription || !txAmount) return;
    addTransaction({
      description: txDescription,
      amount: parseFloat(txAmount),
      type: txType,
    });
    setTxDescription('');
    setTxAmount('');
  };

  const handleAddSavingsGoal = (e) => {
    e.preventDefault();
    if (!goalName || !goalTarget) return;
    addSavingsGoal({ name: goalName, target: parseFloat(goalTarget) });
    setGoalName('');
    setGoalTarget('');
  };

  const handleContributeToGoal = (e) => {
    e.preventDefault();
    if (!selectedGoalId || !goalContribution) return;

    const contribution = parseFloat(goalContribution);
    contributeToGoal({ goalId: Number(selectedGoalId), amount: contribution });
    addTransaction({
      description: 'Savings contribution',
      amount: contribution,
      type: 'expense',
    });
    setGoalContribution('');
  };

  const handleAddPaymentRequest = (e) => {
    e.preventDefault();
    if (!requestTitle || !requestTarget) return;
    addPaymentRequest({
      title: requestTitle,
      purpose: requestPurpose,
      target: parseFloat(requestTarget),
    });
    setRequestTitle('');
    setRequestPurpose('');
    setRequestTarget('');
  };

  const handleCollectPayment = (e) => {
    e.preventDefault();
    if (!selectedRequestId || !collectionAmount) return;

    const amount = parseFloat(collectionAmount);
    collectPayment({ requestId: Number(selectedRequestId), amount });
    addTransaction({
      description: 'Payment collected',
      amount,
      type: 'income',
    });
    setCollectionAmount('');
  };

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
              {todayStr} · Your financial overview
            </p>
          </div>
          <button style={{ padding: '7px 16px', background: '#F3F4F6', color: '#6B7280', borderRadius: '8px', fontWeight: '600', fontSize: '0.8125rem', border: '1px solid #E5E7EB', cursor: 'pointer' }}>
            Settings
          </button>
        </div>
      </div>

      {/* ── Main 2-column grid ── */}
      <div
        className="dashboard-grid"
        style={{ maxWidth: '1280px', margin: '0 auto', padding: '28px 24px', display: 'grid', gridTemplateColumns: 'minmax(0,1.6fr) 360px', gap: '22px', alignItems: 'start' }}
      >
        {/* ────────── LEFT COLUMN ────────── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

          {/* Balance card */}
          <Reveal delay={0}>
            <div style={{ background: '#fff', borderRadius: '20px', border: '1px solid #E5E7EB', overflow: 'hidden' }}>
              <div style={{ padding: '26px 28px 0' }}>
                <p style={{ color: '#9CA3AF', fontSize: '0.75rem', fontWeight: '700', margin: '0 0 4px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Net Balance</p>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '14px', flexWrap: 'wrap' }}>
                  <span style={{ fontSize: 'clamp(1.75rem,4vw,2.25rem)', fontWeight: '800', color: '#111827', letterSpacing: '-0.03em' }}>
                    ₵{balance.toLocaleString('en-GH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                  <span style={{ color: balance >= 0 ? '#22C55E' : '#EF4444', fontWeight: '700', fontSize: '0.9375rem' }}>
                    {balance >= 0 ? 'Positve Balance' : 'Overdraft Warning'}
                  </span>
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

              {/* Income vs Expenses Summary */}
              <div style={{ padding: '4px 28px 22px', borderTop: '1px solid #F3F4F6', display: 'flex', justifyContent: 'space-between', gap: '20px' }}>
                  <div style={{ flex: 1, paddingTop: '16px' }}>
                      <p style={{ margin: 0, fontSize: '0.8rem', color: '#6B7280', fontWeight: '600' }}>Total Income</p>
                      <p style={{ margin: '4px 0 0', fontSize: '1.1rem', color: '#22C55E', fontWeight: '800' }}>+₵{totalIncome.toLocaleString()}</p>
                  </div>
                  <div style={{ width: '1px', background: '#F3F4F6' }}></div>
                  <div style={{ flex: 1, paddingTop: '16px', textAlign: 'right' }}>
                      <p style={{ margin: 0, fontSize: '0.8rem', color: '#6B7280', fontWeight: '600' }}>Total Expenses</p>
                      <p style={{ margin: '4px 0 0', fontSize: '1.1rem', color: '#EF4444', fontWeight: '800' }}>-₵{totalExpenses.toLocaleString()}</p>
                  </div>
              </div>
            </div>
          </Reveal>

          {/* Transactions List */}
          <Reveal delay={80}>
            <div style={{ background: '#fff', borderRadius: '20px', border: '1px solid #E5E7EB', padding: '24px 28px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>
                <h2 style={{ fontSize: '1.0625rem', fontWeight: '800', color: '#111827', margin: 0 }}>Recent Transactions</h2>
                <span style={{ fontSize: '0.875rem', fontWeight: '600', color: '#1652F0', cursor: 'pointer' }}>View all →</span>
              </div>
              <div className="table-scroll-wrap">
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr>
                    <th style={{ textAlign: 'left', padding: '8px 10px', fontSize: '0.7rem', fontWeight: '700', color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.07em', borderBottom: '1px solid #F3F4F6' }}>Description</th>
                    <th style={{ textAlign: 'left', padding: '8px 10px', fontSize: '0.7rem', fontWeight: '700', color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.07em', borderBottom: '1px solid #F3F4F6' }}>Date</th>
                    <th style={{ textAlign: 'right', padding: '8px 10px', fontSize: '0.7rem', fontWeight: '700', color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.07em', borderBottom: '1px solid #F3F4F6' }}>Amount</th>
                    <th style={{ textAlign: 'right', padding: '8px 10px', fontSize: '0.7rem', fontWeight: '700', color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.07em', borderBottom: '1px solid #F3F4F6' }}>XX</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((t) => (
                    <tr
                      key={t.id}
                      style={{ transition: 'background 0.1s' }}
                    >
                      <td style={{ padding: '12px 10px' }}>
                        <p style={{ margin: 0, fontWeight: '700', color: '#111827', fontSize: '0.875rem' }}>{t.description}</p>
                        <p style={{ margin: 0, color: '#9CA3AF', fontSize: '0.75rem' }}><span style={{ textTransform: 'capitalize' }}>{t.type}</span></p>
                      </td>
                      <td style={{ padding: '12px 10px', color: '#6B7280', fontSize: '0.8125rem' }}>
                        {new Date(t.date).toLocaleDateString()}
                      </td>
                      <td style={{ textAlign: 'right', padding: '12px 10px', fontWeight: '700', fontSize: '0.875rem', color: t.type === 'income' ? '#22C55E' : '#111827' }}>
                        {t.type === 'income' ? '+' : '-'} ₵{Number(t.amount).toLocaleString('en-GH', { minimumFractionDigits: 2 })}
                      </td>
                      <td style={{ textAlign: 'right', padding: '12px 10px' }}>
                         <button onClick={() => deleteTransaction(t.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#EF4444', fontWeight: 'bold' }}>×</button>
                      </td>
                    </tr>
                  ))}
                  {transactions.length === 0 && (
                      <tr>
                          <td colSpan="4" style={{ textAlign: 'center', padding: '20px', color: '#9CA3AF' }}>No transactions yet. Add one!</td>
                      </tr>
                  )}
                </tbody>
              </table>
              </div>
            </div>
          </Reveal>
        </div>

        {/* ────────── RIGHT COLUMN ────────── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

          {/* Add Transaction Form */}
          <Reveal delay={120}>
            <div style={{ background: '#fff', borderRadius: '20px', border: '1px solid #E5E7EB', padding: '24px' }}>
              <h2 style={{ fontSize: '1.0625rem', fontWeight: '800', color: '#111827', margin: '0 0 18px' }}>Add Transaction</h2>

              <form onSubmit={handleAddTransaction}>
                {/* Type toggle */}
                <div style={{ display: 'flex', background: '#F3F4F6', borderRadius: '12px', padding: '4px', marginBottom: '18px' }}>
                    {['income', 'expense'].map(type => (
                    <button
                        key={type}
                        type="button"
                        onClick={() => setTxType(type)}
                        style={{ flex: 1, padding: '8px', borderRadius: '9px', border: 'none', cursor: 'pointer', fontWeight: '700', fontSize: '0.875rem', background: txType === type ? '#fff' : 'transparent', color: txType === type ? (type === 'income' ? '#22C55E' : '#EF4444') : '#6B7280', boxShadow: txType === type ? '0 1px 4px rgba(0,0,0,0.08)' : 'none', transition: 'all 0.15s', textTransform: 'capitalize' }}
                    >
                        {type}
                    </button>
                    ))}
                </div>

                {/* Description */}
                <label style={{ display: 'block', color: '#374151', fontWeight: '600', fontSize: '0.8125rem', marginBottom: '6px' }}>Description</label>
                <input
                    type="text"
                    placeholder="Salary, Rent, etc."
                    value={txDescription}
                    onChange={e => setTxDescription(e.target.value)}
                    style={{ width: '100%', padding: '11px 14px', borderRadius: '10px', border: '1.5px solid #E5E7EB', fontSize: '0.9375rem', fontWeight: '600', color: '#111827', marginBottom: '14px', background: '#fff', outline: 'none', boxSizing: 'border-box' }}
                    onFocus={e => { e.target.style.borderColor = '#1652F0'; }}
                    onBlur={e => { e.target.style.borderColor = '#E5E7EB'; }}
                />

                {/* Amount */}
                <label style={{ display: 'block', color: '#374151', fontWeight: '600', fontSize: '0.8125rem', marginBottom: '6px' }}>Amount (GHS)</label>
                <div style={{ position: 'relative', marginBottom: '20px' }}>
                    <span style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#9CA3AF', fontWeight: '700', fontSize: '1rem', pointerEvents: 'none' }}>₵</span>
                    <input
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="0.00"
                    value={txAmount}
                    onChange={e => setTxAmount(e.target.value)}
                    style={{ width: '100%', padding: '11px 14px 11px 28px', borderRadius: '10px', border: '1.5px solid #E5E7EB', fontSize: '0.9375rem', color: '#111827', outline: 'none', boxSizing: 'border-box', fontWeight: '600', background: '#fff' }}
                    onFocus={e => { e.target.style.borderColor = '#1652F0'; }}
                    onBlur={e => { e.target.style.borderColor = '#E5E7EB'; }}
                    />
                </div>

                <button
                    type="submit"
                    style={{ width: '100%', padding: '13px', background: '#1652F0', color: '#fff', border: 'none', borderRadius: '12px', fontWeight: '800', fontSize: '1rem', cursor: 'pointer', transition: 'opacity 0.15s', letterSpacing: '0.01em' }}
                    onMouseEnter={e => { e.currentTarget.style.opacity = '0.88'; }}
                    onMouseLeave={e => { e.currentTarget.style.opacity = '1'; }}
                >
                    Add Transaction
                </button>
              </form>
            </div>
          </Reveal>

          {/* Savings goals */}
          <Reveal delay={150}>
            <div style={{ background: '#fff', borderRadius: '20px', border: '1px solid #E5E7EB', padding: '24px' }}>
              <h3 style={{ fontSize: '0.95rem', fontWeight: '800', color: '#111827', margin: '0 0 14px' }}>Savings Goals</h3>

              <form onSubmit={handleAddSavingsGoal} style={{ display: 'grid', gridTemplateColumns: '1fr 120px', gap: '8px', marginBottom: '14px' }}>
                <input
                  type="text"
                  placeholder="Goal name"
                  value={goalName}
                  onChange={e => setGoalName(e.target.value)}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '9px', border: '1.5px solid #E5E7EB', fontSize: '0.8125rem', fontWeight: '600', color: '#111827', outline: 'none' }}
                />
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="Target"
                  value={goalTarget}
                  onChange={e => setGoalTarget(e.target.value)}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '9px', border: '1.5px solid #E5E7EB', fontSize: '0.8125rem', fontWeight: '600', color: '#111827', outline: 'none' }}
                />
                <button
                  type="submit"
                  style={{ gridColumn: '1 / -1', width: '100%', padding: '10px', background: '#EEF2FF', color: '#1652F0', border: '1px solid #C7D2FE', borderRadius: '9px', fontWeight: '700', fontSize: '0.8125rem', cursor: 'pointer' }}
                >
                  Create goal
                </button>
              </form>

              <form onSubmit={handleContributeToGoal} style={{ display: 'grid', gridTemplateColumns: '1fr 110px', gap: '8px', marginBottom: '14px' }}>
                <select
                  value={selectedGoalId}
                  onChange={e => setSelectedGoalId(e.target.value)}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '9px', border: '1.5px solid #E5E7EB', fontSize: '0.8125rem', color: '#111827', background: '#fff', outline: 'none' }}
                >
                  <option value="">Select goal</option>
                  {savingsGoals.map(goal => (
                    <option key={goal.id} value={goal.id}>{goal.name}</option>
                  ))}
                </select>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="Amount"
                  value={goalContribution}
                  onChange={e => setGoalContribution(e.target.value)}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '9px', border: '1.5px solid #E5E7EB', fontSize: '0.8125rem', fontWeight: '600', color: '#111827', outline: 'none' }}
                />
                <button
                  type="submit"
                  style={{ gridColumn: '1 / -1', width: '100%', padding: '10px', background: '#1652F0', color: '#fff', border: 'none', borderRadius: '9px', fontWeight: '700', fontSize: '0.8125rem', cursor: 'pointer' }}
                >
                  Contribute to savings
                </button>
              </form>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {savingsGoals.slice(0, 3).map(goal => {
                  const progress = goal.target > 0 ? Math.min(100, (Number(goal.saved) / Number(goal.target)) * 100) : 0;
                  return (
                    <div key={goal.id} style={{ border: '1px solid #F3F4F6', borderRadius: '10px', padding: '10px 12px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', gap: '8px', marginBottom: '6px' }}>
                        <span style={{ color: '#111827', fontWeight: '700', fontSize: '0.8125rem' }}>{goal.name}</span>
                        <span style={{ color: '#6B7280', fontSize: '0.75rem' }}>{Math.round(progress)}%</span>
                      </div>
                      <div style={{ width: '100%', height: '7px', background: '#F3F4F6', borderRadius: '999px', overflow: 'hidden', marginBottom: '4px' }}>
                        <div style={{ width: `${progress}%`, height: '100%', background: '#1652F0' }} />
                      </div>
                      <p style={{ margin: 0, fontSize: '0.75rem', color: '#6B7280' }}>
                        ₵{Number(goal.saved).toLocaleString('en-GH', { minimumFractionDigits: 2 })} / ₵{Number(goal.target).toLocaleString('en-GH', { minimumFractionDigits: 2 })}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          </Reveal>

          {/* Payment collection */}
          <Reveal delay={180}>
            <div style={{ background: '#fff', borderRadius: '20px', border: '1px solid #E5E7EB', padding: '24px' }}>
              <h3 style={{ fontSize: '0.95rem', fontWeight: '800', color: '#111827', margin: '0 0 14px' }}>Payment Collection</h3>

              <form onSubmit={handleAddPaymentRequest} style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '14px' }}>
                <input
                  type="text"
                  placeholder="Request title"
                  value={requestTitle}
                  onChange={e => setRequestTitle(e.target.value)}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '9px', border: '1.5px solid #E5E7EB', fontSize: '0.8125rem', fontWeight: '600', color: '#111827', outline: 'none' }}
                />
                <input
                  type="text"
                  placeholder="Purpose (optional)"
                  value={requestPurpose}
                  onChange={e => setRequestPurpose(e.target.value)}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '9px', border: '1.5px solid #E5E7EB', fontSize: '0.8125rem', color: '#111827', outline: 'none' }}
                />
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="Target amount"
                  value={requestTarget}
                  onChange={e => setRequestTarget(e.target.value)}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '9px', border: '1.5px solid #E5E7EB', fontSize: '0.8125rem', fontWeight: '600', color: '#111827', outline: 'none' }}
                />
                <button
                  type="submit"
                  style={{ width: '100%', padding: '10px', background: '#EEF2FF', color: '#1652F0', border: '1px solid #C7D2FE', borderRadius: '9px', fontWeight: '700', fontSize: '0.8125rem', cursor: 'pointer' }}
                >
                  Create collection
                </button>
              </form>

              <form onSubmit={handleCollectPayment} style={{ display: 'grid', gridTemplateColumns: '1fr 110px', gap: '8px', marginBottom: '12px' }}>
                <select
                  value={selectedRequestId}
                  onChange={e => setSelectedRequestId(e.target.value)}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '9px', border: '1.5px solid #E5E7EB', fontSize: '0.8125rem', color: '#111827', background: '#fff', outline: 'none' }}
                >
                  <option value="">Select request</option>
                  {paymentRequests.map(request => (
                    <option key={request.id} value={request.id}>{request.title}</option>
                  ))}
                </select>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="Amount"
                  value={collectionAmount}
                  onChange={e => setCollectionAmount(e.target.value)}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '9px', border: '1.5px solid #E5E7EB', fontSize: '0.8125rem', fontWeight: '600', color: '#111827', outline: 'none' }}
                />
                <button
                  type="submit"
                  style={{ gridColumn: '1 / -1', width: '100%', padding: '10px', background: '#16A34A', color: '#fff', border: 'none', borderRadius: '9px', fontWeight: '700', fontSize: '0.8125rem', cursor: 'pointer' }}
                >
                  Record payment
                </button>
              </form>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {paymentRequests.slice(0, 3).map(request => {
                  const progress = request.target > 0 ? Math.min(100, (Number(request.collected) / Number(request.target)) * 100) : 0;
                  return (
                    <div key={request.id} style={{ border: '1px solid #F3F4F6', borderRadius: '10px', padding: '10px 12px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', gap: '8px', marginBottom: '4px' }}>
                        <span style={{ color: '#111827', fontWeight: '700', fontSize: '0.8125rem' }}>{request.title}</span>
                        <span style={{ color: '#16A34A', fontWeight: '700', fontSize: '0.75rem' }}>{Math.round(progress)}%</span>
                      </div>
                      {request.purpose && <p style={{ margin: '0 0 6px', color: '#6B7280', fontSize: '0.75rem' }}>{request.purpose}</p>}
                      <div style={{ width: '100%', height: '7px', background: '#F3F4F6', borderRadius: '999px', overflow: 'hidden', marginBottom: '4px' }}>
                        <div style={{ width: `${progress}%`, height: '100%', background: '#16A34A' }} />
                      </div>
                      <p style={{ margin: 0, fontSize: '0.75rem', color: '#6B7280' }}>
                        ₵{Number(request.collected).toLocaleString('en-GH', { minimumFractionDigits: 2 })} / ₵{Number(request.target).toLocaleString('en-GH', { minimumFractionDigits: 2 })}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          </Reveal>

        </div>
      </div>
    </div>
  );
}

