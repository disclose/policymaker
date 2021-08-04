<template>
    <div>
        <br>
        <div class="dio__checkbox-panels">
            <div class="dio__checkbox-panel" :class="{ 'dio__checkbox-panel--selected': isFullVDP }" @click="isFullVDP=true">
                <div class="dio__checkbox-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                </div>
                <div class="dio__checkbox-label">
                    <label>Full Vulnerability Disclosure Policy</label>
                    <p>Use this version if you're creating a brand new VDP or fully replacing an existing VDP policy.</p>
                    <small class="dio__pill">Version 2021.1</small>
                </div>
            </div>
            <div class="dio__checkbox-panel" :class="{ 'dio__checkbox-panel--selected': !isFullVDP }" @click="isFullVDP=false">
                <div class="dio__checkbox-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                </div>
                <div class="dio__checkbox-label">
                    <label>Safe Harbor clause only</label>
                    <p>Use this version if you already have a VDP policy in place and would like to add a Safe Harbor clause.</p>
                    <small class="dio__pill">Version 2021.1</small>
                </div>
            </div>
        </div>
        <br><br><br>

        <dio-term-preview 
            format="text/markdown"
            :downloads="downloads"
            :showLanguage="false"
            :content="content"
            :trackingEvent="trackingEvent"
        />


    </div>
</template>

<script lang="ts">
import Vue from 'vue'
import DioButton from '~/components/DioButton.vue'
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
        configuration: () => store.getters['policymaker/getConfiguration']
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

    .dio__checkbox-panel {
        @apply flex flex-1 flex-row items-center;
        @apply pt-4 pb-4 pl-5 pr-10 cursor-pointer max-w-md;
        @apply border-2 border-transparent;
        @apply transition-all duration-150;
        background: var(--shade-100);
        color: var(--shade-800);

        .dio__checkbox-icon {
            @apply pr-5;
            opacity: 0;
            @apply transition-all duration-300;
        }

        .dio__checkbox-label {
            label {
                font-family: 'Noto Sans Display';
                @apply block font-bold;
                @apply text-lg;
            }

            p {
                @apply text-sm;
            }

        }

        .dio__pill {
            @apply mt-2 inline-block border border-solid;
            background: var(--shade-100);
            color: var(--shade-900);
            border-color: var(--shade-200);
        }

        
        &:first-child {
            @apply rounded-t-lg md:rounded-l-lg md:rounded-r-none;
        }

        &:last-child {
            @apply rounded-b-lg md:rounded-r-lg md:rounded-l-none;
        }

        &:hover {
            background: var(--shade-300);
            label {
                color: var(--dark-purple);
            }
        }

        &.dio__checkbox-panel--selected {
            @apply border-solid;
            background: var(--white);
            color: var(--dark-purple);
            border-color: var(--purple);

            .dio__pill {
                @apply bg-purple-100 text-purple-800 border-purple-400;
            }

            &:hover {
                /* background: var(--dark-purple); */
            }

            .dio__checkbox-icon {
                opacity: 1;
                 
                svg {
                    stroke: var(--purple)
                }
            }
        }
    }




</style>