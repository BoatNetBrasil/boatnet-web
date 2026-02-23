import { Container } from '@/components/Container'
import { Reveal } from '@/components/Reveal'
import { SectionHeader } from '@/components/SectionHeader'
import { Search, LayoutGrid, Tag, MapPinCheck, LifeBuoy } from 'lucide-react'

const steps = [
  { t: 'Buscar', d: 'Encontre o que precisa com filtros simples e resultados claros.', icon: Search },
  { t: 'Categorias', d: 'Navegue por serviços, marinas, experiências e compra e venda.', icon: LayoutGrid },
  { t: 'Ofertas', d: 'Compare opções com contexto: fotos, regras e avaliações.', icon: Tag },
  { t: 'Acompanhar', d: 'Veja status da sua reserva e atualizações em um só lugar.', icon: MapPinCheck },
  { t: 'Ajuda', d: 'Suporte quando você precisar — antes, durante e depois.', icon: LifeBuoy }
]

export function HowItWorks() {
  return (
    <section id="passo-a-passo" className="py-16 sm:py-20">
      <Container>
        <Reveal>
          <SectionHeader
            kicker="Passo a passo"
            title="O site orienta. O app organiza."
            subtitle="A BOAT NET existe para simplificar a náutica com curadoria, reservas e confiança. Nosso objetivo: mudar o mundo da náutica."
          />
        </Reveal>

        {/* Steps */}
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {steps.map((s, idx) => (
            <Reveal key={s.t} delay={0.06 * idx}>
              <div className="h-full rounded-3xl bg-white/5 p-6 ring-1 ring-white/10 glow">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-brand-blue/15 ring-1 ring-brand-blue/30">
                    <s.icon className="h-5 w-5 text-brand-blue" aria-hidden="true" />
                  </div>

                  <div className="min-w-0">
                    <div className="text-xs font-semibold tracking-wide text-white/55">Etapa {idx + 1}</div>
                    <div className="text-base font-semibold leading-tight">{s.t}</div>
                  </div>
                </div>

                <p className="mt-4 text-sm leading-relaxed text-white/70">{s.d}</p>
              </div>
            </Reveal>
          ))}
        </div>

        {/* Bottom cards */}
        <div className="mt-12 grid gap-4 lg:grid-cols-2 lg:items-stretch">
          <Reveal delay={0.05}>
            <div className="h-full rounded-3xl bg-white/5 p-6 ring-1 ring-white/10 glow">
              <div className="flex items-center justify-between gap-3">
                <div className="text-xs font-semibold tracking-wide text-white/60">Acompanhe sua reserva</div>
                <div className="text-[11px] font-semibold tracking-wide text-white/40">tudo em um lugar</div>
              </div>

              <ul className="mt-4 space-y-2 text-sm text-white/70">
                <li className="flex gap-2">
                  <span className="text-white/40">•</span>
                  <span>Confirmação e atualizações do pedido</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-white/40">•</span>
                  <span>Informações importantes e regras do serviço</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-white/40">•</span>
                  <span>Histórico e avaliações após a experiência</span>
                </li>
              </ul>
            </div>
          </Reveal>

          <Reveal delay={0.11}>
            <div className="h-full rounded-3xl bg-white/5 p-6 ring-1 ring-white/10 glow">
              <div className="flex items-center justify-between gap-3">
                <div className="text-xs font-semibold tracking-wide text-white/60">Confiança (no que importa)</div>
                <div className="text-[11px] font-semibold tracking-wide text-white/40">padrão premium</div>
              </div>

              <ul className="mt-4 space-y-2 text-sm text-white/70">
                <li className="flex gap-2">
                  <span className="text-white/40">•</span>
                  <span>Parceiros verificados e informações claras</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-white/40">•</span>
                  <span>Pagamentos com proteção e comprovantes</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-white/40">•</span>
                  <span>Avaliações reais para orientar escolhas</span>
                </li>
              </ul>
            </div>
          </Reveal>
        </div>

        <div className="mt-12">
          <div className="hr" />
        </div>
      </Container>
    </section>
  )
}
