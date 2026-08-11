import { computed, reactive } from 'vue'

import { createEmptyChannel, createHostChannel, isValidDisclosureChannel, isValidHostChannel } from '@/domain/channels'
import { isValidReportingLanguages } from '@/domain/languages'
import type { Channel, PolicyConfiguration } from '@/domain/types'

function createConfiguration(): PolicyConfiguration {
  return {
    language: 'en-US',
    organizationName: '',
    organizationDomain: '',
    reportingLanguages: '',
    channels: [createEmptyChannel()],
    cvdTimelineDays: 90,
    hostUrl: createHostChannel(),
  }
}

const configuration = reactive<PolicyConfiguration>(createConfiguration())

const validOrganizationName = computed(() => Boolean(configuration.organizationName.trim()))
const validChannels = computed(() =>
  configuration.channels.length > 0
  && configuration.channels.every((channel) => isValidDisclosureChannel(channel)),
)
const validHostUrl = computed(() => isValidHostChannel(configuration.hostUrl))
const validReportingLanguages = computed(() => isValidReportingLanguages(configuration.reportingLanguages))
const validOrganizationStep = computed(() => validOrganizationName.value && validChannels.value)
const validSettings = computed(() => validHostUrl.value && validReportingLanguages.value)
const validAll = computed(() => validOrganizationStep.value && validSettings.value)

export function addChannel(): void {
  configuration.channels.push(createEmptyChannel())
}

export function removeChannel(index: number): void {
  if (index > 0) configuration.channels.splice(index, 1)
}

export function updateChannel(index: number, channel: Channel): void {
  configuration.channels[index] = channel
}

export function resetConfiguration(): void {
  Object.assign(configuration, createConfiguration())
}

export function usePolicymaker() {
  return {
    addChannel,
    configuration,
    removeChannel,
    resetConfiguration,
    updateChannel,
    validAll,
    validChannels,
    validHostUrl,
    validOrganizationName,
    validOrganizationStep,
    validReportingLanguages,
    validSettings,
  }
}
