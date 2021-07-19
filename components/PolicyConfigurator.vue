<template>
    <div class="subpixel-antialiased">

        <fieldset id="template-options">
            <!-- <div class="template-option"> -->
                <component v-for="templateOption in ['organization','channel','disclosure_window', 'policy_url']" :key="templateOption"
                    :is="getInputConfiguration(templateOption).inputType" 
                    :options="getInputConfiguration(templateOption)" 
                    v-model="policyConfiguration[templateOption]" />
            <!-- </div> -->
        </fieldset>

      
        <div class="separator"><span>Generated policy</span></div>

        <div id="preview">
            <div id="policy-region">
                <div class="flex flex-row items-center gap-x-2">
                    <input-dropdown :options="localeRegions" v-model="policyConfiguration.region">
                        <template v-slot:selectedValue="{ value }">
                            <div class="flex flex-row justify-start items-center gap-x-2">
                                <client-only><gb-flag v-if="value!=='*'" :code="value" height="15" size="mini" /></client-only>
                                {{ $t(`country.${value}`) }}
                            </div>
                        </template>
                        <template v-slot:option="{ option }">
                            <div class="flex flex-row justify-start gap-x-2">
                                <client-only><gb-flag v-if="option!=='*'" :code="option" size="small" /></client-only>
                                {{ $t(`country.${option}`) }}
                            </div>
                        </template>
                    </input-dropdown>

                    <input-dropdown :options="languagesForRegion(policyConfiguration.region)" v-model="policyConfiguration.language">
                        <template v-slot:selectedValue="{ value }">
                            {{ $t(`language.${value}`) }}
                        </template>
                        <template v-slot:option="{ option }">
                            {{ $t(`language.${option}`) }}
                        </template>
                    </input-dropdown>
                </div>
                <div>
                    <button @click="downloadPolicy(renderedPolicy, 'text/markdown')" :disabled="!isValid">Save as markdown</button>
                    <button @click="downloadPolicy($md.render(renderedPolicy), 'text/html')" :disabled="!isValid">Save as HTML</button>
                </div>
            </div>
        </div>
        <div id="policy" v-html="$md.render(renderedPolicy)"></div>

    </div>
</template>

<script lang="ts">
import Vue from 'vue'
import FieldText from './FieldText.vue'
import FieldDropdown from './FieldDropdown.vue'
import InputDropdown from './InputDropdown.vue'
import _uniq from 'lodash/uniq'
import _get from 'lodash/get'
import _keys from 'lodash/keys'
import _map from 'lodash/map'
import _reduce from 'lodash/reduce'
import _forEach from 'lodash/forEach'
import _filter from 'lodash/filter'
import _startsWith from 'lodash/startsWith'
import _endsWith from 'lodash/endsWith'
import _isEmpty from 'lodash/isEmpty'
import _debounce from 'lodash/debounce'
import _kebabCase from 'lodash/kebabCase'
import _pickBy from 'lodash/pickBy'


