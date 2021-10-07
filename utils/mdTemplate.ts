
import _reduce from 'lodash/reduce'
import _map from 'lodash/map'
import _keys from 'lodash/keys'
import _get from 'lodash/get'
import _set from 'lodash/set'
import _join from 'lodash/join'

import '~/store/types'

import { Channel, Channels, PolicyConfiguration } from '~/store'

export function renderTemplate(template: string, config: PolicyConfiguration) {

  let policy = template || ""
  let varRegex, newValue

  // Replace Organisation Name
  varRegex = new RegExp(`{{organization}}`, 'gm')
  newValue = config.organizationName
  policy = policy.replace(varRegex, newValue)


  // Replace Channels
  varRegex = new RegExp(`{{channel}}`, 'gm');
  const channels = channelURIs(config.channels)
  newValue = _join(channels, " or ")

  policy = policy.replace(varRegex, newValue)

  // Replace CVD Timeline
  varRegex = new RegExp(`{{disclosure_window}}`, 'gm')
  newValue = `${config.cvdTimelineDays}`
  policy = policy.replace(varRegex, newValue)

  return policy
}

export function renderSecurityTxt(template: string, config: PolicyConfiguration) {

  let securitytxt = template || ""
  let varRegex, newValue

  // Replace Organisation Name
  varRegex = new RegExp(`{{organization}}`, 'gm');
  newValue = config.organizationName
  securitytxt = securitytxt.replace(varRegex, newValue)

  // Replace Channels
  varRegex = new RegExp(`{{channel}}`, 'gm');
  const channels = channelURIs(config.channels)
  newValue = _join(_map(channels, (channel) => {
    return `Contact: ${channel}`
  }), "\n")
  securitytxt = securitytxt.replace(varRegex, newValue)

  // Replace Policy URL
  varRegex = new RegExp(`{{policy_url}}`, 'gm');
  const hostURI = channelURIs([config.hostUrl])
  newValue = _join(hostURI, "")
  securitytxt = securitytxt.replace(varRegex, newValue)

  // Replace language
  varRegex = new RegExp(`{{languages}}`, 'gm');
  securitytxt = securitytxt.replace(varRegex, config.language)

  return securitytxt

}

// Flattens the Channels array to fully qualified URIs
export function channelURIs(channels: Channels): Array<string> {
  return _map(channels, (channel: Channel) => {
    return `${channel.prefix.trim()}${channel.address.trim()}`

  })
}
