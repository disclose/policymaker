

// load 


export default {
  // Target: https://go.nuxtjs.dev/config-target
  target: 'static',

  //https://nuxtjs.org/docs/2.x/deployment/github-pages
  router: {
  },

  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    title: 'Policy Maker | disclose.io',
    htmlAttrs: {
      lang: 'en'
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ]
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [
    '@/assets/css/_fonts.css',
    '@/assets/css/_variables.css'
  ],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
    { src: '~plugins/vueflags' }
  ],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    // https://go.nuxtjs.dev/typescript
    '@nuxt/typescript-build',
    // https://go.nuxtjs.dev/tailwindcss
    '@nuxtjs/tailwindcss',
    // https://github.com/nuxt-community/google-analytics-module
    '@nuxtjs/google-analytics'
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    // https://go.nuxtjs.dev/axios
    '@nuxtjs/axios',
    // https://go.nuxtjs.dev/content
    '@nuxt/content',
    'nuxt-i18n',
    '@nuxtjs/markdownit'
  ],

  // Axios module configuration: https://go.nuxtjs.dev/config-axios
  axios: {},

  // Content module configuration: https://go.nuxtjs.dev/config-content
  content: {},

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
    babel: {
      plugins: []
    },
    postcss: {
      plugins: {
        // "postcss-css-variables": {},
        "postcss-nested": {},
        tailwindcss: {},
        autoprefixer: {},
      }
    }
  },

  // nuxt i18n configuration
  i18n: {
    lazy: true,
    locales: [
      { code: 'en', iso: 'en-US', file: 'en-US.js', dir: 'ltr' },
    ],
    langDir: 'lang/',
    defaultLocale: 'en',
    defaultDirection: 'ltr',
    vueI18n: {
      fallbackLocale: 'en',
      messages: {
        en: {
          policyConfigurator: {
            title: 'Disclose.io Policy Configurator (en)'
          }
        }
      }
    }
  },

  markdownit: {
    preset: 'default',
    linkify: false,
    breaks: true,
    html: true,
    typographer: true,
    use: [
      'markdown-it-div',
      'markdown-it-attrs'
    ]
  },

  googleAnalytics: {
    id: 'UA-143424917-8'
  }
}
