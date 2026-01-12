'use client'

import { useState } from 'react'
import { Container } from '@/components/Container'
import { Reveal } from '@/components/Reveal'
import { SectionHeader } from '@/components/SectionHeader'
import { ChevronDown } from 'lucide-react'

const faqs = [
  {
    q: 'O site vende o quê?',
    a: 'O site vende visão e desejo. O app executa: catálogo, reserva, pagamento, suporte e reputação.'
  },
  {
    q: 'Tem pagamento no site?',
    a: 'Não. A operação fica no app. Quando o Stripe/PSP estiver ok, os webhooks orquestram no AWS.'
  },
  {
    q: 'Como uma marina entra?',
    a: 'Preenche o formulário, define oferta (vagas/planos), regras e disponibilidade. A partir daí o onboarding vira rotina.'
  },
  {
    q: 'E loja / broker?',
    a: 'Lista produtos e recebe leads com rastreio. A meta é aumentar conversão com reputação e contexto.'
  }
]

export function FAQ() {
  return (
    <section id="faq" className="py-16 sm:py-20">
      <Container>
        <Reveal>
          <SectionHeader
            kicker="FAQ"
            title="Perguntas que travam conversão — já resolvidas"
            subtitle="Sem explicar demais. Só o suficiente pra pessoa baixar o app ou virar parceiro."
          />
        </Reveal>

        <div className="mt-10 grid gap-3">
          {faqs.map((f, idx) => (
            <Reveal key={f.q} delay={0.04 * idx}>
              <Item q={f.q} a={f.a} />
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  )
}

function Item({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false)
  return (
    <button
      type="button"
      onClick={() => setOpen((v) => !v)}
      className="w-full rounded-3xl bg-white/5 p-6 text-left ring-1 ring-white/10 glow hover:bg-white/[0.07]"
    >
      <div className="flex items-center justify-between gap-6">
        <div className="text-sm font-semibold">{q}</div>
        <ChevronDown className={'h-5 w-5 text-white/60 transition ' + (open ? 'rotate-180' : '')} />
      </div>
      {open ? <p className="mt-3 text-sm leading-relaxed text-white/70">{a}</p> : null}
    </button>
  )
}
