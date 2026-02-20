'use client'

import { useEffect, useMemo, useRef, useState } from 'react'

type ChatMsg = {
  id: string
  role: 'user' | 'assistant'
  text: string
  ts: number
}

type Preset = 'default' | 'partner' | 'booking' | 'support'

declare global {
  interface Window {
    BNChat?: {
      open: (args?: { preset?: Preset }) => void
      close: () => void
      reset: () => void
    }
  }
}

const N8N_WEBHOOK_URL =
  'https://n8n.kevinventuracomercial.net/webhook/ee58f15d-9584-4004-ab9f-2dc1c3052fdf'

function uuid(): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) return crypto.randomUUID()
  return Date.now().toString() + Math.random().toString(16).slice(2)
}

function tryJsonParse(input: string): any | null {
  try {
    return JSON.parse(input)
  } catch {
    return null
  }
}

function extractAIText(raw: string): string {
  const trimmed = (raw ?? '').trim()
  if (!trimmed) return 'Sem resposta.'

  let parsed = tryJsonParse(trimmed)

  if (typeof parsed === 'string') {
    const parsed2 = tryJsonParse(parsed.trim())
    if (parsed2 !== null) parsed = parsed2
  }

  if (parsed === null) return trimmed

  if (Array.isArray(parsed)) {
    const first = parsed[0]
    if (typeof first === 'string') return first
    return (
      first?.response ||
      first?.reply ||
      first?.text ||
      first?.message ||
      first?.output ||
      first?.data?.response ||
      first?.data?.reply ||
      first?.data?.text ||
      first?.data?.message ||
      first?.choices?.[0]?.message?.content ||
      trimmed
    )
  }

  if (typeof parsed === 'object') {
    return (
      parsed?.response ||
      parsed?.reply ||
      parsed?.text ||
      parsed?.message ||
      parsed?.output ||
      parsed?.data?.response ||
      parsed?.data?.reply ||
      parsed?.data?.text ||
      parsed?.data?.message ||
      parsed?.choices?.[0]?.message?.content ||
      trimmed
    )
  }

  return String(parsed)
}

function presetText(preset: Preset): string {
  switch (preset) {
    case 'partner':
      return 'Quero virar parceiro BoatNet. Sou marina/operador. Como funciona cadastro, comissões e próximos passos?'
    case 'booking':
      return 'Quero reservar um passeio/aluguel. Me ajude a encontrar opções por cidade, data e orçamento.'
    case 'support':
      return 'Preciso de suporte. Explique o que você precisa de mim (pedido, pagamento, parceiro, etc.).'
    default:
      return ''
  }
}

