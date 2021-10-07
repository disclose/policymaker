import { store, NavSteps, NavStep } from "~/store";


export default {

  computed: {
    navSteps: () => store.getters['policymaker/getNavSteps'] as NavSteps
  },

  methods: {
    goto(step: number) {
      const vm = this as any;
      store.commit('policymaker/setStep', step)

      vm.$router.push((vm.navSteps[step - 1] as NavStep).route)
    }
  }
}
