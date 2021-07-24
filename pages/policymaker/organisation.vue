<template>
    <div>
        <page-title>Organisation details</page-title>

        <div class="field">
            <label class="field__title">What is the name of your organization? *</label>
            <p class="field__description">The organization that this policy will apply to</p>
            <input-text :value="configuration.organisationName" @input="updateOrganisationName"></input-text>
            <small class="field__subtext">* required</small>
        </div>

        <div class="field">
            <label class="field__title">Who/where are your disclosure points of contact? *</label>
            <div class="field__description">Please provide at least 1 (one) <u>email address</u> or <u>webform url</u> for people to send vulnerability information to your organization.</div>
            <input-channels></input-channels>
        </div>

        <footer>
            <dio-link route="/policymaker/settings">Next</dio-link>
            <dio-link route="/policymaker" theme="muted">Back</dio-link>
        </footer>

    </div>
</template>

<script lang="ts">
import Vue from 'vue'
import InputChannels from '~/components/input/InputChannels.vue'
import InputText from '~/components/input/InputText.vue'
import PageTitle from '~/components/PageTitle.vue'
import { policymaker } from '~/store'

export default Vue.extend({
    components: { PageTitle, InputText, InputChannels },
    layout: 'policymaker-v2',

    mounted() {
        const vm = this as any
    },

    computed: {
        configuration() {
            return policymaker.configuration
        }
    },

    methods: {
        updateOrganisationName(name: string): void {
            policymaker.setOrganisationName(name)
        }
    }
})
</script>

<style lang="postcss">
    .field {
        @apply mt-12 mb-12;
    }

    .field__title {
        font-family: 'Noto Sans Display';
    }

    .field__description {
        @apply text-sm;
    }
</style>