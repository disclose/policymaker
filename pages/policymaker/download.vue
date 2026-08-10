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
import { NavSteps, PolicyConfiguration, store } from '~/store'
import nav from '~/mixins/nav'

export default Vue.extend({
    components: { PageTitle, DioTab, DioTabGroup },
    layout: 'policymaker',

    mixins: [nav],

    created() {
        const vm = this as any
        if (!this.validAll) {
            vm.goto(1)
        } else {
            store.dispatch('policymaker/fetchTerms').then(() => {
                if (process.client) {
                    const gtag = (window as any).gtag
                    if (typeof gtag === 'function') {
                        gtag('event', 'policy_generated', {
                            artifact: 'vulnerability_disclosure_policy',
                            cvd_enabled: (this.configuration as any).cvdTimelineDays > 0
                        })
                    }
                }
                this.$router.push(this.sections[0].route)
            })
        }

        
    },

    computed: {
        configuration: () => store.getters['policymaker/getConfiguration'] as PolicyConfiguration,
        sections: () => store.getters['policymaker/getDownloadSections'] as NavSteps,
        validAll: () => store.getters['policymaker/validAll'] as boolean
    }

})
</script>

<style lang="postcss">

</style>
