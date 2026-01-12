import { NextResponse } from 'next/server'
import { validateLead } from '@/lib/validate'
import crypto from 'crypto'
import { promises as fs } from 'fs'
import path from 'path'

export const runtime = 'nodejs'

type Bucket = { count: number; resetAt: number }
const buckets: Map<string, Bucket> = (globalThis as any).__BN_BUCKETS__ ?? new Map()
;(globalThis as any).__BN_BUCKETS__ = buckets

function getIP(req: Request) {
  const xff = req.headers.get('x-forwarded-for') || ''
  const ip = xff.split(',')[0].trim()
  return ip || 'unknown'
}

function rateLimit(ip: string) {
  const now = Date.now()
  const windowMs = 60_000
  const limit = 8

  const b = buckets.get(ip)
  if (!b || b.resetAt < now) {
    buckets.set(ip, { count: 1, resetAt: now + windowMs })
    return { ok: true }
  }
  if (b.count >= limit) return { ok: false }
  b.count += 1
  return { ok: true }
}

export async function POST(req: Request) {
  const ip = getIP(req)
  if (!rateLimit(ip).ok) {
    return NextResponse.json({ ok: false, error: 'muitas tentativas' }, { status: 429 })
  }

  let body: any
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ ok: false, error: 'json inválido' }, { status: 400 })
  }

  const v = validateLead(body)
  if (!v.ok) {
    return NextResponse.json({ ok: false, error: v.error }, { status: 400 })
  }

  // anti-bot: honeypot deve vir vazio
  if (v.data.honeypot) {
    return NextResponse.json({ ok: true }, { status: 200 })
  }

  const baseDir = process.cwd()
  const file = path.join(baseDir, 'data', 'leads.ndjson')

  // idempotência local (dev): hash de leadId
  const id = crypto.createHash('sha256').update(v.data.leadId).digest('hex')
  const line = JSON.stringify({
    id,
    receivedAt: new Date().toISOString(),
    ip,
    ...v.data
  }) + '\n'

  try {
    // garante pasta
    await fs.mkdir(path.dirname(file), { recursive: true })

    // checa duplicado (dev). Em produção, isso vira DynamoDB.
    try {
      const existing = await fs.readFile(file, 'utf8')
      if (existing.includes(`"id":"${id}"`)) {
        return NextResponse.json({ ok: true, idempotent: true }, { status: 200 })
      }
    } catch {
      // arquivo não existe ainda
    }

    await fs.appendFile(file, line, 'utf8')
    return NextResponse.json({ ok: true }, { status: 200 })
  } catch {
    return NextResponse.json({ ok: false, error: 'falha ao salvar lead' }, { status: 500 })
  }
}
