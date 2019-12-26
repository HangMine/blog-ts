import history from "@/router/history";
import { message } from "antd";
// 仓库缓存
const cache = {
  set: (key: string, value: any, type: "session" | "local" = "session") => {
    const storage = type === "local" ? localStorage : sessionStorage;
    storage[key] = JSON.stringify(value);
  },
  get: (key: string, type: "session" | "local" = "session") => {
    const storage = type === "local" ? localStorage : sessionStorage;
    return storage[key] && JSON.parse(storage[key]);
  },
  del: (key: string) => {
    sessionStorage.removeItem(key);
  }
};

// cookie缓存
const cookie = {
  set: (key: string, value: any, days?: number) => {
    let expires = "";
    if (days) {
      const expiersTime = new Date().getTime() + days * 1000 * 60 * 60 * 24;
      const d = new Date();
      d.setTime(expiersTime);
      expires = `expires=${d.toUTCString()};`;
    }
    document.cookie = `${key}=${value};${expires};path=/`;
  },
  get: (key: string) => {
    const map = cookie.map;
    return map[key] || "";
  },
  del: (key: string | string[]) => {
    const del = (name: string) =>
      (document.cookie =
        name + "=; expires=Thu, 01 Jan 1970 00:00:01 GMT;path=/");
    if (typeof key === "string") {
      del(key);
    } else {
      key.forEach(item => del(item));
    }
  },
  map: (() => {
    let cookieMap: obj = {};
    if (document.cookie) {
      const cookieList = document.cookie.split(";");
      for (const cookie of cookieList) {
        const _key = cookie.split("=")[0].trim();
        const value = cookie.split("=")[1].trim();
        cookieMap[_key] = value;
      }
    }

    return cookieMap;
  })()
};

// 首字母大写
const firstUpperCase = (str: string) => {
  return str.slice(0, 1).toUpperCase() + str.slice(1);
};

// 获取数组中的某个对象的某个属性
const pick = (
  arr: any[],
  id: string,
  resKey: string = "title",
  key: string = "key"
) => {
  const item = arr.find(item => item[key] === id);
  return item[resKey];
};

//将moment处理成字符串
const formatMap: obj = {
  date: "YYYYMMDD",
  range: "YYYYMMDD HH:mm:ss",
  week: "YYYYwo",
  month: "YYYYMM"
};
const timeFormat = (filters: filters, values: obj) => {
  const ONE_MOMENT_TYPES = ["date", "week", "month"];
  const TWO_MOMENT_TYPE = "range";
  for (const [key, item] of Object.entries(values)) {
    const filter = filters.find(item => item.key === key)!;
    const defaultFormat = formatMap[filter.type || ""];
    if (item && ONE_MOMENT_TYPES.includes(filter.type || "")) {
      // 单个moment
      values[key] = item.format(
        (filter.props && filter.props.format) || defaultFormat
      );
    } else if (item && TWO_MOMENT_TYPE === filter.type) {
      // moment数组
      const start = item[0].format(
        (filter.props && filter.props.format) || defaultFormat
      );
      const end = item[1].format(
        (filter.props && filter.props.format) || defaultFormat
      );
      values[key] = `${start}/${end}`;
    }
  }
  return values;
};

// 处理上传参数
const handleUpload = (filters: filters, values: obj) => {
  for (const [key, item] of Object.entries(values)) {
    const filter = filters.find(item => item.key === key)!;
    if (filter.type === "upload") {
      values[key] = item.map((_item: obj) => _item.url);
    }
  }
  return values;
};

// 路由跳转
const to = (url: string, params?: obj) => {
  const promise = new Promise((resolve, reject) => {
    history.push({ pathname: url, state: params });
    resolve(url);
  });
  return promise;
};

// 数字转化为中文大写
const num2cn = (str: number | string) => {
  if (!+str || `${str}`.split(".")[0].length > 12) return "";
  let strOutput = "",
    strUnit = "仟佰拾亿仟佰拾万仟佰拾元角分";
  let num = `${+str}00`;
  let intPos = num.indexOf(".");
  if (intPos >= 0) {
    num = num.substring(0, intPos) + num.substr(intPos + 1, 2);
  }
  strUnit = strUnit.substr(strUnit.length - num.length);
  for (let i = 0; i < num.length; i++) {
    strOutput +=
      "零壹贰叁肆伍陆柒捌玖".substr(+num.substr(i, 1), 1) +
      strUnit.substr(i, 1);
  }
  return strOutput
    .replace(/零角零分$/, "整")
    .replace(/零[仟佰拾]/g, "零")
    .replace(/零{2,}/g, "零")
    .replace(/零([亿|万])/g, "$1")
    .replace(/零+元/, "元")
    .replace(/亿零{0,3}万/, "亿")
    .replace(/^元/, "零元");
};

//复制内容到剪贴版
const copy = (val: string, msg = "复制成功") => {
  //使用textarea才可以换行
  let textarea = document.createElement("textarea");
  textarea.value = val;
  document.body.appendChild(textarea);
  textarea.select();
  document.execCommand("Copy");
  textarea.parentNode!.removeChild(textarea);
  message.success(msg);
};

export {
  cache,
  cookie,
  firstUpperCase,
  pick,
  formatMap,
  timeFormat,
  handleUpload,
  to,
  num2cn,
  copy
};
