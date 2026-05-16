import type { PreviewParams } from '@optimizely/cms-sdk'
import {
  OptimizelyComponent,
  withAppContext,
} from '@optimizely/cms-sdk/react/server'
import { PreviewComponent } from '@optimizely/cms-sdk/react/client'
import Script from 'next/script'
import { getClient } from '@/lib/optimizely'

type Props = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

async function PreviewPage({ searchParams }: Props) {
  const params = await searchParams
  const cmsUrl = process.env.OPTIMIZELY_CMS_URL?.replace(/\/$/, '') ?? ''

  const content = await getClient().getPreviewContent(
    params as unknown as PreviewParams,
  )

  return (
    <>
      <Script src={`${cmsUrl}/util/javascript/communicationinjector.js`} />
      <PreviewComponent />
      <OptimizelyComponent content={content} />
    </>
  )
}

export default withAppContext(PreviewPage)
