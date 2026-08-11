<script setup lang="ts">
import { computed, onMounted } from 'vue'

import PolicyPreview from '@/components/PolicyPreview.vue'
import { SECURITY_TXT_DOWNLOADS } from '@/config'
import securityTxtCopy from '@/content/securitytxt.md?raw'
import { trackSecurityTxtGenerated } from '@/domain/analytics'
import { renderSecurityTxt } from '@/domain/securityTxt'
import { renderMarkdown } from '@/markdown'
import { usePolicymaker } from '@/state/policymaker'

const { configuration } = usePolicymaker()
const content = computed(() => renderSecurityTxt(configuration))

onMounted(() => trackSecurityTxtGenerated('rfc9116_file'))
</script>

<template>
  <section>
    <div class="markdown-content" v-html="renderMarkdown(securityTxtCopy)" />
    <PolicyPreview
      artifact="security.txt"
      :content="content"
      :downloads="SECURITY_TXT_DOWNLOADS"
      format="text/plain"
      :language="configuration.language"
    />
  </section>
</template>
