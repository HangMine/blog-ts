import React, { FC, useState } from "react";
import AddType from "./AddType";
import AddArticle from "./AddArticle";
import RichText from "@/components/base/RichText/RichText";
import { Row, Col } from "antd";
import { SERVER } from "@/assets/js/http";
const Manage: FC = () => {
  const [articleType, setarticleType] = useState();
  const [article, setarticle] = useState("");
  const [defaultContent, setdefaultContent] = useState("");

  // 文章类型改变
  const articleTypeChange = (activeTypeId: number) => {
    setarticleType(activeTypeId);
    // 清空选中文章和内容
    setarticle("");
    setdefaultContent("");
  };

  // 文章改变
  const articleChange = (activeArtcile: obj) => {
    setarticle(activeArtcile.id);
    setdefaultContent(activeArtcile.content);
  };
  return (
    <div>
      <Row>
        <Col span={4}>
          <AddType onChange={articleTypeChange} />
        </Col>
        <Col span={6}>
          <AddArticle articleType={articleType} onChange={articleChange} />
        </Col>
        <Col span={14}>
          <RichText
            value={defaultContent}
            imgBaseUrl={SERVER}
            save={{
              url: "article.operate",
              key: "content",
              params: { id: article, type: articleType }
            }}
          ></RichText>
        </Col>
      </Row>
    </div>
  );
};

export default Manage;
