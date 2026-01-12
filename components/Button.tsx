import Link from 'next/link'
import { cn } from '@/lib/cn'

type Variant = 'primary' | 'ghost'

type Props = {
  href: string
  children: React.ReactNode
  variant?: Variant
  className?: string
}

export function Button({ href, children, variant = 'primary', className }: Props) {
  const base =
    'inline-flex items-center justify-center rounded-full px-5 py-3 text-sm font-semibold tracking-wide transition focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue focus-visible:ring-offset-2 focus-visible:ring-offset-black'

  const styles: Record<Variant, string> = {
    primary:
      'bg-brand-blue text-white shadow-soft hover:opacity-90',
    ghost:
      'bg-white/0 text-white ring-1 ring-white/15 hover:bg-white/5'
  }

  return (
    <Link href={href} className={cn(base, styles[variant], className)}>
      {children}
    </Link>
  )
}
