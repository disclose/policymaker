<script setup lang="ts">
import { DOWNLOAD_SECTIONS } from '@/config'
</script>

<template>
  <nav class="tabs" aria-label="Generated artifacts">
    <RouterLink
      v-for="section in DOWNLOAD_SECTIONS"
      :key="section.route"
      class="tabs__link"
      :to="section.route"
    >
      {{ section.name }}
    </RouterLink>
  </nav>
</template>
