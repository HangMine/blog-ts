import React, { Component, ReactNode } from "react";
import "./index.scss";
import { string } from "prop-types";

type cardItemProps = {
  data: {
    img: string;
    title: string;
    typeLogo: string;
    typeName: string;
  };
};

class CardItem extends Component<cardItemProps> {
  //通过设置静态属性来设置默认值
  static defaultProps = {
    data: {},
  };
  //由于不需要设置state。所以无需继承this
  // constructor(props:cardItemProps) {
  //   super(props);
  // }
  render() {
    const data = this.props.data;

    return (
      <div className="h-card-item">
        <div className="main">
          <div className="img" style={{ backgroundImage: `url(http://127.0.0.1:8888${data.img})` }} />
          <div className="info">
            <a href="//" className="title">
              {data.title}
            </a>
            <div className="type">
              <div className="type-logo">
                <svg className="icon" style={{ fontSize: 25 }}>
                  <use xlinkHref={`#${data.typeLogo}`} />
                </svg>
              </div>
              <a href="//" className="type-name">
                {data.typeName}
              </a>
            </div>
          </div>
          <div className="rotate-shade black" />
          <div className="rotate-shade white" />
          <div className="shade">
            <p>
              上一篇介绍了 Webpack 优化项目的四种技巧，分别是通过 UglifyJS 插件实现对 JavaScript
              文件的压缩，css-loade...
            </p>
          </div>
        </div>
      </div>
    );
  }
}

type cardProps = {
  children: ReactNode;
};

function Card({ children }: cardProps) {
  return <div className="h-card">{children}</div>;
}

Card.Item = CardItem;

export default Card;
