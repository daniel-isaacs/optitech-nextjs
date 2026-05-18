'use client'

import { useParams, usePathname } from 'next/navigation'
import OnPageEdit from '@/components/draft/OnPageEdit'

// Thin client bridge: reads the current URL so the server layout doesn't need to.
// useParams() returns all dynamic segments in the current route tree, including
// [version] and [key] from the child page even though this component lives in the
// layout above them.
export default function OnPageEditBridge() {
  const params   = useParams<{ version?: string }>()
  const pathname = usePathname()
  const version  = params.version ?? ''

  if (!version) return null
  return <OnPageEdit workId={version} currentRoute={pathname} />
}
