<template>
    <div>
        Safe Harbor Clause

        <dio-term-preview :content="safe_harbor" />
    </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { store } from '~/store'

export default Vue.extend({
    
    computed: {
        safe_harbor: () => (store.state as any).policymaker.templates.safe_harbor.text,
        language: () => store.getters['policymaker/getConfiguration'].language
    }
})
</script>

<style lang="postcss">

</style>