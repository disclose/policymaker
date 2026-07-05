<template>
    <div class="dio__term-preview">

        <div class="flex flex-row justify-between items-center">
            <div class="flex flex-row items-center gap-x-2">
                <InputDropdown :options="languageOptions"
                    v-model="localLanguage"
                    v-if="showLanguage">
                    <template v-slot:selectedValue="{ value }">
                        {{ $t(`language.${value}`) }}
                    </template>
                    <template v-slot:option="{ option }">
                        {{ $t(`language.${option}`) }}
                    </template>
                </InputDropdown>
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
import InputDropdown from '../InputDropdown/InputDropdown.vue'

export default Vue.extend({
    components: {InputDropdown},

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

            // construct download blob (stamped for template-lineage detection)
            let fileBlob = new Blob([vm.stamp(policyText, download.type)], {type: download.type})
            link.href = URL.createObjectURL(fileBlob)
            link.download = download.filename
            link.click()

            // clean up
            URL.revokeObjectURL(link.href)

            if (vm.trackingEvent) {
                vm.track(download)
            }
        },

        // Version stamp: a stable fingerprint phrase + date + unique id, appended as a
        // format-appropriate comment. Enables lineage detection of published artifacts
        // (code/web search + diosts scans). Client-side: uniqueness, not cryptographic signing.
        stamp(policyText: string, mimeType: string): string {
            const date = new Date().toISOString().slice(0, 10)
            const id = Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 8)
            const label = `Generated with policymaker.disclose.io (dioterms) | ${date} | id:${id}`
            if (mimeType === 'text/plain') {
                return `${policyText.replace(/\s+$/, '')}\n\n# ${label}\n`
            }
            return `${policyText.replace(/\s+$/, '')}\n\n<!-- ${label} -->\n`
        },

        track(download: any): void {
            const vm = this as any

            const event = { ...vm.trackingEvent, ...download.trackingEvent }

            if (!isEmpty(vm.localLanguage)) {
                event.eventLabel = [vm.localLanguage, event.eventLabel].join('_')
            }

            // GA4 (gtag.js) — the previous vm.$ga.event() targeted the removed
            // vue-analytics/UA plugin, so download events were silently lost after #15.
            const gtag = (window as any).gtag
            if (typeof gtag === 'function') {
                const name = `${event.eventCategory}_${event.eventAction}`
                    .replace(/[^a-zA-Z0-9_]/g, '_').slice(0, 40)
                gtag('event', name, {
                    event_category: event.eventCategory,
                    event_label: event.eventLabel,
                    artifact: event.eventCategory,
                    format: (download.trackingEvent || {}).eventLabel
                })
            }
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
