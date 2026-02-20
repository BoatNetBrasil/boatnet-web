'use client'

import { useEffect, useMemo, useRef, useState } from 'react'

type ChatMsg = {
  id: string
  role: 'user' | 'assistant'
  text: string
  ts: number
}

type Preset = 'default' | 'partner' | 'booking' | 'support'

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
  if (!trimmed) return 'Ok.'

  let parsed = tryJsonParse(trimmed)

  if (typeof parsed === 'string') {
    const parsed2 = tryJsonParse(parsed.trim())
    if (parsed2 !== null) parsed = parsed2
  }

  if (parsed === null) return trimmed

  if (Array.isArray(parsed)) {
    const first = parsed[0]
    if (typeof first === 'string') return first.trim() || 'Ok.'
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
    ).trim?.() || 'Ok.'
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
    ).trim?.() || 'Ok.'
  }

  return String(parsed).trim() || 'Ok.'
}

function normalizePreset(preset?: string): Preset {
  if (preset === 'partner' || preset === 'booking' || preset === 'support') return preset
  return 'default'
}

function presetText(preset: Preset): string {
  switch (preset) {
    case 'partner':
      return 'Quero virar parceiro BoatNet. Sou marina/operador. Como funciona cadastro, comissões e próximos passos?'
    case 'booking':
      return 'Quero reservar um passeio/aluguel. Me ajude a encontrar opções por cidade, data e orçamento.'
    case 'support':
      return 'Preciso de suporte. Como resolver meu caso?'
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

  // trava contra auto-envio repetido (loop)
  const lastAutoKeyRef = useRef<string>('')

  const storageKey = useMemo(() => 'bn_chat_v11', [])

  useEffect(() => {
    if (typeof window === 'undefined') return

    const raw = localStorage.getItem(storageKey)
    const parsed = raw ? tryJsonParse(raw) : null

    const sid = parsed?.sessionId || uuid()
    setSessionId(sid)

    const p = normalizePreset(parsed?.activePreset)
    setActivePreset(p)

    if (parsed?.messages?.length) {
      setMessages(parsed.messages)
    } else {
      setMessages([
        {
          id: uuid(),
          role: 'assistant',
          text: 'Atendimento IA BoatNet online. Como posso ajudar?',
          ts: Date.now()
        }
      ])
    }
  }, [storageKey])

  useEffect(() => {
    if (!sessionId) return
    if (typeof window === 'undefined') return
    localStorage.setItem(storageKey, JSON.stringify({ sessionId, messages, activePreset }))
  }, [storageKey, sessionId, messages, activePreset])

  useEffect(() => {
    if (!listRef.current) return
    listRef.current.scrollTop = listRef.current.scrollHeight
  }, [messages, loading])

  useEffect(() => {
    if (!isOpen) return
    const t = window.setTimeout(() => inputRef.current?.focus(), 120)
    return () => window.clearTimeout(t)
  }, [isOpen])

  function resetChat() {
    const sid = uuid()
    setSessionId(sid)
    setActivePreset('default')
    setError(null)
    setInput('')
    lastAutoKeyRef.current = ''
    setMessages([
      {
        id: uuid(),
        role: 'assistant',
        text: 'Atendimento IA BoatNet online. Como posso ajudar?',
        ts: Date.now()
      }
    ])
    if (typeof window !== 'undefined') localStorage.removeItem(storageKey)
  }

  useEffect(() => {
    if (typeof window === 'undefined') return

    window.BNChat = {
      open: (args?: { preset?: string }) => openPreset(normalizePreset(args?.preset)),
      close: () => setIsOpen(false),
      reset: () => resetChat()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionId])

  function openPreset(preset: Preset) {
    setIsOpen(true)
    setError(null)
    setActivePreset(preset)

    const text = presetText(preset)
    if (!text) return

    const autoKey = `${sessionId}:${preset}`
    if (lastAutoKeyRef.current === autoKey) return
    lastAutoKeyRef.current = autoKey

    setMessages((prev) => {
      const already = prev.slice(-10).some((m) => m.role === 'user' && m.text === text)
      if (already) return prev
      return [...prev, { id: uuid(), role: 'user', text, ts: Date.now() }]
    })

    window.setTimeout(() => {
      sendMessage(text, { silentAppendUser: true })
    }, 0)
  }

  async function sendMessage(text: string, opts?: { silentAppendUser?: boolean }) {
    const trimmed = text.trim()
    if (!trimmed || loading) return

    setLoading(true)
    setError(null)

    if (!opts?.silentAppendUser) {
      setMessages((prev) => [...prev, { id: uuid(), role: 'user', text: trimmed, ts: Date.now() }])
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

      setMessages((prev) => [...prev, { id: uuid(), role: 'assistant', text: finalText, ts: Date.now() }])
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

  const quickActions: { label: string; preset: Preset }[] = [
    { label: 'Passeio / Aluguel', preset: 'booking' },
    { label: 'Marina / Parceiro', preset: 'partner' },
    { label: 'Suporte', preset: 'support' }
  ]

  return (
    <>
      {/* FAB moderno com “LED” */}
      <button
        onClick={() => {
          setIsOpen(true)
          setError(null)
          // ao abrir manualmente, não injeta preset
          lastAutoKeyRef.current = ''
          window.setTimeout(() => inputRef.current?.focus(), 0)
        }}
        className={[
          'fixed z-50 shadow-2xl',
          'right-4 bottom-4 sm:right-6 sm:bottom-6',
          'rounded-full bg-brand-blue text-white',
          'px-5 py-3 sm:px-6 sm:py-3',
          'text-sm font-semibold',
          'flex items-center gap-3',
          'transition hover:scale-[1.02] active:scale-[0.98]'
        ].join(' ')}
        aria-label="Abrir Atendimento IA"
      >
        <span className="relative flex h-2.5 w-2.5">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white/80 opacity-60" />
          <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-white" />
        </span>

        <span className="animate-[bnFloat_2.8s_ease-in-out_infinite]">
          {isOpen ? 'Atendimento IA' : 'Atendimento IA'}
        </span>

        <style jsx>{`
          @keyframes bnFloat {
            0% { transform: translateY(0px); }
            50% { transform: translateY(-2px); }
            100% { transform: translateY(0px); }
          }
        `}</style>
      </button>

      {isOpen && (
        <>
          {/* Overlay */}
          <div
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-[2px] sm:bg-black/40"
            onClick={() => setIsOpen(false)}
            aria-hidden="true"
          />

          {/* Panel */}
          <div
            className={[
              'fixed z-50',
              'inset-0 sm:inset-auto',
              'sm:bottom-24 sm:right-6 sm:w-[420px]',
              'pt-[env(safe-area-inset-top)] sm:pt-0'
            ].join(' ')}
          >
            <div className="h-full sm:h-auto rounded-none sm:rounded-2xl bg-neutral-950 border border-white/10 shadow-2xl flex flex-col">
              {/* Header */}
              <div className="flex items-center justify-between border-b border-white/10 px-4 py-4 sm:px-5">
                <div>
                  <div className="text-white font-semibold leading-none">Atendimento IA</div>
                  <div className="text-xs text-white/50 mt-1">BoatNet • Curadoria • Reservas</div>
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
                      onClick={() => openPreset(a.preset)}
                      className="shrink-0 rounded-full bg-white/5 px-4 py-2 text-xs font-semibold text-white/85 ring-1 ring-white/10 hover:bg-white/10"
                    >
                      {a.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Messages */}
              <div ref={listRef} className="flex-1 overflow-y-auto px-4 sm:px-5 py-4 space-y-3">
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
        </>
      )}
    </>
  )
}
