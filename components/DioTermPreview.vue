<template>
    <div class="dio__term-preview">

        <div class="flex flex-row justify-between items-center">
            <div class="flex flex-row items-center gap-x-2">
                <input-dropdown :options="[]" v-model="language">
                    <template v-slot:selectedValue="{ value }">
                        {{ $t(`language.${value}`) }}
                    </template>
                    <template v-slot:option="{ option }">
                        {{ $t(`language.${option}`) }}
                    </template>
                </input-dropdown>
            </div>
            
            <div>
                <dio-button theme="transparent" @click="download(content, 'text/markdown')">Download as markdown</dio-button>
                <dio-button theme="transparent" @click="download($md.render(content), 'text/html')">Download as HTML</dio-button>
            </div>
        </div>
        <br>

        <div class="dio__term-content" v-html="$md.render(content)">

        </div>
    </div>
</template>

<script lang="ts">
import Vue from 'vue'
import _kebabCase from 'lodash/kebabCase'

export default Vue.extend({
    
    props: {
        content: {
            type: String
        },
        filename: {
            type: String
        }
    },

    data() {
        return {
            language: 'en'
        }
    },


    methods: {
        download(policyText: string, type: string) {
            const vm = this as any

            const link = document.createElement('a')

            // construct download blob
            let fileBlob = new Blob([policyText], {type})
            link.href = URL.createObjectURL(fileBlob)
            link.download = this.filename
            link.click()

            // clean up
            URL.revokeObjectURL(link.href)

        }
    }

})
</script>

<style lang="postcss">
    .dio__term-content {
        @apply p-7 border border-gray-400 rounded-sm shadow-md mb-10 select-none;
        @apply bg-white;

        h1 {
            @apply text-2xl font-bold;

            &:not(:first-child) {
                @apply  pt-6;
            }
        }

        h2 {
            @apply text-xl font-bold pt-5;
        }

        h3 {
            @apply text-lg font-bold pt-4;
        }

        a {
            @apply text-blue-600 underline;
        }

        p {
            @apply pb-4;
        }

        ul {
            @apply list-disc list-outside pl-6 pb-4;
        }

        li {
            @apply pb-1;
        }

    }

</style>