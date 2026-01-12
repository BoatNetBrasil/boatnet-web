'use client'

import { useEffect, useMemo, useRef } from 'react'
import { Container } from '@/components/Container'

const words = [
  'O SITE POSICIONA',
  'O APP FECHA',
  'CURADORIA',
  'BOOKING',
  'PAGAMENTO',
  'REPASSE',
  'REPUTAÇÃO',
  'MARINAS',
  'SERVIÇOS',
  'COMPRA & VENDA',
  'SUPORTE',
  'HISTÓRICO'
]

export function Marquee() {
  const trackRef = useRef<HTMLDivElement | null>(null)

  const line = useMemo(() => words.join(' • '), [])
  const repeated = useMemo(() => Array.from({ length: 6 }).map(() => line).join('   •   '), [line])

  useEffect(() => {
    const el = trackRef.current
    if (!el) return

    let raf = 0
    let x = 0
    let last = performance.now()

    // px/s (independente de FPS)
    const velocity = 42

    const tick = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000)
      last = now
      x += velocity * dt

      // metade do conteúdo (porque repetimos muito)
      const w = el.scrollWidth / 2
      if (w > 0 && x >= w) x -= w

      el.style.transform = `translate3d(${-x}px, 0, 0)`
      raf = requestAnimationFrame(tick)
    }

    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [])

  return (
    <section aria-label="Linha editorial" className="relative py-8 sm:py-10">
      <div className="pointer-events-none absolute inset-x-0 top-0">
        <div className="hr" />
      </div>
      <div className="pointer-events-none absolute inset-x-0 bottom-0">
        <div className="hr" />
      </div>

      <Container>
        <div
          className={[
            'relative overflow-hidden rounded-3xl ring-1 ring-white/10 glow',
            'bg-white/5',
            'isolate'
          ].join(' ')}
        >
          {/* fade nas bordas */}
          <div className="pointer-events-none absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-[#030B16]/90 to-transparent" />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-[#030B16]/90 to-transparent" />

          {/* brilho sutil no fundo */}
          <div className="pointer-events-none absolute -inset-10 bg-brand-blue/10 blur-3xl opacity-40" />

          <div className="px-2 py-4 sm:px-3 sm:py-5">
            <div className="overflow-hidden">
              <div
                ref={trackRef}
                className="inline-flex whitespace-nowrap will-change-transform"
                style={{ transform: 'translate3d(0,0,0)' }}
              >
                <span className="px-6 text-[13px] font-semibold tracking-[0.18em] text-white/65 sm:text-sm">
                  {repeated}
                </span>
                {/* duplicata real para loop perfeito */}
                <span className="px-6 text-[13px] font-semibold tracking-[0.18em] text-white/65 sm:text-sm">
                  {repeated}
                </span>
              </div>
            </div>

            <div className="mt-2 flex items-center justify-center gap-2 text-[11px] font-semibold tracking-wide text-white/45">
              <span className="h-1 w-1 rounded-full bg-white/25" />
              <span>ECOSSISTEMA NÁUTICO • DO FEED AO PAGAMENTO</span>
              <span className="h-1 w-1 rounded-full bg-white/25" />
            </div>
          </div>
        </div>
      </Container>
    </section>
  )
}
