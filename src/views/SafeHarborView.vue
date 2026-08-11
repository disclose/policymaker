<script setup lang="ts">
import { computed, watchEffect } from 'vue'

import PolicyPreview from '@/components/PolicyPreview.vue'
import { SAFE_HARBOR_DOWNLOADS } from '@/config'
import { availablePolicyLocales, renderSafeHarbor } from '@/domain/policies'
import { usePolicymaker } from '@/state/policymaker'

const { configuration } = usePolicymaker()
const content = computed(() => renderSafeHarbor(configuration))
const locales = availablePolicyLocales('safe-harbor')

watchEffect(() => {
  if (!locales.includes(configuration.language)) configuration.language = locales[0]
})
</script>

<template>
  <section>
    <h2>Safe Harbor Clause</h2>
    <PolicyPreview
      artifact="safe-harbor"
      :content="content"
      :downloads="SAFE_HARBOR_DOWNLOADS"
      format="text/markdown"
      :language="configuration.language"
      :locales="locales"
      show-language
      @update:language="configuration.language = $event"
    />
  </section>
</template>
