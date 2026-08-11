import { createApp } from 'vue'

import App from './App.vue'
import { createPolicymakerRouter } from './router'
import './styles.css'

createApp(App).use(createPolicymakerRouter()).mount('#app')
