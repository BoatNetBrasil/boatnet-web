import { Container } from '@/components/Container'
import { Reveal } from '@/components/Reveal'
import { SectionHeader } from '@/components/SectionHeader'
import { cn } from '@/lib/cn'
import { ShieldCheck, Wallet, CalendarCheck, Star, TrendingUp, Headphones } from 'lucide-react'

const items = [
  {
    title: 'Onboarding guiado',
    desc: 'Cadastro, verificação e publicação com fluxo simples e rápido.',
    icon: CalendarCheck,
    meta: 'cadastro • verificação • setup'
  },
  {
    title: 'Regras claras',
    desc: 'Políticas objetivas para reservas, cancelamentos e conduta.',
    icon: ShieldCheck,
    meta: 'políticas • transparência • segurança'
  },
  {
    title: 'Pagamentos e repasses',
    desc: 'Recebimentos organizados, histórico e acompanhamento do financeiro.',
    icon: Wallet,
    meta: 'pagamentos • repasse • histórico'
  },
  {
    title: 'Avaliações',
    desc: 'Reputação baseada em experiência real para gerar confiança.',
    icon: Star,
    meta: 'avaliações • prova social • confiança'
  },
  {
    title: 'Performance',
    desc: 'Visibilidade, leads melhores e indicadores para vender mais.',
    icon: TrendingUp,
    meta: 'métricas • conversão • crescimento'
  },
  {
    title: 'Ajuda',
    desc: 'Suporte para dúvidas e orientação durante o uso da plataforma.',
    icon: Headphones,
    meta: 'atendimento • orientações • suporte'
  }
]

export function Programs() {
  return (
    <section id="parceiros" className="py-16 sm:py-20">
      <Container>
        <Reveal>
          <SectionHeader
            kicker="Parceiros"
            title="Parceria feita para escalar com organização."
            subtitle="Ferramentas e padrão para anunciar melhor, receber com clareza e vender mais — com menos fricção."
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
        
      </div>

      <div className="mt-4 text-lg font-semibold tracking-tight">{title}</div>
      <p className="mt-2 text-sm leading-relaxed text-white/70">{desc}</p>
      <div className="mt-5 text-[11px] font-semibold tracking-wide text-white/55">{meta}</div>
    </div>
  )
}
