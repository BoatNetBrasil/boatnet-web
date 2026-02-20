'use client'

import { useEffect, useMemo, useRef, useState } from 'react'

type ChatMsg = {
  id: string
  role: 'user' | 'assistant'
  text: string
  ts: number
}

declare global {
  interface Window {
    BNChat?: {
      open: (args?: { preset?: string }) => void
      close: () => void
      reset: () => void
    }
  }
}

const N8N_WEBHOOK_URL =
  'https://n8n.kevinventuracomercial.net/webhook/ee58f15d-9584-4004-ab9f-2dc1c3052fdf'

function uuid() {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto')
    return crypto.randomUUID()
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`
}

function parseResponse(raw: string): string {
  if (!raw) return 'Sem resposta.'

  const trimmed = raw.trim()

  try {
    const parsed = JSON.parse(trimmed)

    // suporta múltiplos formatos de retorno
    if (Array.isArray(parsed)) {
      const first = parsed[0]
      return (
        first?.reply ||
        first?.text ||
        first?.message ||
        first?.output ||
        'Resposta recebida.'
      )
    }

    return (
      parsed?.reply ||
      parsed?.text ||
      parsed?.message ||
      parsed?.output ||
      parsed?.data?.reply ||
      parsed?.choices?.[0]?.message?.content ||
      'Resposta recebida.'
    )
  } catch {
    // se não for JSON, retorna texto puro
    return trimmed
  }
}

export function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const [sessionId, setSessionId] = useState('')
  const [messages, setMessages] = useState<ChatMsg[]>([])
  const [input, setInput] = useState('')
  const [isSending, setIsSending] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const listRef = useRef<HTMLDivElement | null>(null)

  const storageKey = useMemo(() => 'bn_chat_v5', [])

  useEffect(() => {
    const raw = localStorage.getItem(storageKey)
    const parsed = raw ? JSON.parse(raw) : null

    const sid = parsed?.sessionId || uuid()
    setSessionId(sid)

    setMessages(
      parsed?.messages?.length
        ? parsed.messages
        : [
            {
              id: uuid(),
              role: 'assistant',
              text:
                'BoatNet Concierge online. Passeios, marinas, aluguel ou compra. Como posso ajudar?',
              ts: Date.now()
            }
          ]
    )
  }, [storageKey])

  useEffect(() => {
    if (!sessionId) return
    localStorage.setItem(storageKey, JSON.stringify({ sessionId, messages }))
  }, [storageKey, sessionId, messages])

  useEffect(() => {
    listRef.current?.scrollTo(0, listRef.current.scrollHeight)
  }, [messages])

  async function send(text: string) {
    const trimmed = text.trim()
    if (!trimmed || isSending) return

    setIsSending(true)
    setError(null)

    const userMsg: ChatMsg = {
      id: uuid(),
      role: 'user',
      text: trimmed,
      ts: Date.now()
    }

    setMessages((prev) => [...prev, userMsg])
    setInput('')

    try {
      const res = await fetch(N8N_WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: trimmed,
          sessionId,
          source: 'boatnet-site'
        })
      })

      if (!res.ok) {
        throw new Error('Falha na comunicação com servidor.')
      }

      const raw = await res.text()
      const replyText = parseResponse(raw)

      setMessages((prev) => [
        ...prev,
        {
          id: uuid(),
          role: 'assistant',
          text: replyText,
          ts: Date.now()
        }
      ])
    } catch (e: any) {
      setError('Conexão indisponível.')
      setMessages((prev) => [
        ...prev,
        {
          id: uuid(),
          role: 'assistant',
          text:
            'Estamos temporariamente indisponíveis. Tente novamente em instantes.',
          ts: Date.now()
        }
      ])
    } finally {
      setIsSending(false)
    }
  }

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 rounded-full bg-brand-blue px-6 py-3 text-white shadow-lg transition hover:scale-105"
      >
        {isOpen ? 'Fechar' : 'Concierge'}
      </button>

      {isOpen && (
        <div className="fixed bottom-24 right-6 z-50 w-[420px] rounded-2xl bg-neutral-950 shadow-2xl border border-white/10 backdrop-blur-xl">
          <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
            <div>
              <div className="text-white font-semibold">
                BoatNet Concierge
              </div>
              <div className="text-xs text-white/40">
                Atendimento náutico premium
              </div>
            </div>
          </div>

          <div
            ref={listRef}
            className="max-h-[420px] overflow-y-auto px-5 py-4 space-y-4"
          >
            {messages.map((m) => (
              <div
                key={m.id}
                className={m.role === 'user' ? 'text-right' : 'text-left'}
              >
                <div
                  className={`inline-block max-w-[80%] rounded-2xl px-4 py-2 text-sm leading-relaxed ${
                    m.role === 'user'
                      ? 'bg-brand-blue text-white'
                      : 'bg-white/5 text-white'
                  }`}
                >
                  {m.text}
                </div>
              </div>
            ))}

            {isSending && (
              <div className="text-left">
                <div className="inline-block bg-white/5 text-white rounded-2xl px-4 py-2 text-sm animate-pulse">
                  Digitando...
                </div>
              </div>
            )}

            {error && (
              <div className="text-xs text-red-400">{error}</div>
            )}
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault()
              send(input)
            }}
            className="flex gap-3 border-t border-white/10 px-4 py-4"
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1 rounded-xl bg-white/5 px-4 py-2 text-white outline-none placeholder:text-white/30"
              placeholder="Digite sua mensagem..."
            />
            <button
              type="submit"
              disabled={isSending}
              className="rounded-xl bg-brand-blue px-5 py-2 text-white transition hover:opacity-90 disabled:opacity-50"
            >
              Enviar
            </button>
          </form>
        </div>
      )}
    </>
  )
}
