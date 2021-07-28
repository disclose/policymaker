<template>
    <div>
        <h3>Vulnerability Disclosure Policy</h3>

        <label><input type="checkbox" v-model="isFullVDP"> Full VDP</label>

        <dio-term-preview 
            :content="content"
            :filename="downloadFilename"
        />


    </div>
</template>

<script lang="ts">
import Vue from 'vue'
import DioButton from '~/components/DioButton.vue'
import { store } from '~/store'

export default Vue.extend({
  components: { DioButton },
    
    data() {
        return {
            isFullVDP: true
        }
    },

    computed: {
        content() {
            const vm = this as any
            if (vm.configuration.cvdTimelineDays > 0) {
                return (vm.isFullVDP) ? vm.vdpCVD : vm.safeHarbor
            } else {
                return (vm.isFullVDP) ? vm.vdp : vm.safeHarbor
            }
        },
        downloadFilename() {
            const vm = this as any
            return (vm.isFullVDP) ? 'disclose-io-vdp' : 'disclose-io-safe-harbor'
        },
        vdp: () => store.getters['policymaker/getTermsVDP'],
        vdpCVD: () => store.getters['policymaker/getTermsVDPCVD'],
        safeHarbor: () => store.getters['policymaker/getTermsSafeHarbor'],
        configuration: () => store.getters['policymaker/getConfiguration']
    }
})
</script>

<style lang="postcss">
    .dio__policy-preview {

    }
</style>