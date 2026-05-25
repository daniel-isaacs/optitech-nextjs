import { notFound, redirect } from 'next/navigation'
import { draftMode } from 'next/headers'
import { getClient, getLocalizedContentByPath, getRequestBaseUrl, getRequestLocale, setRequestContext } from '@/lib/optimizely'
import { getBlogPage, getLatestBlogPosts } from '@/lib/blog'
import { withAppContext } from '@optimizely/cms-sdk/react/server'
import { PreviewComponent } from '@optimizely/cms-sdk/react/client'
import type { PreviewParams } from '@optimizely/cms-sdk'
import { CompositionRenderer } from '@/lib/CompositionRenderer'
import BlogPage from '@/components/pages/BlogPage'
import Script from 'next/script'

type Props = {
  params:       Promise<{ slug: string[] }>
  searchParams: Promise<Record<string, string | string[] | undefined>>
}

async function CmsPage({ params, searchParams }: Props) {
  const { slug } = await params
  const sp        = await searchParams
  const path      = '/' + slug.join('/')
  const cmsUrl    = (process.env.OPTIMIZELY_CMS_URL ?? '').replace(/\/$/, '')
  const dm        = await draftMode()
  const locale    = await getRequestLocale()

  const sp_str = (key: string) => {
    const v = sp[key]
    return typeof v === 'string' ? v : ''
  }

  const baseUrl = await getRequestBaseUrl()

  let exp: any
  if (dm.isEnabled && sp_str('preview_token')) {
    // Preview: locale comes from the CMS editor (sp loc param)
    const previewLocale = sp_str('loc') || locale
    await setRequestContext(previewLocale as any)

    const previewParams: PreviewParams = {
      preview_token: sp_str('preview_token'),
      key:           sp_str('key'),
      ctx:           'edit',
      ver:           sp_str('ver'),
      loc:           previewLocale,
    }
    exp = await getClient().getPreviewContent(previewParams, { cache: false })
  } else {
    exp = await getLocalizedContentByPath(path, locale, baseUrl)
  }

  if (!exp?.composition?.nodes) {
    // Blog page — _page type rendered by its own component, not a composition
    if (exp?.__typename === 'OT_BlogPage') {
      const contentKey = exp._metadata?.key as string | undefined
      // For preview, getPreviewContent already returns all fields.
      // For public, make a targeted query to ensure all fields are present.
      const blogContent = dm.isEnabled
        ? exp
        : (contentKey ? await getBlogPage(contentKey) : null)
      const latestPosts = await getLatestBlogPosts(contentKey, locale, baseUrl)

      if (blogContent) {
        return (
          <>
            {dm.isEnabled && cmsUrl && (
              <Script src={`${cmsUrl}/util/javascript/communicationinjector.js`} />
            )}
            {dm.isEnabled && <PreviewComponent />}
            <BlogPage content={blogContent} latestPosts={latestPosts} />
          </>
        )
      }
    }

    // Standalone block content (not an experience) — send to the isolated preview route
    // so it renders without site chrome and with proper communicationinjector.js setup.
    if (dm.isEnabled && exp?.__typename) {
      const qs = new URLSearchParams({
        preview_token: sp_str('preview_token'),
        key:           sp_str('key'),
        ver:           sp_str('ver'),
        loc:           sp_str('loc') || locale,
        ctx:           'edit',
      })
      redirect(`/preview?${qs}`)
    }
    notFound()
  }

  return (
    <>
      {dm.isEnabled && cmsUrl && (
        <Script src={`${cmsUrl}/util/javascript/communicationinjector.js`} />
      )}
      {dm.isEnabled && <PreviewComponent />}
      <CompositionRenderer nodes={exp.composition.nodes} />
    </>
  )
}

export default withAppContext(CmsPage)
