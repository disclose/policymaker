<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'

import { NAV_STEPS } from '@/config'

const route = useRoute()

// '/' is a prefix of every path, so the landing step must match exactly or it would claim
// every route. Download is checked first because its children are nested one level deeper.
const activeStep = computed(() => {
  if (route.path.startsWith('/policymaker/download')) return NAV_STEPS.length
  const index = NAV_STEPS.findIndex((step) =>
    step.route === '/' ? route.path === '/' : route.path.startsWith(step.route),
  )
  return index >= 0 ? index + 1 : 1
})

const progress = computed(() => `${((activeStep.value - 1) / (NAV_STEPS.length - 1)) * 100}%`)
</script>

<template>
  <nav class="progress" aria-label="Policy builder progress">
    <p class="progress__compact" aria-live="polite">
      Step {{ activeStep }} of {{ NAV_STEPS.length }} · {{ NAV_STEPS[activeStep - 1]?.name }}
    </p>
    <div class="progress__stem" />
    <div class="progress__stem progress__stem--complete" :style="{ height: progress }" />
    <ol class="progress__steps">
      <li v-for="(step, index) in NAV_STEPS" :key="step.route" class="progress__step">
        <RouterLink
          v-if="index + 1 < activeStep"
          class="progress__link progress__link--complete"
          :to="step.route"
        >
          <span class="progress__anchor">{{ index + 1 }}</span>
          {{ step.name }}
        </RouterLink>
        <span
          v-else
          :class="['progress__link', { 'progress__link--active': index + 1 === activeStep }]"
          :aria-current="index + 1 === activeStep ? 'step' : undefined"
        >
          <span class="progress__anchor">{{ index + 1 }}</span>
          {{ step.name }}
        </span>
      </li>
    </ol>
  </nav>
</template>
