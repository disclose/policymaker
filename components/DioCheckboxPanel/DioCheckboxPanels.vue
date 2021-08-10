
<script lang="ts">
import Vue, { VNode, CreateElement } from 'vue'
import _get from 'lodash/get'
import _set from 'lodash/set'
import _isEqual from 'lodash/isEqual'

export default Vue.extend({
    
    props: {
        value: {
            type: [Object, String, Boolean]
        }
    },

    data() {
        return {
            localValue: null
        }
    },

    render: function(createElement, context): VNode {
        const vm = this as any

        const children = vm.$slots.default.map((child: VNode) => {
            if (child.componentOptions?.tag === "dio-checkbox-panel") {
                if (child.data) {
                    child.data.on = {
                        click: this.select.bind(child, _get(child, 'componentOptions.propsData.value'))
                    }
                }
                _set(child.componentOptions, 'propsData.selected', this.panelIsSelected(_get(child, 'componentOptions.propsData.value')))
                return child
            }
        })

        const parentContext = {
            class: 'dio__checkbox-panels',
            on: {
                input: this.select
            }
        }

        return createElement('div', parentContext, children)
    },

    created() {
        this.localValue = this.value        
    },

    methods: {
        select(value: any) {
            this.localValue = value
            this.$emit('input', value)
        },
        panelIsSelected(testValue: any): boolean {
            const isSelected = _isEqual(this.localValue, testValue)
            
            return isSelected
        }
    }
})
</script>