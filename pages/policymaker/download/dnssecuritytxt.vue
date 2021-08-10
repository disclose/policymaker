
<script lang="ts">
import Vue from 'vue'
import DioField from '~/components/DioField/DioField.vue'
import InputText from '~/components/InputText/InputText.vue'
import { store } from '~/store'
import { channelURIs } from '~/utils/mdTemplate'

export default Vue.extend({
    middleware({redirect}) {
        return redirect("/policymaker/download/securitytxt")
    }
})
</script>

