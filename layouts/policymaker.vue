<template>
    <div id="app">
        <header>
            <NuxtLink class="logo" to="/policymaker">
                <img src="@/assets/images/logo-disclose-type.svg">
            </NuxtLink>

            <button class="theme-toggle" type="button" @click="toggleTheme"
                :title="isLight ? 'Switch to dark theme' : 'Switch to light theme'"
                aria-label="Toggle light/dark theme">
                <span v-if="isLight">☀</span><span v-else>☾</span>
            </button>

            <nav>
                <progress-steps orientation="vertical" :steps="navSteps">
                </Progress-Steps>
            </nav>

        </header>

        <main>
            <div id="content">
                <Nuxt />          
                <footer>
                    &copy; Copyright {{ new Date().getFullYear() }} The <a href=https://disclose.io>disclose.io</a> Project - Made with ♥️ by Jeremy Manoto and Casey Ellis.
                </footer>
            </div>
        </main>
    </div>



</template>

<script lang="ts">
import Vue from 'vue'
import ProgressSteps from '~/components/DioProgressStep/ProgressSteps.vue'
import { store } from '~/store'

export default Vue.extend({
  components: { ProgressSteps },
    
    data() {
        return {
            isLight: false
        }
    },

    head() {
        return {
        title: 'Policymaker | disclose.io',
        meta: [
          // hid is used as unique identifier. Do not use `vmid` for it as it will not work
          {
            hid: 'description',
            name: 'description',
            content: 'Disclose.io policymaker'
          }
        ]
      }
    },

    mounted() {
        const vm = this as any
        vm.isLight = document.documentElement.getAttribute('data-theme') !== 'dark'
        this.$nextTick(() => {
            store.dispatch('policymaker/fetchLanguages')
            store.dispatch('policymaker/syncStepFromRoute', this.$route.fullPath)
        })
    },

    methods: {
        toggleTheme(): void {
            const vm = this as any
            vm.isLight = !vm.isLight
            const root = document.documentElement
            if (vm.isLight) {
                root.removeAttribute('data-theme')
                try { localStorage.setItem('dio-theme', 'light') } catch (e) {}
            } else {
                root.setAttribute('data-theme', 'dark')
                try { localStorage.setItem('dio-theme', 'dark') } catch (e) {}
            }
        }
    },

    computed: {
        navSteps: () => store.getters['policymaker/getNavSteps'],
        configuration: () => store.getters['policymaker/getConfiguration'],
    },

})
</script>

<style lang="postcss">
:root {
    color: var(--text);
    background: var(--bg);
    font-family: var(--font);
}

#app {
    @apply container mx-auto h-screen max-w-7xl;
    @apply flex flex-nowrap flex-col content-center justify-start items-stretch;
    @apply lg:flex lg:flex-1 lg:flex-row lg:items-stretch lg:justify-between;
    
}


header {
    background: var(--surface);
    border-right: 1px solid var(--border);
    @apply fixed flex flex-row items-center h-16 px-4 overflow-hidden min-w-max;
    @apply w-full z-10;
    @apply lg:flex-col lg:h-full lg:items-start lg:pt-8 lg:pb-8 lg:w-80 ;

    .logo img {
        @apply h-10;
        @apply lg:h-16;
        @apply transition-all duration-300;
    }

    nav {
        @apply mt-12 mb-12 hidden lg:block;
    }

    .theme-toggle {
        @apply flex items-center justify-center cursor-pointer;
        width: 36px;
        height: 36px;
        margin-left: auto;
        background: var(--surface-2);
        border: 1px solid var(--border);
        border-radius: var(--radius);
        color: var(--text-muted);
        font-size: 16px;
        transition: all var(--transition);

        &:hover {
            border-color: var(--border-light);
            color: var(--text);
        }
    }
}


main {
    @apply pt-16 flex-1;    
    @apply lg:flex-grow lg:pl-80 lg:pt-0;
    background: var(--shade-050);

    #content {
        background: var(--shade-050);
        @apply py-8 px-8 lg:min-h-screen flex flex-col justify-between;
    }

    .dio__action-bar {
        @apply flex flex-row-reverse justify-end items-center my-8 gap-4;
    }

    footer {
        @apply text-sm mt-6;
    }
}

h1,h2,h3,h4,h5,h6 {
    font-family: var(--font);
    color: var(--text-heading);
}

h3 {
    @apply text-2xl;
}

.nuxt-content {
    @apply text-sm lg:text-base;

    h1 {
        @apply text-lg lg:text-2xl font-bold;

        &:not(:first-child) {
            @apply  pt-6;
        }
    }

    h2 {
        @apply text-base lg:text-xl font-bold pt-5;
    }

    h3 {
        @apply text-sm lg:text-lg font-bold pt-4;
    }

    a {
        @apply text-purple-800 border-purple-600 hover:text-purple-600 hover:border-purple-600 border-b-2;
        font-family: 'Noto Sans Display';
        /* border-bottom: 1px solid; */

    }

    p {
        @apply my-4;
    }

    ul {
        @apply list-disc list-outside pl-6 my-4;
    }

    ol {
        @apply list-decimal list-outside pl-6 my-4;
    }

    li {
        @apply mb-2;
    }

    code {
        @apply bg-yellow-100 text-yellow-700 rounded-sm pl-1 pr-1 text-sm;
    }

    blockquote {
        @apply bg-yellow-100 text-yellow-700 rounded-md px-4 py-4 flex flex-row items-center;

        p {
            @apply my-1;
        }

        a {
            @apply text-yellow-800 border-yellow-800 hover:text-yellow-600 hover:border-yellow-600;
            font-family: 'Noto Sans Display';
        }
    }
}
</style>
