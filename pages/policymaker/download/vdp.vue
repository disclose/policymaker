<template>
    <div>
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
    </div>
</template>

<script lang="ts">
import Vue from 'vue'
import DioButton from '~/components/DioButton.vue'
export default Vue.extend({
  components: { DioButton },
    
    data() {
        return {
            language: 'en'
        }
    }
})
</script>

<style lang="postcss">

</style>