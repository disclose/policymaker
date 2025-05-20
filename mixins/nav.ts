import Vue from 'vue'
import { store, NavSteps, NavStep } from "~/store";

declare module 'vue/types/vue' {
  interface Vue {
    navSteps: NavSteps
    goto(step: number): void
  }
}

export interface NavMixin {
  navSteps: NavSteps
  goto(step: number): void
}

export default Vue.extend({
  computed: {
    navSteps(): NavSteps {
      return store.getters['policymaker/getNavSteps']
    }
  },

  methods: {
    goto(step: number): void {
      store.commit('policymaker/setStep', step)
      const currentStep = this.navSteps[step - 1] as NavStep
      this.$router.push(currentStep.route)
    }
  }
})
