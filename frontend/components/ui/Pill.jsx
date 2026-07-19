export default function Pill({ children, active = false, className = '', as = 'span', ...props }) {
  const Tag = as
  return (
    <Tag className={`pill ${active ? 'pill-active' : ''} ${className}`} {...props}>
      {children}
    </Tag>
  )
}