export function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const [sessionId, setSessionId] = useState('')
  const [messages, setMessages] = useState<ChatMsg[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [activePreset, setActivePreset] = useState<Preset>('default')

  const listRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const storageKey = useMemo(() => 'bn_chat_v9', [])

  // INIT
  useEffect(() => {
    if (typeof window === 'undefined') return

    const raw = localStorage.getItem(storageKey)
    const parsed = raw ? tryJsonParse(raw) : null

    const sid = parsed?.sessionId || uuid()
    setSessionId(sid)
    setActivePreset(parsed?.activePreset || 'default')

    if (parsed?.messages?.length) {
      setMessages(parsed.messages)
    } else {
      setMessages([
        {
          id: uuid(),
          role: 'assistant',
          text: 'BoatNet Concierge online. Passeios, marinas, aluguel ou compra. Como posso ajudar?',
          ts: Date.now()
        }
      ])
    }
  }, [storageKey])

  // Persist
  useEffect(() => {
    if (!sessionId) return
    if (typeof window === 'undefined') return
    localStorage.setItem(storageKey, JSON.stringify({ sessionId, messages, activePreset }))
  }, [storageKey, sessionId, messages, activePreset])

  // Scroll
  useEffect(() => {
    if (!listRef.current) return
    listRef.current.scrollTop = listRef.current.scrollHeight
  }, [messages, loading])

  // Focus input on open
  useEffect(() => {
    if (!isOpen) return
    const t = window.setTimeout(() => inputRef.current?.focus(), 150)
    return () => window.clearTimeout(t)
  }, [isOpen])

  function openWithPreset(preset: Preset = 'default') {
    setIsOpen(true)
    setError(null)
    setActivePreset(preset)

    const t = presetText(preset)
    if (!t) return

    // injeta somente uma vez por abertura/preset (sem duplicar)
    setMessages((prev) => {
      const last = prev[prev.length - 1]
      const already = prev.slice(-6).some((m) => m.role === 'user' && m.text === t)
      if (already) return prev
      return [
        ...prev,
        {
          id: uuid(),
          role: 'user',
          text: t,
          ts: Date.now()
        }
      ]
    })

    // dispara envio automático do preset
    window.setTimeout(() => {
      sendMessage(t, { silentAppendUser: true })
    }, 0)
  }

  function resetChat() {
    const sid = uuid()
    setSessionId(sid)
    setActivePreset('default')
    setError(null)
    setInput('')
    setMessages([
      {
        id: uuid(),
        role: 'assistant',
        text: 'BoatNet Concierge online. Como posso ajudar?',
        ts: Date.now()
      }
    ])
    if (typeof window !== 'undefined') localStorage.removeItem(storageKey)
  }

  // Expor API global p/ CTA
  useEffect(() => {
    if (typeof window === 'undefined') return
    window.BNChat = {
      open: (args?: { preset?: Preset }) => openWithPreset(args?.preset || 'default'),
      close: () => setIsOpen(false),
      reset: () => resetChat()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionId])

  async function sendMessage(text: string, opts?: { silentAppendUser?: boolean }) {
    const trimmed = text.trim()
    if (!trimmed || loading) return

    setLoading(true)
    setError(null)

    if (!opts?.silentAppendUser) {
      const userMsg: ChatMsg = { id: uuid(), role: 'user', text: trimmed, ts: Date.now() }
      setMessages((prev) => [...prev, userMsg])
      setInput('')
    }

    try {
      const response = await fetch(N8N_WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: trimmed,
          sessionId,
          preset: activePreset,
          source: 'boatnet-web'
        })
      })

      const rawText = await response.text()

      if (!response.ok) throw new Error(rawText || 'Erro no servidor')

      const finalText = extractAIText(rawText)

      setMessages((prev) => [
        ...prev,
        { id: uuid(), role: 'assistant', text: finalText, ts: Date.now() }
      ])
    } catch {
      setError('Falha de conexão.')
      setMessages((prev) => [
        ...prev,
        {
          id: uuid(),
          role: 'assistant',
          text: 'Estamos temporariamente indisponíveis. Tente novamente em instantes.',
          ts: Date.now()
        }
      ])
    } finally {
      setLoading(false)
    }
  }

  const quickActions: { label: string; preset: Preset; text: string }[] = [
    { label: 'Passeio / Aluguel', preset: 'booking', text: presetText('booking') },
    { label: 'Virar parceiro', preset: 'partner', text: presetText('partner') },
    { label: 'Suporte', preset: 'support', text: presetText('support') }
  ]

  return (
    <>
      {/* FAB */}
      <button
        onClick={() => openWithPreset('default')}
        className={[
          'fixed z-50 shadow-lg',
          'right-4 bottom-4 sm:right-6 sm:bottom-6',
          'rounded-full bg-brand-blue text-white',
          'px-5 py-3 sm:px-6 sm:py-3',
          'text-sm font-semibold'
        ].join(' ')}
        aria-label="Abrir BoatNet Concierge"
      >
        {isOpen ? 'Aberto' : 'Concierge'}
      </button>

      {/* MODAL / PANEL */}
      {isOpen && (
        <div
          className={[
            'fixed z-50',
            // Mobile full-screen
            'inset-0 sm:inset-auto',
            // Desktop floating
            'sm:bottom-24 sm:right-6',
            'sm:w-[420px]',
            // Mobile padding to avoid notch
            'pt-[env(safe-area-inset-top)] sm:pt-0'
          ].join(' ')}
        >
          <div
            className={[
              'h-full sm:h-auto',
              'rounded-none sm:rounded-2xl',
              'bg-neutral-950 border border-white/10 shadow-2xl',
              'flex flex-col'
            ].join(' ')}
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-white/10 px-4 py-4 sm:px-5">
              <div>
                <div className="text-white font-semibold leading-none">BoatNet Concierge</div>
                <div className="text-xs text-white/50 mt-1">
                  Curadoria • Reservas • Confiança
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={resetChat}
                  className="text-xs rounded-full bg-white/5 px-3 py-1.5 text-white/80 hover:bg-white/10"
                >
                  Reset
                </button>

                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="text-xs rounded-full bg-brand-blue px-3 py-1.5 text-white hover:opacity-90"
                >
                  Fechar
                </button>
              </div>
            </div>

            {/* Quick actions */}
            <div className="px-4 sm:px-5 pt-3">
              <div className="flex gap-2 overflow-x-auto pb-2">
                {quickActions.map((a) => (
                  <button
                    key={a.label}
                    type="button"
                    onClick={() => openWithPreset(a.preset)}
                    className="shrink-0 rounded-full bg-white/5 px-4 py-2 text-xs font-semibold text-white/85 ring-1 ring-white/10 hover:bg-white/10"
                  >
                    {a.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Messages */}
            <div
              ref={listRef}
              className="flex-1 overflow-y-auto px-4 sm:px-5 py-4 space-y-3"
            >
              {messages.map((m) => (
                <div key={m.id} className={m.role === 'user' ? 'text-right' : 'text-left'}>
                  <div
                    className={[
                      'inline-block max-w-[86%] rounded-2xl px-4 py-2 text-sm leading-relaxed',
                      m.role === 'user' ? 'bg-brand-blue text-white' : 'bg-white/5 text-white'
                    ].join(' ')}
                  >
                    {m.text}
                  </div>
                </div>
              ))}

              {loading && (
                <div className="text-left">
                  <div className="inline-block bg-white/5 text-white rounded-2xl px-4 py-2 text-sm animate-pulse">
                    Digitando...
                  </div>
                </div>
              )}

              {error && <div className="text-xs text-red-400">{error}</div>}
            </div>

            {/* Input */}
            <form
              onSubmit={(e) => {
                e.preventDefault()
                sendMessage(input)
              }}
              className={[
                'border-t border-white/10',
                'px-4 sm:px-5 py-4',
                'pb-[calc(16px+env(safe-area-inset-bottom))] sm:pb-4',
                'flex gap-3'
              ].join(' ')}
            >
              <input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Digite sua mensagem..."
                className="flex-1 rounded-xl bg-white/5 px-4 py-3 text-white outline-none placeholder:text-white/30"
              />
              <button
                type="submit"
                disabled={loading}
                className="rounded-xl bg-brand-blue px-5 py-3 text-white font-semibold disabled:opacity-50"
              >
                Enviar
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
