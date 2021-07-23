<template>
    <div class="dio__input dio__input--text dio__focusable">
        <input type="text" class="input" @input="update" v-model="localValue" :placeholder="placeholder">
    </div>
</template>

<script lang="ts">
import Vue from 'vue'
import _isEmpty from 'lodash/isEmpty'

export default Vue.extend({
    
    props: {
        value: {
            type: String
        },
        placeholder: {
            type: String
        }
    },

    data() {
        return {
            localValue: null
        }
    },

    mounted() {
        const vm = this as any

        vm.localValue = vm.value
    },

    computed: {
        hasValue(): boolean {
            const vm = this as any
            return !_isEmpty(vm.localValue)
        }
    },

    methods: {
        update() {
            const vm = this as any
            vm.$emit('input', vm.localValue)
        }
    },

    watch: {
        value: function(newValue) {
            const vm = this as any
            vm.localValue = newValue
        }
    }

})
</script>

<style lang="postcss">

.dio__input {
    @apply bg-white border border-solid rounded-sm max-w-md;
    @apply flex flex-1 justify-items-stretch p-2;
    border-color: var(--shade-300);

    input[type='text'] {
        @apply bg-transparent flex-grow;
        @apply text-base;
    }

}

.dio__focusable {
    &:focus-within {
        box-shadow: 0 0 0 2px var(--purple);

    }
}

input {
    outline: none;
}


</style>