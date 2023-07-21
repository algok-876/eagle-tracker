import Eagle, { IGlobalConfig } from '@eagle-tracker/core';

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
