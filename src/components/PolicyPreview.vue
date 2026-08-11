<script setup lang="ts">
import { computed } from 'vue'

import { LANGUAGE_LABELS } from '@/config'
import { trackDownload } from '@/domain/analytics'
import { downloadArtifact } from '@/domain/downloads'
import type { DownloadDescriptor } from '@/domain/types'
import { policySource, type SupportedLocale } from '@/generated/policies'
import { renderMarkdown } from '@/markdown'

const props = withDefaults(
  defineProps<{
    artifact: 'safe-harbor' | 'security.txt' | 'vdp'
    content: string
    downloads: DownloadDescriptor[]
    format?: 'text/markdown' | 'text/plain'
    language: SupportedLocale
    locales?: readonly SupportedLocale[]
    showLanguage?: boolean
  }>(),
  {
    format: 'text/plain',
    locales: undefined,
    showLanguage: false,
  },
)

const emit = defineEmits<{
  'update:language': [value: SupportedLocale]
}>()

const html = computed(() => renderMarkdown(props.content))
const visibleLocales = computed(() => props.locales ?? policySource.locales)

function download(descriptor: DownloadDescriptor): void {
  const content = descriptor.type === 'text/html' ? html.value : props.content
  downloadArtifact(content, descriptor)
  trackDownload(
    props.artifact,
    descriptor.eventLabel,
    props.showLanguage ? props.language : undefined,
  )
}
</script>

<template>
  <section class="preview">
    <div class="preview__toolbar">
      <label v-if="showLanguage" class="language-picker">
        <span class="sr-only">Policy language</span>
        <select
          :value="language"
          @change="emit('update:language', ($event.target as HTMLSelectElement).value as SupportedLocale)"
        >
          <option v-for="locale in visibleLocales" :key="locale" :value="locale">
            {{ LANGUAGE_LABELS[locale] ?? locale }}
          </option>
        </select>
      </label>
      <div class="preview__downloads">
        <button
          v-for="descriptor in downloads"
          :key="descriptor.type"
          class="button button--transparent"
          type="button"
          @click="download(descriptor)"
        >
          {{ descriptor.label }}
        </button>
      </div>
    </div>
    <div v-if="format === 'text/markdown'" class="term-content" v-html="html" />
    <div v-else class="term-content">
      <pre>{{ content }}</pre>
    </div>
  </section>
</template>
