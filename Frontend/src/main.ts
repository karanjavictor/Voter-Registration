import { createApp } from 'vue'
import { createPinia } from 'pinia'
import piniaPersist from 'pinia-plugin-persistedstate'
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import App from './App.vue'
import router from './router'
import './assets/main.css'
import 'unfonts.css'

const vuetify = createVuetify(
    {
        theme: {
            themes: {
                light: {
                    colors: {
                        primary: '#9FCF67',
                        secondary: '#4B5563',
                    },
                },
            },
        },
    }
)

const app = createApp(App)

const pinia = createPinia()
pinia.use(piniaPersist)

app.use(pinia)
app.use(router)
app.use(vuetify)
app.mount('#app')
