<template>
    <div>

        <nuxt-content :document="securitytxtCopy"></nuxt-content>

        <DioTermPreview
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
import DioTermPreview from '~/components/DioTermPreview/DioTermPreview.vue'
import { store } from '~/store'

declare module 'vue/types/vue' {
  interface Vue {
    securitytxtCopy: any
    downloads: Array<{
      type: string
      label: string
      filename: string
      trackingEvent: { eventLabel: string }
    }>
    expiry: any
  }
}

export default Vue.extend({
  components: { DioCheckboxPanels, DioCheckboxPanel, DioDnsSecurityTxtTable, DioTermPreview },

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