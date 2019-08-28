import React, { useState, useEffect } from "react";
import { Input, Button } from 'antd';
import http from "@/assets/js/http";
import { useDispatch } from "redux-react-hook";
import { toRouter, fetchArtcile, fetchArtcileType } from "@/redux/actions"


function Login() {
  const dispatch = useDispatch();

  const [user, setUser] = useState('');
  const [password, setPassword] = useState('');


  const login = () => {
    http.post('/login', { user, password }).then(() => {
      dispatch(toRouter('/app/home'))

      // 正常应该在登录之后获取文章数据，现在在app那里获取（后续需修改，需考虑刷新页面的问题）
      // const articleReq = dispatch(fetchArtcile('/getArticle'));
      // const articleTypeReq = dispatch(fetchArtcileType());
      // Promise.all([articleReq, articleTypeReq]).then(() => {
      //   dispatch(toRouter('/app/home'))
      // })

    });
  }


  return (

    <div>
      <Input placeholder="用户名" onChange={e => setUser(e.target.value)} />
      <Input.Password placeholder="密码" onChange={e => setPassword(e.target.value)} />
      <Button type="primary" onClick={login}>登录</Button>
    </div>

  )
}

export default Login;

