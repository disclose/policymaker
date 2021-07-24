<template>
    <div class="dio__input dio__input--text dio__focusable">
        <input ref="input" type="text" class="input" @input="update" v-model="localValue" :placeholder="placeholder">
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
        update(): void {
            const vm = this as any
            vm.$emit('input', vm.localValue)
        },

        focus(): void {
            const vm = this as any
            vm.$refs.input.focus()
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
    -moz-outline-style: none;
    
    &:focus-within, &:focus {
        box-shadow: 0 0 0 2px var(--purple);
        -moz-outline-style: none;
    }

}

input {
    outline: none;
}

::-moz-focus-inner, :active, :focus {
    outline:none;
    -moz-outline-style: none;
}

</style>