<script setup lang="ts">
import { onMounted } from 'vue'

import DownloadTabs from '@/components/DownloadTabs.vue'
import AppButton from '@/components/AppButton.vue'
import { trackBundleDownload, trackPolicyGenerated } from '@/domain/analytics'
import { downloadPolicyBundle } from '@/domain/bundle'
import { usePolicymaker } from '@/state/policymaker'

const { configuration } = usePolicymaker()

onMounted(() => trackPolicyGenerated(configuration.cvdTimelineDays > 0))

function downloadAll(): void {
  downloadPolicyBundle(configuration)
  trackBundleDownload()
}
</script>

<template>
  <article>
    <h1 class="page-title">Download</h1>
    <section class="deployment-kit" aria-labelledby="deployment-kit-heading">
      <div>
        <p class="eyebrow">Deployment kit</p>
        <h2 id="deployment-kit-heading">Everything needed to publish and verify</h2>
        <p>The ZIP contains the policy, safe-harbor clause, security.txt, DNS zone records, and a deployment guide.</p>
      </div>
      <AppButton @click="downloadAll">Download all (.zip)</AppButton>
    </section>

    <ol class="deployment-checklist" aria-label="Deployment checklist">
      <li>Publish the policy at the HTTPS address you configured.</li>
      <li>Serve security.txt from <code>/.well-known/security.txt</code> as UTF-8 <code>text/plain</code>.</li>
      <li>Add the generated records beneath <code>_security.&lt;domain&gt;</code>.</li>
      <li>Verify both discovery methods and renew them before their expiry.</li>
    </ol>
    <DownloadTabs />
    <RouterView />
  </article>
</template>
