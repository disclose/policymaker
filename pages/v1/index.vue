<template>
  <div class="container pt-6">
    <div>
      <h1 class="text-4xl mb-3 font-bold">Welcome to the disclose.io Policy Generator. </h1>
      <p>Whether you're starting a vulnerability disclosure program (VDP) for the first time, 
        adding modern features to an existing VDP, or updating your VDP terms to reflect safe 
        harbor for hackers acting in good faith, this tool will walk you through the process 
        and generate the policies and information you require.</p>
        <br><br>

       <policy-configurator />
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import PolicyConfigurator from '@/components/PolicyConfigurator.vue'

export default Vue.extend({
  components: { PolicyConfigurator },
  layout: 'policymaker-v1',
  
  data() {
    return {
      
    }
  }
  
  })
</script>

<style lang="postcss" scoped>

.container {
  @apply font-sans text-gray-700;
  @apply flex flex-col justify-start items-stretch text-left mx-auto;
}

</style>
