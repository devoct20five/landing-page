import { notFound } from 'next/navigation'
import NewsroomHome from '@/components/newsroom/NewsroomHome'
import { CATEGORIES, getCategory } from '@/lib/newsroom'

export const dynamicParams = false
export const generateStaticParams = () => CATEGORIES.map((c) => ({ category: c.slug }))

export async function generateMetadata({ params }) {
  const { category } = await params
  const c = getCategory(category)
  return c ? { title: `${c.label} — Newsroom`, description: c.description } : {}
}

export default async function CategoryPage({ params }) {
  const { category } = await params
  const c = getCategory(category)
  if (!c) notFound()
  return <NewsroomHome category={c} />
}
