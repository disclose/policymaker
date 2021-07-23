<template>
    <div class="dio__input-channels">
        <div class="dio__input-channel-list">
            <input-channel 
                v-for="(channel, index) in channels"
                :key="index"
                :index="index"
                :value="channel"
                :ref="`channel${index}`"
                @input="updateChannel($event, index)"
                @remove="removeChannel">
            </input-channel>
        </div>
        <dio-button @click="addChannel" theme="transparent">Add another</dio-button>
    </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { mapState } from 'vuex'
import DioButton from '../DioButton.vue'
import InputChannel from './InputChannel.vue'
import _cloneDeep from 'lodash/cloneDeep'
import { policymaker } from '~/store'

export default Vue.extend({
    components: { InputChannel, DioButton },
    
    props: {
        value: {
            type: Array
        }
    },

    data() {
        return {
        }
    },

    mounted() {
    },

    computed: {
        ...mapState('policymaker', ['policyConfiguration']),
        channels() {
            return policymaker.configuration.channels
        }
    },

    methods: {
        addChannel(): void {
            const vm = this as any
            policymaker.addChannel()

            Vue.nextTick(() => {
                vm.$refs[`channel${vm.channels.length-1}`][0].focus()
            })
        },
        removeChannel(index: number): void {
            policymaker.removeChannel(index)
        },
        updateChannel($event: any, index: number): void {
            const vm = this as any
            policymaker.updateChannel({ value: $event, index })
        },
        emit(): void {
            const vm = this as any
            vm.$emit('input', vm.channels)
        }
    }
})
</script>

<style lang="postcss">
    .dio__input-channel-list {
        & > div {
            @apply mb-2;
        }
    }
</style>