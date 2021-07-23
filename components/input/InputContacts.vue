<template>
    <div class="dio__input-contacts">
        <div class="dio__input-contact-list">
            <input-contact 
                v-for="(contact, index) in contacts"
                :key="index"
                :index="index"
                :value="contact"
                @input="updateContact($event, index)"
                @removeContact="removeContact">
            </input-contact>
        </div>
        <dio-button @click="addContact" theme="transparent">Add another</dio-button>
    </div>
</template>

<script lang="ts">
import Vue from 'vue'
import DioButton from '../DioButton.vue'
import InputContact from './InputContact.vue'
import _cloneDeep from 'lodash/cloneDeep'

export default Vue.extend({
    components: { InputContact, DioButton },
    
    props: {
        value: {
            type: Array
        }
    },

    data() {
        return {
            contacts: []
        }
    },

    mounted() {
        const vm = this as any
        vm.contacts = _cloneDeep(vm.value)
    },

    computed: {

    },

    methods: {
        addContact(): void {
            const vm = this as any
            vm.contacts.push({ type: 'url', address: ``})
            vm.emit()
        },
        removeContact(index: number): void {
            const vm = this as any
            Vue.delete(vm.contacts, index)
            vm.emit()
        },
        updateContact($event: any, index: number): void {
            const vm = this as any
            Vue.set(vm.contacts, index, $event)
            vm.emit()
        },
        emit(): void {
            const vm = this as any
            vm.$emit('input', vm.contacts)
        }
    }
})
</script>

<style lang="postcss">
    .dio__input-contact-list {
        & > div {
            @apply mb-2;
        }
    }
</style>