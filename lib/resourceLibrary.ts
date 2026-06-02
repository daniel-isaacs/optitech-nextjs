import { getClient } from '@/lib/optimizely'

// ─── Types ─────────────────────────────────────────────────────────────────────

export type ResourceAsset = {
  title:       string
  url:         string
  extension:   string | null
  fileSize:    number | null
  description: string | null
}

// ─── GraphQL queries ────────────────────────────────────────────────────────────
//
// Two-step pattern:
//   1. Fetch the anchor asset by its content key → extract _metadata.collectionId
//      (falls back to _metadata.parent.key for CMS-media-tree DAM mappings).
//   2. Fetch all assets sharing that collectionId, optionally filtered by assetType.
//
// The Optimizely Graph `Asset` type exposes:
//   title, url, extension, fileSize, description, assetType
// `_AssetItem` is the universal DAM base type used in step 1.

const ANCHOR_QUERY = `
  query GetAnchorAssetCollection($key: String!) {
    _AssetItem(
      where: { _metadata: { key: { eq: $key } } }
      limit: 1
    ) {
      items {
        _metadata {
          key
          collectionId
          parent { key }
        }
      }
    }
  }
`

const COLLECTION_QUERY = `
  query GetCollectionAssets($collectionId: String!) {
    Asset(
      where: { _metadata: { collectionId: { eq: $collectionId } } }
      orderBy: { title: ASC }
      limit: 50
    ) {
      items {
        title
        url
        extension
        fileSize
        description
      }
    }
  }
`

const COLLECTION_TYPED_QUERY = `
  query GetCollectionAssetsTyped($collectionId: String!, $assetType: String!) {
    Asset(
      where: {
        _metadata: { collectionId: { eq: $collectionId } }
        assetType: { eq: $assetType }
      }
      orderBy: { title: ASC }
      limit: 50
    ) {
      items {
        title
        url
        extension
        fileSize
        description
      }
    }
  }
`

// Display-template filterType values → Graph assetType values.
// null means "no filter — return all asset types".
const FILTER_TO_ASSET_TYPE: Record<string, string | null> = {
  all:       null,
  documents: 'document',
  images:    'image',
  video:     'video',
}

// ─── Data access ────────────────────────────────────────────────────────────────

/**
 * Fetches all assets in the same DAM collection as the given anchor asset.
 *
 * anchorAssetKey — the content key of the CMS asset selected by the editor
 * filterType     — display-template value; maps to an assetType Graph filter
 */
export async function getResourceLibraryAssets(
  anchorAssetKey: string,
  filterType = 'all',
): Promise<ResourceAsset[]> {
  try {
    // ── Step 1: resolve the collection ID from the anchor asset ───────────────
    const anchorData = await getClient().request(ANCHOR_QUERY, { key: anchorAssetKey })
    const anchorMeta = (anchorData as any)?._AssetItem?.items?.[0]?._metadata

    // Prefer the DAM-native collectionId; fall back to the CMS parent folder key
    const collectionId: string | undefined =
      anchorMeta?.collectionId ?? anchorMeta?.parent?.key

    if (!collectionId) return []

    // ── Step 2: fetch sibling assets, optionally filtered by type ─────────────
    const assetType = FILTER_TO_ASSET_TYPE[filterType] ?? null
    let raw: any[] = []

    if (assetType) {
      const data = await getClient().request(COLLECTION_TYPED_QUERY, { collectionId, assetType })
      raw = (data as any)?.Asset?.items ?? []
    } else {
      const data = await getClient().request(COLLECTION_QUERY, { collectionId })
      raw = (data as any)?.Asset?.items ?? []
    }

    return raw
      .filter((item: any) => item?.title && item?.url)
      .map((item: any): ResourceAsset => ({
        title:       String(item.title),
        url:         String(item.url),
        extension:   item.extension ? String(item.extension).replace(/^\./, '') : null,
        fileSize:    typeof item.fileSize === 'number' ? item.fileSize : null,
        description: item.description ? String(item.description) : null,
      }))
  } catch {
    return []
  }
}
