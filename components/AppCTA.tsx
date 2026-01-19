'use client'

import Image from 'next/image'
import { useEffect, useMemo, useState } from 'react'
import { Container } from '@/components/Container'
import { Reveal } from '@/components/Reveal'
import { Badge } from '@/components/Badge'
import { Button } from '@/components/Button'

const shots = [
  '/placeholders/app-shot-2.png',
  '/placeholders/app-shot-3.png',
  '/placeholders/app-shot-4.png'
]

const WHATSAPP_NUMBER = '+5511941752551'

function waLink(message: string) {
  const digits = WHATSAPP_NUMBER.replace(/\D/g, '')
  return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`
}

function buildWhatsAppMessage(kind: 'partner' | 'fast') {
  if (kind === 'partner') {
    return [
      'Olá! Quero virar parceiro(a) da BOAT NET.',
      '',
      '✅ Tipo: Parceiro / Marina / Loja-Broker',
      '✅ Cidade/UF:',
      '✅ Empresa (nome fantasia):',
      '✅ CNPJ (se tiver):',
      '✅ Instagram/Site:',
      '',
      '📌 O que eu ofereço (1 linha):',
      '📌 Região de atuação:',
      '',
      'Pode me passar o próximo passo do onboarding?'
    ].join('\n')
  }

  return [
    'Oi! Preciso falar com a BOAT NET.',
    '',
    'Sou:',
    'Cidade/UF:',
    'Assunto (parceria / dúvida / suporte):',
    '',
    'Mensagem:'
  ].join('\n')
}

function GhostAnchor({
  href,
  children,
  ariaLabel
}: {
  href: string
  children: React.ReactNode
  ariaLabel?: string
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
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
    </a>
  )
}

function FloatingWhatsApp() {
  const href = useMemo(() => waLink(buildWhatsAppMessage('fast')), [])

  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      aria-label="Falar no WhatsApp"
      className={[
        'fixed bottom-5 right-5 z-50',
        'inline-flex items-center gap-3',
        'rounded-full bg-brand-blue px-5 py-3 text-sm font-semibold tracking-wide text-white',
        'shadow-soft ring-1 ring-brand-blue/40',
        'transition hover:opacity-90 active:scale-[0.98]',
        'animate-[bn-float_3.2s_ease-in-out_infinite]'
      ].join(' ')}
    >
      <span>Falar no WhatsApp</span>
      <span className="relative flex h-2.5 w-2.5">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white/60 opacity-40" />
        <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-white/90" />
      </span>
    </a>
  )
}

export function AppCTA() {
  const [idx, setIdx] = useState(0)
  const partnerHref = useMemo(() => waLink(buildWhatsAppMessage('partner')), [])

  useEffect(() => {
    const id = window.setInterval(() => setIdx((i) => (i + 1) % shots.length), 3500)
    return () => window.clearInterval(id)
  }, [])

  return (
    <section id="o-app" className="py-16 sm:py-20">
      <FloatingWhatsApp />

      <style jsx global>{`
        @keyframes bn-float {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-8px);
          }
        }
      `}</style>

      <Container>
        <div className="grid items-center gap-10 lg:grid-cols-[1fr_0.92fr]">
          {/* LEFT */}
          <Reveal>
            <Badge>BOAT NET APP</Badge>

            <h2 className="mt-4 text-2xl font-semibold tracking-tight sm:text-3xl">
              Baixe. Explore. Feche.
              <span className="block text-white/70">Operação premium, sem ruído.</span>
            </h2>

            <p className="mt-4 max-w-xl text-sm leading-relaxed text-white/70">
              Este site apresenta o ecossistema BOAT NET e ajuda você a decidir com clareza. No app BOAT NET, você agenda/reserva expêriencias, encontra serviços e negocia compra & venda com parceiros verificados, políticas transparentes e atendimento humano com excelência.
            </p>

            <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Button href={process.env.NEXT_PUBLIC_APP_STORE_URL || '#'}>Baixar no App Store</Button>
              <GhostAnchor href={partnerHref} ariaLabel="Virar parceiro no WhatsApp (nova aba)">
                Virar parceiro
              </GhostAnchor>
            </div>

            <div className="mt-8 rounded-3xl bg-white/5 p-6 ring-1 ring-white/10 glow">
              <div className="text-xs font-semibold tracking-wide text-white/60">Por que o site existe</div>

              <div className="mt-3 grid gap-3 sm:grid-cols-3">
                {[
                  { k: 'Educar', v: 'explicar o padrão BOAT NET' },
                  { k: 'Desejo', v: 'vitrine estilo revista' },
                  { k: 'Converter', v: 'levar pro app' },
                  { k: 'Confiança', v: 'dar contexto e segurança' },
                  { k: 'Descoberta', v: 'filtros e categorias por intenção' },
                  { k: 'Onboarding', v: 'atrair parceiros e marinas' }
                ].map((x) => (
                  <div key={x.k} className="rounded-2xl bg-black/20 p-4 ring-1 ring-white/10">
                    <div className="text-xs font-semibold tracking-wide text-white/60">{x.k}</div>
                    <div className="mt-2 text-sm font-semibold text-white/90">{x.v}</div>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>

          {/* RIGHT */}
          <Reveal delay={0.08}>
            <div className="relative mx-auto w-[320px] sm:w-[360px]">
              {/* REMOVIDO: glow/blur de fundo e mockup preto */}
              <Image
                src={shots[idx]}
                alt="App screenshot"
                width={900}
                height={1950}
                className="h-auto w-full"
                priority={idx === 0}
              />

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
