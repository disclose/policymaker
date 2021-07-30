<template>
    <div>
        <page-title>{{ $t('policymaker.organization_details.page_title') }}</page-title>

        <dio-field>
            <label>{{ $t('policymaker.organization_details.organization_name_label') }} *</label>
            <p>{{ $t('policymaker.organization_details.organization_name_desc') }}</p>
            <input-text
                :value="configuration.organizationName"
                @input="updateOrganisationName" />
            <small>* {{ $t('policymaker.organization_details.organization_name_required') }}</small>
        </dio-field>

        <dio-field>
            <label>Who/where are your disclosure points of contact? *</label>
            <p>Please provide at least 1 (one) <u>email address</u> or <u>webform url</u> for 
            people to send vulnerability information to your organization.</p>
            <input-channels></input-channels>
        </dio-field>

        <footer>
            <dio-button route="/policymaker/settings" @click="goto(3)">Next</dio-button>
            <dio-button route="/policymaker" theme="muted" @click="goto(1)">Back</dio-button>
        </footer>

    </div>
</template>

<script lang="ts">
import Vue from 'vue'
import DioField from '~/components/input/DioField.vue'
import InputChannels from '~/components/input/InputChannels.vue'
import InputText from '~/components/input/InputText.vue'
import PageTitle from '~/components/PageTitle.vue'
import { store } from '~/store'

export default Vue.extend({
    components: { PageTitle, InputText, InputChannels, DioField },
    layout: 'policymaker-v2',

    mounted() {
        const vm = this as any
    },

    computed: {
        configuration: () => store.getters['policymaker/getConfiguration']

    },

    methods: {
        updateOrganisationName(name: string): void {
            store.commit('policymaker/setOrganisationName', name)
        },
        goto: (step: number) => store.dispatch('policymaker/gotoStep', step)

    }
})
</script>
