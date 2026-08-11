<script setup lang="ts">
import { computed, ref } from 'vue'

const props = withDefaults(
  defineProps<{
    allowSpaces?: boolean
    ariaDescribedby?: string
    ariaLabelledby?: string
    autocomplete?: string
    id?: string
    error?: string
    modelValue: string
    placeholder?: string
    prefix?: string
    required?: boolean
    valid?: boolean
    type?: string
  }>(),
  {
    allowSpaces: true,
    ariaDescribedby: undefined,
    ariaLabelledby: undefined,
    autocomplete: 'off',
    id: undefined,
    error: '',
    placeholder: '',
    prefix: '',
    required: false,
    valid: false,
    type: 'text',
  },
)

const emit = defineEmits<{
  blur: []
  'update:modelValue': [value: string]
}>()
const control = ref<HTMLInputElement>()
const errorId = computed(() => props.id ? `${props.id}-error` : undefined)
const describedBy = computed(() =>
  [props.ariaDescribedby, props.error ? errorId.value : undefined].filter(Boolean).join(' ') || undefined,
)

function update(event: Event): void {
  const input = event.target as HTMLInputElement
  const value = props.allowSpaces ? input.value : input.value.replace(/\s/g, '')
  if (value !== input.value) input.value = value
  emit('update:modelValue', value)
}

function focus(): void {
  control.value?.focus()
}

defineExpose({ focus })
</script>

<template>
  <div class="text-input-group">
    <div :class="['text-input', 'focusable', { 'text-input--error': error }]">
      <span v-if="prefix" class="text-input__prefix">{{ prefix }}</span>
      <input
        ref="control"
        class="text-input__control"
        :aria-describedby="describedBy"
        :aria-invalid="error ? 'true' : undefined"
        :aria-labelledby="ariaLabelledby"
        :autocomplete="autocomplete"
        :id="id"
        autocapitalize="off"
        autocorrect="off"
        :placeholder="placeholder"
        :required="required"
        :spellcheck="false"
        :type="type"
        :value="modelValue"
        @blur="emit('blur')"
        @input="update"
      />
      <span
        v-if="required"
        :class="['required-pill', { 'required-pill--complete': valid }]"
      >
        {{ valid ? 'Complete' : 'Required' }}
      </span>
    </div>
    <p v-if="error" :id="errorId" class="field-error" role="alert">{{ error }}</p>
  </div>
</template>
