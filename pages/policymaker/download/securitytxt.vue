<template>
    <div>
        <nuxt-content :document="copy"></nuxt-content>
        
        <dio-term-preview 
            format="text/plain"
            :content="securitytxt"
            :downloads="downloads"
            :showLanguage="false"
            :trackingEvent="trackingEvent"
        />

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

    data() {
        return {
            downloads: [
                { type: 'text/plain', label: 'Download', filename: 'security.txt', trackingEvent: { eventLabel: 'text' } },
            ]
        }
    },

    computed: {
        configuration: () => store.getters['policymaker/getConfiguration'],
        securitytxt: () => store.getters['policymaker/getSecurityTxt'],
        trackingEvent() {
            const vm = this as any
            return {
                eventCategory: 'security.txt',
                eventAction: 'download'
            }
        },
    }

})
</script>

<style lang="postcss">

</style>