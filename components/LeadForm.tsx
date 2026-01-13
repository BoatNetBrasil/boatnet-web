'use client'

import { useEffect, useState } from 'react'
import { Container } from '@/components/Container'
import { Reveal } from '@/components/Reveal'
import { SectionHeader } from '@/components/SectionHeader'
import type { LeadType } from '@/lib/types'

function generateLeadId() {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return (crypto as any).randomUUID().replace(/-/g, '')
  }
  return `${Date.now().toString(16)}${Math.random().toString(16).slice(2)}`
}

const TYPE_OPTIONS: { value: LeadType; label: string; hint: string }[] = [
  { value: 'parceiro', label: 'Parceiro', hint: 'passeios • aluguel • serviços' },
  { value: 'marina', label: 'Marina', hint: 'vagas • estrutura • serviços' },
  { value: 'loja', label: 'Loja / Broker', hint: 'anúncios • leads • visibilidade' }
]

const NICHE_OPTIONS = [
  { value: '', label: 'Selecione' },
  { value: 'passeios', label: 'Passeios' },
  { value: 'aluguel', label: 'Aluguel' },
  { value: 'day_use', label: 'Day-use' },
  { value: 'servicos', label: 'Serviços / documentos' },
  { value: 'marina', label: 'Marina' },
  { value: 'loja', label: 'Loja / broker' },
  { value: 'outro', label: 'Outro' }
]

const REVENUE_OPTIONS = [
  { value: '', label: 'Selecione' },
  { value: 'prefiro_nao_informar', label: 'Prefiro não informar' },
  { value: 'ate_50k_mes', label: 'Até R$ 50k/mês' },
  { value: '50k_200k_mes', label: 'R$ 50k–200k/mês' },
  { value: '200k_1m_mes', label: 'R$ 200k–1M/mês' },
  { value: 'acima_1m_mes', label: 'Acima de R$ 1M/mês' }
]

const CONTACT_OPTIONS = [
  { value: 'whatsapp', label: 'WhatsApp' },
  { value: 'email', label: 'Email' }
]

