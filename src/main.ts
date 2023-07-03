import '@vant/touch-emulator';
import 'virtual:uno.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { createPersistedState } from 'pinia-plugin-persistedstate'

import App from './App.vue'
import router from './router'
import { Lazyload } from 'vant'

const app = createApp(App)

app.use(Lazyload, {
  lazyComponent: true
})

const pinia = createPinia()
pinia.use(
  createPersistedState({
    storage: localStorage
  })
)

app.use(pinia)
app.use(router)

app.mount('#app')
