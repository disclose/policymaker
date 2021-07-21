<template>
    <div>
        <NuxtLink class="progress-step" :to="route">
            {{ index }}
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
        }
    }
})
</script>

<style lang="postcss">

</style>