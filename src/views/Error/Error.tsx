import React, { FC, ReactNode } from 'react'
import { Result, Button } from 'antd';
import history from '@/router/history';

type errorProps = {
  status?: "error" | "404" | "500" | "403" | "success" | "info" | "warning"
  title?: string
  subTitle?: string
  extra?: 'back'
}

const Error: FC<errorProps> = ({ status, title, subTitle, extra }) => {
  const error = history.location.state || {
    status: 'error',
    title: '页面错误',
    subTitle: '错误信息:渲染错误,请联系管理员',
    extra: undefined
  };
  return (
    <Result
      status={status || error.status}
      title={title || error.title}
      subTitle={subTitle || error.subTitle}
      extra={error.extra === 'back' && <Button type="primary" onClick={() => history.push('/app/home')}>回到首页</Button>}
    />
  )
}

export default Error;