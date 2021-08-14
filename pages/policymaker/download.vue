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

    </div>
</template>

<script lang="ts">
import Vue from 'vue'
import DioTab from '~/components/DioTab/DioTab.vue'
import DioTabGroup from '~/components/DioTab/DioTabGroup.vue'
import PageTitle from '~/components/PageTitle/PageTitle.vue'
import { store } from '~/store'

export default Vue.extend({
    components: { PageTitle, DioTab, DioTabGroup },
    layout: 'policymaker',

    data() {
        return {
            sections: [
                { route: '/policymaker/download/vdp', name: 'Vulnerability Disclosure Policy' },
                { route: '/policymaker/download/securitytxt', name: 'Security.txt' },
                { route: '/policymaker/download/dnssecuritytxt', name: 'DNS Security.txt' },
            ]
        }
    },

    mounted() {
        // Check validation
        if (!this.validAll) {
            this.$router.replace(this.getNavSteps[0].route)
        }

        store.dispatch('policymaker/fetchTerms').then(() => {
            this.$router.push(this.sections[0].route)
        })
        
    },

    computed: {
        configuration: () => store.getters['policymaker/getConfiguration'],
        validAll: () => store.getters['policymaker/validAll'],
        getNavSteps: () => store.getters['policymaker/getNavSteps']
    },

    methods: {
        goto: (step: number) => store.dispatch('policymaker/gotoStep', step)

    }
})
</script>

<style lang="postcss">

</style>