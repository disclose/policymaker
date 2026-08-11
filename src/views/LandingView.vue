<script setup lang="ts">
import { useRouter } from 'vue-router'

import AppButton from '@/components/AppButton.vue'
import { trackStart } from '@/domain/analytics'

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
      <div class="action-bar"><AppButton @click="begin">Build your policy</AppButton></div>
    </header>

    <section class="landing__summary" aria-labelledby="what-you-get">
      <h2 id="what-you-get">What Policymaker produces</h2>
      <ul>
        <li><strong>Vulnerability Disclosure Policy:</strong> a complete policy for a new or replacement program.</li>
        <li><strong>Safe Harbor:</strong> standardized language that can be added to an existing policy.</li>
        <li><strong>security.txt:</strong> an RFC 9116 file that directs researchers to the correct reporting channel.</li>
        <li><strong>DNS Security TXT:</strong> a DNS record that publishes security-contact information.</li>
      </ul>
      <p>
        The generated language comes from the disclose.io Framework's canonical, publicly reviewed
        terms. Policymaker is a starting point for implementation and does not provide legal advice.
      </p>
    </section>

  </article>
</template>
