import { Module, VuexModule, Mutation } from 'vuex-module-decorators'

@Module({
    name: 'policymaker',
    stateFactory: true,
    namespaced: true
})
class PolicyMaker extends VuexModule {

    // Wizard
    currentStep: number = 1

    // Policy settings
    language: string = "en"
    region: string = "*"
    organizationName: string = ""
    channels: Array<any> = [];

    @Mutation
    setLanguage(language: string) {
        this.language = language
    }

}

