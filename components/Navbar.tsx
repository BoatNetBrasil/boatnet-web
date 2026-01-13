'use client'

import { useEffect, useState } from 'react'
import { Container } from '@/components/Container'
import { Button } from '@/components/Button'
import { cn } from '@/lib/cn'

const links = [
  { href: '#servicos', label: 'Serviços' },
  { href: '#passo-a-passo', label: 'Passo a passo' },
  { href: '#parceiros', label: 'Parceiros' },
]

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <div
      className={cn(
        'fixed top-0 z-50 w-full transition',
        scrolled ? 'backdrop-blur-md bg-black/25 ring-1 ring-white/10' : 'bg-transparent'
      )}
    >
      <Container className="flex h-16 items-center justify-between">
        <a href="#top" className="flex items-center gap-3">
          <span className="text-sm font-semibold tracking-[0.22em] text-white/90">
            BOATNET
          </span>
        </a>

        <nav className="hidden items-center gap-6 md:flex">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-xs font-semibold tracking-wide text-white/75 hover:text-white transition"
            >
              {l.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <Button
            href={process.env.NEXT_PUBLIC_APP_STORE_URL || '#'}
            variant="ghost"
            className="hidden sm:inline-flex"
          >
            Baixe o app
          </Button>

          <Button href="#parceiros">Virar parceiro</Button>
        </div>
      </Container>
    </div>
  )
}
