import React, { FC } from "react";
import { Card } from "antd";
import "./Detail.scss";
const ArticleDetail: FC<location> = ({ location }) => {
  const routeParams = location.state;
  const title = routeParams && routeParams.title;
  const content = routeParams && routeParams.content;
  return (
    <section className="article-detail">
      <Card>
        <h2 className="title">{title}</h2>
        <div dangerouslySetInnerHTML={{ __html: content }}></div>
      </Card>
    </section>
  );
};

export default ArticleDetail;
