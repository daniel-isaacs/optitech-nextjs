import type { PreviewParams } from '@optimizely/cms-sdk'
import {
  OptimizelyComponent,
  withAppContext,
} from '@optimizely/cms-sdk/react/server'
import { PreviewComponent } from '@optimizely/cms-sdk/react/client'
import { getClient } from '@/lib/optimizely'
import { CompositionRenderer } from '@/lib/CompositionRenderer'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import Script from 'next/script'

export const dynamic  = 'force-dynamic'
export const revalidate = 0

type Props = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

async function PreviewPage({ searchParams }: Props) {
  const params  = await searchParams
  const cmsUrl  = process.env.OPTIMIZELY_CMS_URL?.replace(/\/$/, '') ?? ''

  // Graph may not have indexed the newly-saved version yet — retry briefly.
  let content: any
  let lastErr: unknown
  for (let attempt = 0; attempt <= 3; attempt++) {
    try {
      lastErr = undefined
      content = await getClient().getPreviewContent(
        params as unknown as PreviewParams,
      )
      break
    } catch (err) {
      lastErr = err
      const notIndexed =
        err instanceof Error && err.message.includes('No content found for key')
      if (notIndexed && attempt < 3) {
        await new Promise(r => setTimeout(r, 250))
        continue
      }
      break
    }
  }

  if (lastErr || !content) {
    const msg = lastErr instanceof Error ? lastErr.message : 'Unknown error'
    return (
      <div style={{ padding: '2rem', fontFamily: 'monospace' }}>
        <p><strong>Preview unavailable</strong></p>
        <p>{msg}</p>
        <p>The content may not be published or the preview session may have expired. Reload the Visual Builder to get a fresh preview token.</p>
      </div>
    )
  }

  const isExperience = Array.isArray(content?.composition?.nodes)

  // For standalone blocks synthesize __composition so pa(content.__composition)
  // generates the data-epi-block-id attribute needed for on-page editing.
  const contentKey = typeof params.key === 'string' ? params.key : ''
  const standaloneContent = !isExperience && contentKey
    ? { ...content, __composition: { key: contentKey } }
    : content

  return (
    <>
      {cmsUrl && (
        <Script
          src={`${cmsUrl}/util/javascript/communicationinjector.js`}
          strategy="afterInteractive"
          id="optimizely-communication-injector"
        />
      )}
      <PreviewComponent />
      {isExperience ? (
        <>
          <Header />
          <main className="flex-1">
            <CompositionRenderer nodes={content.composition.nodes} />
          </main>
          <Footer />
        </>
      ) : (
        <OptimizelyComponent content={standaloneContent} />
      )}
    </>
  )
}

export default withAppContext(PreviewPage)
