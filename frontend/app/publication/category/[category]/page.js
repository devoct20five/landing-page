import { notFound } from 'next/navigation'
import PublicationHome from '@/components/publication/PublicationHome'
import { CATEGORIES, getCategory } from '@/lib/publication'

export const dynamicParams = false
export const generateStaticParams = () => CATEGORIES.map((c) => ({ category: c.slug }))

export async function generateMetadata({ params }) {
  const { category } = await params
  const c = getCategory(category)
  return c ? { title: `${c.label} — Publication`, description: c.description } : {}
}

export default async function CategoryPage({ params }) {
  const { category } = await params
  const c = getCategory(category)
  if (!c) notFound()
  return <PublicationHome category={c} />
}
