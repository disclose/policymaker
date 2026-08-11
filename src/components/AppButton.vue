<script setup lang="ts">
withDefaults(
  defineProps<{
    disabled?: boolean
    size?: 'normal' | 'small'
    theme?: 'muted' | 'solid' | 'transparent'
    type?: 'button' | 'submit'
  }>(),
  {
    disabled: false,
    size: 'normal',
    theme: 'solid',
    type: 'button',
  },
)
</script>

<template>
  <button
    :class="['button', `button--${theme}`, `button--${size}`]"
    :disabled="disabled"
    :type="type"
  >
    <slot />
  </button>
</template>
