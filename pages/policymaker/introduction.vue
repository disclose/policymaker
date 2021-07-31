<template>
    <div>
        <page-title>Introduction</page-title>

        <nuxt-content :document="content"></nuxt-content>

        <footer>
            <dio-button @click="goto(2)">Begin</dio-button>
        </footer>
    </div>
</template>

<script lang="ts">
import Vue from 'vue'
import ProgressSteps from '@/components/ProgressSteps.vue'
import ProgressStep from '@/components/ProgressStep.vue'
import PageTitle from '~/components/PageTitle.vue'
import DioLink from '~/components/DioLink.vue'
import { store } from '~/store'

export default Vue.extend({
    layout: 'policymaker-v2',
    components: {
        ProgressSteps,
        ProgressStep,
        PageTitle,
        DioLink
    },

    async asyncData({ $content, params, route}) {
        const content = await $content(route.fullPath).fetch()
        console.log("content", content)
        return {
            content
        }
    },

    data() {
        return {
        }
    },

    computed: {},

    methods: {
        goto: (step: number) => store.dispatch('policymaker/gotoStep', step)
    },

    watch: {}
    
})
</script>


<style lang="postcss">
    .nuxt-content-container {
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

        ol {
            @apply list-decimal list-outside pl-6 pb-4;
        }

        li {
            @apply mb-2;
        }

        code {
            @apply bg-yellow-100 text-yellow-700 rounded-sm pl-1 pr-1 text-sm;
        }
    }
</style>