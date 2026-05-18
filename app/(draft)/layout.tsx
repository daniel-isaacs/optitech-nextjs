export const dynamic  = 'force-dynamic'
export const revalidate = 0

export default function DraftLayout({ children }: { children: React.ReactNode }) {
  const cmsUrl = (
    process.env.NEXT_PUBLIC_CMS_URL ?? process.env.OPTIMIZELY_CMS_URL ?? ''
  ).replace(/\/$/, '')

  return (
    <>
      {/* React 19: async script tags are hoisted to <head> and deduped automatically */}
      {cmsUrl && <script async src={`${cmsUrl}/util/javascript/communicationinjector.js`} />}
      {children}
    </>
  )
}
