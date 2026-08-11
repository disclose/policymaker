<script setup lang="ts">
import { nextTick, ref } from 'vue'

import { usePolicymaker } from '@/state/policymaker'

import AppButton from './AppButton.vue'
import ChannelInput from './ChannelInput.vue'

withDefaults(defineProps<{ labelledby?: string }>(), { labelledby: 'disclosure-channels-label' })

const { addChannel, configuration, removeChannel, updateChannel } = usePolicymaker()
const inputs = ref<InstanceType<typeof ChannelInput>[]>([])

async function add(): Promise<void> {
  addChannel()
  await nextTick()
  inputs.value.at(-1)?.focus()
}
</script>

<template>
  <div class="channel-list" role="group" :aria-labelledby="labelledby">
    <div class="channel-list__items">
      <div v-for="(channel, index) in configuration.channels" :key="index">
        <label
          :id="`disclosure-channel-${index + 1}-label`"
          class="sr-only"
          :for="`disclosure-channel-${index + 1}`"
        >Disclosure channel {{ index + 1 }}</label>
        <ChannelInput
          ref="inputs"
          :id="`disclosure-channel-${index + 1}`"
          :index="index"
          :labelledby="`${labelledby} disclosure-channel-${index + 1}-label`"
          :model-value="channel"
          @remove="removeChannel(index)"
          @update:model-value="updateChannel(index, $event)"
        />
      </div>
    </div>
    <AppButton size="small" theme="transparent" @click="add">Add another</AppButton>
  </div>
</template>
