import React, {
  useState,
  useEffect,
  useRef,
  ReactNode,
  ReactChildren
} from "react";
import style from "./index.module.scss";
import PropTypes from "prop-types";

type CollapseProps = {
  header: ReactNode;
  children: ReactNode;
  value: boolean;
  onChange?: (value: boolean) => void;
};

function Collapse({ header, children, value, onChange }: CollapseProps) {
  const [isCollapse, setIsCollapse] = useState(value);

  useEffect(() => {
    setIsCollapse(value);
  }, [value]);

  useEffect(() => {
    setStyle();
    onChange && onChange(isCollapse);
  }, [isCollapse]);
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
  initCollapse: false
};

export default Collapse;