export function LeadForm() {
  const [type, setType] = useState<LeadType>('parceiro')
  const [companyInSetup, setCompanyInSetup] = useState(false)
  const [loading, setLoading] = useState(false)
  const [ok, setOk] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [leadId, setLeadId] = useState<string>('')

  useEffect(() => setLeadId(generateLeadId()), [])

  useEffect(() => {
    const handler = (e: any) => {
      if (e?.detail === 'parceiro' || e?.detail === 'marina' || e?.detail === 'loja') setType(e.detail)
    }
    window.addEventListener('bn:setLeadType', handler)
    return () => window.removeEventListener('bn:setLeadType', handler)
  }, [])

  async function submit(form: HTMLFormElement) {
    setLoading(true)
    setOk(false)
    setError(null)

    const id = leadId || generateLeadId()
    if (!leadId) setLeadId(id)

    const fd = new FormData(form)
    const payload = {
      leadId: id,
      type,
      name: String(fd.get('name') || '').trim(),
      role: String(fd.get('role') || '').trim(),

      company: String(fd.get('company') || '').trim(),
      legalName: String(fd.get('legalName') || '').trim(),
      cnpj: String(fd.get('cnpj') || '').trim(),
      companyInSetup,

      email: String(fd.get('email') || '').trim(),
      phone: String(fd.get('phone') || '').trim(),

      city: String(fd.get('city') || '').trim(),
      state: String(fd.get('state') || '').trim(),

      niche: String(fd.get('niche') || '').trim(),
      monthlyRevenue: String(fd.get('monthlyRevenue') || '').trim(),
      operatingRegion: String(fd.get('operatingRegion') || '').trim(),
      capacity: String(fd.get('capacity') || '').trim(),
      preferredContact: String(fd.get('preferredContact') || '').trim(),

      website: String(fd.get('website') || '').trim(),
      message: String(fd.get('message') || '').trim(),

      honeypot: String(fd.get('website_confirm') || '')
    }

    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(payload)
      })
      const json = await res.json()
      if (!res.ok || !json.ok) throw new Error(json?.error || 'falha ao enviar')

      setOk(true)
      form.reset()
      setCompanyInSetup(false)
      setLeadId(generateLeadId())
    } catch (e: any) {
      setError(e?.message || 'erro')
    } finally {
      setLoading(false)
    }
  }

  const typeHint = TYPE_OPTIONS.find((x) => x.value === type)?.hint ?? ''
  const capacityLabel =
    type === 'marina'
      ? 'Capacidade (vagas / serviços)'
      : type === 'loja'
        ? 'Capacidade (anúncios)'
        : 'Capacidade (frota / agenda)'

  const capacityPlaceholder =
    type === 'marina'
      ? 'Ex.: 80 vagas + serviços'
      : type === 'loja'
        ? 'Ex.: 40 anúncios ativos'
        : 'Ex.: 6 embarcações + equipe'

  return (
    <section id="parceiros" className="py-14 sm:py-16">
      <Container>
        <Reveal>
          {/* centraliza title + subtitle */}
          <div className="mx-auto max-w-3xl text-center">
            <SectionHeader
              kicker="Parceiros"
              title="Entre para a rede BoatNet"
              subtitle="Cadastre sua operação e receba contato para próximos passos. Simples, rápido e sem burocracia."
            />
          </div>
        </Reveal>

        <div className="mt-8">
          <Reveal delay={0.08}>
            <form
              onSubmit={(e) => {
                e.preventDefault()
                submit(e.currentTarget)
              }}
              className="mx-auto max-w-4xl rounded-3xl bg-white/5 p-5 sm:p-6 ring-1 ring-white/10 glow"
            >
              {/* TOP */}
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div className="min-w-0">
                  <div className="text-xs font-semibold tracking-wide text-white/60">Tipo</div>

                  <div className="mt-2 inline-grid w-full grid-cols-3 rounded-2xl bg-black/20 p-1 ring-1 ring-white/10 sm:w-[440px]">
                    {TYPE_OPTIONS.map((it) => {
                      const active = it.value === type
                      return (
                        <button
                          key={it.value}
                          type="button"
                          onClick={() => setType(it.value)}
                          className={
                            'rounded-xl px-3 py-2 text-sm font-semibold transition ' +
                            (active
                              ? 'bg-brand-blue/25 text-white ring-1 ring-brand-blue/35'
                              : 'text-white/70 hover:text-white hover:bg-white/5')
                          }
                        >
                          {it.label}
                        </button>
                      )
                    })}
                  </div>

                  <div className="mt-2 text-xs font-semibold tracking-wide text-white/45">{typeHint}</div>
                </div>

                <div className="rounded-2xl bg-black/20 px-4 py-3 ring-1 ring-white/10 lg:max-w-[390px]">
                  <div className="text-xs font-semibold tracking-wide text-white/60">Privacidade</div>
                  <div className="mt-1 text-sm leading-relaxed text-white/70">
                    Seus dados não ficam expostos publicamente. Contato e acesso são controlados.
                  </div>
                </div>
              </div>

              <div className="mt-5 hr" />

              {/* FIELDS */}
              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <Field name="name" label="Seu nome" placeholder="Nome e sobrenome" required />
                <Field name="role" label="Cargo" placeholder="Ex.: proprietário, gerente" />

                <Field name="company" label="Empresa" placeholder="Nome fantasia" required />
                <Field name="legalName" label="Razão social" placeholder="(opcional)" />

                {/* CNPJ + Empresa em abertura (abaixo, sem distorcer layout) */}
                <div className="sm:col-span-2">
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div>
                      <CNPJField required={!companyInSetup} disabled={companyInSetup} />

                      <div className="mt-3">
                        <ToggleInline
                          label="Empresa em abertura"
                          helper="Se ainda não tem CNPJ, pode seguir."
                          checked={companyInSetup}
                          onToggle={() => setCompanyInSetup((v) => !v)}
                        />
                        <input type="hidden" name="companyInSetup" value={companyInSetup ? 'on' : ''} />
                      </div>
                    </div>

                    <div className="rounded-2xl bg-black/20 px-4 py-3 ring-1 ring-white/10">
                      <div className="text-xs font-semibold tracking-wide text-white/60">Validação</div>
                      <div className="mt-1 text-sm leading-relaxed text-white/70">
                        Usamos esses dados para organizar o contato e acelerar sua entrada na plataforma.
                      </div>
                    </div>
                  </div>
                </div>

                <Field name="email" label="Email" placeholder="voce@empresa.com" type="email" required />
                <Field name="phone" label="WhatsApp" placeholder="(11) 9xxxx-xxxx" inputMode="tel" />

                <Field name="city" label="Cidade" placeholder="São Paulo" />
                <Field name="state" label="Estado" placeholder="SP" />

                <Field
                  name="website"
                  label="Site / Instagram"
                  placeholder="@suaempresa ou link"
                  className="sm:col-span-2"
                />

                <div className="sm:col-span-2">
                  <details className="rounded-2xl bg-white/5 ring-1 ring-white/10">
                    <summary className="cursor-pointer select-none px-4 py-3 text-sm font-semibold text-white/85">
                      Informações adicionais (opcional)
                    </summary>

                    <div className="grid gap-4 px-4 pb-4 pt-2 sm:grid-cols-2">
                      <Select name="niche" label="Categoria" options={NICHE_OPTIONS} />
                      <Select name="monthlyRevenue" label="Faturamento (faixa)" options={REVENUE_OPTIONS} />

                      <Field
                        name="operatingRegion"
                        label="Região de atuação"
                        placeholder="Ex.: litoral norte SP, Angra, RJ"
                        className="sm:col-span-2"
                      />

                      <Field
                        name="capacity"
                        label={capacityLabel}
                        placeholder={capacityPlaceholder}
                        className="sm:col-span-2"
                      />

                      <Select name="preferredContact" label="Preferência de contato" options={CONTACT_OPTIONS} />

                      <div className="text-xs text-white/55 sm:col-span-1 flex items-center">
                        Opcional — ajuda a agilizar.
                      </div>
                    </div>
                  </details>
                </div>

                <input name="website_confirm" className="hidden" tabIndex={-1} autoComplete="off" />

                <div className="sm:col-span-2">
                  <label className="text-xs font-semibold tracking-wide text-white/60">Mensagem</label>
                  <textarea
                    name="message"
                    rows={4}
                    placeholder="Conte um pouco sobre você e inclua links úteis (opcional)."
                    className="mt-2 w-full rounded-2xl bg-black/20 px-4 py-3 text-sm text-white outline-none ring-1 ring-white/10 focus:ring-brand-blue/40"
                  />
                </div>
              </div>

              <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="text-xs text-white/55">
                  LeadId: <span className="font-mono">{leadId ? leadId.slice(0, 8) : '--------'}</span>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex items-center justify-center rounded-full bg-brand-blue px-6 py-3 text-sm font-semibold tracking-wide text-white shadow-soft hover:opacity-90 disabled:opacity-60"
                >
                  {loading ? 'Enviando…' : ok ? 'Enviado' : 'Enviar'}
                </button>
              </div>

              {ok ? <p className="mt-4 text-sm font-semibold text-white">Recebido. Vamos falar com você.</p> : null}
              {error ? <p className="mt-4 text-sm font-semibold text-red-300">{error}</p> : null}
            </form>
          </Reveal>
        </div>
      </Container>
    </section>
  )
}

