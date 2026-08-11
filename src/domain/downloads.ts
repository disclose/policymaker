import { trackDownload, type TrackedArtifact } from './analytics'
import type { DownloadDescriptor } from './types'

/**
 * Every download is tracked here rather than at the call sites.
 *
 * The "Download DNS records" button was added without a trackDownload() call and shipped that way,
 * so dnssecuritytxt_download read zero for the life of the feature — indistinguishable from
 * nobody using it. Requiring this argument makes that omission impossible to repeat.
 */
export type DownloadTracking = {
  artifact: TrackedArtifact
  format: 'html' | 'markdown' | 'text' | 'zip'
  locale?: string
  policyId?: string
}

type StampOptions = {
  generatedAt?: Date
  id?: string
}

export function createLineageId(): string {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`
}

export function stampArtifact(
  content: string,
  mimeType: DownloadDescriptor['type'],
  options: StampOptions = {},
): string {
  const date = (options.generatedAt ?? new Date()).toISOString().slice(0, 10)
  const id = options.id ?? createLineageId()
  const label = `Generated with policymaker.disclose.io (dioterms) | ${date} | id:${id}`
  const trimmed = content.replace(/\s+$/, '')

  if (mimeType === 'text/plain') {
    return `${trimmed}\n\n# ${label}\n`
  }

  return `${trimmed}\n\n<!-- ${label} -->\n`
}

export function downloadArtifact(
  content: string,
  descriptor: DownloadDescriptor,
  tracking: DownloadTracking,
): void {
  downloadBlob(
    new Blob([stampArtifact(content, descriptor.type)], { type: descriptor.type }),
    descriptor.filename,
    tracking,
  )
}

export function downloadBlob(blob: Blob, filename: string, tracking: DownloadTracking): void {
  trackDownload(tracking.artifact, tracking.format, {
    locale: tracking.locale,
    policyId: tracking.policyId,
  })

  const link = document.createElement('a')
  const href = URL.createObjectURL(blob)
  link.href = href
  link.download = filename
  link.hidden = true
  document.body.append(link)
  link.click()
  link.remove()
  setTimeout(() => URL.revokeObjectURL(href), 0)
}
