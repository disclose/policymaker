<template>
    <div>
        <h3>Vulnerability Disclosure Policy</h3>

        <div class="flex flex-row justify-between items-center">
            <div class="flex flex-row items-center gap-x-2">
                <input-dropdown :options="[]" v-model="language">
                    <template v-slot:selectedValue="{ value }">
                        {{ $t(`language.${value}`) }}
                    </template>
                    <template v-slot:option="{ option }">
                        {{ $t(`language.${option}`) }}
                    </template>
                </input-dropdown>
            </div>
            
            <div>
                <dio-button theme="transparent" @click="downloadPolicy(renderedPolicy, 'text/markdown')">Save as markdown</dio-button>
                <dio-button theme="transparent" @click="downloadPolicy($md.render(renderedPolicy), 'text/html')">Save as HTML</dio-button>
            </div>
        </div>

        <dio-term-preview :content="vdp" />


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
        }
    },

    computed: {
        vdp: () => (store.state as any).policymaker.templates.vdp.text,
        language: () => store.getters['policymaker/getConfiguration'].language
    }
})
</script>

<style lang="postcss">
    .dio__policy-preview {

    }
</style>