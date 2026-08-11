export function normalizeReportingLanguages(value: string): string {
  const tags = value
    .split(',')
    .map((tag) => tag.trim())
    .filter(Boolean)

  if (tags.length === 0) return ''
  return Intl.getCanonicalLocales(tags).join(', ')
}

export function isValidReportingLanguages(value: string): boolean {
  if (!value.trim()) return true
  try {
    return normalizeReportingLanguages(value).length > 0
  } catch {
    return false
  }
}
