import React, { useState, useContext } from "react";
import { Input, Icon } from "antd";
import http from "@/assets/js/http";
import { useMappedState, useDispatch } from "redux-react-hook";
import { toRouter, fetchArtcile, fetchArtcileType } from "@/redux/actions";
import "./index.scss";

function Login() {
  const isMobile: boolean = useMappedState(state => state.isMobile);
  const dispatch = useDispatch();

  const [user, setUser] = useState("");
  const [password, setPassword] = useState("");

  const login = () => {
    http.post("/login", { user, password }).then(res => {
      if (res.code === "success") {
        dispatch(toRouter("/app/home"));
      }

      // 正常应该在登录之后获取文章数据，现在在app那里获取（后续需修改，需考虑刷新页面的问题）
      // const articleReq = dispatch(fetchArtcile('/getArticle'));
      // const articleTypeReq = dispatch(fetchArtcileType());
      // Promise.all([articleReq, articleTypeReq]).then(() => {
      //   dispatch(toRouter('/app/home'))
      // })
    });
  };

  return (
    <div className="login">
      <div className="login-main">
        <Input
          className="login-input"
          placeholder="用户名"
          prefix={<Icon type="user" style={{ color: "rgba(0,0,0,.25)" }} />}
          onChange={e => setUser(e.target.value)}
        />
        <Input.Password
          className="login-input"
          placeholder="密码"
          prefix={<Icon type="lock" style={{ color: "rgba(0,0,0,.25)" }} />}
          onChange={e => setPassword(e.target.value)}
        />
        <button className="login-btn" onClick={login}>
          登录
        </button>
      </div>
      <video className="login-video" loop autoPlay muted>
        {/* <source src={require(`@/assets/video/bird_mobile.mp4`)} type="video/mp4"></source> */}
        <source
          src={require(`@/assets/video/bird_pc.mov`)}
          type="video/ogg"
        ></source>
      </video>
    </div>
  );
}

export default Login;
