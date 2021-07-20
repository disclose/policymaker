<template>
    <div id="app">
        <nav>
            <div>disclose.io</div>

            <Progress-Steps>
                <Progress-Step :index="1">Introduction</Progress-Step>
                <Progress-Step :index="2">Organization details</Progress-Step>
                <Progress-Step :index="3">Policy settings</Progress-Step>
                <Progress-Step :index="4">Download</Progress-Step>
            </Progress-Steps>

        </nav>

        <main>
            <header>
                header
            </header>            
        </main>
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
#app {
    @apply container mx-auto h-screen;
    @apply flex flex-1 flex-row flex-nowrap items-stretch justify-between;
}

nav {
    --nav-width: 320px;
    width: var(--nav-width);
    background: var(--white);
}

main {
    background: var(--shade-050);
    @apply flex-grow;
}

</style>