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
                    :autocorrect="false"
                    :autocapitalize="false"
                    :spellcheck="false"
                    placeholder="Organization name" />
                <!-- <small>* {{ $t('policymaker.organization_details.organization_name_required') }}</small> -->
            </dio-field>

            <dio-field>
                <label>Who/where are your disclosure points of contact? *</label>
                <p>Provide at least one email address or webform url for people to send vulnerability information
                    to your organization. Combinations are welcome and supported, however we strongly recommend
                    keeping the number of communication channels to a minimum to avoid confusion.</p>
                    <br>
                    <small>Note: Please begin email addresses with mailto: or webforms with https:// or http://</small>
                <input-channels></input-channels>

            </dio-field>
        </dio-field-group>

        <div class="dio__action-bar">
            <DioButton route="/policymaker/settings" @click="goto(3)" :disabled="!isValid">Next</DioButton>
            <DioButton route="/policymaker" theme="muted" @click="goto(1)">Back</DioButton>
        </div>

    </div>
</template>

<script lang="ts">
import Vue from 'vue'
import DioField from '~/components/DioField/DioField.vue'
import DioFieldGroup from '~/components/DioField/DioFieldGroup.vue'
import DioButton from '~/components/DioButton/DioButton.vue'
import InputChannels from '~/components/InputChannel/InputChannels.vue'
import InputText from '~/components/InputText/InputText.vue'
import PageTitle from '~/components/PageTitle/PageTitle.vue'
import { store } from '~/store'
import nav from '~/mixins/nav'

export default Vue.extend({
    components: { PageTitle, InputText, InputChannels, DioField, DioFieldGroup, DioButton },
    layout: 'policymaker',

    mixins: [nav],

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
        }

    }
})
</script>
