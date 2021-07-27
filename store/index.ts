import Vue from 'vue'
import Vuex, { Store } from 'vuex'
import { Module, VuexModule, Mutation, Action } from 'vuex-module-decorators'

import _cloneDeep from 'lodash/cloneDeep'
import _map from 'lodash/map'
import _reduce from 'lodash/reduce'

Vue.use(Vuex)

export const store = new Vuex.Store({})


@Module({
    name: 'policymaker',
    stateFactory: true,
    namespaced: true,
    store: store,
    dynamic: true
})
export class PolicyMaker extends VuexModule {

    // Wizard
    currentStep: number = 1

    templateRoot: string = '/templates'

    // Policy settings
    policyConfiguration = {
        language: 'en',
        region: 'US',
        organisationName: '',
        channels: <Channels>[{ type:'', address:'' }],
        cvdTimelineDays: 90,
        hostUrl: {
            type:'',
            address: ''
        }
    }

    // CVD Timeline Options
    cvdTimelineOptions = [
        { value: 90, label: '90 days' }, 
        { value: 60, label: '60 days' }, 
        { value: 45, label: '45 days' },
        { value: 30, label: '30 days' },
        { value: 0, label: 'Opt-out of CVD Timeline' }]

    templates: any = {
        vdp: { url_root: '/templates/disclose-io-vdp', text: '' },
        vdp_with_cvd: { url_root: '/templates/disclose-io-vdp-with-cvd', text: '' },
        safe_harbor: { url_root: '/templates/disclose-io-safe-harbor', text: '' }
    }


    get getConfiguration() {
        return this.policyConfiguration
    }

    get getChannels() {
        return this.policyConfiguration.channels
    }

    get getCurrentLocale() {
        return `${this.policyConfiguration.language.toLowerCase()}-${this.policyConfiguration.region.toUpperCase()}`
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

    @Mutation
    setCVDTimelineDays(days: number) {
        this.policyConfiguration.cvdTimelineDays = days
    }

    @Mutation
    setTemplateText(request: SetTemplateTextRequest) {
        this.templates[request.type].text = request.text
    }

    @Mutation
    setHostUrl(url: string) {
        this.policyConfiguration.hostUrl = url
    }

    @Action({ rawError: true })
    async fetchTerms() {

        return Promise.all(
            _map(this.templates, async (template, key) => {
                let url = `${template.url_root}/${this.getCurrentLocale}.md`
                console.log("Loading template ", url);
                const response = await fetch(url)
                const text = await response.text()
                this.setTemplateText({ type: key, text })
            })
        )
    }

}

type Channel = {
    type: string,
    address: string
}

type Channels = Channel[]


type SetTemplateTextRequest = {
    type: string,
    text: string
}