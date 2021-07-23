<template>

    <div class="field">
        <div class="label-container">
            <label>{{ options.label }}</label>
            <div class="required" :class="{ ok: hasValue}" v-if="options.required">Required</div>

        </div>
        <select required v-model="localValue">
            <option value="" disabled selected hidden>{{ options.placeholder }}</option>
            <option v-for="option in options.options" :key="option.value">{{option.label}}</option>
        </select>
    </div>
</template>

<script lang="ts">
import Vue from 'vue'
import _isEmpty from 'lodash/isEmpty'

export default Vue.extend({
    name: "FieldDropdown",

    props: {
        options: {
            type: Object
        }
    },

    data() {
        return {
            localValue: ""
        }
    },

    mounted() {
        const vm = this as any;

        vm.localValue = vm.options.value
    },

    computed: {
        hasValue(): boolean {
            const vm = this as any
            return !_isEmpty(vm.localValue)
        }
    },

    methods: {
    },
    
    watch: {
        localValue: function(newValue, oldValue) {
            const vm = this as any
            vm.$emit('input', vm.localValue)
        }
    }
})
</script>