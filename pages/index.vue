<template>
    <div>
        <nav>
            <logo>disclose.io</logo>

            <Progress-Steps>
                <Progress-Step>Introduction</Progress-Step>
                <Progress-Step>Organization details</Progress-Step>
                <Progress-Step>Policy settings</Progress-Step>
                <Progress-Step>Download</Progress-Step>
            </Progress-Steps>

        </nav>
        <main></main>
    </div>
</template>

<script lang="ts">
import Vue from 'vue'
import ProgressSteps from '@/components/ProgressSteps.vue'
import ProgressStep from '@/components/ProgressStep.vue'

export default Vue.extend({
    layout: 'policymaker-v2',
    components: {
        ProgressSteps,
        ProgressStep
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
nav {
    --nav-width: 320px;

    height: 100vh;
    width: var(--nav-width);
    background: var(--white);
}

</style>