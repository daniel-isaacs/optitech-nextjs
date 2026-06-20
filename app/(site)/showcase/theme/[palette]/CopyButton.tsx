'use client'

import { useState } from 'react'

export function CopyButton({ text, label = 'Copy' }: { text: string; label?: string }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <button
      onClick={handleCopy}
      className="px-md py-sm text-label font-semibold tracking-label uppercase border border-fg/20 text-fg-muted hover:text-fg hover:border-fg/40 transition-colors"
    >
      {copied ? 'Copied' : label}
    </button>
  )
}
