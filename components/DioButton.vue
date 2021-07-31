<template>
    <button class="dio__button dio__focusable"
        @click="click($event)"
        :class="{ [`dio__button-${theme}`]: true, [`dio__button-${size}`]: true, [`dio__button-disabled`]: disabled }"
        :disabled="disabled"
        >
        <slot></slot>
    </button>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
    
    props: {
        theme: {
            type: String,
            default: 'solid'
        },
        size: {
            type: String,
            default: 'normal'
        },
        disabled: {
            type: Boolean,
            default: false
        }
    },

    methods: {
        click($event: any): void {
            const vm = this as any
            vm.$emit('click', $event)
        }
    }
})
</script>

<style lang="postcss">
    .dio__button {
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


        &.dio__button-disabled {
            background: var(--shade-500);
            @apply cursor-default;
        }
    }
</style>