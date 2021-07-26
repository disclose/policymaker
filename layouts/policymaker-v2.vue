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

            <small><pre>{{ configuration }}</pre></small>
        </header>


        <main>
            <Nuxt />          
        </main>
    </div>



</template>

<script lang="ts">
import Vue from 'vue'
import { policymaker } from '~/store'

export default Vue.extend({
    
    data() {
        return {
            navSteps: [
                { route: '/policymaker/introduction', name: 'Introduction' },
                { route: '/policymaker/organisation', name: 'Organisation details' },
                { route: '/policymaker/settings', name: 'Policy settings' },
                { route: '/policymaker/download', name: 'Download' }
            ]
        }
    },

    computed: {
        configuration() {
            return policymaker.configuration
        }
    }
})
</script>

<style lang="postcss">
:root {
    color: var(--dark-purple);
    background: linear-gradient(90deg, var(--white) 50%, var(--shade-050) 50%);
    /* font-family: "Noto Sans", Roboto, "Helvetica Neue", ui-sans-serif, system-ui, -apple-system, system-ui; */
    font-family: "Noto Sans";
}

#app {
    @apply container mx-auto h-screen;
    @apply flex flex-1 flex-row flex-nowrap items-stretch justify-between;
}


header {
    --nav-width: 320px;
    width: var(--nav-width);
    min-width: var(--nav-width);
    background: var(--white);
    @apply pt-8 pb-8;
}

nav {
    @apply mt-12 mb-12 pl-3;
}

main {
    background: var(--shade-050);
    @apply flex-grow;
    @apply pt-8 pb-8 pl-8;

    footer {
        @apply flex flex-row-reverse justify-between items-center mt-24;
    }
}

.logo {

}

</style>
