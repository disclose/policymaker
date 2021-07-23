import { Module, VuexModule, Mutation } from 'vuex-module-decorators'
import _cloneDeep from 'lodash/cloneDeep'

@Module({
    name: 'policymaker',
    stateFactory: true,
    namespaced: true
})
export default class PolicyMaker extends VuexModule {

    // Wizard
    currentStep: number = 1

    // Policy settings
    policyConfiguration = {
        language: 'en',
        region: '*',
        organisationName: '',
        channels: <Channels>[{ type:'', address:'' }]
    }


    get configuration() {
        return this.policyConfiguration
    }

    get channels() {
        return this.policyConfiguration.channels
    }

    @Mutation
    setOrganisationName(name: string) {
        this.policyConfiguration.organisationName = name
    }

    @Mutation
    addChannel(channel?: Channel) {
        if (channel) {
            this.policyConfiguration.channels.push(channel)
        } else {
            this.policyConfiguration.channels.push({ type: 'url', address: ''})
        }
    }

    @Mutation
    updateChannel(payload: any) {
        this.policyConfiguration.channels[payload.index] = payload.value
        this.policyConfiguration.channels = _cloneDeep(this.policyConfiguration.channels)
    }

    @Mutation
    removeChannel(index: number) {
        this.policyConfiguration.channels.splice(index, 1)
    }

    @Mutation
    setLanguage(language: string) {
        this.policyConfiguration.language = language
    }

}

type Channel = {
    type: string,
    address: string
}

type Channels = Channel[]