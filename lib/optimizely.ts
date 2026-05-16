import { config, getClient } from '@optimizely/cms-sdk'

config({
  apiKey: process.env.OPTIMIZELY_GRAPH_SINGLE_KEY!,
})

export { getClient }
