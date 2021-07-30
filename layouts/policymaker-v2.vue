<template>
    <div id="app">
        <header>
            <div class="logo">
                <img src="@/assets/images/logo-disclose-type.svg">
            </div>

            <nav>
                <Progress-Steps orientation="vertical" :steps="navSteps">
                </Progress-Steps>
            </nav>

            <!-- <small><pre>{{ configuration }}</pre></small> -->

        </header>

        <main>
            <div id="content">
                <Nuxt />          
            </div>
        </main>
    </div>



</template>

<script lang="ts">
import Vue from 'vue'
import { store } from '~/store'

export default Vue.extend({
    
    data() {
        return {
        }
    },

    mounted() {
        this.$nextTick(() => {
            store.dispatch('policymaker/syncStepFromRoute', this.$route.fullPath)
        })
    },

    computed: {
        navSteps: () => store.getters['policymaker/getNavSteps'],
        configuration: () => store.getters['policymaker/getConfiguration'],
    },

})
</script>

<style lang="postcss">
:root {
    color: var(--dark-purple);
    background: linear-gradient(90deg, var(--white) 50%, var(--shade-050) 50%);
    /* font-family: "Noto Sans", Roboto, "Helvetica Neue", ui-sans-serif, system-ui, -apple-system, system-ui; */
    font-family: "Noto Sans";
    --nav-width: 320px;
}

#app {
    @apply container mx-auto h-screen max-w-7xl;
    @apply flex flex-1 flex-row flex-nowrap items-stretch justify-between;
    
}


header {
    width: var(--nav-width);
    min-width: var(--nav-width);
    background: var(--white);
    @apply pt-8 pb-8;
    @apply fixed h-full;
}

nav {
    @apply mt-12 mb-12 pl-3;
}

main {
    @apply flex-grow;
    background: var(--shade-050);
    padding-left: var(--nav-width);

    #content {
        background: var(--shade-050);
        @apply pt-8 pb-8 pl-8;
    }

    footer {
        @apply flex flex-row-reverse justify-between items-center mt-24;
    }
}

h1,h2,h3,h4,h5,h6 {
    font-family: 'Noto Sans Display'
}

h3 {
    @apply text-2xl;
}
</style>
