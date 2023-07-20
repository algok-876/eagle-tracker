import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import Eagle from '@eagle-tracker/vue3'

const app = createApp(App)
app.use(Eagle, {
  isTest: true
}).mount('#app')
app.config.performance = true
app.config.errorHandler = (err, instance, info) => {
  console.log('err')
  console.log(err instanceof Error)
  console.dir(err)
  console.log('instance', instance)
  console.log('info', info)
}