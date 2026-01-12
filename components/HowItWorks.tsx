import { Container } from '@/components/Container'
import { Reveal } from '@/components/Reveal'
import { SectionHeader } from '@/components/SectionHeader'
import { CalendarCheck, CreditCard, ShieldCheck, Star } from 'lucide-react'

const steps = [
  { t: 'Descobrir', d: 'Catálogo limpo, filtros úteis e oferta com contexto.', icon: CalendarCheck },
  { t: 'Reservar', d: 'Datas, regras e confirmação sem ruído.', icon: ShieldCheck },
  { t: 'Pagar', d: 'Fluxo pronto para PSP (Stripe/Mercado Pago/Adyen) + comprovantes.', icon: CreditCard },
  { t: 'Viver', d: 'Check-in, suporte, avaliação e histórico.', icon: Star }
]

const bookingStates = ['draft', 'paid', 'confirmed', 'in_progress', 'completed', 'cancel', 'refund', 'dispute']

export function HowItWorks() {
  return (
    <section id="como-funciona" className="py-16 sm:py-20">
      <Container>
        <Reveal>
          <SectionHeader
            kicker="Flow"
            title="Do interesse ao dinheiro — sem queda no meio"
            subtitle="O site posiciona e converte. O app executa: catálogo, reserva, pagamento, suporte e reputação."
          />
        </Reveal>

        {/* Steps */}
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((s, idx) => (
            <Reveal key={s.t} delay={0.06 * idx}>
              <div className="h-full rounded-3xl bg-white/5 p-6 ring-1 ring-white/10 glow">
                {/* header fixo para alinhar */}
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-brand-blue/15 ring-1 ring-brand-blue/30">
                    <s.icon className="h-5 w-5 text-brand-blue" aria-hidden="true" />
                  </div>

                  <div className="min-w-0">
                    <div className="text-xs font-semibold tracking-wide text-white/55">Passo {idx + 1}</div>
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
                <div className="text-xs font-semibold tracking-wide text-white/60">Estados de reserva (MVP)</div>
                <div className="text-[11px] font-semibold tracking-wide text-white/40">máquina de estados</div>
              </div>

              {/* chips com grid pra ficar alinhado */}
              <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
                {bookingStates.map((x) => (
                  <span
                    key={x}
                    className="inline-flex items-center justify-center rounded-full bg-white/5 px-3 py-1 text-[11px] font-semibold tracking-wide text-white/70 ring-1 ring-white/10"
                  >
                    {x}
                  </span>
                ))}
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.11}>
            <div className="h-full rounded-3xl bg-white/5 p-6 ring-1 ring-white/10 glow">
              <div className="flex items-center justify-between gap-3">
                <div className="text-xs font-semibold tracking-wide text-white/60">Segurança (no que importa)</div>
                <div className="text-[11px] font-semibold tracking-wide text-white/40">padrão produção</div>
              </div>

              <ul className="mt-4 space-y-2 text-sm text-white/70">
                <li className="flex gap-2">
                  <span className="text-white/40">•</span>
                  <span>S3 privado + URLs assinadas</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-white/40">•</span>
                  <span>Auditoria e least privilege</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-white/40">•</span>
                  <span>Idempotência em pagamentos e webhooks</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-white/40">•</span>
                  <span>Cancelamento/estorno com regras</span>
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
