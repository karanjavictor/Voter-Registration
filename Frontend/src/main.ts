import { createApp } from 'vue'
import { createPinia } from 'pinia'
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

app.use(createPinia())
app.use(router)
app.use(vuetify)
app.mount('#app')
