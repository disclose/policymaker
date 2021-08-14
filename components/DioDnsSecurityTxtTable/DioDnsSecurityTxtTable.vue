<template>
    <div>
        <dio-field>
            <p>Enter your domain to customize the DNS records below:</p>
            <input-text class="w-64" v-model="domain" placeholder="Enter your domain" />
        </dio-field>

        <table class="dio__table table-auto w-full">
        <thead>
            <tr>
            <th class="text-left">Record name</th>
            <th class="text-center">Record type</th>
            <th class="text-left">Value</th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="(channel, index) in channels" :key="index">
                <td>_security.{{ domainName }}</td>
                <td class="text-center">TXT</td>
                <td>"security_contact={{ channel }}"</td>
            </tr>
            <tr v-if="policyUrl[0]">
                <td>_security.{{ domainName }}</td>
                <td class="text-center">TXT</td>
                <td>"security_policy={{ policyUrl[0] }}"</td>
            </tr>
        </tbody>
        </table>

        
    </div>
</template>

<script lang="ts">
import Vue from 'vue'
import DioField from '~/components/DioField/DioField.vue'
import InputText from '~/components/InputText/InputText.vue'
import { store } from '~/store'
import { channelURIs } from '~/utils/mdTemplate'

export default Vue.extend({
    components: { DioField, InputText },
    
    props: {
        configuration: {
            type: Object
        }
    },

    computed: {
        // configuration: () => store.getters['policymaker/getConfiguration'],
        domain: {
            get() {
                const vm = this as any
                return vm.configuration.organizationDomain
            },
            set(value) {
                store.commit('policymaker/setOrganizationDomain', value)
            }
        },
        domainName() {
            const vm = this as any
            if (vm.domain) {
                return vm.domain
            } else {
                return 'domain.com'
            }
        },
        channels() {
            const vm = this as any
            return channelURIs(vm.configuration.channels)
        },
        policyUrl() {
            const vm = this as any
            return channelURIs([vm.configuration.hostUrl])
        }
    }
})
</script>

<style lang="postcss">

    .dio__table {
        @apply table-auto text-sm lg:text-base border border-solid bg-white;
        border-color: var(--shade-300);

        thead {
            background: var(--shade-100);
            th {
                @apply py-1 px-2 lg:px-6 text-xs lg:text-sm;
                color: var(--dark-purple);
            }
        }

        tr {
            @apply leading-normal border-b;
            border-color: var(--shade-400);
        }

        td {
            @apply py-2 lg:py-3 px-2 lg:px-6;
            color: var(--purple);
        }
    }
</style>