import './globals.css'
import { Oswald } from 'next/font/google'
import { Providers } from './providers'
import SmoothScroll from '@/components/motion/SmoothScroll'

// Display: Oswald — the closest Google-Fonts fallback to Eurostile per the brand plan (§5).
// Body: Satoshi Variable — loaded via Fontshare in globals.css @import.
const oswald = Oswald({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-display',
  display: 'swap',
})

export const metadata = {
  title: 'OCT20FIVE — A Creative Ecosystem Built for the Future',
  description: 'Concept. Create. Deliver. Editing, Design, 3D Ads, Web Dev — full-spectrum creative services for brands, agencies and creators.',
  metadataBase: new URL('https://oct20five.example.com'),
  openGraph: {
    title: 'OCT20FIVE — A Creative Ecosystem',
    description: 'Concept. Create. Deliver.',
    type: 'website',
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={oswald.variable}>
      <head>
        <link rel="preconnect" href="https://api.fontshare.com" />
        <link rel="stylesheet" href="https://api.fontshare.com/v2/css?f[]=satoshi@300,400,500,700,900&display=swap" />
        <script dangerouslySetInnerHTML={{__html:'window.addEventListener("error",function(e){if(e.error instanceof DOMException&&e.error.name==="DataCloneError"&&e.message&&e.message.includes("PerformanceServerTiming")){e.stopImmediatePropagation();e.preventDefault()}},true);'}} />
      </head>
      <body className="antialiased">
        <Providers>
          <SmoothScroll>{children}</SmoothScroll>
        </Providers>
      </body>
    </html>
  )
}
