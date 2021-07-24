<template>
    <div>
        <page-title>Policy settings</page-title>

        <div class="field">
            <label class="field__title">Coordinated Vulnerability Disclosure Timeline</label>
            <p class="field__description">Vulnerability finders often wish to publish their reports after the issue has been fixed, and some will provide their own timeline when reporting security issues. We strongly recommend that you take a proactive approach to setting your own timeline, and to make this clear within your VDP. If you’re not currently able to do this, you may optionally opt-out of setting a timeline.</p>
        </div>

        <div class="field">
            <label class="field__title">Where do you intend to host this policy? *</label>
            <p class="field__description">Enter the web address where people can find this policy on your website.</p>
            <input-channel :index="0"></input-channel>
            <small>* required for security.txt / DNS security.txt</small>
        </div>

        <div class="field">
            <label class="field__title">Would you like to generate security.txt and/or dnssecuritytxt records?</label>
            <p class="field__description">Security.txt and DNS security.txt form the foundations for informing people.</p>
            
            <small>* required for security.txt / DNS security.txt</small>
        </div>

        <footer>
            <dio-link route="/policymaker/download">Next</dio-link>
            <dio-link route="/policymaker/organisation" theme="muted">Back</dio-link>
        </footer>

    </div>
</template>

<script lang="ts">
import Vue from 'vue'
import PageTitle from '~/components/PageTitle.vue'
import { policymaker } from '@/store'
import InputChannel from '~/components/input/InputChannel.vue'

export default Vue.extend({
    components: { PageTitle, InputChannel },
    layout: 'policymaker-v2',
})
</script>

<style lang="postcss">

</style>