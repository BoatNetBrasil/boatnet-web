import type { LeadPayload, LeadType, Niche, RevenueBand } from '@/lib/types'

const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function sanitize(input: unknown, max = 240) {
  const s = String(input ?? '').trim()
  return s.length > max ? s.slice(0, max) : s
}

export function asLeadType(value: string): LeadType {
  if (value === 'parceiro' || value === 'marina' || value === 'loja') return value
  return 'parceiro'
}

function digitsOnly(s: string) {
  return (s || '').replace(/\D+/g, '')
}

// Validação clássica de CNPJ (14 dígitos)
export function isValidCNPJ(input: string) {
  const cnpj = digitsOnly(input)
  if (cnpj.length !== 14) return false
  if (/^(\d)\1+$/.test(cnpj)) return false

  const calc = (len: number) => {
    let sum = 0
    let pos = len - 7
    for (let i = len; i >= 1; i--) {
      sum += Number(cnpj[len - i]) * pos--
      if (pos < 2) pos = 9
    }
    const r = sum % 11
    return r < 2 ? 0 : 11 - r
  }

  const d1 = calc(12)
  const d2 = calc(13)
  return d1 === Number(cnpj[12]) && d2 === Number(cnpj[13])
}

function asNiche(v: string): Niche | undefined {
  const x = v as Niche
  if (
    x === 'passeios' ||
    x === 'aluguel' ||
    x === 'day_use' ||
    x === 'servicos' ||
    x === 'marina' ||
    x === 'loja' ||
    x === 'outro'
  )
    return x
  return undefined
}

function asRevenueBand(v: string): RevenueBand | undefined {
  const x = v as RevenueBand
  if (
    x === 'prefiro_nao_informar' ||
    x === 'ate_50k_mes' ||
    x === '50k_200k_mes' ||
    x === '200k_1m_mes' ||
    x === 'acima_1m_mes'
  )
    return x
  return undefined
}

export function validateLead(body: any): { ok: true; data: LeadPayload } | { ok: false; error: string } {
  const leadId = sanitize(body.leadId, 64)
  const type = asLeadType(sanitize(body.type, 24))
  const name = sanitize(body.name)
  const company = sanitize(body.company)
  const legalName = sanitize(body.legalName)
  const companyInSetup = Boolean(body.companyInSetup)
  const cnpjRaw = sanitize(body.cnpj, 32)
  const cnpj = digitsOnly(cnpjRaw)
  const email = sanitize(body.email)
  const phone = sanitize(body.phone)
  const city = sanitize(body.city)
  const state = sanitize(body.state)
  const niche = asNiche(sanitize(body.niche, 24))
  const monthlyRevenue = asRevenueBand(sanitize(body.monthlyRevenue, 32))
  const operatingRegion = sanitize(body.operatingRegion, 160)
  const capacity = sanitize(body.capacity, 120)
  const role = sanitize(body.role, 80)
  const preferredContact = (sanitize(body.preferredContact, 16) === 'email' ? 'email' : 'whatsapp') as
    | 'whatsapp'
    | 'email'
  const message = sanitize(body.message, 800)
  const website = sanitize(body.website, 160)
  const honeypot = sanitize(body.honeypot, 120)

  if (!leadId) return { ok: false, error: 'leadId ausente' }
  if (!name) return { ok: false, error: 'nome é obrigatório' }
  if (!company) return { ok: false, error: 'empresa é obrigatória' }
  if (!companyInSetup) {
    if (!cnpj) return { ok: false, error: 'cnpj é obrigatório (ou marque “empresa em abertura”)' }
    if (!isValidCNPJ(cnpj)) return { ok: false, error: 'cnpj inválido' }
  }
  if (!emailRe.test(email)) return { ok: false, error: 'email inválido' }

  return {
    ok: true,
    data: {
      leadId,
      type,
      name,
      company,
      legalName: legalName || undefined,
      cnpj: cnpj || undefined,
      companyInSetup,
      email,
      phone: phone || undefined,
      city: city || undefined,
      state: state || undefined,
      niche,
      monthlyRevenue,
      operatingRegion: operatingRegion || undefined,
      capacity: capacity || undefined,
      role: role || undefined,
      preferredContact,
      message: message || undefined,
      website: website || undefined,
      honeypot
    }
  }
}
