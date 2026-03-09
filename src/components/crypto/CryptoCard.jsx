import { Link } from 'react-router-dom';

const COIN_COLORS = {
  bitcoin:      '#F59E0B',
  ethereum:     '#6366F1',
  tether:       '#14B8A6',
  'binance-coin': '#EAB308',
  solana:       '#8B5CF6',
  usdc:         '#3B82F6',
  cardano:      '#1D4ED8',
  ripple:       '#0EA5E9',
  dogecoin:     '#F59E0B',
  polkadot:     '#EC4899',
};

function CryptoCard({ coin, rank }) {
  const isUp = coin.change24h >= 0;
  const color = COIN_COLORS[coin.id] || '#6B7280';

  return (
    <Link
      to={`/asset/${coin.id}`}
      className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors no-underline group"
      style={{ textDecoration: 'none' }}
    >
      {rank && (
        <span className="text-xs font-semibold text-gray-400 w-4 shrink-0">{rank}</span>
      )}
      <div
        className="w-9 h-9 rounded-full flex items-center justify-center shrink-0 font-bold text-white text-xs"
        style={{ background: color }}
      >
        {coin.symbol.slice(0, 2)}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-700 text-gray-900 truncate leading-tight">{coin.name}</p>
        <p className="text-xs text-gray-400 leading-tight">{coin.symbol}</p>
      </div>
      <div className="text-right shrink-0">
        <p className="text-sm font-semibold text-gray-900 tabular-nums">
          ${coin.price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </p>
        <p className={`text-xs font-semibold ${isUp ? 'text-green-600' : 'text-red-500'}`}>
          {isUp ? '▲' : '▼'} {Math.abs(coin.change24h).toFixed(2)}%
        </p>
      </div>
    </Link>
  );
}

export default CryptoCard;
