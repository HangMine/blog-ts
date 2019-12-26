const _userAgent = navigator.userAgent;
const platform = {
  isWeiXin: /MicroMessenger/i.test(_userAgent),
  isMobile: /iphone|ipod|ipad|ipad|Android|nokia|blackberry|webos|webos|webmate|bada|lg|ucweb/i.test(
    _userAgent
  ),
  isIos: /iPhone|iPad|iPod|iOS/i.test(_userAgent),
  isIphone: /iPhone/i.test(_userAgent),
  isXX: /xxAssistant/i.test(_userAgent),
  isXXipa:
    /xxipa/gi.test(_userAgent) && /(iPhone|iPod|iPad|ios)/gi.test(_userAgent),
  isSafari:
    /safari/gi.test(_userAgent) &&
    !/(crios|chrome|fxios|qqbrowser|sogou|baidu|ucbrowser|qhbrowser|opera|micromessenger|weibo)/gi.test(
      _userAgent
    )
};

const isInt = (val: string) => /\d+/.test(val);

const isNumber = (val: string, dotLength?: number) => {
  const dotLengthReg = dotLength ? `{0,${dotLength}}` : "*";
  const reg = new RegExp(`^\\d+(\\.\\d${dotLengthReg})?$`);
  return reg.test(val);
};

const numClear = (val: string) => {
  return val
    .replace(/[^\d.]/g, "")
    .replace(/\.{2,}/g, ".")
    .replace(".", "$#$")
    .replace(/\./g, "")
    .replace("$#$", ".");
};

const isRange = (val: string | number, min: number, max: number) =>
  +val >= min && +val <= max;

export { platform, isInt, isNumber, numClear, isRange };
