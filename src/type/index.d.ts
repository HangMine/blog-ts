// 普通对象
interface obj {
  [any: string]: any;
}

// 接口响应数据
interface res {
  data?: any;
  msg?: string;
  [key: string]: any;
}

// redux的dispatch函数
type dispatch = (param: any) => any;

// 行数据
interface row {
  id: string | number;
  [any: string]: any;
}

// 路由的location
interface location {
  location: { [any: string]: any };
}
