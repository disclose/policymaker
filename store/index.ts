import Vue from 'vue'
import Vuex, { Store } from 'vuex'
import { Module, VuexModule, Mutation, Action } from 'vuex-module-decorators'

import _cloneDeep from 'lodash/cloneDeep'
import _map from 'lodash/map'
import _reduce from 'lodash/reduce'
import _isEmpty from 'lodash/isEmpty'
import _findIndex from 'lodash/findIndex'
import _startsWith from 'lodash/startsWith'

import { renderTemplate, renderSecurityTxt } from '~/utils/mdTemplate'

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

    navSteps: Array<any> = [
        { route: '/policymaker/introduction', name: 'Introduction' },
        { route: '/policymaker/organisation', name: 'Organisation details' },
        { route: '/policymaker/settings', name: 'Policy settings' },
        { route: '/policymaker/download', name: 'Download' }
    ]

    templateRoot: string = '/templates'

    // Policy settings
    policyConfiguration: PolicyConfiguration = {
        language: 'en',
        region: 'US',
        organizationName: '',
        organizationDomain: '',
        channels: <Channels>[{ prefix: '', type:'', address:'' }],
        cvdTimelineDays: 90,
        hostUrl: {
            prefix: '',
            type:'',
            address: ''
        }
    }

    // CVD Timeline Options
    cvdTimelineOptions = [
        { value: 180, label: '180 days (6 months)' },
        { value: 120, label: '120 days (4 months)' },
        { value: 90, label: '90 days (3 months)' },
        { value: 60, label: '60 days (2 months)' },
        { value: 45, label: '45 days (1.5 months)' },
        { value: 30, label: '30 days (1 month)' },
        { value: 0, label: 'Opt-out of CVD Timeline' }]

    // Term Templates
    templates: any = {
        vdp: { url: 'templates/disclose-io-vdp/{{locale}}.md', text: '' },
        vdp_with_cvd: { url: 'templates/disclose-io-vdp-with-cvd/{{locale}}.md', text: '' },
        safe_harbor: { url: 'templates/disclose-io-safe-harbor/{{locale}}.md', text: '' },
        securitytxt: { url: 'templates/securitytxt/securitytxt.md', text: '' }
    }

    get getCurrentStep(): number {
        return this.currentStep
    }

    get getNavSteps(): Array<any> {
        return this.navSteps
    }

    get getConfiguration(): object {
        return this.policyConfiguration
    }

    get getChannels(): Channels {
        return this.policyConfiguration.channels
    }

    get getCurrentLocale(): string {
        return `${this.policyConfiguration.language.toLowerCase()}-${this.policyConfiguration.region.toUpperCase()}`
    }

    get getTermsVDP(): string {
        return renderTemplate(this.templates.vdp.text, this.policyConfiguration)
    }

    get getTermsVDPCVD(): string {
        return renderTemplate(this.templates.vdp_with_cvd.text, this.policyConfiguration)
    }

    get getTermsSafeHarbor(): string {
        return renderTemplate(this.templates.safe_harbor.text, this.policyConfiguration)
    }

    get getSecurityTxt(): string {
        return renderSecurityTxt(this.templates.securitytxt.text, this.policyConfiguration)
    }

    get validOrganizationName(): boolean {
        return !_isEmpty(this.policyConfiguration.organizationName)
    }

    get validChannels(): boolean {
        return this.policyConfiguration.channels.length > 0 && !_isEmpty(this.policyConfiguration.channels[0].address.trim())
    }

    get validHostUrl(): boolean {
        return !_isEmpty(this.policyConfiguration.hostUrl.address)
    }

    @Mutation
    setStep(stepNumber: number) {
        this.currentStep = stepNumber
    }

    @Mutation
    setOrganizationName(name: string) {
        this.policyConfiguration.organizationName = name
    }

    @Mutation
    setOrganizationDomain(domain: string) {
        this.policyConfiguration.organizationDomain = domain.trim()
    }

    @Mutation
    addChannel(channel?: Channel) {
        if (channel) {
            this.policyConfiguration.channels.push(channel)
        } else {
            this.policyConfiguration.channels.push({ prefix: '', type: '', address: ''})
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
    setHostUrl(channel: Channel) {
        this.policyConfiguration.hostUrl = channel
    }

    @Action({ rawError: true })
    async fetchTerms() {
        
        return Promise.all(
            _map(this.templates, async (template, key) => {
                // @ts-ignore
                let url = `${$nuxt.$router.options.base}${template.url}`
                url = url.replace("{{locale}}", this.getCurrentLocale)
                // console.log("Loading template ", url);
                const response = await fetch(url)
                const text = await response.text()
                this.setTemplateText({ type: key, text })
            })
        )
    }

    @Action
    gotoStep(step: number) {
        this.context.commit('setStep', step)
        
        // @ts-ignore
        $nuxt.$router.push(this.context.getters['getNavSteps'][step-1].route)
    }

    @Action
    syncStepFromRoute(route: string) {
        
        let index = _findIndex(this.context.getters['getNavSteps'], (step: any) => { 
            return _startsWith(route, step.route)
        })
        index ++
        // console.log('Syncing', route, index)
        this.context.commit('setStep', index)
    }

}