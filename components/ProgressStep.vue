<template>
    <div class="dio__step">
        <NuxtLink class="dio__step-link" :to="route">
            <div class="dio__step-anchor" :class="{ [`dio__step-anchor--active`]: active, [`dio__step-anchor--completed`]: completed }">{{ index }}</div>
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
        }
    }
})
</script>

<style lang="postcss">
    .dio__step {
        @apply mt-8 mb-8;
        font-family: 'Noto Sans Display';
        color: var(--shade-700);
    }

    .dio__step-anchor {
        @apply text-center leading-loose h-9 w-9 rounded-full border-solid border-2 mr-4;

        &--completed {
            background: var(--white);
            border-color: var(--purple);
        }

        &--active {

        }
    }

    .dio__step-link {
        @apply flex flex-row items-center;

        &.nuxt-link-exact-active {
            @apply font-bold;
            color: var(--dark-purple);
            
            .dio__step-anchor {
                color: var(--white);
                background: var(--purple);
                border-color: var(--purple);
            }
        }
    }
</style>