<template>
    <NuxtLink class="dio__link dio__focusable" :to="route"
        :class="{ [`dio__link-${theme}`]: true, [`dio__link-${size}`]: true }">
        <slot></slot>
    </NuxtLink>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
    
    props: {
        route: {
            type: String,
            required: true
        },
        theme: {
            type: String,
            default: 'solid'
        },
        size: {
            type: String,
            default: 'normal'
        }
    },

    methods: {
        click(): void {
            const vm = this as any
            vm.$emit('click')
        }
    }
})
</script>

<style lang="postcss">
    .dio__link {
        @apply p-2 pl-4 pr-4 rounded-full cursor-pointer;
        @apply border border-solid rounded-full;

        &:focus, &:focus-within {
            @apply rounded-full;
            outline: none;
        }

        /* Themes */
        &-solid {
            background: var(--purple);
            color: var(--white);
        }

        &-transparent {
            @apply bg-transparent;
            color: var(--purple);
            border-color: var(--purple);
        }

        &-muted {
            @apply bg-transparent;
            color: var(--shade-700);
            border-color: var(--shade-700);

        }


        /* Size */
        &-normal {

        }

        &-small {
            @apply text-sm p-1 pl-3 pr-3;
        }
    }
</style>