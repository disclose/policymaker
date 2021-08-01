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
}

#app {
    @apply container mx-auto h-screen max-w-7xl;
    @apply flex flex-nowrap flex-col content-center justify-start items-stretch;
    @apply lg:flex lg:flex-1 lg:flex-row lg:items-stretch lg:justify-between;
    
}


header {
    background: var(--white);
    @apply flex flex-row items-center h-16 px-4;
    @apply lg:pt-8 lg:pb-8 lg:w-80 w-full z-10;
    @apply fixed lg:flex-col lg:h-full min-w-max overflow-hidden;

    .logo img {
        @apply h-12;
    }

    nav {
        @apply mt-12 mb-12 pl-3 hidden lg:block;
    }
}


main {
    @apply pt-16 flex-1;    
    @apply lg:flex-grow lg:pl-80 lg:pt-0;
    background: var(--shade-050);

    #content {
        background: var(--shade-050);
        @apply py-8 px-8;
    }

    footer {
        @apply flex flex-row-reverse justify-between items-center mt-16;
    }
}

h1,h2,h3,h4,h5,h6 {
    font-family: 'Noto Sans Display'
}

h3 {
    @apply text-2xl;
}

.nuxt-content {
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
