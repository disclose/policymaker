/* disclose.io app design-system palette bridge.
 *
 * policymaker styles its components with Tailwind `@apply` using the DEFAULT
 * palette (bg-white, text-purple-800, bg-yellow-100, text-gray-700, ...).
 * Because those live inside <style> @apply blocks (not template class="" attrs),
 * they can only be re-skinned at the Tailwind layer. This remaps the specific
 * default-palette shades in use onto the app-theme CSS variables so every
 * @apply color themes (dark/light) automatically. `extend` deep-merges with
 * Tailwind's defaults, so unspecified shades keep their normal values. */
module.exports = {
  theme: {
    extend: {
      colors: {
        // surfaces
        white: 'var(--surface)',
        // brand / links → accent
        purple: {
          100: 'var(--accent-dim)',
          400: 'var(--accent)',
          600: 'var(--accent)',
          700: 'var(--accent)',
          800: 'var(--accent)',
        },
        // stray link color → accent (DioTermPreview)
        blue: {
          600: 'var(--accent)',
        },
        // code / callout accents (were yellow) → accent
        yellow: {
          100: 'var(--accent-dim)',
          600: 'var(--accent)',
          700: 'var(--accent)',
          800: 'var(--accent)',
        },
        // validation
        red: {
          100: 'var(--error-bg)',
          600: 'var(--error)',
        },
        green: {
          100: 'var(--high-bg)',
          600: 'var(--high)',
        },
        // neutrals → themed text/border
        gray: {
          100: 'var(--border-light)',
          200: 'var(--border)',
          300: 'var(--border)',
          400: 'var(--border)',
          500: 'var(--text-muted)',
          700: 'var(--text)',
        },
      },
    },
  },
}
