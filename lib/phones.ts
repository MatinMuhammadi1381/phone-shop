import { NextResponse } from 'next/server'

// Allow-list of writable Phone fields coming from the admin UI.
// Prevents mass-assignment of sensitive/managed fields like `id`, `views`,
// `isSold`, `createdAt` when POST/PUT bodies are forwarded to Prisma.
export type PhoneInput = {
  brand?: string
  model?: string
  price?: number
  storage?: string
  ram?: string
  color?: string
  condition?: string
  description?: string
  images?: string[]
  isSold?: boolean
  section?: string | null
}

const VALID_SECTIONS = new Set(['', 'featured', 'budget', 'new_box'])
const VALID_CONDITIONS = new Set(['like_new', 'good', 'fair'])

/**
 * Pick only allowed fields and coerce them to safe values.
 * Returns `{ data }` when valid, or `{ error }` (NextResponse) when invalid.
 */
export function parsePhoneBody(
  body: unknown
): { data: PhoneInput } | { error: NextResponse } {
  if (!body || typeof body !== 'object') {
    return { error: NextResponse.json({ error: 'بدنه‌ی درخواست نامعتبر است' }, { status: 400 }) }
  }

  const raw = body as Record<string, unknown>
  const data: PhoneInput = {}

  if (typeof raw.brand === 'string') data.brand = raw.brand.trim()
  if (typeof raw.model === 'string') data.model = raw.model.trim()
  if (typeof raw.storage === 'string') data.storage = raw.storage.trim()
  if (typeof raw.ram === 'string') data.ram = raw.ram.trim()
  if (typeof raw.color === 'string') data.color = raw.color.trim()
  if (typeof raw.description === 'string') data.description = raw.description

  if (raw.price !== undefined) {
    const n = Number(raw.price)
    if (!Number.isFinite(n) || n < 0) {
      return { error: NextResponse.json({ error: 'قیمت نامعتبر است' }, { status: 400 }) }
    }
    data.price = n
  }

  if (typeof raw.isSold === 'boolean') data.isSold = raw.isSold

  if (raw.condition !== undefined) {
    if (typeof raw.condition !== 'string' || !VALID_CONDITIONS.has(raw.condition)) {
      return { error: NextResponse.json({ error: 'وضعیت نامعتبر است' }, { status: 400 }) }
    }
    data.condition = raw.condition
  }

  if (raw.section !== undefined && raw.section !== null) {
    if (typeof raw.section !== 'string' || !VALID_SECTIONS.has(raw.section)) {
      return { error: NextResponse.json({ error: 'بخش نامعتبر است' }, { status: 400 }) }
    }
    data.section = raw.section || null
  } else if (raw.section === null) {
    data.section = null
  }

  if (raw.images !== undefined) {
    if (!Array.isArray(raw.images) || !raw.images.every((i) => typeof i === 'string')) {
      return { error: NextResponse.json({ error: 'فهرست تصاویر نامعتبر است' }, { status: 400 }) }
    }
    data.images = raw.images as string[]
  }

  return { data }
}
