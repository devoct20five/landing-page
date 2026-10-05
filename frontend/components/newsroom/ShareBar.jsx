'use client'

import { useEffect, useState } from 'react'
import { Link2, Check, Linkedin, Twitter, Mail, MessageCircle } from 'lucide-react'

/** Share links use the page's real URL at click time (works on any domain). */
export default function ShareBar({ title, fallbackUrl = '', orientation = 'row' }) {
  const [url, setUrl] = useState(fallbackUrl)
  const [copied, setCopied] = useState(false)
  useEffect(() => setUrl(window.location.href), [])

  const enc = encodeURIComponent
  const items = [
    { label: 'Share on X', href: `https://twitter.com/intent/tweet?text=${enc(title)}&url=${enc(url)}`, Icon: Twitter },
    { label: 'Share on LinkedIn', href: `https://www.linkedin.com/sharing/share-offsite/?url=${enc(url)}`, Icon: Linkedin },
    { label: 'Share on WhatsApp', href: `https://wa.me/?text=${enc(`${title} ${url}`)}`, Icon: MessageCircle },
    { label: 'Share by email', href: `mailto:?subject=${enc(title)}&body=${enc(url)}`, Icon: Mail },
  ]
  const btn =
    'flex h-11 w-11 items-center justify-center rounded-full border border-brand-border bg-brand-card text-brand-black transition-colors hover:border-brand-orange hover:bg-brand-orange hover:text-brand-cream'

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      window.prompt('Copy this link', url)
    }
  }

  return (
    <div className={`flex gap-2.5 ${orientation === 'col' ? 'flex-col' : 'flex-row flex-wrap items-center'}`}>
      <button onClick={copy} aria-label="Copy link" className={btn}>
        {copied ? <Check size={17} className="text-brand-orange" /> : <Link2 size={17} />}
      </button>
      {items.map(({ label, href, Icon }) => (
        <a key={label} href={href} target={href.startsWith('mailto') ? undefined : '_blank'} rel="noopener noreferrer" aria-label={label} className={btn}>
          <Icon size={17} />
        </a>
      ))}
      <span role="status" className="text-xs font-bold uppercase tracking-wider text-brand-orange">{copied ? 'Link copied' : ''}</span>
    </div>
  )
}
