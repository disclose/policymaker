<template>
    <div>

        <nuxt-content :document="securitytxtCopy"></nuxt-content>

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
import DioCheckboxPanel from '~/components/DioCheckboxPanel/DioCheckboxPanel.vue'
import DioCheckboxPanels from '~/components/DioCheckboxPanel/DioCheckboxPanels.vue'
import DioDnsSecurityTxtTable from '~/components/DioDnsSecurityTxtTable/DioDnsSecurityTxtTable.vue'
import { store } from '~/store'

export default Vue.extend({
  components: { DioCheckboxPanels, DioCheckboxPanel, DioDnsSecurityTxtTable },

    async asyncData({ $content, params, route}) {
        const securitytxtCopy = await $content("policymaker/securitytxt").fetch()

        return {
            securitytxtCopy,
        }
    },

    data() {
        return {
            expiry: null,
            downloads: [
                { type: 'text/plain', label: 'Download', filename: 'security.txt', trackingEvent: { eventLabel: 'text' } },
            ]
        }
    },

    created() {
        store.dispatch('policymaker/fetchSecurityTxt')
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