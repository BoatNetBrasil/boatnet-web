'use client'

import { useState } from 'react'
import { Container } from '@/components/Container'
import { Reveal } from '@/components/Reveal'
import { SectionHeader } from '@/components/SectionHeader'
import { ChevronDown } from 'lucide-react'

const faqs = [
  {
    q: 'O que é a BOAT NET?',
    a: 'Uma plataforma para organizar a náutica em um só lugar: serviços, marinas, experiências e compra & venda — com curadoria, reservas e avaliações no app.'
  },
  {
    q: 'Como faço uma reserva?',
    a: 'Você escolhe a opção ideal, confere regras e disponibilidade e finaliza no app. Depois, acompanha o status em tempo real até a conclusão.'
  },
  {
    q: 'Onde acontece o pagamento?',
    a: 'No app. Lá ficam pagamento, comprovantes, histórico e o acompanhamento completo da reserva.'
  },
  {
    q: 'Vocês oferecem suporte de verdade?',
    a: 'Sim. Suporte 24h com pessoas reais, ao vivo, para acompanhar sua reserva e resolver com agilidade.'
  },
  {
    q: 'Como virar parceiro (marina, operador ou loja)?',
    a: 'Preencha o formulário de parceiros. A equipe valida sua operação e entra em contato com o próximo passo do onboarding.'
  },
  {
    q: 'Consigo acompanhar minha reserva?',
    a: 'Sim. No app você acompanha status, mensagens, orientações e histórico — do início ao fim.'
  },
  {
    q: 'A BOAT NET verifica parceiros?',
    a: 'Sim. Parceiros passam por validação e seguem um padrão de operação e atendimento para garantir consistência.'
  },
  {
    q: 'O que o site faz e o que o app faz?',
    a: 'O site apresenta o ecossistema e guia sua decisão. O app executa: reservas, pagamento, comprovantes, suporte e avaliações.'
  }
]

export function FAQ() {
  return (
    <section id="faq" className="py-16 sm:py-20">
      <Container>
        <Reveal>
          <SectionHeader
            kicker="FAQ"
            title="Perguntas frequentes"
            subtitle="Clareza para baixar o app, reservar com segurança e operar com confiança."
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
