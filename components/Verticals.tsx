import { Container } from '@/components/Container'
import { Reveal } from '@/components/Reveal'
import { SectionHeader } from '@/components/SectionHeader'
import { cn } from '@/lib/cn'
import { Waves, Ship, LifeBuoy, Store, Building2, Anchor } from 'lucide-react'

const items = [
  {
    title: 'Passeios',
    desc: 'Escolha, reserve e viva a experiência com clareza do início ao fim.',
    icon: Waves,
    meta: 'curadoria • agenda • experiência'
  },
  {
    title: 'Aluguel day-use',
    desc: 'Disponibilidade, regras e confirmação de forma simples e rápida.',
    icon: Ship,
    meta: 'disponibilidade • regras • confirmação'
  },
  {
    title: 'Compra e venda',
    desc: 'Conecte oferta e demanda com contexto, confiança e intenção.',
    icon: Store,
    meta: 'leads • confiança • conversão'
  },
  {
    title: 'Serviços e documentos',
    desc: 'Profissionais, manutenção e documentação em um só lugar.',
    icon: LifeBuoy,
    meta: 'serviços • documentação • agendamento'
  },
  {
    title: 'Marinas',
    desc: 'Vagas, estrutura e relacionamento — com padrão e transparência.',
    icon: Building2,
    meta: 'vagas • regras • recorrência'
  },
  {
    title: 'Eventos e experiências',
    desc: 'Roteiros e ativações premium para aumentar ticket e recorrência.',
    icon: Anchor,
    meta: 'experiência • premium • recorrência'
  }
]

export function Verticals() {
  return (
    <section id="servicos" className="py-16 sm:py-20">
      <Container>
        <Reveal>
          <SectionHeader
            kicker="Serviços"
            title="Um ecossistema completo para a náutica."
            subtitle="Descubra serviços, experiências e soluções — com curadoria, reservas e confiança em um só lugar."
          />
        </Reveal>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((it, idx) => (
            <Reveal key={it.title} delay={0.05 * idx}>
              <Card title={it.title} desc={it.desc} meta={it.meta} Icon={it.icon} />
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  )
}

function Card({
  title,
  desc,
  meta,
  Icon
}: {
  title: string
  desc: string
  meta: string
  Icon: any
}) {
  return (
    <div
      className={cn(
        'group rounded-3xl bg-white/5 p-6 ring-1 ring-white/10 glow transition',
        'hover:bg-white/[0.07] hover:ring-white/15'
      )}
    >
      <div className="flex items-center justify-between">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-blue/15 ring-1 ring-brand-blue/30">
          <Icon className="h-5 w-5 text-brand-blue" aria-hidden="true" />
        </div>

       
      </div>

      <div className="mt-4 text-lg font-semibold tracking-tight">{title}</div>
      <p className="mt-2 text-sm leading-relaxed text-white/70">{desc}</p>

      <div className="mt-5 text-[11px] font-semibold tracking-wide text-white/55">{meta}</div>
    </div>
  )
}
