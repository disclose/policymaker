<template>
    <div class="dio__input dio__input--text dio__focusable">
        <span class="dio__input-prefix">{{ prefix }}</span>
        <input
            ref="input"
            :type="type"
            class="input"
            @input="update"
            @blur="$emit('blur')"
            v-model="localValue"
            :placeholder="placeholder"
            :autocapitalize="autocapitalize ? 'on' : 'off'"
            :autocorrect="autocorrect ? 'on' : 'off'"
            :autocomplete="autocomplete ? 'on' : 'off'"
            :spellcheck="spellcheck"
            >
        <span v-if="required" 
            class="dio__input-required py-1 px-3 rounded-full text-xs"
            :class="{ 'dio__input-required--complete': isValid }">Required</span>
    </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue'
import _isEmpty from 'lodash/isEmpty'

export default Vue.extend({
    
    props: {
        value: {
            type: String
        },
        placeholder: {
            type: String
        },
        required: {
            type: Boolean,
            default: false
        },
        prefix: {
            type: String
        },
        isValid: {
            type: Boolean,
            default: () => false
        },
        type: {
            type: String,
            default: 'text'
        },
        autocapitalize: {
            type: Boolean,
            default: false
        },
        autocorrect: {
            type: Boolean,
            default: false
        },
        autocomplete: {
            type: Boolean,
            default: false
        },
        spellcheck: {
            type: Boolean,
            default: false
        },
        allowSpaces: {
            type: Boolean,
            default: true
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

            // Remove blacklisted characters
            if (!vm.allowSpaces) {
                vm.localValue = vm.localValue.replace(/ /g, '')
            }

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

    input {
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


.dio__input-required {
    @apply bg-red-100 text-red-600;

    &.dio__input-required--complete {
        @apply bg-green-100 text-green-600;
    }
}
</style>