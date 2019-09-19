import React, { ReactNode } from "react";
import { Avatar, Icon } from "antd";
import "./index.scss";
import { useDispatch } from "redux-react-hook";

type props = {
  icon: ReactNode;
  title: String;
  size?: number | "small" | "large" | "default";
  src?: string;
};

function Logo({ icon, title, size, src }: props) {
  const dispatch = useDispatch();
  //可传入图标或默认显示用户头像
  const logo = () => {
    return icon || <Avatar size={size} src={src} icon="user" />;
  };
  const toLogin = () => {
    dispatch({ type: 'TO_ROUTER', url: '/login' })
  }
  return (
    <div className='aside-logo'>
      {logo()}
      <div className='logo-title'>{title}</div>
      <div className="logo-operate">
        <span className='cancel' onClick={toLogin}><Icon type="poweroff" /> 注销</span>
      </div>
    </div>
  );
}

Logo.defaultProps = {
  size: 100,
  title: "头像标题",
};

export default Logo;
