<template>
    <div>
        <page-title>Download</page-title>
        <footer>
            <dio-link route="/policymaker/download">Done</dio-link>
            <dio-link route="/policymaker/settings" theme="muted">Back</dio-link>
        </footer>
    </div>
</template>

<script lang="ts">
import Vue from 'vue'
import PageTitle from '~/components/PageTitle.vue'

export default Vue.extend({
  components: { PageTitle },
    layout: 'policymaker-v2',
})
</script>

<style lang="postcss">

</style>