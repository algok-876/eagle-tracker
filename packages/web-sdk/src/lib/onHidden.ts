export interface OnHiddenCallback {
  (event: Event): void
}

/**
 * 页面被隐藏时执行回调
 */
export const onHidden = (cb: OnHiddenCallback) => {
  const onHiddenOrPageHide = (event: Event) => {
    if (event.type === 'pagehide' || document.visibilityState === 'hidden') {
      cb(event);
    }
  };
  window.addEventListener('visibilitychange', onHiddenOrPageHide, true);
  // 有些浏览器不支持visibilitychange
  window.addEventListener('pagehide', onHiddenOrPageHide, true);
};
