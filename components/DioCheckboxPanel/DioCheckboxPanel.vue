<template>
    <div class="dio__checkbox-panel" :class="{ 'dio__checkbox-panel--selected': selected }">
        <div class="dio__checkbox-icon">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
        </div>
        <div class="dio__checkbox-label">
            <slot></slot>
        </div>
    </div>
</template>


<script lang="ts">
import Vue from 'vue'
export default Vue.extend({

    props: {
        value: {
            type: [Object, String, Boolean]
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
    .dio__checkbox-panel {
        @apply flex flex-1 flex-row items-center;
        @apply pt-4 pb-4 pl-5 pr-10 cursor-pointer max-w-md;
        @apply border-2 border-transparent;
        @apply transition-all duration-150;
        background: var(--shade-100);
        color: var(--shade-800);

        .dio__checkbox-icon {
            @apply pr-5;
            opacity: 0;
            @apply transition-all duration-300;
        }

        .dio__checkbox-label {
            label {
                font-family: 'Noto Sans Display';
                @apply block font-bold;
                @apply text-lg;
            }

            p {
                @apply text-sm;
            }

        }

        .dio__pill {
            @apply mt-2 inline-block border border-solid;
            background: var(--shade-100);
            color: var(--shade-900);
            border-color: var(--shade-200);
        }

        
        &:first-child {
            @apply rounded-t-lg md:rounded-l-lg md:rounded-r-none;
        }

        &:last-child {
            @apply rounded-b-lg md:rounded-r-lg md:rounded-l-none;
        }

        &:hover {
            background: var(--shade-300);
            label {
                color: var(--dark-purple);
            }
        }

        &.dio__checkbox-panel--selected {
            @apply border-solid;
            background: var(--white);
            color: var(--dark-purple);
            border-color: var(--purple);

            .dio__pill {
                @apply bg-purple-100 text-purple-800 border-purple-400;
            }

            &:hover {
                /* background: var(--dark-purple); */
            }

            .dio__checkbox-icon {
                opacity: 1;
                 
                svg {
                    stroke: var(--purple)
                }
            }
        }
    }
</style>