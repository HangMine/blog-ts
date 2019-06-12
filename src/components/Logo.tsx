import React, { ReactNode } from "react";
import { Avatar } from "antd";

type props = {
  icon: ReactNode;
  title: String;
  size?: number | "small" | "large" | "default";
  src?: string;
};

function Logo({ icon, title, size, src }: props) {
  //可传入图标或默认显示用户头像
  const Icon = () => {
    return icon || <Avatar size={size} src={src} icon="user" />;
  };

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      {Icon()}
      <div style={{ color: "white", fontSize: "12px" }}>{title}</div>
    </div>
  );
}

Logo.defaultProps = {
  size: 100,
  title: "头像标题",
};

export default Logo;
