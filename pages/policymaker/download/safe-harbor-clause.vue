<template>
    <div>
        Safe Harbor Clause

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

        <dio-term-preview :content="safe_harbor" />
    </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { store } from '~/store'

export default Vue.extend({
    
    computed: {
        safe_harbor: () => (store.state as any).policymaker.templates.safe_harbor.text,
        language: () => store.getters['policymaker/getConfiguration'].language
    }
})
</script>

<style lang="postcss">

</style>