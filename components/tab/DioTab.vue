<template>
    <div class="dio__tab">
        <NuxtLink :to="route">
            <slot></slot>
        </NuxtLink>
    </div>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({

    props: {
        route: {
            type: String,
            required: true
        },
        selected: {
            type: Boolean,
            default: false
        }
    },

    data() {
        return {

        }
    }
    
})
</script>


<style lang="postcss">
    .dio__tab {

        > a {
            @apply pl-4 pr-4 pt-4 pb-4 mr-0.5;
            @apply transition-all duration-150;
            background: var(--shade-100);
            @apply border-b-2 border-solid;
            border-bottom-color: var(--shade-200);
            @apply whitespace-nowrap overflow-ellipsis;

            &.nuxt-link-exact-active {
                @apply border-t-4;
                background: transparent;
                border-top-color: var(--purple);
                border-bottom-color: transparent;
            }
        }

    }
</style>