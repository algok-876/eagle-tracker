import { EagleTracker } from '@eagle-tracker/core/index'

const instance = new EagleTracker({
  isTest: true,
  appId: 'test123',
  dsn: 'http://weiwei8848.com/log/log.png',
  uid: '88888',
  record: {
    timeOnPage: true,
  },
  ignoreResource: [/http:\/\/127.0.0.1:4000\/@fs\/.*/, /.*\.css/, /.*\.svg/]
})
instance.start()
export default instance