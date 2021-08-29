<template>
    <div>

        <dio-checkbox-panels v-model="isFullVDP" class="mt-4 mb-16">
            <dio-checkbox-panel :value="true">
                <label>Full Vulnerability Disclosure Policy</label>
                <p>Use this version if you're creating a brand new VDP or fully replacing an existing VDP policy.</p>
                <small class="dio__pill">Version 2021.1</small>
            </dio-checkbox-panel>
            <dio-checkbox-panel :value="false">
                <div class="dio__checkbox-label">
                    <label>Safe Harbor clause only</label>
                    <p>Use this version if you already have a VDP policy in place and would like to add a Safe Harbor clause.</p>
                    <small class="dio__pill">Version 2021.1</small>
                </div>
            </dio-checkbox-panel>
        </dio-checkbox-panels>

        <dio-term-preview 
            v-if="!isLoading"
            ref="preview"
            format="text/markdown"
            :downloads="downloads"
            :language="configuration.language"
            :languageOptions="languages"
            :showLanguage="true"
            :content="content"
            :trackingEvent="trackingEvent"
        />

    </div>
</template>

<script lang="ts">
import Vue from 'vue'
import DioButton from '~/components/DioButton/DioButton.vue'
import { store } from '~/store'

export default Vue.extend({
    components: { DioButton },

    async asyncData({ $content, params, route}) {
        const copy = await $content("policymaker/vdp").fetch()
        return {
            copy
        }
    },
    
    data() {
        return {
            isFullVDP: true,
            isLoading: false
        }
    },

    computed: {
        content() {
            const vm = this as any
            if (vm.configuration.cvdTimelineDays > 0) {
                return (vm.isFullVDP) ? vm.vdpCVD : vm.safeHarbor
            } else {
                return (vm.isFullVDP) ? vm.vdp : vm.safeHarbor
            }
        },
        downloadFilename() {
            const vm = this as any
            return (vm.isFullVDP) ? 'disclose-io-vdp' : 'disclose-io-safe-harbor'
        },
        downloads() {
            const vm = this as any
            return [
                { type: 'text/markdown', label: 'Save as markdown', filename: `${vm.downloadFilename}.md`, trackingEvent: { eventLabel: 'markdown' } },
                { type: 'text/html', label: 'Save as HTML', filename: `${vm.downloadFilename}.html`, trackingEvent: { eventLabel: 'html' } }
            ]
        },
        trackingEvent() {
            const vm = this as any
            return {
                eventCategory: (vm.isFullVDP) ? 'vdp' : 'safe-harbor',
                eventAction: 'download'
            }
        },
        vdp: () => store.getters['policymaker/getTermsVDP'],
        vdpCVD: () => store.getters['policymaker/getTermsVDPCVD'],
        safeHarbor: () => store.getters['policymaker/getTermsSafeHarbor'],
        configuration: () => store.getters['policymaker/getConfiguration'],
        languages: () => store.getters['policymaker/getVDPLanguageOptions']
    },

    methods: {
    }
})
</script>

<style lang="postcss">
    .dio__checkbox-panels {
        @apply flex;
        @apply flex-col md:flex-row;
    }

    .dio__pill {
        @apply rounded-full py-1 px-2 text-xs bg-yellow-100 text-yellow-600 border border-solid;
    }

</style>