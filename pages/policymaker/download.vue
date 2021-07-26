<template>
    <div>
        <page-title>Download</page-title>

        <dio-tab-group>
            <dio-tab 
                v-for="(section, index) in sections"
                :key="index"
                :route="section.route">
                {{ section.name }}
            </dio-tab>
        </dio-tab-group>

        <NuxtChild />

        <footer>
            <p></p>
            <dio-link route="/policymaker/download" v-if="false">Done</dio-link>
            <dio-link route="/policymaker/settings" theme="muted">Back</dio-link>
        </footer>
    </div>
</template>

<script lang="ts">
import Vue from 'vue'
import DioTab from '~/components/DioTab.vue'
import DioTabGroup from '~/components/DioTabGroup.vue'
import PageTitle from '~/components/PageTitle.vue'

export default Vue.extend({
    components: { PageTitle, DioTab, DioTabGroup },
    layout: 'policymaker-v2',

    data() {
        return {
            sections: [
                { route: '/policymaker/download/vdp', name: 'VDP' },
                { route: '/policymaker/download/safe-harbor-clause', name: 'Safe Harbor Clause' },
                { route: '/policymaker/download/securitytxt', name: 'Security.txt' },
                { route: '/policymaker/download/dnssecuritytxt', name: 'DNS Security.txt' },
            ]
        }
    }
})
</script>

<style lang="postcss">

</style>