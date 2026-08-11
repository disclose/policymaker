<script setup lang="ts">
import { useRouter } from 'vue-router'

import AppButton from '@/components/AppButton.vue'
import { trackStart } from '@/domain/analytics'
import introduction from '@/content/introduction.md?raw'
import { renderMarkdown } from '@/markdown'

const router = useRouter()

function begin(): void {
  trackStart('wizard_introduction')
  void router.push('/policymaker/organization')
}
</script>

<template>
  <article>
    <h1 class="page-title">Introduction</h1>
    <div class="markdown-content" v-html="renderMarkdown(introduction)" />
    <div class="action-bar"><AppButton @click="begin">Begin</AppButton></div>
  </article>
</template>
