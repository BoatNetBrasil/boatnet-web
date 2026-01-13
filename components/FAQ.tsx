'use client'

import { useState } from 'react'
import { Container } from '@/components/Container'
import { Reveal } from '@/components/Reveal'
import { SectionHeader } from '@/components/SectionHeader'
import { ChevronDown } from 'lucide-react'

const faqs = [
  {
    q: 'O que é a BoatNet?',
    a: 'A BoatNet é um ecossistema premium para náutica: serviços, marinas, experiências e compra e venda — com curadoria, reservas e avaliações.'
  },
  {
    q: 'Qual é o papel do site?',
    a: 'O site apresenta o ecossistema, explica o passo a passo e direciona você para a melhor decisão. Para reservar, pagar e acompanhar, o acesso é pelo app.'
  },
  {
    q: 'Como funcionam reservas?',
    a: 'Você escolhe a oferta, confere disponibilidade e regras, e conclui a reserva no app com confirmação, informações organizadas e atualizações.'
  },
  {
    q: 'Quais formas de pagamento são aceitas?',
    a: 'O pagamento é feito no app, com opções amplamente usadas no Brasil e comprovantes. As alternativas exibidas variam conforme o tipo de serviço e o parceiro.'
  },
  {
    q: 'Como a BoatNet garante confiança?',
    a: 'Parceiros verificados, informações claras e avaliações reais. Isso reduz incerteza, eleva o padrão e melhora a experiência do início ao fim.'
  },
  {
    q: 'Existe suporte humano de verdade?',
    a: 'Sim. No app, você tem suporte 24h com pessoas de verdade para ajudar antes, durante e depois da sua experiência.'
  },
  {
    q: 'Onde acompanho minha reserva?',
    a: 'No app. Você acompanha status, recebe atualizações e mantém tudo centralizado: detalhes, orientações e histórico.'
  },
  {
    q: 'Sou marina, operador, prestador de serviço ou loja. Como entro?',
    a: 'Acesse a seção “Parceiros” e preencha o cadastro. Nossa equipe entra em contato para orientar a entrada e os próximos passos.'
  },
  {
    q: 'Como falar com a BoatNet por email?',
    a: 'Você pode enviar uma mensagem para contato@boatnet.com.br.'
  }
]

export function FAQ() {
  return (
    <section id="faq" className="py-16 sm:py-20">
      <Container>
        <Reveal>
          <SectionHeader
            kicker="Perguntas frequentes"
            title="Clareza e confiança, do primeiro clique à experiência"
            subtitle="Curadoria, reservas, pagamentos e suporte humano 24h no app."
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
