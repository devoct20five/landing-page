import ServicePageTemplate from '@/components/sections/ServicePageTemplate'
import { SERVICES } from '@/data/content'

export const metadata = { title: 'Web Dev — OCT20FIVE', description: 'Design. Develop. Deploy. Fast, animated, high-converting sites.' }

export default function Page() {
  return <ServicePageTemplate data={SERVICES['web-dev']} />
}
