<template>

    <div class="field">
        <div class="label-container">
            <label>{{ options.label }}</label>
            <div class="required" :class="{ ok: hasValue}" v-if="options.required">Required</div>
            <!-- <div class="ok" v-if="options.required && hasValue">OK</div> -->
        </div>
        <input
            v-model="localValue" 
            :placeholder="options.placeholder"
            autocomplete="false"
            tabindex="0"
            type="text">
    </div>
</template>

<script lang="ts">
import Vue from 'vue'
import _isEmpty from 'lodash/isEmpty'

export default Vue.extend({
    name: "FieldText",

    props: {
        options: {
            type: Object
        },
        value: {
            type: String,
            default: ""
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
        },
        value: function(newValue) {
            const vm = this as any
            vm.localValue = newValue
        }
    }
})
</script>

<style lang="postcss">

    .field {
        @apply border border-gray-300 relative rounded-sm p-1 flex-grow max-w-full;
        @apply focus-within:border-purple-800 focus-within:text-purple-800;
        @apply transition-all duration-500;
        min-width: 300px;
        @apply sm:max-w-full;

        .label-container {
            @apply -mt-3 absolute px-1 tracking-wide text-xs w-full;
            @apply flex flex-row;
        }

        .required {
            @apply rounded pl-1.5 pr-1.5 text-xs text-white bg-red-500;
            font-size: 10px;
        }

        .ok {
            @apply rounded pl-1.5 pr-1.5 text-xs text-white bg-green-500;
            font-size: 10px;
        }

        label {
            @apply bg-white focus:text-purple-800 text-black px-1 text-xs font-bold;
        }

        input, select {
            @apply text-sm p-1.5 mt-2 outline-none bg-gray-50 border-gray-200 block w-full appearance-none;
        }
    }

</style>