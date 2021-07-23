<template>
    <div>
        <page-title>Organisation details</page-title>

        <div class="field">
            <label class="field__title">What is the name of your organization? *</label>
            <p class="field__description">The organization that this policy will apply to</p>
            <input-text v-model="organisationName"></input-text>
            <small class="field__subtext">* required</small>
        </div>

        <div class="field">
            <label class="field__title">Who/where are your disclosure points of contact? *</label>
            <div class="field__description">Please provide at least 1 (one) <u>email address</u> or <u>webform url</u> for people to send vulnerability information to your organization.</div>
            <input-contacts v-model="organisationContacts"></input-contacts>
        </div>
        <p></p>
    </div>
</template>

<script lang="ts">
import Vue from 'vue'
import InputContacts from '~/components/input/InputContacts.vue'
import InputText from '~/components/input/InputText.vue'
import PageTitle from '~/components/PageTitle.vue'

export default Vue.extend({
    components: { PageTitle, InputText, InputContacts },
    layout: 'policymaker-v2',

    data() {
        return {
            organisationName: '',
            organisationContacts: [{ type: 'url', address: '' }]
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