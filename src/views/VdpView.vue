<script setup lang="ts">
import { computed, ref, watchEffect } from 'vue'

import PolicyPreview from '@/components/PolicyPreview.vue'
import { SAFE_HARBOR_DOWNLOADS, VDP_DOWNLOADS } from '@/config'
import { renderSafeHarbor, renderVdp } from '@/domain/policies'
import { availablePolicyLocales, selectVdpFamily } from '@/domain/policies'
import { policySource } from '@/generated/policies'
import { usePolicymaker } from '@/state/policymaker'

const { configuration } = usePolicymaker()
const fullVdp = ref(true)
const content = computed(() => (fullVdp.value ? renderVdp(configuration) : renderSafeHarbor(configuration)))
const downloads = computed(() => (fullVdp.value ? VDP_DOWNLOADS : SAFE_HARBOR_DOWNLOADS))
const artifact = computed(() => (fullVdp.value ? 'vdp' as const : 'safe-harbor' as const))
const family = computed(() => fullVdp.value ? selectVdpFamily(configuration.cvdTimelineDays) : 'safe-harbor')
const locales = computed(() => availablePolicyLocales(family.value))
const revision = policySource.revision.slice(0, 7)

watchEffect(() => {
  if (!locales.value.includes(configuration.language)) configuration.language = locales.value[0]
})
</script>

<template>
  <section>
    <fieldset class="policy-choices">
      <legend class="sr-only">Policy type</legend>
      <label :class="['policy-choice', { 'policy-choice--selected': fullVdp }]">
        <input v-model="fullVdp" type="radio" :value="true" />
        <span>
          <strong>Full Vulnerability Disclosure Policy</strong>
          <small>Use this version if you're creating a brand new VDP or fully replacing an existing VDP policy.</small>
          <em>DIOTerms revision {{ revision }}</em>
        </span>
      </label>
      <label :class="['policy-choice', { 'policy-choice--selected': !fullVdp }]">
        <input v-model="fullVdp" type="radio" :value="false" />
        <span>
          <strong>Safe Harbor clause only</strong>
          <small>Use this version if you already have a VDP policy in place and would like to add a Safe Harbor clause.</small>
          <em>DIOTerms revision {{ revision }}</em>
        </span>
      </label>
    </fieldset>
    <PolicyPreview
      :artifact="artifact"
      :content="content"
      :downloads="downloads"
      format="text/markdown"
      :language="configuration.language"
      :locales="locales"
      show-language
      @update:language="configuration.language = $event"
    />
  </section>
</template>