/* ----------------- small components ----------------- */

function Field({
  label,
  name,
  placeholder,
  type = 'text',
  required,
  className,
  inputMode
}: {
  label: string
  name: string
  placeholder?: string
  type?: string
  required?: boolean
  className?: string
  inputMode?: any
}) {
  return (
    <div className={className}>
      <label className="text-xs font-semibold tracking-wide text-white/60">{label}</label>
      <input
        name={name}
        type={type}
        required={required}
        placeholder={placeholder}
        inputMode={inputMode}
        className="mt-2 w-full rounded-2xl bg-black/20 px-4 py-3 text-sm text-white outline-none ring-1 ring-white/10 focus:ring-brand-blue/40"
      />
    </div>
  )
}

function formatCNPJ(value: string) {
  const d = (value || '').replace(/\D+/g, '').slice(0, 14)
  const p1 = d.slice(0, 2)
  const p2 = d.slice(2, 5)
  const p3 = d.slice(5, 8)
  const p4 = d.slice(8, 12)
  const p5 = d.slice(12, 14)
  let out = p1
  if (p2) out += '.' + p2
  if (p3) out += '.' + p3
  if (p4) out += '/' + p4
  if (p5) out += '-' + p5
  return out
}

function CNPJField({ required, disabled }: { required: boolean; disabled: boolean }) {
  return (
    <div>
      <label className="text-xs font-semibold tracking-wide text-white/60">CNPJ</label>
      <input
        name="cnpj"
        required={required}
        disabled={disabled}
        placeholder="00.000.000/0000-00"
        inputMode="numeric"
        autoComplete="off"
        onChange={(e) => {
          e.currentTarget.value = formatCNPJ(e.currentTarget.value)
        }}
        className="mt-2 w-full rounded-2xl bg-black/20 px-4 py-3 text-sm text-white outline-none ring-1 ring-white/10 focus:ring-brand-blue/40 disabled:opacity-60"
      />
      <div className="mt-2 text-[11px] leading-4 text-white/50">Opcional, se você ainda estiver regularizando.</div>
    </div>
  )
}

function ToggleInline({
  label,
  helper,
  checked,
  onToggle
}: {
  label: string
  helper: string
  checked: boolean
  onToggle: () => void
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className="flex w-full items-center justify-between rounded-2xl bg-black/20 px-4 py-3 text-left ring-1 ring-white/10 transition hover:bg-white/5 hover:ring-white/15"
    >
      <div className="min-w-0">
        <div className="text-sm font-semibold text-white/85">{label}</div>
        <div className="mt-1 text-[11px] leading-4 text-white/50">{helper}</div>
      </div>

      <span
        className={
          'inline-flex h-6 w-11 items-center rounded-full p-1 ring-1 transition ' +
          (checked ? 'bg-brand-blue/35 ring-brand-blue/40' : 'bg-white/10 ring-white/10')
        }
        aria-hidden="true"
      >
        <span className={'h-4 w-4 rounded-full bg-white transition ' + (checked ? 'translate-x-5' : 'translate-x-0')} />
      </span>
    </button>
  )
}

function Select({
  label,
  name,
  options,
  className
}: {
  label: string
  name: string
  options: { value: string; label: string }[]
  className?: string
}) {
  return (
    <div className={className}>
      <label className="text-xs font-semibold tracking-wide text-white/60">{label}</label>
      <select
        name={name}
        className="mt-2 w-full rounded-2xl bg-black/20 px-4 py-3 text-sm text-white outline-none ring-1 ring-white/10 focus:ring-brand-blue/40"
        defaultValue={options[0]?.value ?? ''}
      >
        {options.map((o) => (
          <option key={o.value} value={o.value} className="bg-neutral-900">
            {o.label}
          </option>
        ))}
      </select>
    </div>
  )
}
