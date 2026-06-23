import { type NextRequest, NextResponse } from 'next/server'
import { putPublishDelivery, getLatestPublishDelivery } from '@/lib/cmpPreviewStore'

// CMP publish webhook — PHASE 4, STEP 1: capture & inspect.
//
// When a CMP workflow completes (publish), CMP fires a webhook here. We don't
// yet know the event name or payload shape, so this route only captures: verify
// the inbound `callback-secret`, log the full delivery to the server console
// (Vercel → Functions logs, prefixed [cmp-publish]), stash the latest, and echo
// it back. GET returns the most recent delivery as JSON for browser inspection.
//
// Once we know the shape, the next step maps the fields (reusing lib/cmpBlog.ts)
// and CREATES a draft OT_BlogPage via the CMS Management API — updating the same
// page on re-publish (content_guid → CMS key), per the agreed design.
//
// Reuses CMP_CALLBACK_SECRET — set the same callback secret on the CMP publish
// webhook as on the preview webhook (or we can split to a second var later).

export const dynamic = 'force-dynamic'
export const revalidate = 0

type CapturedMeta = {
  receivedAt: string
  method: string
  contentType: string
  query: Record<string, string>
  headers: Record<string, string>
}

// Reads the body without trusting the content-type header (mirrors the preview
// webhook): JSON first, then form encodings, then raw text re-parsed as JSON.
async function readBody(req: NextRequest): Promise<unknown> {
  const contentType = req.headers.get('content-type') ?? ''
  if (contentType.includes('application/json')) {
    try {
      return await req.json()
    } catch {
      /* fall through */
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
      /* fall through */
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
  const expectedSecret = process.env.CMP_CALLBACK_SECRET
  if (expectedSecret) {
    const provided = req.headers.get('callback-secret')
    if (provided !== expectedSecret) {
      console.warn('[cmp-publish] rejected webhook — callback-secret mismatch')
      return NextResponse.json({ ok: false, error: 'invalid callback secret' }, { status: 401 })
    }
  }

  const body = await readBody(req)

  const meta: CapturedMeta = {
    receivedAt: new Date().toISOString(),
    method: req.method,
    contentType: req.headers.get('content-type') ?? '',
    query: Object.fromEntries(req.nextUrl.searchParams.entries()),
    headers: Object.fromEntries(req.headers.entries()),
  }

  await putPublishDelivery({ receivedAt: meta.receivedAt, meta, payload: body })

  console.log('[cmp-publish] webhook received:\n' + JSON.stringify({ meta, body }, null, 2))

  // Surface the event name if present, to speed up identifying the publish event.
  const eventName = (body as { event_name?: string })?.event_name
  return NextResponse.json({ ok: true, eventName, captured: meta, payload: body })
}

export async function GET() {
  const latest = await getLatestPublishDelivery()
  if (!latest) {
    return NextResponse.json({
      ok: true,
      message:
        'No publish payload captured yet. Point the CMP publish/workflow-complete ' +
        'webhook (POST) at this URL, complete a workflow, then reload to inspect.',
    })
  }
  return NextResponse.json({
    ok: true,
    message: 'Most recently captured CMP publish webhook delivery.',
    captured: latest.meta,
    payload: latest.payload,
  })
}
