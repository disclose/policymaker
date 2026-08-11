<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'

import AppButton from '@/components/AppButton.vue'
import AppField from '@/components/AppField.vue'
import ChannelList from '@/components/ChannelList.vue'
import TextInput from '@/components/TextInput.vue'
import { usePolicymaker } from '@/state/policymaker'

const router = useRouter()
const { configuration, validOrganizationName, validOrganizationStep } = usePolicymaker()
const organizationTouched = ref(false)
const organizationError = computed(() =>
  organizationTouched.value && !validOrganizationName.value ? 'Enter the legal name of your organization.' : '',
)
</script>

<template>
  <article>
    <h1 class="page-title">Organization details</h1>
    <div class="field-group">
      <AppField>
        <label for="organization-name">What is the name of your organization?</label>
        <p>This is the organization authorizing the policy, who is responsible for the assets that are in scope.</p>
        <TextInput
          id="organization-name"
          v-model="configuration.organizationName"
          :error="organizationError"
          placeholder="Organization name"
          required
          :valid="validOrganizationName"
          @blur="organizationTouched = true"
        />
      </AppField>

      <AppField>
        <p id="disclosure-channels-label" class="field__label">Where can researchers report security issues? *</p>
        <p>
          Provide at least one email address or HTTPS reporting form. Multiple channels are supported,
          but a short list is easier for researchers to understand.
        </p>
        <small>Enter an email address or HTTPS report form; Policymaker will format it for you.</small>
        <ChannelList labelledby="disclosure-channels-label" />
      </AppField>
    </div>

    <div class="action-bar">
      <AppButton theme="muted" @click="router.push('/')">Back</AppButton>
      <AppButton :disabled="!validOrganizationStep" @click="router.push('/policymaker/settings')">Next</AppButton>
    </div>
  </article>
</template>
