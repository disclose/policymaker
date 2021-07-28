
import _reduce from 'lodash/reduce'
import _keys from 'lodash/keys'


const templateVars = {
    "organization": 'organizationName',
    "disclosure_window": 'cvdTimelineDays',
    "policy_url": 'hostUrl'
}

export class Template {
    template: string = ''

    
}


export function renderTemplate(template: string, valueObject: object) {
    let policy = _reduce(_keys(valueObject), (policy, option) => {

        // regex to identify all option variables specified in template
        let varRegex = new RegExp(`{{${option}}}`, 'gm');

        const newValue = vm.policyConfiguration[option] ? vm.policyConfiguration[option] : '______________'

        policy = policy.replace(varRegex, newValue)
        // console.log("Option:", varRegex, option, newValue)
        return policy
    }, vm.activeTemplate)
}