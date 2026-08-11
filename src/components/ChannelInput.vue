<script setup lang="ts">
import { computed, ref } from 'vue'

import {
  disclosureChannelError,
  hostChannelError,
  isValidDisclosureChannel,
  isValidHostChannel,
  normalizeChannelInput,
} from '@/domain/channels'
import type { Channel } from '@/domain/types'

import TextInput from './TextInput.vue'

const props = withDefaults(
  defineProps<{
    host?: boolean
    id?: string
    index?: number
    labelledby?: string
    modelValue: Channel
  }>(),
  {
    host: false,
    id: undefined,
    index: 0,
    labelledby: undefined,
  },
)

const emit = defineEmits<{
  remove: []
  'update:modelValue': [value: Channel]
}>()
const input = ref<InstanceType<typeof TextInput>>()
const touched = ref(false)

const valid = computed(() =>
  props.host ? isValidHostChannel(props.modelValue) : isValidDisclosureChannel(props.modelValue),
)
const placeholder = computed(() => {
  if (props.modelValue.prefix === 'mailto:') return 'Email address'
  if (props.modelValue.prefix.startsWith('http')) return 'website.com/contact-us'
  return 'Email address or webform url'
})
const error = computed(() => {
  if (valid.value || (!touched.value && !props.modelValue.address.trim())) return ''
  return props.host ? hostChannelError(props.modelValue) : disclosureChannelError(props.modelValue)
})

function update(value: string): void {
  const previousPrefix = props.modelValue.prefix.toLowerCase() === 'http://'
    ? ''
    : props.modelValue.prefix
  emit('update:modelValue', normalizeChannelInput(value, previousPrefix))
}

function openChannel(): void {
  window.open(`${props.modelValue.prefix}${props.modelValue.address}`, '_blank', 'noopener,noreferrer')
}

function focus(): void {
  input.value?.focus()
}

defineExpose({ focus })
</script>

<template>
  <div class="channel-input">
    <TextInput
      ref="input"
      :allow-spaces="false"
      :aria-labelledby="labelledby"
      :error="error"
      :id="id"
      :model-value="modelValue.address"
      :placeholder="placeholder"
      :prefix="modelValue.prefix"
      required
      :type="modelValue.type || 'text'"
      :valid="valid"
      @blur="touched = true"
      @update:model-value="update"
    />
    <button
      v-if="modelValue.address && valid"
      class="channel-input__icon"
      :aria-label="modelValue.type === 'email' ? 'Open email address' : 'Open website'"
      type="button"
      @click="openChannel"
    >
      {{ modelValue.type === 'email' ? '@' : '↗' }}
    </button>
    <button
      v-if="index > 0"
      class="channel-input__remove"
      aria-label="Remove disclosure channel"
      type="button"
      @click="emit('remove')"
    >
      ×
    </button>
  </div>
</template>
