<template>
    <div class="dio__field-group">
        <slot></slot>
    </div>
</template>

<style lang="postcss">
    .dio__field-group {
        > .dio__field {
            @apply my-16;
        }
    }
</style>