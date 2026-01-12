export type LeadType = 'parceiro' | 'marina' | 'loja'

export type RevenueBand =
  | 'prefiro_nao_informar'
  | 'ate_50k_mes'
  | '50k_200k_mes'
  | '200k_1m_mes'
  | 'acima_1m_mes'

export type Niche =
  | 'passeios'
  | 'aluguel'
  | 'day_use'
  | 'servicos'
  | 'marina'
  | 'loja'
  | 'outro'

export type LeadPayload = {
  leadId: string
  type: LeadType
  name: string
  company: string
  legalName?: string
  cnpj?: string
  companyInSetup?: boolean
  email: string
  phone?: string
  city?: string
  state?: string
  niche?: Niche
  monthlyRevenue?: RevenueBand
  operatingRegion?: string
  capacity?: string
  role?: string
  preferredContact?: 'whatsapp' | 'email'
  message?: string
  website?: string
  honeypot?: string
}
