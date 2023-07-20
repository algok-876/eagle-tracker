import Eagle, { IGlobalConfig } from '@eagle-tracker/core';

function install(app: any, options: Partial<IGlobalConfig> = {}) {
  new Eagle({
    ...options,
    famework: {
      vue: true,
      app,
    },
  });
}

export default {
  install,
};
