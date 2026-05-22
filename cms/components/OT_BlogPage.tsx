import { getPreviewUtils } from '@optimizely/cms-sdk/react/server'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import BlogPage from '@/components/pages/BlogPage'

type Props = { content: any }

// CMS Visual Editor adapter for OT_BlogPage.
// Renders the full blog page (with Header/Footer) so the editor preview shows
// the real layout. The latestPosts section is omitted in preview to avoid
// the extra Graph round-trip — the "More from the blog" rail only matters
// on the live site.
export default async function OT_BlogPageAdapter({ content }: Props) {
  const { pa } = getPreviewUtils(content)

  return (
    <>
      <Header />
      <main className="flex-1" {...pa(content.__composition)}>
        <BlogPage content={content} latestPosts={[]} />
      </main>
      <Footer />
    </>
  )
}
