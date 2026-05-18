import { notFound, redirect } from 'next/navigation'
import { draftMode } from 'next/headers'
import { getClient } from '@/lib/optimizely'
import { OptimizelyComposition } from '@optimizely/cms-sdk/react/server'
import { PreviewComponent } from '@optimizely/cms-sdk/react/client'
import type { PreviewParams } from '@optimizely/cms-sdk'

type Props = {
  params:       Promise<{ slug: string[] }>
  searchParams: Promise<Record<string, string | string[] | undefined>>
}

export default async function CmsPage({ params, searchParams }: Props) {
  const { slug } = await params
  const sp        = await searchParams
  const path      = '/' + slug.join('/')
  const dm        = await draftMode()

  const sp_str = (key: string) => {
    const v = sp[key]
    return typeof v === 'string' ? v : ''
  }

  let exp: any
  if (dm.isEnabled && sp_str('preview_token')) {
    const previewParams: PreviewParams = {
      preview_token: sp_str('preview_token'),
      key:           sp_str('key'),
      ctx:           'edit',
      ver:           sp_str('ver'),
      loc:           sp_str('loc'),
    }
    exp = await getClient().getPreviewContent(previewParams, { cache: false })
  } else {
    const results = await getClient().getContentByPath(path)
    exp = results?.[0]
  }

  if (!exp?.composition?.nodes) {
    // Standalone block content (not an experience) — send to the isolated preview route
    // so it renders without site chrome and with proper communicationinjector.js setup.
    if (dm.isEnabled && exp?.__typename) {
      const qs = new URLSearchParams({
        preview_token: sp_str('preview_token'),
        key:           sp_str('key'),
        ver:           sp_str('ver'),
        loc:           sp_str('loc'),
        ctx:           'edit',
      })
      redirect(`/preview?${qs}`)
    }
    notFound()
  }

  return (
    <>
      <OptimizelyComposition nodes={exp.composition.nodes} />
      {dm.isEnabled && <PreviewComponent />}
    </>
  )
}