export default Vue.extend({
  components: { FieldText, FieldDropdown, InputDropdown },
    
    data() {
        return {

            
            policyOptions: {
                // list of policy locales - these should match to the available term files in /static/terms
                locales: ['en-*', 'en-AU', 'en-CA', 'en-GB', 'en-NZ', 'en-US', 'nl-*', 'nl-BE', 'nl-NL'],
            },

            policyConfiguration: {
                language: "en",
                region: "*",
                organization: "",
                disclosure_window: "",
                channel: ""
            },

            isValid: false,

            inputConfig: {
                "organization": {
                    "inputType": "FieldText",
                    "label": "Organization Name",
                    "placeholder": "Name of your organisation",
                    "required": true
                },
                "channel": {
                    "inputType": "FieldText",
                    "label": "Official Channel / Contact",
                    "placeholder": "Email address or website to receive vulnerability reports",
                    "required": true
                },
                "disclosure_window": {
                    "inputType": "FieldDropdown",
                    "label": "Disclosure window",
                    "placeholder": "Select a disclosure window",
                    "options": [
                        { label: "30 days", value: "30" },
                        { label: "60 days", value: "60" },
                        { label: "90 days", value: "90" }
                    ],
                    "required": true
                },
                "policy_url": {
                    "inputType": "FieldText",
                    "label": "Policy URL",
                    "placeholder": "Where will this policy reside on your website",
                    "required": false
                }
            },
            activeTemplate: ``
        } as any
    },

    mounted() {
        const vm = this as any
        vm.fetchTerms(vm.policyLocale)
    },
    
    computed: {

        renderedPolicy(): string {
            const vm = this as any

            // construct new policy string
            let policy = _reduce(_keys(vm.policyConfiguration), (policy, option) => {

                // regex to identify all option variables specified in template
                let varRegex = new RegExp(`{{${option}}}`, 'gm');

                const newValue = vm.policyConfiguration[option] ? vm.policyConfiguration[option] : '______________'

                policy = policy.replace(varRegex, newValue)
                // console.log("Option:", varRegex, option, newValue)
                return policy
            }, vm.activeTemplate)
            
            
            
            return policy
        },

        templateOptions() {
            const vm = this as any

            let options = {} as any

            options.variables = _uniq(vm.activeTemplate.match(/({{[_|\(\)\s\w\d]{0,}}})/gm))
            options.variables = options.variables.map((variable: string) => { 
                variable = variable.replace(/^{{/g, '')
                variable = variable.replace(/}}$/g, '')
                return variable
            })

            return options;
        },

        localeLanguages(): (string | null)[] {
            const vm = this as any

            // Regex to parse out locale strings into language + country
            const localeRx = new RegExp(/([a-zA-Z]{2})-([a-zA-Z]{2}|\*)/gm)
            let languages = _uniq(_map(vm.policyOptions.locales, (locale) => {
                let match = localeRx.exec(locale)
                localeRx.exec("")

                return (match != null) ? match[1].toLowerCase() : null
            }))

            return languages
        },


        localeRegions() {
            const vm = this as any

            // Regex to parse out locale strings into language + country
            const localeRx = new RegExp(/([a-zA-Z]{2})-([a-zA-Z]{2}|\*)/gm)
            let regions = _uniq(_map(vm.policyOptions.locales, (locale) => {
                let match = localeRx.exec(locale)
                localeRx.exec("")

                return (match != null) ? match[2].toUpperCase() : null
            }))

            // Insert placeholder for international
            // regions = ["*", ...regions]

            return regions.sort()
        },

        policyLocale(): string {
            const vm = this as any
            let locale = `${vm.policyConfiguration.language.toLowerCase()}`

            if (!_isEmpty(vm.policyConfiguration.region)) {
                locale = `${locale}-${vm.policyConfiguration.region}`
            }

            return locale
        }
    },

    methods: {
        getInputConfiguration(templateOption: string): any {
            const vm = this as any

            let config = _get(vm.inputConfig, templateOption)
            
            return config
        },

        /**
         * Filters the locales by specified language
         * @param language string eg: 'en'
         */
        regionsForLanguage(language: string) {
            const vm = this as any

            const locales = _filter(vm.policyOptions.locales, (locale) => {
                return _startsWith(locale, language)
            })

            const localeRx = new RegExp(/([a-zA-Z]{2})-([a-zA-Z]{2}|\*)/gm)
            let regions = _map(locales, (region) => {
                const match = localeRx.exec(region)
                localeRx.exec("")
                return (match != null) ? match[2].toUpperCase() : null
            })

            // Insert placeholder for international
            // regions = ["*", ...regions]
            
            return regions;
        },

        /**
         * Filters the locales by specified region
         * @param region string eg: "AU"
         */
        languagesForRegion(region: string) {
            const vm = this as any

            if (_isEmpty(region)) {
                return vm.localeLanguages
            }

            const locales = _filter(vm.policyOptions.locales, (locale) => {
                return _endsWith(locale, region)
            })

            const localeRx = new RegExp(/([a-zA-Z]{2})-([a-zA-Z]{2}|\*)/gm)
            let languages = _map(locales, (region) => {
                const match = localeRx.exec(region)
                localeRx.exec("")
                return (match != null) ? match[1].toLowerCase() : null
            })

            return languages

        },

        // fetch terms for the specified locale.
        // Locale may be just a language (eg: 'en') or of the format en-AU where AU is a country code
        async fetchTerms(locale: string) {
            const vm = this as any
            let response = await fetch(`/terms/${locale}.md`)
            
            vm.activeTemplate = await response.text()
        },

        downloadPolicy(policyText: string, type: string) {
            const vm = this as any

            if (!vm.isValid) return

            const link = document.createElement('a')

            let sanitizedOrgName = _kebabCase(vm.policyConfiguration.organization)
            let filename = `vdp-${vm.policyLocale.replace('-*', '')}-${sanitizedOrgName}`

            // construct download blob
            let fileBlob = new Blob([policyText], {type})
            link.href = URL.createObjectURL(fileBlob)
            link.download = filename
            link.click()

            // clean up
            URL.revokeObjectURL(link.href)

        }
    },

    watch: {
        policyConfiguration: {
            deep: true,
            handler: function(newValue, oldValue) {
                const vm = this as any

                const requiredFields = _pickBy(vm.inputConfig, { required: true })

                vm.isValid = _reduce(_keys(requiredFields), (isValid, variable) => {
                    
                    return isValid && !_isEmpty(_get(vm.policyConfiguration, variable))
                }, true)
            }
        },
        // Reset the policy language when the region is changed
        "policyConfiguration.region": function(newValue, oldValue) {
            const vm = this as any
            vm.policyConfiguration.language = vm.languagesForRegion(newValue)[0]
        },

        "policyLocale": function(newValue) {
            const vm = this as any
            vm.fetchTerms(vm.policyLocale)
        }
    }

})
</script>

<style lang="postcss">

#policy-region {
    @apply flex flex-row gap-6 mb-5 justify-between;
}

.region-option {

}

.region-locale {
    @apply text-xs;
}

#template-options {
    @apply flex flex-wrap;
    @apply p-4 rounded-sm gap-8;
    @apply sm:border border-purple-800;
}



button {
    @apply inline-flex px-4 py-2 text-sm font-medium leading-5 text-gray-700 border border-gray-300 rounded-full;
    @apply focus:outline-none focus:border-purple-800;
    @apply transition duration-150 ease-in-out;
    @apply text-gray-400 cursor-default;

    &:enabled {
        @apply text-purple-800 border-purple-800;
    }

    &:enabled:hover {
        @apply cursor-pointer;
        @apply bg-purple-800 text-white border-purple-800;
    }
}

.separator {
    @apply mt-8 mb-8 flex border-b border-dashed border-gray-400  justify-center leading-none;

    span {
        @apply bg-white p-2 pl-4 pr-4 -mb-5 text-gray-400 tracking-widest uppercase text-sm;
    }
}

#policy {
    @apply p-7 border border-gray-400 rounded-sm shadow-md mb-10 select-none;

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