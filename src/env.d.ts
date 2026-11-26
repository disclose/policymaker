/// <reference types="vite/client" />

declare module '*.md?raw' {
  const content: string
  export default content
}

declare global {
  interface Window {
    dataLayer: unknown[]
    gtag?: (...args: unknown[]) => void
    posthog?: {
      __loaded?: boolean
      capture: (event: string, properties?: Record<string, unknown>) => void
    }
  }
}

export {}
