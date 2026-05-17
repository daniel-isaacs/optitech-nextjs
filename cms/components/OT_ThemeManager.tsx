import ThemePreviewContent from '@/components/theme/ThemePreviewContent'

type Props = { content: any }

export default function OT_ThemeManagerAdapter({ content }: Props) {
  // Apply the draft defaultMode directly so the preview pane reflects it immediately on save.
  const defaultMode = (content?.defaultMode as string | undefined) === 'light' ? 'light' : 'dark'

  return (
    <div className="min-h-screen bg-canvas" data-theme={defaultMode}>
      <div className="border-b border-fg/10 px-md py-sm bg-surface flex items-center gap-md">
        <span className="text-label tracking-label uppercase font-semibold text-brand">Theme Manager Preview</span>
        <span className="text-label text-fg-muted">Updates when you save in the CMS editor</span>
        <span className="ml-auto text-label text-fg-muted/60 font-mono capitalize">{defaultMode} mode</span>
      </div>
      <ThemePreviewContent settings={content} />
    </div>
  )
}
