import MarkdownIt from 'markdown-it'

declare module 'vue/types/vue' {
  interface Vue {
    $md: MarkdownIt
  }
}

declare module '@nuxt/types' {
  interface Context {
    $md: MarkdownIt
  }
}
