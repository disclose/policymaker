<script setup lang="ts">
import logo from '@/assets/logo-disclose-type.svg'
import ProgressSteps from '@/components/ProgressSteps.vue'
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
        <RouterView />
        <footer>
          &copy; Copyright {{ new Date().getFullYear() }} The
          <a href="https://disclose.io">disclose.io</a> Project - Made with ♥️ by Jeremy Manoto and Casey Ellis.
        </footer>
      </div>
    </main>
  </div>
</template>
