<template>
    <div class="dio__term-preview">
        <div class="dio__term-content" v-html="$md.render(content)">

        </div>
    </div>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
    
    props: {
        content: {
            type: String
        }
    }

})
</script>

<style lang="postcss">
    .dio__term-preview {
        @apply p-7 border border-gray-400 rounded-sm shadow-md mb-10 select-none;
        @apply bg-white;

        h1 {
            @apply text-2xl font-bold;

            &:not(:first-child) {
                @apply  pt-6;
            }
        }

        h2 {
            @apply text-xl font-bold pt-5;
        }

        h3 {
            @apply text-lg font-bold pt-4;
        }

        a {
            @apply text-blue-600 underline;
        }

        p {
            @apply pb-4;
        }

        ul {
            @apply list-disc list-outside pl-6 pb-4;
        }

        li {
            @apply pb-1;
        }

    }

</style>