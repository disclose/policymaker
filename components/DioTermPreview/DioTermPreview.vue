<template>
    <div class="dio__term-preview">

        <div class="flex flex-row justify-between items-center">
            <div class="flex flex-row items-center gap-x-2">
                <input-dropdown :options="languageOptions" 
                    v-model="localLanguage" 
                    v-if="showLanguage">
                    <template v-slot:selectedValue="{ value }">
                        {{ $t(`language.${value}`) }}
                    </template>
                    <template v-slot:option="{ option }">
                        {{ $t(`language.${option}`) }}
                    </template>
                </input-dropdown>
            </div>
            
            <div>
                <template v-for="(downloadButton, index) in downloads">
                    <dio-button v-if="downloadButton.type === 'text/plain'" :key="index" theme="transparent" @click="download(content, downloadButton)">{{ downloadButton.label }}</dio-button>
                    <dio-button v-if="downloadButton.type === 'text/markdown'" :key="index" theme="transparent" @click="download(content, downloadButton)">{{ downloadButton.label }}</dio-button>
                    <dio-button v-if="downloadButton.type === 'text/html'" :key="index" theme="transparent" @click="download($md.render(content), downloadButton)">{{ downloadButton.label }}</dio-button>
                </template>
            </div>
        </div>
        <br>

        <div v-if="format === 'text/markdown'" class="dio__term-content" v-html="$md.render(content)">
        </div>
        <div v-if="format === 'text/plain'" class="dio__term-content">
            <pre>{{ content }}</pre>
        </div>
    </div>
</template>

<script lang="ts">
import Vue from 'vue'
import _kebabCase from 'lodash/kebabCase'
import { store } from '~/store'
import { isEmpty } from 'lodash'

export default Vue.extend({
    
    props: {
        content: {
            type: String
        },
        format: {
            type: String,
            default: 'text/plain'
        },
        downloads: {
            type: Array
        },
        language: {
            type: String
        },
        languageOptions: {
            type: Array
        },
        showLanguage: {
            type: Boolean,
            default: false
        },
        trackingEvent: {
            type: Object,
            default() { return null }
        }
    },

    data() {
        return {
            localLanguage: ''
        }
    },

    mounted() {
        this.localLanguage = this.language
    },

    methods: {
        download(policyText: string, download: any) {
            const vm = this as any

            const link = document.createElement('a')

            // construct download blob
            let fileBlob = new Blob([policyText], {type: download.type})
            link.href = URL.createObjectURL(fileBlob)
            link.download = download.filename
            link.click()

            // clean up
            URL.revokeObjectURL(link.href)

            if (vm.trackingEvent) {
                vm.track(download)
            }
        },

        track(download: any): void {
            const vm = this as any

            const event = { ...vm.trackingEvent, ...download.trackingEvent }

            if (!isEmpty(vm.localLanguage)) {
                event.eventLabel = [vm.localLanguage, event.eventLabel].join('_')
            }
            
            vm.$ga.event(event)
        }
    },

    watch: {
        "localLanguage": function(newLanguage) {
            if (!isEmpty(newLanguage)) {
                store.dispatch('policymaker/updateLanguage', newLanguage)
            }
        }
    }

})
</script>

<style lang="postcss">
    .dio__term-content {
        @apply p-3 lg:p-7 border border-gray-400 rounded-sm shadow-md mb-10 text-xs lg:text-base;
        @apply bg-white;

        h1 {
            @apply text-lg lg:text-2xl font-bold;

            &:not(:first-child) {
                @apply  pt-6;
            }
        }

        h2 {
            @apply text-base lg:text-xl font-bold pt-5;
        }

        h3 {
            @apply text-sm lg:text-lg font-bold pt-4;
        }

        a {
            @apply text-blue-600 underline;
        }

        p {
            @apply pb-4;
        }

        ul {
            @apply list-disc list-outside pl-6 pb-4;

            &[dir="rtl"] {
              @apply pr-6;
            }
        }

        li {
            @apply pb-1;
        }

    }

</style>
