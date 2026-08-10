<template>
    <article class="policymaker-landing">
        <header class="landing-hero">
            <p class="landing-eyebrow">Free, open-source vulnerability disclosure tooling</p>
            <h1>Generate a vulnerability disclosure policy, safe harbor, and security.txt</h1>
            <p class="landing-lede">
                Policymaker turns a few details about your organization into a complete disclosure setup: a customizable VDP, optional coordinated-disclosure timeline, standalone safe-harbor language, an RFC 9116 security.txt file, and a DNS Security TXT record.
            </p>
            <div class="dio__action-bar">
                <DioButton @click="begin">Build your policy</DioButton>
            </div>
        </header>

        <section class="landing-summary" aria-labelledby="what-you-get">
            <h2 id="what-you-get">What Policymaker produces</h2>
            <ul>
                <li><strong>Vulnerability Disclosure Policy:</strong> a complete policy for a new or replacement program.</li>
                <li><strong>Safe Harbor:</strong> standardized language that can be added to an existing policy.</li>
                <li><strong>security.txt:</strong> an RFC 9116 file that directs researchers to the correct reporting channel.</li>
                <li><strong>DNS Security TXT:</strong> a DNS record that publishes security-contact information.</li>
            </ul>
            <p>
                The generated language comes from the disclose.io Framework's canonical, publicly reviewed terms. Policymaker is a starting point for implementation and does not provide legal advice.
            </p>
        </section>

        <nuxt-content :document="content"></nuxt-content>

        <div class="dio__action-bar">
            <DioButton @click="begin">Begin</DioButton>
        </div>
    </article>
</template>

<script lang="ts">
import Vue from 'vue'
import nav from '~/mixins/nav'
import DioButton from '~/components/DioButton/DioButton.vue'

export default Vue.extend({
    layout: 'policymaker',
    components: { DioButton },
    mixins: [nav],

    async asyncData({ $content }) {
        const content = await $content('policymaker/introduction').fetch()
        return { content }
    },

    head() {
        return {
            title: 'Vulnerability Disclosure Policy Generator | disclose.io',
            link: [
                { hid: 'canonical', rel: 'canonical', href: 'https://policymaker.disclose.io/' }
            ],
            meta: [
                {
                    hid: 'description',
                    name: 'description',
                    content: 'Generate a vulnerability disclosure policy, safe-harbor clause, security.txt file, and DNS Security TXT record with the free disclose.io Policymaker.'
                }
            ]
        }
    },

    methods: {
        begin(): void {
            const gtag = (window as any).gtag
            if (typeof gtag === 'function') {
                gtag('event', 'policymaker_start', { entry_point: 'landing_page' })
            }
            ;(this as any).goto(2)
        }
    }
})
</script>

<style lang="postcss">
.policymaker-landing {
    @apply max-w-4xl;
}

.landing-hero {
    @apply py-4 lg:py-8 mb-12 border-b border-gray-300;

    h1 {
        @apply text-2xl lg:text-3xl font-bold mt-3;
        max-width: 22ch;
    }
}

.landing-eyebrow {
    @apply text-sm font-medium text-purple-800;
    letter-spacing: 0.04em;
    text-transform: uppercase;
}

.landing-lede {
    @apply text-base lg:text-lg mt-6;
    color: var(--text-muted);
    max-width: 68ch;
}

.landing-summary {
    @apply bg-white border border-gray-300 rounded-md p-4 lg:p-7 mb-12;

    h2 {
        @apply text-lg lg:text-2xl font-bold mb-4;
    }

    ul {
        @apply list-disc list-outside pl-6;
    }

    li {
        @apply mb-2;
    }

    p {
        @apply mt-6 text-sm;
        color: var(--text-muted);
    }
}
</style>
