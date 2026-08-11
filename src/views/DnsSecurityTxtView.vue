<script setup lang="ts">
import { onMounted } from 'vue'

import DnsRecordsTable from '@/components/DnsRecordsTable.vue'
import dnsCopy from '@/content/dnssecuritytxt.md?raw'
import { trackSecurityTxtGenerated } from '@/domain/analytics'
import { renderMarkdown } from '@/markdown'

onMounted(() => trackSecurityTxtGenerated('dns_record'))
</script>

<template>
  <section>
    <div class="markdown-content" v-html="renderMarkdown(dnsCopy)" />
    <DnsRecordsTable />
  </section>
</template>
