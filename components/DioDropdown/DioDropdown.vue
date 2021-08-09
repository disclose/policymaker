<template>
    <div class="dio__input dio__focusable dio__dropdown">
        <select required v-model="localValue" @change="emit">
            <option value="" disabled selected hidden>{{ options.placeholder }}</option>
            <option v-for="option in options" :value="option.value" :key="option.value">{{option.label}}</option>
        </select>
    </div>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({

    props: {
        value: {
            type: [String, Number]
        },
        options: {
            type: [Array, Object],
            required: true
        },
        placeholder: { 
            type: String
        }
    },

    data() {
        return {
            localValue: '',
            localOptions: []
        }
    },

    mounted() {
        const vm = this as any
        vm.localValue = vm.value
    },

    methods: {
        emit(): void {
            const vm = this as any
            vm.$emit('input', vm.localValue)
        }
    }
    
})
</script>

<style lang="postcss">
    .dio__dropdown {
        @apply flex flex-row items-center justify-start justify-items-stretch;

        select {
            @apply flex-grow;

            &:focus {
                outline: none;
            }
        }
    }
</style>