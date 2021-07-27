export default async (context, locale) => {
    return await Promise.resolve({
        welcome: 'Welcome',
        language: {
            en: 'English',
            nl: 'Dutch'
        },
        country: {
            "*": "Global (All regions)",
            AU: 'Australia',
            CA: 'Canada',
            GB: 'Great Britain (UK)',
            US: 'Unites States',
            NZ: 'New Zealand',
            BE: 'Belgium',
            NL: 'Netherlands'
        },

        policymaker: {
            nav: {
                introduction: 'Introduction',
                organization_details: 'Organization details',
                policy_settings: 'Policy settings',
                download: 'Download'
            },

            organization_details: {
                page_title: 'Organization details',
                organization_name_label: 'What is the name of your organization?',
                organization_name_desc: 'The organization that this policy will apply to',
                organization_name_placeholder: 'Organization name',
                organization_name_required: 'required'
            }
        }
    })
}