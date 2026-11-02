import { ChevronRight } from 'lucide-react'

export interface BreadcrumbItem {
  label: string
  href?: string
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[]
}

export default function Breadcrumbs({ items }: BreadcrumbsProps) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.label,
      item: item.href ? `https://chintan992.dev${item.href}` : undefined,
    })),
  }

  return (
    <nav aria-label="Breadcrumb" className="mb-6">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ol className="flex items-center flex-wrap gap-1.5 text-xs font-medium text-zinc-400">
        {items.map((item, idx) => {
          const isLast = idx === items.length - 1
          return (
            <li key={item.label} className="flex items-center gap-1.5">
              {idx > 0 && <ChevronRight className="w-3 h-3 text-zinc-600 shrink-0" />}
              {isLast || !item.href ? (
                <span className="text-white font-medium">{item.label}</span>
              ) : (
                <a
                  href={item.href}
                  className="hover:text-white transition-colors"
                >
                  {item.label}
                </a>
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}

