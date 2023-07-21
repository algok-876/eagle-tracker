// 为了开发方便，导入时加上index可以及时响应变更，不需要build
import Eagle, { IGlobalConfig } from '@eagle-tracker/core/index';

function install(app: any, options: Partial<IGlobalConfig> = {}) {
  const instance = new Eagle({
    ...options,
    famework: {
      vue: true,
      app,
    },
  });
  app.config.errorHandler = instance.getVueErrorhandler();
}

export default {
  install,
};
