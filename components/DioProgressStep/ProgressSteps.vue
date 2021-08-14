<template>
    <div class="dio__steps" :class="{ [`dio__steps--${orientation}`]: true }">
        <div class="dio__stem" :style="stemStyle"></div>
        <div class="dio__stem--progress" :style="progressStyle"></div>
        <div ref="steps">
            <progress-step 
                v-for="(step, index) in steps"
                :key="index"
                :index="index+1"
                :active="false"
                :completed="isStepCompleted(index)"
                :size="40"
                :disabled="isStepDisabled(index + 1)"
                @changeStep="setActiveStep"
                :route="step.route">{{ step.name }}</Progress-Step>
        </div>
    </div>    
</template>

<script lang="ts">
import Vue from 'vue'
import { store } from '~/store'
import ProgressStep from './ProgressStep.vue'

export default Vue.extend({
  components: { ProgressStep },
    name: "ProgressSteps",
    
    props: {
        orientation: {
            type: String,
            default: 'vertical'
        },
        anchorSize: {
            type: Number,
            default: 40
        },
        steps: {
            type: Array
        }
    },

    computed: {
        activeStep: () => store.getters['policymaker/getCurrentStep'],
            
        isVertical(): boolean {
            const vm = this as any
            return (vm.orientation.toLowerCase().trim() === 'vertical')
        },

        stemStyle() {
            const vm = this as any
            return {
                marginLeft: `${(vm.anchorSize/2) - 1}px`
            }
        },
        numSteps() {
            const vm = this as any
            return vm.steps.length
        },
        progressStyle() {
            const vm = this as any
            
            return {
                height: `${((vm.activeStep - 1)/(vm.numSteps - 1)) * 100}%`,
                marginLeft: `${(vm.anchorSize/2) - 1}px`
            }
        }
    },

    methods: {
        setActiveStep(step: number) {
            const vm = this as any
            if (vm.step !== vm.activeStep) {
                store.commit('policymaker/setStep', step)
            }
        },

        isStepDisabled(index: number): boolean {
            const vm = this as any
            return (index) >= vm.activeStep
        },

        isStepCompleted(index: number): boolean {
            const vm = this as any
            return index < vm.activeStep
        }
    }
})
</script>

<style lang="postcss">
    .dio__steps {
        @apply block;
    }

    .dio__steps--vertical {
        @apply relative;

        .dio__stem {
            @apply block absolute;
            @apply border-l-2 border-solid inset-y-0 w-2 z-0;
            border-color: var(--shade-200);

            &--progress {
                @apply block absolute;
                @apply border-l-2 z-10 w-2;
                @apply transition-all duration-300 ease-in-out;
                border-color: var(--purple);
            }
        }
    }
</style>