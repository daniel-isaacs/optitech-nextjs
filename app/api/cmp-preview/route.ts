import { type NextRequest, NextResponse } from 'next/server'

// CMP blog preview webhook — PHASE 1: capture & inspect.
//
// Optimizely's Content Marketing Platform fires a webhook POST here when an
// editor requests a preview. We don't yet know the payload shape, so this route
// simply captures whatever arrives and makes it inspectable two ways:
//   • POST — parses the body (JSON / form / raw), logs it to the server console
//     (Vercel → Functions logs), stashes it in memory, and echoes it back so the
//     CMP webhook-delivery log also shows the parsed payload.
//   • GET  — returns the most recently captured payload as JSON, so you can open
//     this URL in a browser to read the last delivery.
//
// Once we know the shape, PHASE 2 swaps the echo response for a rendered blog
// preview (map payload → the OT_BlogPage UI components).

export const dynamic = 'force-dynamic'
export const revalidate = 0

type CapturedMeta = {
  receivedAt: string
  method: string
  contentType: string
  query: Record<string, string>
  headers: Record<string, string>
}

// Best-effort in-memory capture of the most recent delivery. This survives only
// within a single warm serverless instance — durable enough for active analysis,
// not a persistent store. Cleared on cold start / redeploy.
let lastPayload: unknown = null
let lastMeta: CapturedMeta | null = null

// Reads the request body without assuming a content type: tries JSON first, then
// form encodings, then falls back to raw text (re-parsing as JSON in case the
// content-type header lied, which webhooks sometimes do).
async function readBody(req: NextRequest): Promise<unknown> {
  const contentType = req.headers.get('content-type') ?? ''

  if (contentType.includes('application/json')) {
    try {
      return await req.json()
    } catch {
      /* malformed JSON — fall through to raw text */
    }
  }

  if (
    contentType.includes('application/x-www-form-urlencoded') ||
    contentType.includes('multipart/form-data')
  ) {
    try {
      const form = await req.formData()
      return Object.fromEntries(form.entries())
    } catch {
      /* fall through to raw text */
    }
  }

  const text = await req.text()
  if (!text) return null
  try {
    return JSON.parse(text)
  } catch {
    return text
  }
}

export async function POST(req: NextRequest) {
  const body = await readBody(req)

  const meta: CapturedMeta = {
    receivedAt: new Date().toISOString(),
    method: req.method,
    contentType: req.headers.get('content-type') ?? '',
    query: Object.fromEntries(req.nextUrl.searchParams.entries()),
    headers: Object.fromEntries(req.headers.entries()),
  }

  lastPayload = body
  lastMeta = meta

  // Pretty-print to the server log so the full delivery is captured even if the
  // caller ignores the response body.
  console.log('[cmp-preview] webhook received:\n' + JSON.stringify({ meta, body }, null, 2))

  return NextResponse.json({ ok: true, captured: meta, payload: body })
}

export async function GET() {
  if (!lastPayload && !lastMeta) {
    return NextResponse.json({
      ok: true,
      message:
        'No payload captured yet. Point the CMP preview webhook (POST) at this URL, ' +
        'trigger a preview, then reload this page to inspect the delivery.',
    })
  }

  return NextResponse.json({
    ok: true,
    message: 'Most recently captured CMP webhook delivery.',
    captured: lastMeta,
    payload: lastPayload,
  })
}
