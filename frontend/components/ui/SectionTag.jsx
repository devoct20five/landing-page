export default function SectionTag({ children, className = '' }) {
  return (
    <span className={`eyebrow ${className}`}>
      <span className="eyebrow-dot" />
      {children}
    </span>
  )
}
