<template>
    <div class="progress-step">
        {{ index }}
        <slot></slot>
    </div>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
    name: 'ProgressStep',

    props: {
        index: {
            type: Number
        }
    }
})
</script>

<style lang="postcss">

</style>