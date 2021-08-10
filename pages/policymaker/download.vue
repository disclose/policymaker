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
    layout: 'policymaker-v2',

    data() {
        return {
            sections: [
                { route: '/policymaker/download/vdp', name: 'Vulnerability Disclosure Policy' },
                { route: '/policymaker/download/securitytxt', name: 'Security.txt' },
            ]
        }
    },

    mounted() {
        // Check validation

        store.dispatch('policymaker/fetchTerms').then(() => {
            this.$router.push(this.sections[0].route)
        })
        
    },

    computed: {
        configuration: () => store.getters['policymaker/getConfiguration']
    },

    methods: {
        goto: (step: number) => store.dispatch('policymaker/gotoStep', step)

    }
})
</script>

<style lang="postcss">

</style>