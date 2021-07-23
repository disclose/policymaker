<template>
    <div>
        <page-title>Introduction</page-title>
    </div>
</template>

<script lang="ts">
import Vue from 'vue'
import ProgressSteps from '@/components/ProgressSteps.vue'
import ProgressStep from '@/components/ProgressStep.vue'
import PageTitle from '~/components/PageTitle.vue'

export default Vue.extend({
    layout: 'policymaker-v2',
    components: {
        ProgressSteps,
        ProgressStep,
        PageTitle
    },

    data() {
        return {}
    },

    computed: {},

    methods: {},

    watch: {}
    
})
</script>


<style lang="postcss">

</style>