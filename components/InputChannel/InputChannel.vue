<template>
    <div class="dio__input-channel">
        <input-text 
            v-model="localValue.address"
            ref="inputText"
            :type="channelType"
            @input="update"
            :placeholder="placeholder" 
            :required="index == 0"
            :isValid="isValid"
            @blur="cleanInput"
            :prefix="localValue.prefix"
            :autocapitalize="false"
            :autocorrect="false"
            :spellcheck="false"
            :autocomplete="false"
            :allowSpaces="false"
            />

        <svg class="dio__input-channel-preview dio__channel-icon" v-if="hasValue" @click="openUrl(localValue.address)" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path v-if="isEmail" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
            <path v-if="isWebsite" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
        </svg>

        <svg class="dio__input-channel-remove"
            @click="removeSelf" 
            v-if="showRemove"
            xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
    </div>
</template>

<script lang="ts">
import Vue from 'vue'
import _isEmpty from 'lodash/isEmpty'
import _cloneDeep from 'lodash/cloneDeep'
import _startsWith from 'lodash/startsWith'
import DioButton from '../DioButton/DioButton.vue'
import InputText from '../InputText/InputText.vue'

const DEFAULT_URLPREFIX = 'https://'
const DEFAULT_EMAILPREFIX = 'mailto:'

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
        },

    },

    data() {
        return {
            localValue: {
                type: '',
                prefix: '',
                address: ''
            },
        }
    },

    mounted() {
        const vm = this as any
        Vue.set(vm, 'localValue', _cloneDeep(vm.value))
    },

    computed: {
        hasValue(): boolean {
            const vm = this as any
            return !_isEmpty(vm.localValue.address)
        },

        isValid(): boolean {
            const vm = this as any
            const isValid = vm.hasValue && (vm.isEmail || vm.isWebsite);
            vm.$emit('valid', isValid)
            return isValid
            

        },

        isEmail(): boolean {
            const vm = this as any
            const atIndex = vm.localValue.address.indexOf("@")
            const lastDotIndex = vm.localValue.address.lastIndexOf(".")
            let isEmail = (vm.localValue && atIndex > 0)
            isEmail = isEmail && lastDotIndex > atIndex
            return isEmail
        },

        placeholder(): string {
            const vm = this as any

            if (vm.localValue.prefix == DEFAULT_EMAILPREFIX) {
                return "Email address"
            }

            if (_startsWith(vm.localValue.prefix, "http")) {
                return "website.com/contact-us"
            }

            return "Email address or webform url"
        },

        isUrl(): boolean {
            const vm = this as any
            
            if (vm.localValue.address.match(/^https?:\/\//gim)) {
                return true
            } else if (vm.localValue.address.match(/\//gim)) {
                return true
            } else {
                return false
            }
        },

        isWebsite(): boolean {
            const vm = this as any
            
            if (vm.localValue.prefix.match(/^https?:\/\//gim)) {
                return true
            } else {
                return false
            }
        },

        prefix(): string {
            const vm = this as any
            
            if (vm.isEmail) {
                if (vm.localValue.address.match(/^mailto:/gim)) {
                    const match = vm.localValue.address.match(/(mailto:)/gim)
                    return (match) ? DEFAULT_EMAILPREFIX : ""
                } else {
                    return DEFAULT_EMAILPREFIX
                }
            }
            if (vm.isUrl) {
                if (vm.isWebsite || vm.localValue.address.match(/^https?:\/?\/?/gim)) {
                    const match = vm.localValue.address.match(/(https?:\/\/.)/gim)
                    return (match) ? match[0].substring(0, match[0].length - 1) : ""
                } else {
                    return DEFAULT_URLPREFIX
                }
            }
            return ""
        },
        channelType(): string {
            const vm = this as any
            if (vm.isEmail) {
                return 'email'
            }
            if (vm.isWebsite) {
                return 'url'
            }
            return 'text'
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
            window.open(`${vm.localValue.prefix}${url}`, "_blank")
        },
        cleanInput(): void {
            const vm = this as any
            if (vm.isEmail) {
                vm.localValue.address = vm.localValue.address.replace(/mailto:/gim, '')
            }

            if (vm.isUrl) {
                // vm.localValue.address = vm.localValue.address.replace("https://", "")
                vm.localValue.address = vm.localValue.address.replace(/^https?:\/\//gim, '')
            }
        }
    },

    watch: {
        'value.address': {
            handler: function(newValue) {
                const vm = this as any
                
            },
            deep: true
        },
        'prefix': function(newValue){
            const vm = this as any
            if (!_isEmpty(newValue)) {
                vm.localValue.prefix = newValue
                vm.cleanInput()
            }
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
    @apply h-5 w-5 cursor-pointer stroke-current text-red-600;
}
.dio__channel-icon {
    @apply h-5 w-5 stroke-current text-purple-600 cursor-pointer;
}

</style>
