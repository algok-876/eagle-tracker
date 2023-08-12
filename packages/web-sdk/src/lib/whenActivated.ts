export const whenActivated = (callback: () => void) => {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  if (document.prerendering) {
    window.addEventListener('prerenderingchange', () => callback(), true);
  } else {
    callback();
  }
};
