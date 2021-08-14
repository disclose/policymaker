
<template>
    <div>
            <nuxt-content :document="dnssecuritytxtCopy"></nuxt-content>

            <dio-dns-security-txt-table :configuration="configuration" />
    </div>
</template>

<script lang="ts">
import Vue from 'vue'
import DioDnsSecurityTxtTable from '~/components/DioDnsSecurityTxtTable/DioDnsSecurityTxtTable.vue'
import DioField from '~/components/DioField/DioField.vue'
import InputText from '~/components/InputText/InputText.vue'
import { store } from '~/store'
import { channelURIs } from '~/utils/mdTemplate'

export default Vue.extend({
  components: { DioDnsSecurityTxtTable },

    async asyncData({ $content, params, route}) {
        const dnssecuritytxtCopy = await $content("policymaker/dnssecuritytxt").fetch()


        return {
            dnssecuritytxtCopy
        }
    },

    computed: {
        configuration: () => store.getters['policymaker/getConfiguration'],
    }
})
</script>

