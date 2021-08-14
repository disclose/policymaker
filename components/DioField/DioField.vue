<template>
    <div class="dio__field">
        <slot></slot>
    </div>    
</template>

<style lang="postcss">
    .dio__field {
        @apply mt-6 mb-6;

        label {
            @apply block mb-1 text-base lg:text-xl;
            font-family: 'Noto Sans Display';
        }
        p {
            @apply mb-2;
            @apply text-sm lg:text-base;
        }
        
        .dio__field-input {
            @apply mt-4;
        }
        
        small {
            @apply mt-2;
        }
    }
</style>