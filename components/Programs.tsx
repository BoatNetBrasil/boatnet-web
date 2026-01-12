import { Container } from '@/components/Container'
import { Reveal } from '@/components/Reveal'
import { SectionHeader } from '@/components/SectionHeader'
import { cn } from '@/lib/cn'
import { ShieldCheck, Wallet, CalendarCheck, Star, TrendingUp, Headphones } from 'lucide-react'

const items = [
  {
    title: 'Onboarding Premium',
    desc: 'Validação + configuração rápida. Sem fricção e sem ruído.',
    icon: CalendarCheck,
    meta: 'cadastro • verificação • setup'
  },
  {
    title: 'Regras & Depósito',
    desc: 'Termos claros, política de cancelamento e caução padronizada.',
    icon: ShieldCheck,
    meta: 'políticas • proteção • consistência'
  },
  {
    title: 'Pagamentos & Repasse',
    desc: 'Fluxo pronto para PSP. Comprovantes e conciliação.',
    icon: Wallet,
    meta: 'PSP • repasse • conciliação'
  },
  {
    title: 'Reputação',
    desc: 'Avaliações e histórico para aumentar confiança e conversão.',
    icon: Star,
    meta: 'reviews • prova social • ranking'
  },
  {
    title: 'Performance',
    desc: 'Leads melhores e tracking do funil para otimizar receita.',
    icon: TrendingUp,
    meta: 'funil • métricas • conversão'
  },
  {
    title: 'Suporte',
    desc: 'Operação com padrão: atendimento e resolução rápida.',
    icon: Headphones,
    meta: 'SLA • suporte • operação'
  }
]

export function Programs() {
  return (
    <section id="programs" className="py-16 sm:py-20">
      <Container>
        <Reveal>
          <SectionHeader
            kicker="Partner"
            title="Modelo de parceria que escala"
            subtitle="Tudo que o parceiro precisa para operar com padrão, receber melhor e vender mais — sem improviso."
          />
        </Reveal>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((it, idx) => (
            <Reveal key={it.title} delay={0.05 * idx}>
              <Card title={it.title} desc={it.desc} meta={it.meta} Icon={it.icon} />
            </Reveal>
          ))}
        </div>

        <div className="mt-12">
          <div className="hr" />
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
        <span className="text-xs font-semibold tracking-wide text-white/55 group-hover:text-white/75 transition">
          padrão →
        </span>
      </div>

      <div className="mt-4 text-lg font-semibold tracking-tight">{title}</div>
      <p className="mt-2 text-sm leading-relaxed text-white/70">{desc}</p>
      <div className="mt-5 text-[11px] font-semibold tracking-wide text-white/55">{meta}</div>
    </div>
  )
}
