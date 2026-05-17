import { cache } from 'react'
import { config, getClient as _getClient } from '@optimizely/cms-sdk'

let initialized = false

function ensureInitialized() {
  if (initialized) return
  const key = process.env.OPTIMIZELY_GRAPH_SINGLE_KEY
  if (!key) throw new Error('OPTIMIZELY_GRAPH_SINGLE_KEY is not set')
  config({ apiKey: key })
  initialized = true
}

export function getClient() {
  ensureInitialized()
  return _getClient()
}

// cache() deduplicates across the same request — Header and Footer both call this
// but only one Graph fetch happens per page render.
export const getSiteSettings = cache(async function getSiteSettings() {
  try {
    const results = await getClient().getContentByPath('/site-settings')
    return (results?.[0] ?? null) as any
  } catch {
    return null
  }
})
