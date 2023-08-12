interface onBFCacheRestoreCallback {
  (event: PageTransitionEvent): void;
}

/**
 * 页面从往返缓存中恢复时，执行cb
 * @param cb 回调函数
 */
export const onBFCacheRestore = (cb: onBFCacheRestoreCallback) => {
  window.addEventListener(
    'pageshow',
    (event) => {
      if (event.persisted) {
        cb(event);
      }
    },
    true,
  );
};
