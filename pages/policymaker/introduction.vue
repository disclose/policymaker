<template>
    <div>
        <page-title>
            Policymaker
            <template slot="subtitle">
                Open-source vulnerability disclosure program policy, security.txt, and DNS Security TXT generator<br>
                Part of the <a href="https://twitter.com/disclose_io" target="_blank">@disclose_io</a> Project
            </template>
        </page-title>

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

</style>