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

function extractReply(raw: string): string {
  const trimmed = (raw || '').trim()
  if (!trimmed) return 'Ok.'

  const parsed = safeJsonParse<any>(trimmed)
  if (!parsed) return trimmed

  const obj = Array.isArray(parsed) ? parsed[0] : parsed

  return (
    obj?.reply ||
    obj?.text ||
    obj?.message ||
    obj?.output ||
    obj?.data?.reply ||
    obj?.data?.text ||
    obj?.data?.message ||
    obj?.choices?.[0]?.message?.content ||
    trimmed
  )
}

export function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const [sessionId, setSessionId] = useState('')
  const [messages, setMessages] = useState<ChatMsg[]>([])
  const [input, setInput] = useState('')
  const [isSending, setIsSending] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const listRef = useRef<HTMLDivElement | null>(null)
  const inputRef = useRef<HTMLInputElement | null>(null)

  const storageKey = useMemo(() => 'bn_chat_v4', [])

  useEffect(() => {
    const raw = localStorage.getItem(storageKey)
    const parsed = raw ? safeJsonParse<{ sessionId: string; messages: ChatMsg[] }>(raw) : null

    const sid = parsed?.sessionId || uuid()
    setSessionId(sid)

    setMessages(
      parsed?.messages?.length
        ? parsed.messages
        : [
            {
              id: uuid(),
              role: 'assistant',
              text: 'BOAT NET online. Como posso ajudar?',
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
        body: JSON.stringify({ message: trimmed, sessionId })
      })

      const raw = await res.text()

      if (!res.ok) throw new Error(raw)

      const replyText = extractReply(raw)

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
      setError(e?.message || 'Erro de conexão.')
      setMessages((prev) => [
        ...prev,
        {
          id: uuid(),
          role: 'assistant',
          text: 'Erro ao conectar com o servidor.',
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
        className="fixed bottom-5 right-5 z-50 rounded-full bg-brand-blue px-5 py-3 text-white"
      >
        {isOpen ? 'Fechar chat' : 'Falar no chat'}
      </button>

      {isOpen && (
        <div className="fixed bottom-20 right-5 z-50 w-[420px] rounded-2xl bg-black/80 shadow-xl backdrop-blur">
          <div className="border-b border-white/10 p-4 text-white font-semibold">
            BOAT NET • Concierge AI
          </div>

          <div ref={listRef} className="max-h-[400px] overflow-y-auto p-4 space-y-3">
            {messages.map((m) => (
              <div
                key={m.id}
                className={m.role === 'user' ? 'text-right' : 'text-left'}
              >
                <div
                  className={`inline-block rounded-xl px-4 py-2 text-sm ${
                    m.role === 'user'
                      ? 'bg-brand-blue text-white'
                      : 'bg-white/10 text-white'
                  }`}
                >
                  {m.text}
                </div>
              </div>
            ))}

            {error && (
              <div className="text-xs text-red-400">{error}</div>
            )}
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault()
              send(input)
            }}
            className="flex gap-2 border-t border-white/10 p-3"
          >
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1 rounded-xl bg-white/10 px-3 py-2 text-white outline-none"
              placeholder="Digite sua mensagem..."
            />
            <button
              type="submit"
              disabled={isSending}
              className="rounded-xl bg-brand-blue px-4 text-white"
            >
              Enviar
            </button>
          </form>
        </div>
      )}
    </>
  )
}
