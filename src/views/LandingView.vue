<script setup lang="ts">
import { useRouter } from 'vue-router'

import AppButton from '@/components/AppButton.vue'
import introduction from '@/content/introduction.md?raw'
import { trackStart } from '@/domain/analytics'
import { renderMarkdown } from '@/markdown'

const router = useRouter()

function begin(): void {
  trackStart('landing_page')
  void router.push('/policymaker/organization')
}
</script>

<template>
  <article class="landing">
    <header class="landing__hero">
      <p class="eyebrow">Free, open-source vulnerability disclosure tooling</p>
      <h1>Generate a vulnerability disclosure policy, safe harbor, and security.txt</h1>
      <p class="landing__lede">
        Policymaker turns a few details about your organization into a complete disclosure setup:
        a customizable VDP, optional coordinated-disclosure timeline, standalone safe-harbor
        language, an RFC 9116 security.txt file, and draft DNS Security TXT records.
      </p>
    </header>

    <div class="markdown-content" v-html="renderMarkdown(introduction)" />

    <!-- Label is "Begin" because the prose above ends with: Ready to start? Hit "Begin". -->
    <div class="action-bar"><AppButton @click="begin">Begin</AppButton></div>
  </article>
</template>
