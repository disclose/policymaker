<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
    middleware({redirect}) {
        return redirect("/policymaker")
    }
})
</script>