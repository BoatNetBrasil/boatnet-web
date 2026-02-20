'use client'

import Image from 'next/image'
import { useEffect, useState } from 'react'
import { Container } from '@/components/Container'
import { Reveal } from '@/components/Reveal'
import { Badge } from '@/components/Badge'
import { Button } from '@/components/Button'
import { ChatWidget } from '@/components/ChatWidget'

const shots = ['/placeholders/app-shot-2.png', '/placeholders/app-shot-3.png', '/placeholders/app-shot-4.png']

function GhostButton({
  onClick,
  children,
  ariaLabel
}: {
  onClick: () => void
  children: React.ReactNode
  ariaLabel?: string
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={ariaLabel}
      className={[
        'inline-flex items-center justify-center rounded-full px-6 py-3',
        'text-sm font-semibold tracking-wide',
        'text-white/85 ring-1 ring-white/15 bg-white/5',
        'transition hover:bg-white/10 hover:text-white',
        'active:scale-[0.98]'
      ].join(' ')}
    >
      {children}
    </button>
  )
}

export function AppCTA() {
  const [idx, setIdx] = useState(0)

  useEffect(() => {
    const id = window.setInterval(() => setIdx((i) => (i + 1) % shots.length), 3500)
    return () => window.clearInterval(id)
  }, [])

  return (
    <section id="o-app" className="py-16 sm:py-20">
      <ChatWidget />

      <Container>
        <div className="grid items-center gap-10 lg:grid-cols-[1fr_0.92fr]">
          <Reveal>
            <Badge>BOAT NET APP</Badge>

            <h2 className="mt-4 text-2xl font-semibold tracking-tight sm:text-3xl">
              Concierge, curadoria e execução.
              <span className="block text-white/70">O mercado náutico no padrão BOAT NET.</span>
            </h2>

            <p className="mt-4 max-w-xl text-sm leading-relaxed text-white/70">
              O site mostra o ecossistema. O app é onde você fecha: reservas, serviços e compra & venda com parceiros
              verificados, políticas claras e suporte ponta a ponta.
            </p>

            <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Button href={process.env.NEXT_PUBLIC_APP_STORE_URL || '#'}>Baixar no App Store</Button>

              <GhostButton ariaLabel="Virar parceiro (abre o chat)" onClick={() => window.BNChat?.open({ preset: 'partner' })}>
                Virar parceiro
              </GhostButton>

              <GhostButton ariaLabel="Reservar (abre o chat)" onClick={() => window.BNChat?.open({ preset: 'booking' })}>
                Reservar agora
              </GhostButton>
            </div>

            <div className="mt-8 rounded-3xl bg-white/5 p-6 ring-1 ring-white/10 glow">
              <div className="text-xs font-semibold tracking-wide text-white/60">Pilares BOAT NET</div>

              <div className="mt-3 grid gap-3 sm:grid-cols-3">
                {[
                  { k: 'Curadoria', v: 'parceiros verificados' },
                  { k: 'Segurança', v: 'regras e políticas claras' },
                  { k: 'Operação', v: 'fluxo sem ruído' },
                  { k: 'Desejo', v: 'vitrine editorial premium' },
                  { k: 'Descoberta', v: 'categorias por intenção' },
                  { k: 'Conversão', v: 'do site pro app' }
                ].map((x) => (
                  <div key={x.k} className="rounded-2xl bg-black/20 p-4 ring-1 ring-white/10">
                    <div className="text-xs font-semibold tracking-wide text-white/60">{x.k}</div>
                    <div className="mt-2 text-sm font-semibold text-white/90">{x.v}</div>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.08}>
            <div className="relative mx-auto w-[320px] sm:w-[360px]">
              <div className="pointer-events-none absolute -inset-6 -z-10 rounded-[36px] bg-[radial-gradient(circle_at_30%_20%,rgba(59,130,246,0.25),transparent_55%),radial-gradient(circle_at_70%_80%,rgba(255,255,255,0.08),transparent_55%)] blur-2xl" />

              <Image src={shots[idx]} alt="App screenshot" width={900} height={1950} className="h-auto w-full" priority={idx === 0} />

              <div className="mt-4 flex items-center justify-center gap-2">
                {shots.map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setIdx(i)}
                    className={[
                      'h-2.5 rounded-full transition',
                      i === idx ? 'w-6 bg-brand-blue' : 'w-2.5 bg-white/20 hover:bg-white/35'
                    ].join(' ')}
                    aria-label={`Ir para screenshot ${i + 1}`}
                  />
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </Container>
    </section>
  )
}
