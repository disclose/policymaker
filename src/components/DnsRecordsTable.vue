<script setup lang="ts">
import { computed, ref } from 'vue'

import {
  buildBindZone,
  buildDnsRecords,
  dnsVerificationCommand,
  domainFromPolicyUrl,
  normalizeDomainInput,
} from '@/domain/dns'
import { downloadBlob, stampArtifact } from '@/domain/downloads'
import { usePolicymaker } from '@/state/policymaker'

import AppButton from './AppButton.vue'
import AppField from './AppField.vue'
import TextInput from './TextInput.vue'

const { configuration } = usePolicymaker()
const copyStatus = ref('')

if (!configuration.organizationDomain) {
  configuration.organizationDomain = domainFromPolicyUrl(configuration)
}

const normalizedDomain = computed(() => normalizeDomainInput(configuration.organizationDomain))
const domainError = computed(() =>
  configuration.organizationDomain && !normalizedDomain.value
    ? 'Enter a valid domain or HTTPS URL, such as example.com.'
    : '',
)
const records = computed(() => normalizedDomain.value ? buildDnsRecords(configuration) : [])
const zone = computed(() => buildBindZone(records.value))
const verificationCommand = computed(() => dnsVerificationCommand(normalizedDomain.value || 'domain.com'))

function normalizeDomain(): void {
  if (normalizedDomain.value) configuration.organizationDomain = normalizedDomain.value
}

async function copy(text: string, label: string): Promise<void> {
  try {
    await navigator.clipboard.writeText(text)
    copyStatus.value = `${label} copied.`
  } catch {
    copyStatus.value = `Could not copy ${label.toLowerCase()}; select the text manually.`
  }
}

function downloadZone(): void {
  const content = stampArtifact(zone.value, 'text/plain')
  downloadBlob(new Blob([content], { type: 'text/plain' }), 'dns-security.txt')
}
</script>

<template>
  <div>
    <AppField>
      <label for="dns-domain">Domain covered by these DNS records</label>
      <p>Policymaker derived this from your policy URL. You can replace it with another covered domain.</p>
      <TextInput
        id="dns-domain"
        v-model="configuration.organizationDomain"
        class="domain-input"
        :error="domainError"
        placeholder="example.com"
        :valid="Boolean(normalizedDomain)"
        @blur="normalizeDomain"
      />
    </AppField>

    <div v-if="records.length" class="dns-actions">
      <AppButton size="small" theme="transparent" @click="copy(zone, 'All DNS records')">Copy all records</AppButton>
      <AppButton size="small" theme="transparent" @click="downloadZone">Download DNS records</AppButton>
    </div>

    <div class="table-scroll">
      <table class="records-table">
        <caption class="sr-only">DNS Security TXT records for {{ normalizedDomain }}</caption>
        <thead>
          <tr>
            <th>Record name</th>
            <th>Record type</th>
            <th>Value</th>
            <th><span class="sr-only">Actions</span></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="record in records" :key="record.value">
            <td>{{ record.name }}</td>
            <td>{{ record.type }}</td>
            <td><code>{{ record.value }}</code></td>
            <td>
              <button
                class="copy-control"
                type="button"
                :aria-label="`Copy ${record.value.split('=')[0]?.replace('&quot;', '')} record`"
                @click="copy(buildBindZone([record]).trim(), 'DNS record')"
              >Copy</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <section v-if="records.length" class="verification-command" aria-labelledby="dns-verify-heading">
      <h3 id="dns-verify-heading">Verify after publishing</h3>
      <code>{{ verificationCommand }}</code>
      <button class="copy-control" type="button" @click="copy(verificationCommand, 'Verification command')">Copy command</button>
    </section>
    <p class="copy-status" aria-live="polite">{{ copyStatus }}</p>
  </div>
</template>
