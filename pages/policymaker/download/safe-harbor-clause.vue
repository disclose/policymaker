<template>
    <div>
        Safe Harbor Clause

        <DioTermPreview :content="safe_harbor" />
    </div>
</template>

<script lang="ts">
import Vue from 'vue'
import DioTermPreview from '~/components/DioTermPreview/DioTermPreview.vue';
import { store } from '~/store'

export default Vue.extend({
    components: { DioTermPreview},

    computed: {
        safe_harbor: () => (store?.state as any)?.policymaker.templates?.safe_harbor?.text,
        language: () => store?.getters['policymaker/getConfiguration']?.language
    }
})
</script>

<style lang="postcss">

</style>