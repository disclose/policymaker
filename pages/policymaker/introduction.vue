<template>
    <div>
        <page-title>
            Introduction
        </page-title>

        <nuxt-content :document="content"></nuxt-content>

        <div class="dio__action-bar">
            <DioButton @click="goto(2)">Begin</DioButton>
        </div>
    </div>
</template>

<script lang="ts">
import Vue from 'vue'
import PageTitle from '~/components/PageTitle/PageTitle.vue'
import DioLink from '~/components/DioLink/DioLink.vue'
import nav from '~/mixins/nav'
import DioButton from '~/components/DioButton/DioButton.vue'

declare module 'vue/types/vue' {
  interface Vue {
    content: any
  }
}

export default Vue.extend({
    layout: 'policymaker',
    components: {
        PageTitle,
        DioLink,
        DioButton
    },

    mixins: [nav],

    async asyncData({ $content, params, route }) {
        const content = await $content(route.fullPath).fetch()
        return {
            content
        }
    }
})
</script>


<style lang="postcss">

</style>
