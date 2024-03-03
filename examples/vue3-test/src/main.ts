import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import { EagleTracker, useCatchError } from '@eagle-tracker/vue3'
import router from './router'
const app = createApp(App)

app.config.performance = true
// app.config.errorHandler = (err, instance, info) => {
//   console.log('err')
//   console.log(err instanceof Error)
//   console.dir(err)
//   console.log('instance', instance)
//   console.log('info', info)
// }
useCatchError((type, log) => {
  console.log('发生错误啦')
  // if (isVueError(log)) {
  console.log(type, log)
  // }
})
app.use(router)
app.use(EagleTracker, {
  // isTest: true,
  appId: 'fdsafd',
  dsn: 'http://www.baidu.com'
}).mount('#app')