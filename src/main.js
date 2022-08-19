import { createApp, defineAsyncComponent } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import './assets/main.css'

// base components
const BaseLoadingVue = defineAsyncComponent(() => import('./components/base/BaseLoading.vue'))
const BaseButtonVue = defineAsyncComponent(() => import('./components/base/BaseButton.vue'))
const BaseCardVue = defineAsyncComponent(() => import('./components/base/BaseCard.vue'))

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.component('base-loading', BaseLoadingVue)
app.component('base-button', BaseButtonVue)
app.component('base-card', BaseCardVue)


app.mount('#app')
