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
