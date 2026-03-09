function PriceChart({ positive = true, height = 56, className = '' }) {
  const upPath   = 'M0,48 C20,44 35,38 55,30 C75,22 90,26 110,18 C130,10 145,8 165,5 C185,2 200,4 220,2';
  const downPath = 'M0,6 C20,10 35,16 55,24 C75,32 90,28 110,36 C130,44 145,46 165,49 C185,52 200,50 220,52';
  const path   = positive ? upPath : downPath;
  const stroke = positive ? '#16A34A' : '#DC2626';
  const fillId = positive ? 'chartUp' : 'chartDown';
  const fillColor = positive ? '#16A34A' : '#DC2626';
  const endpoint = positive ? 2 : 52;

  return (
    <div className={`w-full overflow-hidden ${className}`} style={{ height }}>
      <svg viewBox="0 0 220 56" width="100%" height={height} preserveAspectRatio="none">
        <defs>
          <linearGradient id={fillId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={fillColor} stopOpacity="0.18" />
            <stop offset="100%" stopColor={fillColor} stopOpacity="0.01" />
          </linearGradient>
        </defs>
        <path
          d={`${path} L220,56 L0,56 Z`}
          fill={`url(#${fillId})`}
        />
        <path
          d={path}
          fill="none"
          stroke={stroke}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx="220" cy={endpoint} r="3" fill={stroke} />
      </svg>
    </div>
  );
}

export default PriceChart;
