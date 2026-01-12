import { Badge } from '@/components/Badge'

export function SectionHeader({
  kicker,
  title,
  subtitle
}: {
  kicker: string
  title: string
  subtitle?: string
}) {
  return (
    <div className="max-w-2xl">
      <Badge>{kicker}</Badge>
      <h2 className="mt-4 text-2xl font-semibold tracking-tight sm:text-3xl">{title}</h2>
      {subtitle ? <p className="mt-3 text-sm leading-relaxed text-white/70">{subtitle}</p> : null}
    </div>
  )
}
