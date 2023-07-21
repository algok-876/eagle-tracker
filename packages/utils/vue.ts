import { ViewModel } from './types';

// 获取报错组件名
const classifyRE = /(?:^|[-_])(\w)/g;
const classify = (str: string) => str.replace(classifyRE, (c) => c.toUpperCase()).replace(/[-_]/g, '');
const ROOT_COMPONENT_NAME = '<Root>';
export const ANONYMOUS_COMPONENT_NAME = '<Anonymous>';
export const formatComponentName = (vm: ViewModel, includeFile: Boolean) => {
  if (!vm) {
    return ANONYMOUS_COMPONENT_NAME;
  }
  if (vm.$root === vm) {
    return ROOT_COMPONENT_NAME;
  }
  const options = vm.$options;
  let name = options.name || options._componentTag;
  const file = options.__file;
  if (!name && file) {
    const match = file.match(/([^/\\]+)\.vue$/);
    if (match) {
      name = match[1];
    }
  }
  return (
    (name ? `<${classify(name)}>` : ANONYMOUS_COMPONENT_NAME) + (file && includeFile !== false ? ` at ${file}` : '')
  );
};
