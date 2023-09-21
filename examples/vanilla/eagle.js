import { EagleTracker } from '@eagle-tracker/core/index.ts'

const instance = new EagleTracker({
  isTest: false,
  sendMode:'post',
  postUrl:'http://127.0.0.1:7001/logs',
  appId: 'test123',
  uid: '88888',
  record: {
    timeOnPage: true,
  },
  ignoreResource: [/http:\/\/127.0.0.1:4000\/@fs\/.*/, /.*\.css/, /.*\.svg/]
})
instance.start()

export default instance