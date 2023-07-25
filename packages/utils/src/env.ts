// 主要都是一些用来获取用户环境相关的数据

/**
 * 获取用户操作系统信息
 * @returns 操作系统类型及版本字符串
 */
export function getOS() {
  const userAgent = window.navigator.userAgent;
  let os = 'Unknown';
  let version = 'Unknown';

  // 匹配Windows操作系统及版本
  const windowsRegex = /Windows\sNT\s(\d+\.\d+)/;
  if (windowsRegex.test(userAgent)) {
    os = 'Windows';
    const result = userAgent.match(windowsRegex);
    version = result ? result[1] : '';
  } else if (/Mac OS X (\d+[._]\d+[._]\d+)/.test(userAgent)) {
    // 匹配MacOS操作系统及版本
    os = 'MacOS';
    const result = userAgent.match(/Mac OS X (\d+[._]\d+[._]\d+)/);
    version = result ? result[1] : '';
  } else if (/Linux/i.test(userAgent)) {
    // 匹配Linux操作系统
    os = 'Linux';
  } else if (/Android (\d+\.\d+)/.test(userAgent)) {
    // 匹配Android操作系统及版本
    os = 'Android';
    const result = userAgent.match(/Android (\d+\.\d+)/);
    version = result ? result[1] : '';
  } else if (/iPhone|iPad|iPod/.test(userAgent)) {
    // 匹配iOS操作系统及版本
    os = 'iOS';
    const result = userAgent.match(/OS (\d+_\d+(?:_\d+)?)/);
    version = result ? result[1].replace(/_/g, '.') : '';
  }

  return `${os} ${version}`;
}

/**
 * 获取用户浏览器信息
 * @returns 操作浏览器类型及版本字符串
 */
export function getBrowser() {
  const userAgent = window.navigator.userAgent;
  let browser = 'Unknown';
  let version = '';

  if (/Firefox/i.test(userAgent)) {
    browser = 'Firefox';
  } else if (/Chrome/i.test(userAgent)) {
    browser = 'Chrome';
  } else if (/Safari/i.test(userAgent)) {
    browser = 'Safari';
  } else if (/Opera|OPR/i.test(userAgent)) {
    browser = 'Opera';
  } else if (/Edge/i.test(userAgent)) {
    browser = 'Edge';
  } else if (/MSIE|Trident/i.test(userAgent)) {
    browser = 'Internet Explorer';
  }

  // 获取浏览器版本
  const versionMatch = userAgent.match(/(Firefox|Chrome|Safari|Opera|Edge|MSIE|Trident)\/([\d.]+)/);
  if (versionMatch && versionMatch.length >= 3) {
    version = versionMatch[2];
    browser += ` ${version}`;
  }

  return browser;
}

/**
 * 获取屏幕分辨率信息
 * @returns 屏幕分辨率信息
 */
export function getScreenResolution() {
  return `${window.screen.width}x${window.screen.height}`;
}

/**
 * 获取设备类型
 * @returns 设备类型字符串
 */
export function getDeviceType() {
  const userAgent = window.navigator.userAgent;
  if (/Mobile|Android|iPhone|iPad|iPod|Windows Phone/i.test(userAgent)) {
    return 'Mobile';
  } if (/Tablet|iPad/i.test(userAgent)) {
    return 'Tablet';
  }
  return 'Desktop';
}
