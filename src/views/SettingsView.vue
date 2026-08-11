<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'

import AppButton from '@/components/AppButton.vue'
import AppField from '@/components/AppField.vue'
import ChannelInput from '@/components/ChannelInput.vue'
import TextInput from '@/components/TextInput.vue'
import { CVD_TIMELINE_OPTIONS } from '@/config'
import { normalizeReportingLanguages } from '@/domain/languages'
import { trackWizardStep } from '@/domain/analytics'
import { usePolicymaker } from '@/state/policymaker'

onMounted(() => trackWizardStep('settings'))

const router = useRouter()
const { configuration, validReportingLanguages, validSettings } = usePolicymaker()
const languagesTouched = ref(false)
const languagesError = computed(() =>
  languagesTouched.value && !validReportingLanguages.value
    ? 'Use comma-separated BCP 47 language tags, such as en, fr-FR.'
    : '',
)

function normalizeLanguages(): void {
  languagesTouched.value = true
  if (validReportingLanguages.value && configuration.reportingLanguages.trim()) {
    configuration.reportingLanguages = normalizeReportingLanguages(configuration.reportingLanguages)
  }
}
</script>

<template>
  <article>
    <h1 class="page-title">Policy settings</h1>
    <div class="field-group">
      <AppField>
        <label for="cvd-timeline">Coordinated Vulnerability Disclosure Timeline</label>
        <p>
          Vulnerability finders often wish to publish their reports after the issue has been fixed,
          and some will provide their own timeline when reporting security issues. We strongly
          recommend that you take a proactive approach to setting your own timeline, and to make this clear within your VDP.
        </p>
        <div class="select-input focusable">
          <select id="cvd-timeline" v-model.number="configuration.cvdTimelineDays">
            <option v-for="option in CVD_TIMELINE_OPTIONS" :key="option.value" :value="option.value">
              {{ option.label }}
            </option>
          </select>
        </div>
        <small>If you’re not currently able to do this, you may optionally opt-out of setting a timeline.</small>
      </AppField>

      <AppField>
        <label for="policy-url">Where will this policy be published? *</label>
        <p>
          Enter the HTTPS address where researchers will find the published policy. This address is
          included in security.txt and DNS Security TXT output.
        </p>
        <ChannelInput id="policy-url" v-model="configuration.hostUrl" host />
      </AppField>

      <AppField>
        <label for="reporting-languages">Languages accepted by your security team</label>
        <p>
          Optional. Add comma-separated language tags only if your response team accepts reports in
          those languages. This controls the security.txt <code>Preferred-Languages</code> field, not the policy translation.
        </p>
        <TextInput
          id="reporting-languages"
          v-model="configuration.reportingLanguages"
          :error="languagesError"
          placeholder="en, fr-FR"
          :valid="validReportingLanguages"
          @blur="normalizeLanguages"
        />
      </AppField>
    </div>

    <div class="action-bar">
      <AppButton theme="muted" @click="router.push('/policymaker/organization')">Back</AppButton>
      <AppButton :disabled="!validSettings" @click="router.push('/policymaker/download')">Next</AppButton>
    </div>
  </article>
</template>
