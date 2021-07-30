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
            <dio-button v-if="false">Done</dio-button>
            <dio-button @click="goto(3)" theme="muted">Back</dio-button>
        </footer>
    </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { mapActions } from 'vuex'
import DioTab from '~/components/tab/DioTab.vue'
import DioTabGroup from '~/components/tab/DioTabGroup.vue'
import PageTitle from '~/components/PageTitle.vue'
import { store } from '~/store'

export default Vue.extend({
    components: { PageTitle, DioTab, DioTabGroup },
    layout: 'policymaker-v2',

    data() {
        return {
            sections: [
                { route: '/policymaker/download/vdp', name: 'Vulnerability Disclosure Policy' },
                // { route: '/policymaker/download/safe-harbor-clause', name: 'Safe Harbor Clause' },
                { route: '/policymaker/download/securitytxt', name: 'Security.txt' },
                { route: '/policymaker/download/dnssecuritytxt', name: 'DNS Security.txt' },
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