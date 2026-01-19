'use client'

import Image from 'next/image'
import { motion, useReducedMotion } from 'framer-motion'
import { Container } from '@/components/Container'
import { Button } from '@/components/Button'
import { Badge } from '@/components/Badge'

const cards = [
  { k: 'EXPERIÊNCIA', v: 'Jornada premium, sem fricção' },
  { k: 'CURADORIA', v: 'Seleção que economiza tempo' },
  { k: 'RESERVAS', v: 'Clareza do início ao fim' },
  { k: 'PAGAMENTOS', v: 'Segurança + comprovantes' },
  { k: 'CONFIANÇA', v: 'Regras claras e suporte' },
  { k: 'AVALIAÇÕES', v: 'Reputação que orienta escolhas' }
]

export function Hero() {
  const reduce = useReducedMotion()

  return (
    <section id="top" className="relative overflow-hidden pb-10 pt-28 sm:pb-14 sm:pt-32">
      <WaveBackdrop />

      <Container>
        <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
          {/* LEFT */}
          <div className="relative z-10">
            <Badge>
              <span className="inline-flex items-center gap-2">
                <span className="relative inline-flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand-blue/60 opacity-40" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-brand-blue" />
                </span>
                Curadoria • Reservas • Confiança
              </span>
            </Badge>

            <motion.h1
              initial={reduce ? { opacity: 1 } : { opacity: 0, y: 10 }}
              animate={reduce ? { opacity: 1 } : { opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              className="mt-5 text-4xl font-semibold leading-[1.05] tracking-tight sm:text-5xl"
            >
              O mar inspira.
              <span className="block text-white/70">A BOAT NET padroniza.</span>
            </motion.h1>

            <p className="mt-5 max-w-xl text-base leading-relaxed text-white/70">
              Uma plataforma para encontrar serviços, embarcações, marinas, experiências e compra & venda com curadoria, regras claras e suporte humano durante toda negociação.{' '}
              <span className="text-white/85 font-semibold">Todo o mundo náutico em um só lugar.</span>.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Button href={process.env.NEXT_PUBLIC_APP_STORE_URL || '#o-app'}>Baixar o APP</Button>
              <Button href="#servicos" variant="ghost">
                Explorar serviços
              </Button>
            </div>

            <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3">
              {cards.map((item, i) => (
                <motion.div
                  key={item.k}
                  initial={reduce ? { opacity: 1 } : { opacity: 0, y: 10 }}
                  whileInView={reduce ? { opacity: 1 } : { opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.35 }}
                  transition={{ duration: 0.6, ease: 'easeOut', delay: 0.04 * i }}
                  className={[
                    'rounded-2xl bg-white/5 p-4 ring-1 ring-white/10 glow',
                    'transition hover:bg-white/[0.07] hover:ring-white/15',
                    'text-center'
                  ].join(' ')}
                >
                  <div className="text-[11px] font-semibold tracking-[0.22em] text-white/55">{item.k}</div>
                  <div className="mt-2 text-sm font-semibold text-white/90">{item.v}</div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* RIGHT */}
          <div className="relative z-10 flex flex-col items-center lg:items-end">
            <div className="absolute -inset-6 rounded-[32px] bg-brand-blue/10 blur-2xl" />

            <div className="relative w-[300px] sm:w-[340px] lg:w-[360px]">
              <motion.div
                initial={reduce ? { opacity: 1 } : { opacity: 0, y: 12 }}
                whileInView={reduce ? { opacity: 1 } : { opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.7, ease: 'easeOut' }}
                className="relative"
              >
                <PhoneMock src="/placeholders/app-shot-1.png" />
              </motion.div>

              <div className="mt-6 flex flex-wrap justify-center gap-3">
                <Pill>IOS FIRST</Pill>
                <Pill>PARCEIROS VERIFICADOS</Pill>
                <Pill>PADRÃO PREMIUM</Pill>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  )
}

function PhoneMock({ src }: { src: string }) {
  return (
    <div className="relative">
      <div className="pointer-events-none absolute -inset-10 rounded-[56px] bg-brand-blue/12 blur-3xl" />
      <Image
        src={src}
        alt="App preview"
        width={900}
        height={1950}
        priority
        className="relative h-auto w-full select-none object-contain drop-shadow-[0_28px_70px_rgba(0,0,0,0.55)]"
      />
    </div>
  )
}

function WaveBackdrop() {
  return (
    <>
      <style jsx global>{`
        @keyframes bn-wave-x {
          from {
            transform: translateX(0);
          }
          to {
            transform: translateX(-50%);
          }
        }
        @keyframes bn-shimmer {
          0% {
            transform: translateX(-38%);
            opacity: 0;
          }
          18% {
            opacity: 0.22;
          }
          60% {
            opacity: 0.12;
          }
          100% {
            transform: translateX(38%);
            opacity: 0;
          }
        }
      `}</style>

      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -inset-x-24 top-8 h-[420px] rotate-[-8deg] bg-brand-blue/10 blur-3xl" />

        <div
          className="absolute -inset-y-12 left-1/2 w-[560px] -translate-x-1/2 rounded-full bg-white/10 blur-3xl"
          style={{ animation: 'bn-shimmer 7.2s ease-in-out infinite' }}
        />

        <div
          className="absolute inset-x-0 bottom-[-90px] h-[420px] opacity-60"
          style={{
            maskImage: 'linear-gradient(to top, black 0%, black 45%, transparent 100%)',
            WebkitMaskImage: 'linear-gradient(to top, black 0%, black 45%, transparent 100%)',
            mixBlendMode: 'overlay'
          }}
        >
          <div className="absolute inset-0">
            <div className="absolute inset-0 flex w-[200%]" style={{ animation: 'bn-wave-x 12s linear infinite' }}>
              <WavesSVG />
              <WavesSVG />
            </div>
          </div>
        </div>

        <div
          className="absolute inset-0 opacity-[0.10]"
          style={{
            backgroundImage:
              'linear-gradient(to right, rgba(255,255,255,0.08) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.08) 1px, transparent 1px)',
            backgroundSize: '72px 72px',
            maskImage: 'radial-gradient(60% 55% at 30% 25%, black 35%, transparent 72%)',
            WebkitMaskImage: 'radial-gradient(60% 55% at 30% 25%, black 35%, transparent 72%)'
          }}
        />
      </div>
    </>
  )
}

function WavesSVG() {
  return (
    <svg className="h-full w-1/2" viewBox="0 0 1200 360" preserveAspectRatio="none" aria-hidden="true">
      <defs>
        <linearGradient id="bnWaveGrad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="rgba(0,122,255,0.00)" />
          <stop offset="38%" stopColor="rgba(0,122,255,0.22)" />
          <stop offset="70%" stopColor="rgba(255,255,255,0.10)" />
          <stop offset="100%" stopColor="rgba(0,122,255,0.00)" />
        </linearGradient>
      </defs>

      <g fill="none" stroke="url(#bnWaveGrad)" strokeWidth="2">
        <path d="M0,210 C150,150 300,270 450,210 C600,150 750,270 900,210 C1050,150 1150,250 1200,210" opacity="0.55" />
        <path d="M0,250 C170,190 310,310 480,250 C650,190 800,310 970,250 C1090,205 1160,285 1200,250" opacity="0.38" />
        <path d="M0,170 C160,115 320,235 480,170 C640,105 790,235 950,170 C1080,125 1160,205 1200,170" opacity="0.28" />
      </g>

      <g fill="none" stroke="rgba(255,255,255,0.10)" strokeWidth="1">
        <path d="M0,290 C170,230 320,350 490,290 C660,230 820,350 990,290 C1110,245 1170,325 1200,290" opacity="0.32" />
      </g>
    </svg>
  )
}

function Pill({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-full bg-white/5 px-4 py-2 text-[11px] font-semibold tracking-[0.18em] text-white/70 ring-1 ring-white/10">
      {children}
    </div>
  )
}
