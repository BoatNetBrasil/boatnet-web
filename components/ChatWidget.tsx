'use client'

import { useEffect, useMemo, useRef, useState } from 'react'

type ChatMsg = {
  id: string
  role: 'user' | 'assistant'
  text: string
  ts: number
}

const N8N_WEBHOOK_URL =
  'https://n8n.kevinventuracomercial.net/webhook/ee58f15d-9584-4004-ab9f-2dc1c3052fdf'

function uuid(): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID()
  }
  return Date.now().toString() + Math.random().toString(16).slice(2)
}

/**
 * Extrai texto final da resposta da IA.
 * Aceita:
 * - texto puro
 * - { reply: "" }
 * - { text: "" }
 * - array [ { reply: "" } ]
 * - openai style
 */
function extractAIText(raw: string): string {
  if (!raw) return 'Sem resposta.'

  const trimmed = raw.trim()

  try {
    const parsed = JSON.parse(trimmed)

    // Caso array
    if (Array.isArray(parsed)) {
      const first = parsed[0]
      return (
        first?.reply ||
        first?.text ||
        first?.message ||
        first?.output ||
        trimmed
      )
    }

    // Caso objeto
    if (typeof parsed === 'object') {
      return (
        parsed?.reply ||
        parsed?.text ||
        parsed?.message ||
        parsed?.output ||
        parsed?.data?.reply ||
        parsed?.choices?.[0]?.message?.content ||
        trimmed
      )
    }

    return trimmed
  } catch {
    // Não é JSON
    return trimmed
  }
}

export function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const [sessionId, setSessionId] = useState('')
  const [messages, setMessages] = useState<ChatMsg[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const listRef = useRef<HTMLDivElement>(null)
  const storageKey = useMemo(() => 'bn_chat_v7', [])

  // INIT
  useEffect(() => {
    if (typeof window === 'undefined') return

    const raw = localStorage.getItem(storageKey)
    let parsed: any = null

    if (raw) {
      try {
        parsed = JSON.parse(raw)
      } catch {}
    }

    const sid = parsed?.sessionId || uuid()
    setSessionId(sid)

    if (parsed?.messages?.length) {
      setMessages(parsed.messages)
    } else {
      setMessages([
        {
          id: uuid(),
          role: 'assistant',
          text:
            'BoatNet Concierge online. Passeios, marinas, aluguel ou compra. Como posso ajudar?',
          ts: Date.now()
        }
      ])
    }
  }, [storageKey])

  // PERSIST
  useEffect(() => {
    if (!sessionId) return
    if (typeof window === 'undefined') return

    localStorage.setItem(
      storageKey,
      JSON.stringify({ sessionId, messages })
    )
  }, [sessionId, messages, storageKey])

  // SCROLL
  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight
    }
  }, [messages])

  async function sendMessage(text: string) {
    const trimmed = text.trim()
    if (!trimmed || loading) return

    setLoading(true)
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
      const response = await fetch(N8N_WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: trimmed, sessionId })
      })

      if (!response.ok) {
        throw new Error('Erro no servidor')
      }

      // 🔥 LER UMA ÚNICA VEZ
      const rawText = await response.text()

      const finalText = extractAIText(rawText)

      setMessages((prev) => [
        ...prev,
        {
          id: uuid(),
          role: 'assistant',
          text: finalText,
          ts: Date.now()
        }
      ])
    } catch (err) {
      setError('Falha de conexão.')
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
      setLoading(false)
    }
  }

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 rounded-full bg-brand-blue px-6 py-3 text-white shadow-lg"
      >
        {isOpen ? 'Fechar' : 'Concierge'}
      </button>

      {isOpen && (
        <div className="fixed bottom-24 right-6 z-50 w-[420px] rounded-2xl bg-neutral-950 border border-white/10 shadow-2xl">
          <div className="border-b border-white/10 px-5 py-4 text-white font-semibold">
            BoatNet Concierge
          </div>

          <div
            ref={listRef}
            className="max-h-[420px] overflow-y-auto px-5 py-4 space-y-4"
          >
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={msg.role === 'user' ? 'text-right' : 'text-left'}
              >
                <div
                  className={`inline-block max-w-[80%] rounded-2xl px-4 py-2 text-sm ${
                    msg.role === 'user'
                      ? 'bg-brand-blue text-white'
                      : 'bg-white/5 text-white'
                  }`}
                >
                  {msg.text}
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

            {error && (
              <div className="text-xs text-red-400">{error}</div>
            )}
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault()
              sendMessage(input)
            }}
            className="flex gap-3 border-t border-white/10 px-4 py-4"
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Digite sua mensagem..."
              className="flex-1 rounded-xl bg-white/5 px-4 py-2 text-white outline-none"
            />

            <button
              type="submit"
              disabled={loading}
              className="rounded-xl bg-brand-blue px-5 py-2 text-white disabled:opacity-50"
            >
              Enviar
            </button>
          </form>
        </div>
      )}
    </>
  )
}
