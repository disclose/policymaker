<template>
    <div class="dio__tab-group">
        <slot></slot>
    </div>    
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
    
})
</script>

<style lang="postcss">
    .dio__tab-group {
        @apply flex flex-row items-start;
        @apply h-16;
    }
</style>