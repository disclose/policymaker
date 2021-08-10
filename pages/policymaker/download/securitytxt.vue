<template>
    <div>

        <dio-checkbox-panels v-model="isDNSSecurityTxt" class="mt-4 mb-8">
            <dio-checkbox-panel :value="false">
                <label>Security.txt</label>
                <p>Use this version if wish to deploy as a file on your website.</p>
            </dio-checkbox-panel>
            <dio-checkbox-panel :value="true">
                <label>DNS Security.txt</label>
                <p>Use this version if you wish to use your DNS.</p>
            </dio-checkbox-panel>
        </dio-checkbox-panels>

        <template v-if="!isDNSSecurityTxt">
            <nuxt-content :document="securitytxtCopy"></nuxt-content>

            <dio-term-preview 
                format="text/plain"
                :content="securitytxt"
                :downloads="downloads"
                :showLanguage="false"
                :trackingEvent="trackingEvent"
            />
        </template>
        <template v-else>
            <nuxt-content :document="dnssecuritytxtCopy"></nuxt-content>

            <dio-dns-security-txt-table :configuration="configuration" />
        </template>

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
        const dnssecuritytxtCopy = await $content("policymaker/dnssecuritytxt").fetch()


        return {
            securitytxtCopy,
            dnssecuritytxtCopy
        }
    },

    data() {
        return {
            isDNSSecurityTxt: false,
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
    },

    methods: {
        select(value: any) {
            console.log("Component select", value);
            
        }
    }

})
</script>

<style lang="postcss">

</style>