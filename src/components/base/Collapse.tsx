import React, { useState, useEffect, useRef, ReactNode } from "react";
import style from "@css/base/Collapse.module.scss";
import PropTypes from "prop-types";

type LinkedList<T> = T & { next: LinkedList<T> };

interface Person {
  name: string;
}

var people: LinkedList<Person>;
var s = { name: "test" };
console.log(s);

type props = {
  header: ReactNode;
  children: ReactNode;
  initCollapse?: boolean;
};

function Collapse({ header, children, initCollapse }: props) {
  const [isCollapse, setIsCollapse] = useState(initCollapse);
  useEffect(() => {
    setStyle();
  });
  const refBody: any = useRef(null); //这里refBody用any类型暂时去除报错，后续需修改

  const setStyle = () => {
    const height: number = getHeight();

    setHeight(height);
    setOpacity();
  };

  const setHeight = (height: number | string = 0) => {
    height = typeof height === "number" ? `${height}px` : height;
    refBody.current.style.height = height;
  };

  const getHeight = () => {
    const height: number = refBody.current.scrollHeight; //核心，通过scrollHeight获取元素高度
    const resHeight: number = isCollapse ? height : 0;
    return resHeight;
  };

  const setOpacity = () => {
    const opacity: number = isCollapse ? 1 : 0;
    refBody.current.style.opacity = opacity;
  };
  return (
    <div className={style.collapse}>
      <div className={style.header} onClick={() => setIsCollapse(!isCollapse)}>
        {header}
      </div>
      <div className={style.body} ref={refBody}>
        {typeof children == "function" ? children(setIsCollapse) : children}
      </div>
    </div>
  );
}

Collapse.defaultProps = {
  initCollapse: false,
};

export default Collapse;
