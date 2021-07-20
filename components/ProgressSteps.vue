<template>
    <div class="progress-steps">
        <slot></slot>
    </div>    
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
    name: "ProgressSteps",
    
    mounted() {
        console.log(this as any)
    }
})
</script>

<style lang="postcss">

</style>