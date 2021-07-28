
import _reduce from 'lodash/reduce'
import _keys from 'lodash/keys'
import _get from 'lodash/get'
import _set from 'lodash/set'

const templateVars = {
    "organization": 'organizationName',
    "channel": 'channels[0].address',
    "disclosure_window": 'cvdTimelineDays',
    "policy_url": 'hostUrl'
}

export function renderTemplate(template: string, valueObject: object) {

    let policy = template
    let varRegex, newValue

    // Replace Organisation Name
    varRegex = new RegExp(`{{organization}}`, 'gm');
    newValue = _get(valueObject, _get(templateVars, 'organization'))
    policy = policy.replace(varRegex, newValue)


    // Replace Channels
    varRegex = new RegExp(`{{channel}}`, 'gm');
    newValue = _get(valueObject, _get(templateVars, 'channel'))
    policy = policy.replace(varRegex, newValue)

    // Replace CVD Timeline

    return policy
}