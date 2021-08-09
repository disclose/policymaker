<template>
    <div class="dio__step">
        <NuxtLink class="dio__step-link"
            :to="route"
            :class="{ [`dio__step-link--completed`]: completed }"
            :event="disabled ? '' : 'click'"
            @click.native="changeStep">
            <div class="dio__step-anchor"
                :style="anchorStyle"
                :class="{ [`dio__step-anchor--active`]: active, [`dio__step-anchor--completed`]: completed }">
                {{ index }}
            </div>
            <slot></slot>
        </NuxtLink>
    </div>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
    name: 'ProgressStep',

    props: {
        index: {
            type: Number
        },
        route: {
            type: String
        },
        active: {
            type: Boolean
        },
        completed: {
            type: Boolean
        },
        size: {
            type: Number,
            default: 40
        },
        disabled: {
            type: Boolean,
            default: false
        }
    },

    data() {
        return {
            anchor: {
                localSize: 40
            }
        }
    },

    mounted() {
        const vm = this as any
        vm.anchor.localSize = vm.size
    },

    computed: {
        anchorStyle() {
            const vm = this as any

            return {
                width: `${vm.anchor.localSize}px`,
                height: `${vm.anchor.localSize}px`,
                lineHeight: `${vm.anchor.localSize-4}px`
            }
        }
    },

    methods: {
        changeStep(): void {
            const vm = this as any
            if (!vm.disabled) {
                vm.$emit('changeStep', vm.index)
            }
        }
    }
})
</script>

<style lang="postcss">
    .dio__step {
        @apply mt-8 mb-8 z-20 flex relative bg-white select-none;
        font-family: 'Noto Sans Display';
        color: var(--shade-500);
    }

    .dio__step-anchor {
        @apply text-center rounded-full border-solid border-2 mr-4;
        @apply transition-all duration-200 ease-in-out delay-100;

    }

    .dio__step-link {
        @apply flex flex-row items-center cursor-default;

        &.nuxt-link-active {
            @apply font-bold;
            color: var(--dark-purple);
            
            .dio__step-anchor {
                color: var(--white);
                background: var(--purple);
                border-color: var(--purple);
            }
        }
        &--completed {
            color: var(--dark-purple);
            @apply cursor-pointer;

            .dio__step-anchor {
                background: var(--white);
                border-color: var(--purple);
                color: var(--purple);
            }
        }
    }
</style>