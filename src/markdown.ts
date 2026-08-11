import MarkdownIt from 'markdown-it'

export const markdown = new MarkdownIt({
  breaks: true,
  html: true,
  linkify: false,
  typographer: true,
})

export function renderMarkdown(content: string): string {
  return markdown.render(content)
}
