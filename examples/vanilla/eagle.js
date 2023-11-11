import { EagleTracker } from '@eagle-tracker/core/index'

const instance = new EagleTracker({
  isTest: false,
  sendMode: 'post',
  dsn: 'http://127.0.0.1:7001/logs',
  appId: 'mGGeXsyR',
  appKey: 'd232ab18af1da3e70cd2934ccd01aa02',
  uid: '88888',
  record: {
    timeOnPage: true,
  },
  // ignoreResource: [/http:\/\/127.0.0.1:4000\/@fs\/.*/, /.*\.css/, /.*\.svg/]
})
instance.start()

export default instance