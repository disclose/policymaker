<template>
  <div class="relative inline-block text-left dropdown z-10">
    <!-- <span class="rounded-md shadow-sm"> -->
        <div @click="isOpen = !isOpen" class="trigger" type="button" aria-haspopup="true" aria-expanded="true" aria-controls="headlessui-menu-items-117">
            <slot v-if="hasValue" name="selectedValue" :value="localValue"></slot>
            <span v-if="!hasValue">{{ localPlaceholder }}</span>
            <svg class="w-5 h-5 ml-2 -mr-1" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd"></path></svg>
        </div>
    <!-- </span> -->
    <div :class="{ 'open': isOpen }" class="opacity-0 invisible dropdown-menu">
      <div class="dropdown-options" role="menu" aria-labelledby="headlessui-menu-button-1" id="headlessui-menu-items-117">
        <div class="dropdown-option px-4 py-3" v-for="option in options" :key="option" @click="select(option)">  
          <slot name="option" :option="option"></slot>
        </div>
      </div>
    </div>
  </div>

</template>

<script lang="ts">
import Vue from 'vue'

import { ChevronDownIcon } from '@vue-hero-icons/outline'
import _isEmpty from 'lodash/isEmpty'

export default Vue.extend({
    components: { ChevronDownIcon },

    props: {
        options: {
            type: Array
        },
        value: {
            type: String
        },
        align: {
            type: String
        },
        placeholder: {
            type: String
        }
    },

    data() {
        return {
            localPlaceholder: "",
            isOpen: false,
            localValue: null
        }
    },

    mounted() {
        const vm = this as any

        vm.localValue = vm.value
        vm.localPlaceholder = vm.placeholder
    },

    computed: {
        hasValue(): boolean {
            const vm = this as any
            return !_isEmpty(vm.localValue)
        }
    },

    methods: {
        select(value: any) {
            const vm = this as any
            vm.localValue = value

            vm.$emit('input', value)

            vm.isOpen = false
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

.dropdown {
    .trigger {
        @apply inline-flex justify-center w-full px-4 py-2 text-sm font-medium leading-5 text-gray-700 border border-gray-300 rounded-full;
        @apply hover:text-gray-500 focus:outline-none focus:border-purple-800;
        @apply transition duration-150 ease-in-out cursor-pointer;

        &:hover {
            @apply ring-0 ring-purple-800;
        }

    }
}
.dropdown-menu {
    @apply transition-all duration-300 transform origin-top-left -translate-y-2 scale-95;

    &.open {
        opacity:1;
        transform: translate(0) scale(1);
        visibility: visible;
    }

    .dropdown-options {
        @apply z-10 absolute left-0 w-56 mt-2 origin-top-left bg-white border border-gray-200 divide-y divide-gray-100 rounded-md shadow-lg outline-none;
    }

    .dropdown-option {
        @apply select-none cursor-pointer;
    }
}

</style>