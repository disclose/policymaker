<template>
    <div>
        <nuxt-content :document="copy"></nuxt-content>
        
        <div class="dio__securitytxt">
            <pre>{{ securitytxt }}</pre>
        </div>

    </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { store } from '~/store'

export default Vue.extend({

    async asyncData({ $content, params, route}) {
        const copy = await $content("policymaker/securitytxt").fetch()
        return {
            copy
        }
    },

    computed: {
        configuration: () => store.getters['policymaker/getConfiguration'],
        securitytxt: () => store.getters['policymaker/getSecurityTxt']
    }

})
</script>

<style lang="postcss">
    .dio__securitytxt {
        @apply p-4 bg-white border border-solid font-mono;
        border-color: var(--shade-400);
    }
</style>