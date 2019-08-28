import { message } from "antd";
import history from "@/router/history";

const BASE_URL = 'http://127.0.0.1:8888';

// 默认配置
interface defaultOptions {
  credentials: "same-origin" | "omit" | "include" | undefined,
  cache: 'no-cache' | 'reload' | 'force-cache' | 'only-if-cached' | undefined,
}
const defaultOptions: defaultOptions = {
  credentials: "include", //强制带上cookies
  cache: 'no-cache'
}
// 当传的是整个对象的方式，必须包括URL
interface allOption {
  url: string,
  method?: string,
  params?: object
}

// 通过快捷方式调用，传入的配置
interface options {
  method?: string,
  headers?: object,
  hideMsg?: boolean
}

// 主函数(有简便传法和全对象传法)
function http(firstParam: string | allOption, params?: Object, options?: options) {
  let url = BASE_URL, resOptions: any = {};

  url += typeof firstParam === 'string' ? firstParam : firstParam.url;
  params = typeof firstParam === 'string' ? params : firstParam.params;
  options = typeof firstParam === 'string' ? options : firstParam;

  if (options && options.method === 'POST') {
    // POST
    params = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      },
      body: JSON.stringify(params)
    }
  } else {
    // GET
    url = params2query(url, params);
  }
  resOptions = { ...defaultOptions, ...options, ...params };


  const res: Promise<any> = new Promise((resolve, reject) => {

    fetch(url, resOptions)
      .then((res) => handleResponse(res))
      .then((res) => {

        // 当非登录状态时，防止弹很多个相同提示
        if (res.code === 'no_session') {
          message.config({
            maxCount: 1,
          });
          history.push('/login');
        }


        const isSuccess = res && res.code === 'success'
        const msg = res && res.msg;
        const type = isSuccess ? 'success' : 'error';
        if (msg && !resOptions.hideMsg) message[type](msg);
        // 这里不返回reject,如果返回了，调用时不使用catch会报警告
        if (isSuccess) resolve(res);

      })

  });

  return res;

}


// get方法（挂载在主函数上）
http.get = (url: string, params?: Object, options: Object = {}) => {
  const getParams = {
    method: 'GET',
    params
  };
  return http({ url, ...getParams, ...options });
}

// post方法（挂载在主函数上）
http.post = (url: string, params?: Object, options: Object = {}) => {
  const postParams = {
    method: 'POST',
    params
  };
  return http({ url, ...postParams, ...options });
}

// response根据类型处理(暂时只支持json和text)
interface response {
  headers: { get: Function },
  json: Function,
  text: Function,
}
const handleResponse = (res: response) => {
  const mime = res.headers.get('content-type').split(';')[0];
  switch (mime) {
    case 'text/html':
      return res.text()
    case 'application/json':
    default:
      return res.json()
  }
}

// 对象参数转化为查询字符串
const params2query = (url: string, params?: object) => {
  if (!params) return url;
  let query = url + (url.includes('?') ? '&' : '?');
  let queryArr = [];
  for (const [key, value] of Object.entries(params)) {
    queryArr.push(`${key}=${value}`);
  }
  return query += queryArr.join('&');
}
export default http;