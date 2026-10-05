import { Suspense } from 'react'
import PortfolioCatalogue from '@/components/portfolio/PortfolioCatalogue'

export const metadata = {
  title: 'Portfolio',
  description:
    'The OCT20FIVE portfolio — editing, design, 3D ads and web development, filterable by service.',
}

export default function PortfolioPage() {
  return (
    <Suspense fallback={null}>
      <PortfolioCatalogue />
    </Suspense>
  )
}
