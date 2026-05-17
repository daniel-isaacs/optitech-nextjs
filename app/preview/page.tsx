import type { PreviewParams } from '@optimizely/cms-sdk'
import {
  OptimizelyComponent,
  OptimizelyComposition,
  withAppContext,
} from '@optimizely/cms-sdk/react/server'
import { PreviewComponent } from '@optimizely/cms-sdk/react/client'
import { getClient } from '@/lib/optimizely'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import ThemePreviewContent from '@/components/theme/ThemePreviewContent'

type Props = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

function isThemeManager(content: any): boolean {
  return (
    (Array.isArray(content?._metadata?.types) && content._metadata.types.includes('OT_ThemeManager')) ||
    content?._metadata?.contentType === 'OT_ThemeManager' ||
    content?.__typename === 'OT_ThemeManager'
  )
}

async function PreviewPage({ searchParams }: Props) {
  const params = await searchParams
  const cmsUrl = process.env.OPTIMIZELY_CMS_URL?.replace(/\/$/, '') ?? ''

  let content: any
  try {
    content = await getClient().getPreviewContent(
      params as unknown as PreviewParams,
    )
  } catch (err: any) {
    return (
      <div style={{ padding: '2rem', fontFamily: 'monospace' }}>
        <p><strong>Preview unavailable</strong></p>
        <p>{err?.message ?? 'Unknown error'}</p>
        <p>The content may not be published or the preview session may have expired. Reload the Visual Builder to get a fresh preview token.</p>
      </div>
    )
  }

  const isExperience = Array.isArray(content?.composition?.nodes)

  // Theme Manager: render the live settings preview with draft data
  if (isThemeManager(content)) {
    return (
      <>
        <script async src={`${cmsUrl}/util/javascript/communicationinjector.js`} />
        <PreviewComponent />
        <div className="min-h-screen bg-canvas">
          <div className="border-b border-fg/10 px-md py-sm bg-surface flex items-center gap-md">
            <span className="text-label tracking-label uppercase font-semibold text-brand">Theme Manager Preview</span>
            <span className="text-label text-fg-muted">Updates when you save in the CMS editor</span>
          </div>
          <ThemePreviewContent settings={content} />
        </div>
      </>
    )
  }

  return (
    <>
      {/* React 19: <script async src> is hoisted to <head> and deduped automatically */}
      <script async src={`${cmsUrl}/util/javascript/communicationinjector.js`} />
      <PreviewComponent />
      {isExperience ? (
        <>
          <Header />
          <main className="flex-1">
            <OptimizelyComposition nodes={content.composition.nodes} />
          </main>
          <Footer />
        </>
      ) : (
        <OptimizelyComponent content={content} />
      )}
    </>
  )
}

export default withAppContext(PreviewPage)
