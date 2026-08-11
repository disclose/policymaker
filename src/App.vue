<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'

import logo from '@/assets/logo-disclose-type.svg'
import ProgressSteps from '@/components/ProgressSteps.vue'

const route = useRoute()
const showSessionNotice = computed(() =>
  route.path.startsWith('/policymaker/') && route.path !== '/policymaker/introduction',
)
</script>

<template>
  <div class="app-shell">
    <header class="sidebar">
      <RouterLink class="logo" to="/policymaker" aria-label="Policymaker home">
        <img :src="logo" alt="disclose.io" />
      </RouterLink>
      <ProgressSteps />
    </header>
    <main class="main">
      <div class="content-shell">
        <p v-if="showSessionNotice" class="session-note">
          <strong>Private by design:</strong> your answers stay in this tab and reset if you refresh or close it.
        </p>
        <RouterView />
        <footer>
          &copy; Copyright {{ new Date().getFullYear() }} The
          <a href="https://disclose.io">disclose.io</a> Project - Made with ♥️ by Jeremy Manoto and Casey Ellis.
        </footer>
      </div>
    </main>
  </div>
</template>
