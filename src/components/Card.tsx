import React, { Component, ReactNode } from "react";
import "@css/Card.scss";
import { string } from "prop-types";

type cardItemProps = {
  data: {
    img: string;
    title: string;
    type?: number;
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
    const typeTrans = [
      { name: "Other", logo: "icon-gengduo" },
      { name: "Notes", logo: "icon-rizhi" },
      { name: "Code", logo: "icon-wulumuqishigongandashujuguanlipingtai-ico-" },
      { name: "Game", logo: "icon-youxi" },
    ];
    const type = typeTrans[data.type || 0];
    return (
      <div className="h-card-item">
        <div className="main">
          <div className="img" style={{ backgroundImage: `url(${data.img})` }} />
          <div className="info">
            <a href="//" className="title">
              {data.title}
            </a>
            <div className="type">
              <div className="type-logo">
                <svg className="icon" style={{ fontSize: 25 }}>
                  <use xlinkHref={`#${type.logo}`} />
                </svg>
              </div>
              <a href="//" className="type-name">
                {type.name}
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
