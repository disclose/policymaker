<template>
    <div class="page-title">
        <h2><slot></slot></h2>
        <slot name="subtitle"></slot>
    </div>
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
    @apply mb-16;

    h2 {
        @apply text-2xl lg:text-3xl font-bold mt-3;
        font-family: 'Noto Sans Display';
    }

    h5 {
        @apply text-base lg:text-lg;
        font-family: 'Noto Sans'
    }
}
</style>