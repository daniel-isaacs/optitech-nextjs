import ThemePreviewContent from '@/components/theme/ThemePreviewContent'

type Props = { content: any }

export default function OT_ThemeManagerAdapter({ content }: Props) {
  return (
    <div className="min-h-screen bg-canvas">
      <div className="border-b border-fg/10 px-md py-sm bg-surface flex items-center gap-md">
        <span className="text-label tracking-label uppercase font-semibold text-brand">Theme Manager Preview</span>
        <span className="text-label text-fg-muted">Updates when you save in the CMS editor</span>
      </div>
      <ThemePreviewContent settings={content} />
    </div>
  )
}
