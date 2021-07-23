<template>
    <h2 class="page-title"><slot></slot></h2>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
    
    props: {
        title: {
            type: String,
            default: 'Page title'
        }
    },

    data() {
        return {}
    }
})
</script>

<style lang="postcss">
.page-title {
    @apply text-3xl font-bold mt-3 mb-16;
    font-family: 'Noto Sans Display';
}
</style>