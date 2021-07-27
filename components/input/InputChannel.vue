<template>
    <div class="dio__input-channel">
        <span class="dio__input-prefix">{{ prefix }}</span>
        <input-text 
            v-model="localValue.address"
            ref="inputText"
            @input="update"
            placeholder="Email address or URL" />
        <dio-button 
            size="small" 
            @click="openUrl(localValue.address)"
            theme="transparent">
            Check
        </dio-button>
        <dio-button class="dio__input-channel-remove dio__focusable" 
            theme="muted"
            size="small" 
            @click="removeSelf" 
            v-if="showRemove">
            Remove
        </dio-button>
    </div>
</template>

<script lang="ts">
import Vue from 'vue'
import _isEmpty from 'lodash/isEmpty'
import _cloneDeep from 'lodash/cloneDeep'
import DioButton from '../DioButton.vue'
import InputText from './InputText.vue'

export default Vue.extend({
  components: { DioButton, InputText },
    
    props: {
        value: {
            type: [Object, String],
            default: () => {
                return {
                    type: '',
                    address: ''
                }
            }
        },
        index: {
            type: Number
        }
    },

    data() {
        return {
            localValue: {
                type: '',
                address: ''
            }
        }
    },

    mounted() {
        const vm = this as any
        Vue.set(vm, 'localValue', _cloneDeep(vm.value))
    },

    computed: {
        hasValue(): boolean {
            const vm = this as any
            return !_isEmpty(vm.localValue)
        },

        isEmail(): boolean {
            const vm = this as any
            return (vm.localValue && vm.localValue.address.indexOf("@") > 0)
        },

        prefix(): string {
            const vm = this as any
            
            if (vm.isEmail) {
                return "mailto:"
            } else {
                return "https://"
            }
        },
        channelType(): string {
            const vm = this as any
            return (vm.isEmail) ? 'email' : 'url';
        },
        showRemove(): boolean {
            const vm = this as any
            return vm.index !== 0
        }
    },

    methods: {
        update(): void {
            const vm = this as any
            vm.localValue.type = vm.channelType
            vm.$emit('input', vm.localValue)
        },

        removeSelf(): void {
            const vm = this as any
            vm.$emit('remove', vm.index)
        },
        focus(): void {
            const vm = this as any
            vm.$refs.inputText.focus()
        },
        openUrl(url: string): void {
            const vm = this as any
            window.open(`${vm.prefix}${url}`, "_blank")
        }
    },

    watch: {
        'value.address': {
            handler: function(newValue) {
                const vm = this as any
                vm.localValue.address = newValue
            },
            deep: true
        }
    }

})
</script>

<style lang="postcss">

.dio__input-channel {
    @apply flex flex-row items-center gap-2;
}

.dio__input-prefix {
    @apply flex items-center justify-center;
    color: var(--shade-600);
}
.dio__input-channel-remove {
    @apply ml-2;
}

</style>