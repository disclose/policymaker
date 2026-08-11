import type { DownloadDescriptor } from './types'

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

export function downloadArtifact(content: string, descriptor: DownloadDescriptor): void {
  downloadBlob(
    new Blob([stampArtifact(content, descriptor.type)], { type: descriptor.type }),
    descriptor.filename,
  )
}

export function downloadBlob(blob: Blob, filename: string): void {
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
