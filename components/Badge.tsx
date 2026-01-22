import { cn } from '@/lib/cn'

export function Badge({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-2 rounded-full bg-white/5 px-3 py-1 text-xs font-semibold tracking-wide text-white ring-1 ring-white/10',
        className
      )}
    >
      {children}
    </span>
  )
  
}
