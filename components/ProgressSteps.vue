<template>
    <div class="dio__steps" :class="{ [`dio__steps--${orientation}`]: true }">
        <div class="dio__stem" :style="stemStyle"></div>
        <div class="dio__stem--progress" :style="progressStyle"></div>
        <div ref="steps">
            <Progress-Step 
                v-for="(step, index) in steps"
                :key="index"
                :index="index+1"
                :active="false"
                :completed="isStepCompleted(index)"
                :size="40"
                @changeStep="setActiveStep"
                :route="step.route">{{ step.name }}</Progress-Step>
        </div>
    </div>    
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
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

    data() {
        return {
            activeStep: 0
        }
    },

    mounted() {
        const vm = this as any
    },

    computed: {
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
            vm.activeStep = step
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