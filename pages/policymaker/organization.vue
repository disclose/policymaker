<template>
    <div>
        <page-title>{{ $t('policymaker.organization_details.page_title') }}</page-title>

        <dio-field-group>
            <dio-field>
                <label>{{ $t('policymaker.organization_details.organization_name_label') }} </label>
                <p>This is the organization authorizing the policy, who is responsible for the assets that are in scope.</p>
                <input-text
                    :value="configuration.organizationName"
                    @input="updateOrganisationName"
                    :required="true"
                    :isValid="validOrganizationName"
                    placeholder="Organization name" />
                <!-- <small>* {{ $t('policymaker.organization_details.organization_name_required') }}</small> -->
            </dio-field>

            <dio-field>
                <label>Who/where are your disclosure points of contact? *</label>
                <p>Provide at least one email address or webform url for people to send vulnerability information 
                    to your organization. Combinations are welcome and supported, however we strongly recommend 
                    keeping the number of communication channels to a minimum to avoid confusion.</p>
                    <br>
                    <small>Note: Please begin email addresses with mailto:// or webforms with https:// or http://</small>
                <input-channels></input-channels>

            </dio-field>
        </dio-field-group>

        <footer>
            <dio-button route="/policymaker/settings" @click="goto(3)" :disabled="!isValid">Next</dio-button>
            <dio-button route="/policymaker" theme="muted" @click="goto(1)">Back</dio-button>
        </footer>

    </div>
</template>

<script lang="ts">
import Vue from 'vue'
import DioField from '~/components/input/DioField.vue'
import DioFieldGroup from '~/components/input/DioFieldGroup.vue'
import InputChannels from '~/components/input/InputChannels.vue'
import InputText from '~/components/input/InputText.vue'
import PageTitle from '~/components/PageTitle.vue'
import { store } from '~/store'

export default Vue.extend({
    components: { PageTitle, InputText, InputChannels, DioField, DioFieldGroup },
    layout: 'policymaker-v2',

    mounted() {
        const vm = this as any
    },

    computed: {
        configuration: () => store.getters['policymaker/getConfiguration'],
        validOrganizationName: () => store.getters['policymaker/validOrganizationName'],
        isValid() {
            return store.getters['policymaker/validOrganizationName'] && store.getters['policymaker/validChannels']
        }
    },

    methods: {
        updateOrganisationName(name: string): void {
            store.commit('policymaker/setOrganizationName', name)
        },
        goto: (step: number) => store.dispatch('policymaker/gotoStep', step)

    }
})
</script>
