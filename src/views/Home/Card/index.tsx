import React, { Children, Component, ReactNode } from "react";
import { Empty } from "antd";
import "./index.scss";
import { SERVER } from "@/assets/js/http";

type cardItemProps = {
  data: {
    img: string;
    title: string;
    typeLogo: string;
    typeName: string;
    [any: string]: any;
  };
  onClick?: () => void;
};

class CardItem extends Component<cardItemProps> {
  //通过设置静态属性来设置默认值
  static defaultProps = {
    data: {}
  };
  //由于不需要设置state。所以无需继承this
  // constructor(props:cardItemProps) {
  //   super(props);
  // }
  render() {
    const data = this.props.data;

    return (
      <div className="h-card-item">
        <div
          className="main"
          onClick={() => this.props.onClick && this.props.onClick()}
        >
          <div
            className="img"
            style={{ backgroundImage: `url(${SERVER}${data.img})` }}
          />
          <div className="info">
            <a className="title">{data.title}</a>
            <div className="type">
              <div className="type-logo">
                <svg className="icon" style={{ fontSize: 25 }}>
                  <use xlinkHref={`#${data.typeLogo}`} />
                </svg>
              </div>
              <a className="type-name">{data.typeName}</a>
            </div>
          </div>
          <div className="rotate-shade black" />
          <div className="rotate-shade white" />
          <div className="shade">
            <p>{data.content_text}</p>
          </div>
        </div>
      </div>
    );
  }
}

type cardProps = {
  children: ReactNode;
};

const Card = ({ children }: cardProps) => {
  return (
    <div className="h-card">
      {React.Children.count(children) ? children : <Empty></Empty>}
    </div>
  );
};

Card.Item = CardItem;

export default Card;
