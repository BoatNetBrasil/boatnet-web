'use client'

import { useEffect, useMemo, useRef, useState } from 'react'

type ChatMsg = {
  id: string
  role: 'user' | 'assistant'
  text: string
  ts: number
}

type BNChatOpenArgs = { preset?: string }

declare global {
  interface Window {
    BNChat?: {
      open: (args?: BNChatOpenArgs) => void
      close: () => void
      reset: () => void
    }
  }
}

const N8N_WEBHOOK_URL =
  'https://n8n.kevinventuracomercial.net/webhook/ee58f15d-9584-4004-ab9f-2dc1c3052fdf-2dc1c3052fdf'

function uuid() {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) return crypto.randomUUID()
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`
}

function safeJsonParse<T>(s: string): T | null {
  try {
    return JSON.parse(s) as T
  } catch {
    return null
  }
}

/**
 * Extrai o "melhor texto" de uma resposta do n8n:
 * - aceita JSON {reply|text|message|output|data...}
 * - aceita array [{...}]
 * - aceita texto puro
 */
function extractReply(raw: string): string {
  const trimmed = (raw || '').trim()
  if (!trimmed) return 'Ok.'

  // tenta parse JSON mesmo se content-type vier errado
  const j = safeJsonParse<any>(trimmed)
  if (!j) return trimmed

  // se vier array, pega o primeiro item
  const obj = Array.isArray(j) ? j?.[0] : j

  // chaves mais comuns
  const candidates = [
    obj?.reply,
    obj?.text,
    obj?.message,
    obj?.output,
    obj?.answer,
    obj?.result,
    obj?.content,
    obj?.data?.reply,
    obj?.data?.text,
    obj?.data?.message,
    obj?.data?.output,
    obj?.response?.reply,
    obj?.response?.text,
    obj?.response?.message
  ]

  for (const c of candidates) {
    if (typeof c === 'string' && c.trim()) return c.trim()
  }

  // Se o obj for string
  if (typeof obj === 'string' && obj.trim()) return obj.trim()

  // Se vier estilo OpenAI: { choices: [{ message: { content } }] }
  const openAIContent =
    obj?.choices?.[0]?.message?.content ||
    obj?.choices?.[0]?.delta?.content ||
    obj?.choices?.[0]?.text
  if (typeof openAIContent === 'string' && openAIContent.trim()) return openAIContent.trim()

  // Se vier { data: { ... } } e o texto estiver “escondido”
  const deepStrings: string[] = []
  const seen = new Set<any>()

  const walk = (x: any) => {
    if (!x || seen.has(x)) return
    seen.add(x)

    if (typeof x === 'string') {
      const s = x.trim()
      if (s && s.length <= 5000) deepStrings.push(s)
      return
    }
    if (Array.isArray(x)) {
      for (const it of x) walk(it)
      return
    }
    if (typeof x === 'object') {
      for (const k of Object.keys(x)) walk(x[k])
    }
  }
  walk(obj)

  // Heurística: pega a string mais “longa” e útil
  if (deepStrings.length) {
    deepStrings.sort((a, b) => b.length - a.length)
    return deepStrings[0]
  }

  // fallback final: não mostrar JSON cru enorme
  return 'Recebi a resposta, mas ela veio em formato não suportado.'
}

export function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const [sessionId, setSessionId] = useState<string>('')
  const [messages, setMessages] = useState<ChatMsg[]>([])
  const [input, setInput] = useState('')
  const [isSending, setIsSending] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const listRef = useRef<HTMLDivElement | null>(null)
  const inputRef = useRef<HTMLInputElement | null>(null)

  const storageKey = useMemo(() => 'bn_chat_v3', [])

  useEffect(() => {
    const raw = localStorage.getItem(storageKey)
    const parsed = raw ? safeJsonParse<{ sessionId: string; messages: ChatMsg[] }>(raw) : null

    const sid = parsed?.sessionId || uuid()
    setSessionId(sid)
    setMessages(
      (parsed?.messages?.length
        ? parsed.messages
        : [
            {
              id: uuid(),
              role: 'assistant',
              text: 'BOAT NET online. O que você quer resolver agora?',
              ts: Date.now()
            }
          ]) as ChatMsg[]
    )
  }, [storageKey])

  useEffect(() => {
    if (!sessionId) return
    localStorage.setItem(storageKey, JSON.stringify({ sessionId, messages }))
  }, [storageKey, sessionId, messages])

  useEffect(() => {
    const el = listRef.current
    if (!el) return
    el.scrollTop = el.scrollHeight
  }, [messages, isOpen, isSending])

  function focusInput() {
    setTimeout(() => inputRef.current?.focus(), 30)
  }

  function openWithPreset(preset?: string) {
    setIsOpen(true)
    setError(null)
    if (preset && preset.trim()) setInput(preset)
    focusInput()
  }

  function resetChat() {
    const sid = uuid()
    setSessionId(sid)
    setError(null)
    setMessages([
      {
        id: uuid(),
        role: 'assistant',
        text: 'Sessão reiniciada. Parceria, suporte ou app?',
        ts: Date.now()
      }
    ])
    setInput('')
    focusInput()
  }

  useEffect(() => {
    window.BNChat = {
      open: (args?: BNChatOpenArgs) => openWithPreset(args?.preset),
      close: () => setIsOpen(false),
      reset: () => resetChat()
    }

    const handler = (ev: Event) => {
      const ce = ev as CustomEvent
      const preset = (ce?.detail?.preset ?? '') as string
      openWithPreset(preset)
    }

    window.addEventListener('bn:openChat', handler as EventListener)
    return () => {
      window.removeEventListener('bn:openChat', handler as EventListener)
      if (window.BNChat) delete window.BNChat
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionId])

  async function send(text: string) {
    const trimmed = text.trim()
    if (!trimmed || isSending) return

    if (!N8N_WEBHOOK_URL) {
      setError('Webhook do n8n não configurado.')
      return
    }

    setError(null)
    setIsSending(true)

    const userMsg: ChatMsg = { id: uuid(), role: 'user', text: trimmed, ts: Date.now() }
    setMessages((prev) => [...prev, userMsg])
    setInput('')

    try {
      const res = await fetch(N8N_WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: trimmed,
          sessionId,
          metadata: {
            source: 'site',
            page: typeof window !== 'undefined' ? window.location.pathname : '/'
          }
        })
      })

      const raw = await res.text()
      if (!res.ok) throw new Error(raw || `HTTP ${res.status}`)

      const replyText = extractReply(raw)

      const assistantMsg: ChatMsg = { id: uuid(), role: 'assistant', text: replyText, ts: Date.now() }
      setMessages((prev) => [...prev, assistantMsg])
      focusInput()
    } catch (e: any) {
      setError(e?.message || 'Falha ao enviar mensagem.')
      setMessages((prev) => [
        ...prev,
        {
          id: uuid(),
          role: 'assistant',
          text: 'Falha de conexão. Se aparecer CORS no console, o n8n precisa liberar localhost:3000.',
          ts: Date.now()
        }
      ])
    } finally {
      setIsSending(false)
    }
  }

  function quickSend(preset: string) {
    openWithPreset('')
    void send(preset)
  }

  return (
    <>
      <button
        type="button"
        onClick={() => {
          setIsOpen((v) => {
            const nv = !v
            if (nv) focusInput()
            return nv
          })
        }}
        aria-label={isOpen ? 'Fechar chat' : 'Abrir chat'}
        className={[
          'fixed bottom-5 right-5 z-50',
          'group inline-flex items-center gap-3',
          'rounded-full bg-brand-blue px-5 py-3 text-sm font-semibold tracking-wide text-white',
          'shadow-soft ring-1 ring-brand-blue/40',
          'transition hover:opacity-95 active:scale-[0.98]',
          'animate-[bn-float_3.2s_ease-in-out_infinite]',
          'focus:outline-none focus:ring-2 focus:ring-brand-blue/50'
        ].join(' ')}
      >
        <span>{isOpen ? 'Fechar chat' : 'Falar no chat'}</span>

        <span className="relative flex h-3 w-3">
          <span className="absolute inline-flex h-full w-full animate-[bn-sonar_1.6s_ease-out_infinite] rounded-full bg-white/70 opacity-40" />
          <span className="relative inline-flex h-3 w-3 rounded-full bg-white/95" />
        </span>
      </button>

      <style jsx global>{`
        @keyframes bn-float {
          0%,
          100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }
        @keyframes bn-sonar {
          0% { transform: scale(1); opacity: 0.55; }
          100% { transform: scale(2.2); opacity: 0; }
        }
        @keyframes bn-wave {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>

      {isOpen && (
        <div className="fixed bottom-[86px] right-5 z-50 w-[94vw] max-w-[460px]">
          <div className="overflow-hidden rounded-[28px] bg-black/70 ring-1 ring-white/10 shadow-soft backdrop-blur">
            <div className="relative border-b border-white/10 bg-black/40 px-4 py-3">
              <div className="pointer-events-none absolute inset-0 opacity-[0.20]">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(59,130,246,0.45),transparent_55%),radial-gradient(circle_at_80%_30%,rgba(255,255,255,0.12),transparent_45%)]" />
                <div className="absolute bottom-0 left-0 h-10 w-[200%] animate-[bn-wave_10s_linear_infinite] bg-[url('data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22800%22 height=%2240%22 viewBox=%220 0 800 40%22%3E%3Cpath d=%22M0 20 C 100 0, 200 40, 300 20 C 400 0, 500 40, 600 20 C 700 0, 800 40, 900 20%22 fill=%22none%22 stroke=%22rgba(255,255,255,0.45)%22 stroke-width=%222%22/%3E%3C/svg%3E')] bg-repeat-x" />
              </div>

              <div className="relative flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <div className="text-sm font-semibold text-white/90">BOAT NET • Concierge AI</div>
                  <div className="truncate text-[11px] text-white/50">Sessão: {sessionId.slice(0, 8)} • Secure</div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={resetChat}
                    className="rounded-full bg-white/5 px-3 py-1.5 text-xs font-semibold text-white/70 ring-1 ring-white/10 hover:bg-white/10"
                  >
                    Novo
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsOpen(false)}
                    className="rounded-full bg-white/5 px-3 py-1.5 text-xs font-semibold text-white/70 ring-1 ring-white/10 hover:bg-white/10"
                  >
                    Fechar
                  </button>
                </div>
              </div>
            </div>

            <div ref={listRef} className="max-h-[56vh] space-y-3 overflow-y-auto px-4 py-4">
              <div className="flex flex-wrap gap-2">
                {['Quero virar parceiro(a)', 'Preciso de suporte', 'Quero baixar o app', 'Como funciona a BOAT NET?'].map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => quickSend(t)}
                    className="rounded-full bg-white/5 px-3 py-1.5 text-xs font-semibold text-white/70 ring-1 ring-white/10 hover:bg-white/10"
                  >
                    {t}
                  </button>
                ))}
              </div>

              {messages.map((m) => (
                <div key={m.id} className={['flex', m.role === 'user' ? 'justify-end' : 'justify-start'].join(' ')}>
                  <div
                    className={[
                      'max-w-[86%] rounded-2xl px-4 py-2 text-sm leading-relaxed ring-1',
                      'shadow-[0_10px_30px_rgba(0,0,0,0.25)]',
                      m.role === 'user'
                        ? 'bg-brand-blue text-white ring-brand-blue/40'
                        : 'bg-white/5 text-white/85 ring-white/10'
                    ].join(' ')}
                  >
                    {m.text}
                  </div>
                </div>
              ))}

              {isSending && (
                <div className="flex justify-start">
                  <div className="rounded-2xl bg-white/5 px-4 py-2 text-sm text-white/70 ring-1 ring-white/10">
                    Digitando…
                  </div>
                </div>
              )}

              {error && (
                <div className="rounded-2xl bg-red-500/10 px-4 py-2 text-xs text-red-200 ring-1 ring-red-500/20">
                  {error}
                </div>
              )}
            </div>

            <form
              className="border-t border-white/10 bg-black/30 px-3 py-3"
              onSubmit={(e) => {
                e.preventDefault()
                void send(input)
              }}
            >
              <div className="flex items-center gap-2">
                <div className="flex-1 rounded-2xl bg-white/5 ring-1 ring-white/10 focus-within:ring-2 focus-within:ring-brand-blue/40">
                  <input
                    ref={inputRef}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Digite sua mensagem…"
                    className="h-[44px] w-full bg-transparent px-4 text-sm text-white/85 placeholder:text-white/35 focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={!input.trim() || isSending}
                  className={[
                    'h-[44px] rounded-2xl px-4 text-sm font-semibold',
                    'bg-brand-blue text-white ring-1 ring-brand-blue/40',
                    'transition active:scale-[0.98]',
                    (!input.trim() || isSending) ? 'opacity-60' : 'hover:opacity-95'
                  ].join(' ')}
                >
                  Enviar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
