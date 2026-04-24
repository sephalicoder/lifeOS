export default function ProgressBar({ pct, color = '#d4a853', className = '' }) {
  return (
    <div className={`progress-track ${className}`}>
      <div
        className="progress-fill"
        style={{ width: `${pct}%`, background: color }}
      />
    </div>
  )
}
