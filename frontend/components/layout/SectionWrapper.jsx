export default function SectionWrapper({ theme = 'light', className = '', children, id, noPad = false }) {
  const themeCls = theme === 'dark' ? 'theme-dark' : theme === 'peach' ? 'theme-peach' : 'theme-light'
  return (
    <section id={id} data-theme={theme} className={`section ${themeCls} ${noPad ? '' : 'py-24 md:py-32'} ${className}`}>
      {children}
    </section>
  )
}
