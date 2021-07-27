<template>
    <div>
        <page-title>Introduction</page-title>

        <nuxt-content :document="content"></nuxt-content>

        <footer>
            <dio-link route="/policymaker/organisation">Begin</dio-link>
        </footer>
    </div>
</template>

<script lang="ts">
import Vue from 'vue'
import ProgressSteps from '@/components/ProgressSteps.vue'
import ProgressStep from '@/components/ProgressStep.vue'
import PageTitle from '~/components/PageTitle.vue'
import DioLink from '~/components/DioLink.vue'

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

    methods: {},

    watch: {}
    
})
</script>


<style lang="postcss">

</style>