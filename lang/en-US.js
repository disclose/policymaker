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
        }
    })
}