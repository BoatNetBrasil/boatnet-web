import { NextResponse } from 'next/server'
import { validateLead } from '@/lib/validate'
import crypto from 'crypto'
import { PutCommand } from '@aws-sdk/lib-dynamodb'
import { ddb } from '@/lib/ddb'

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
  const table = process.env.LEADS_TABLE
  if (!table) {
    return NextResponse.json({ ok: false, error: 'LEADS_TABLE não configurado' }, { status: 500 })
  }

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

  // idempotência: hash de leadId (mantém o seu comportamento atual)
  const id = crypto.createHash('sha256').update(v.data.leadId).digest('hex')
  const receivedAt = new Date().toISOString()

  // item final (salva exatamente o que já existe hoje)
  const item = {
    pk: `LEAD#${id}`,
    sk: receivedAt,

    id,
    receivedAt,
    ip,

    ...v.data,

    status: 'new',
    source: 'site',

    // índice por tipo (se você criou o GSI)
    gsi1pk: `TYPE#${v.data.type}`,
    gsi1sk: `${receivedAt}#${id}`
  }

  try {
    await ddb.send(
      new PutCommand({
        TableName: table,
        Item: item,
        // evita duplicar o mesmo lead (idempotência real)
        ConditionExpression: 'attribute_not_exists(pk)'
      })
    )

    return NextResponse.json({ ok: true }, { status: 200 })
  } catch (e: any) {
    // se já existe, retorna ok igual ao seu comportamento antigo
    if (e?.name === 'ConditionalCheckFailedException') {
      return NextResponse.json({ ok: true, idempotent: true }, { status: 200 })
    }

    console.error(e)
    return NextResponse.json({ ok: false, error: 'falha ao salvar lead' }, { status: 500 })
  }
}


