// 文章
interface article {
  id: number,
  type: number,
  img: string;
  title: string;
}

// 文章类型
interface articleType {
  id: number,
  name: string,
  icon: string,
}

// 接口响应数据
interface res {
  data?: any,
  msg?: string,
  [key: string]: any
}

// redux的dispatch函数
type dispatch = (param: any) => any