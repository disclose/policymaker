<template>
    <div>
        <page-title>
            Introduction
        </page-title>

        <nuxt-content :document="content"></nuxt-content>

        <div class="dio__action-bar">
            <dio-button @click="goto(2)">Begin</dio-button>
        </div>
    </div>
</template>

<script lang="ts">
import Vue from 'vue'
import PageTitle from '~/components/PageTitle/PageTitle.vue'
import DioLink from '~/components/DioLink/DioLink.vue'
import nav from '~/mixins/nav'

export default Vue.extend({
    layout: 'policymaker',
    components: {
        PageTitle,
        DioLink
    },

    mixins: [nav],

    async asyncData({ $content, params, route}) {
        const content = await $content(route.fullPath).fetch()
        return {
            content
        }
    }

})
</script>


<style lang="postcss">

</style>
