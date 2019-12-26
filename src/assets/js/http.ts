// 注意：fetch不支持进度事件，所以上传文件的进度使用的是axios。在fetch支持进度事件之前，建议使用自己封装+axios的方式

import { message, Button } from "antd";
import history from "@/router/history";
import apiMap from "./apiMap";

const isDev = process.env.NODE_ENV === "development";
export const SERVER = isDev
  ? "http://127.0.0.1:8888"
  : "http://138.128.211.146:8888";
const BASE_URL = isDev ? "/api" : "";
// 请求中断器
// const controller = new AbortController();

// 默认配置(RequestInit是fetch的设置类型)
const defaultOptions: RequestInit = {
  credentials: "include", //强制带上cookies
  cache: "no-cache"
  // signal: controller.signal//带上可以取消请求的信号
};

// 当传的是整个对象的方式，必须包括URL
interface allOption {
  url: string;
  method?: string;
  params?: object;
}

// 通过快捷方式调用，传入的配置
interface options {
  method?: string;
  headers?: object;
  hideMsg?: boolean;
}

// 将前端接口地址翻译成后端接口地址(格式为:'test.test1/diyName')
const getUrl = (url: string) => {
  if (/^http/.test(url)) return url;
  if (url[0] !== "/") {
    const mainUrl = url.split("/")[0];
    const apiUrl = getApiUrl(mainUrl);
    const subUrl = url.split("/")[1] ? `/${url.split("/")[1]}` : "";
    url = apiUrl + subUrl;
  }
  url = BASE_URL + url;
  return url;
};

const getApiUrl = (mainUrl: string) => {
  const layers = mainUrl.split(".");
  let tem: obj = apiMap;

  for (const layer of layers) {
    tem = tem[layer];
  }
  return tem;
};

// 获取参数,区分formData和json
const getParams = (params?: obj) => {
  const isFormData = params instanceof FormData;

  if (!isFormData && params) {
    params = resetUndefined(params);
  }
  return params;
};

// 清除空数据
// const clearEmpty = (obj: obj) => {
//   for (const [key, item] of Object.entries(obj)) {
//     if (!item && item !== 0) delete obj[key]
//   }
//   return obj;
// }

// 将undefined的数据变成''
const resetUndefined = (obj: obj) => {
  for (const [key, item] of Object.entries(obj)) {
    if (item === undefined) {
      obj[key] = "";
      // 清除值为undefined的ID
      if (key === "id") delete obj[key];
    }
  }
  return obj;
};

// multipart/form-data

// 主函数(有简便传法和全对象传法)
const http = (
  firstParam: string | allOption,
  params?: Object | FormData,
  options?: options
) => {
  let reqOptions: any = {};
  let url = getUrl(
    typeof firstParam === "string" ? firstParam : firstParam.url
  );
  params = getParams(
    typeof firstParam === "string" ? params : firstParam.params
  );
  options = typeof firstParam === "string" ? options : firstParam;
  const isFormData = params instanceof FormData;
  let postOptions = {};
  if (options && options.method === "POST") {
    // POST，判断是文件还是json
    const body = isFormData ? params : JSON.stringify(params);
    // 此处有坑：fetch上传文件时，不需要设置Content-Type为'multipart/form-data'  !!!!!!!
    const contentType = isFormData
      ? {}
      : { "Content-Type": "application/json" };
    postOptions = {
      headers: {
        ...contentType,
        ...options.headers
      },
      body
    };
  } else {
    // GET
    url = params2query(url, params);
  }
  reqOptions = { ...defaultOptions, ...options, ...postOptions };
  // 请求中间件(后续需丰富reqOptions)
  const req = reqMiddle(url, reqOptions);
  const res: Promise<any> = new Promise((resolve, reject) => {
    fetch(req)
      // 响应中间件
      .then(res => resMiddle(res, reqOptions))
      .then((res: res) => {
        // 当非登录状态时，防止弹很多个相同提示
        if (res.event === "user_failure") {
          message.config({
            maxCount: 1
          });
          history.push("/");
        }

        const isSuccess = res && res.code === "success";
        const msg = res && res.msg;
        const type = isSuccess ? "success" : "error";
        if (msg && !reqOptions.hideMsg) message[type](msg);
        resolve(res);
      })
      .catch(err => {
        reject(err);
      });
  });

  return res;
};

// get方法（挂载在主函数上）
http.get = (
  firstParam: string | allOption,
  params?: Object | FormData,
  options?: options
) => {
  const getOptions = {
    ...options,
    method: "GET"
  };
  return http(firstParam, params, getOptions);
};

// post方法（挂载在主函数上）
http.post = (
  firstParam: string | allOption,
  params?: Object | FormData,
  options?: options
) => {
  const postOptions = {
    ...options,
    method: "POST"
  };
  return http(firstParam, params, postOptions);
};

// 请求中间件
const reqMiddle = (url: string, resOptions: any) => {
  const req = new Request(url, resOptions);
  return req;
};

// 响应中间件
const resMiddle = (res: obj, reqOptions: obj) => {
  errorHandle(res);
  res = typeHandle(res, reqOptions);
  return res;
};

// 请求错误处理
const errorHandle = (res: any) => {
  if (!res.ok) {
    const status = [500, 404, 403].includes(+res.status)
      ? `${res.status}`
      : "error";
    history.push("/error", {
      status: status,
      title: `${status}`,
      subTitle: `失败地址:${res.url},请联系管理员`,
      extra: "back"
    });
  }
  return;
};
// response根据类型处理(暂时只支持json和text)
const typeHandle = (res: obj, reqOptions: obj) => {
  const header = res.headers.get("content-type");
  const mime = header && header.split(";")[0];
  switch (mime) {
    case "text/html":
      return res.text();
    case "application/json":
    default:
      return res.json();
  }
};

// 对象参数转化为查询字符串
const params2query = (
  url: string,
  params: object = {},
  clearUndefined: boolean = false
) => {
  if (!params) return url;
  let query = url + (url.includes("?") ? "&" : "?");
  let queryArr = [];
  for (const [key, value] of Object.entries(params)) {
    if (clearUndefined && value === undefined) continue;
    // 需增加encodeURIComponent对特殊字符进行处理
    queryArr.push(`${key}=${encodeURIComponent(value)}`);
  }
  return (query += queryArr.join("&"));
};

export { getUrl, params2query };

export default http;
