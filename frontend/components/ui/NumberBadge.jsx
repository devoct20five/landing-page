export default function NumberBadge({ n, className = '' }) {
  return <span className={`num-badge ${className}`}>{String(n).padStart(2, '0')}</span>
}
