import React, { FC, useState, useEffect, useMemo } from "react";
import Card from "./Card";
import "./index.scss";
import { to } from "@/assets/js/common";
import http from "@/assets/js/http";
import HFilter from "@/components/HFilter/HFilter";

interface card {
  img: string;
  title: string;
  typeLogo: string;
  typeName: string;
}

const Home: FC = () => {
  const [cardList, setCardList]: [(card & article)[], any] = useState([]);
  const [articles, setarticles] = useState([]);
  const [articleTypes, setarticleTypes]: [articleType[], any] = useState([]);

  const filters = useMemo(
    () => [
      {
        key: "type",
        title: "文章类型",
        type: "select",
        options: articleTypes
      },
      {
        key: "theme",
        title: "主题",
        type: "select",
        options: [
          {
            key: "scenery",
            title: "风景"
          },
          {
            key: "cartoon",
            title: "动漫"
          }
        ]
      }
    ],
    [articleTypes]
  );

  useEffect(() => {
    http("article.get").then(res => {
      setarticles(res.data);
    });
    http("articleType.get").then(res => {
      setarticleTypes(res.data);
    });
  }, []);

  useEffect(() => {
    if (!articles || !articleTypes) return;
    const cardList: card[] = articles.map((article: article) => {
      const type: articleType = articleTypes.find(
        type => type.id === article.type
      ) || { id: 0, name: "", icon: "" };
      const typeInfo = {
        typeLogo: type.icon,
        typeName: type.name
      };
      const card: card = { ...article, ...typeInfo };
      return card;
    });
    setCardList(cardList);
  }, [articles, articleTypes]);

  //跳转到文章详情页
  const toArticleDetail = (card: obj) => {
    to(`/app/article`, card);
  };

  // 搜索
  const search = (params: obj) => {
    http("article.get", params).then(res => {
      console.log(res.data);
      setarticles(res.data);
    });
  };

  return (
    <div className="home">
      <HFilter data={filters} isFilt onSearch={search}></HFilter>
      <Card>
        {cardList.map((card: card, i) => (
          <Card.Item
            key={i}
            data={card}
            onClick={() => toArticleDetail(card)}
          />
        ))}
      </Card>
    </div>
  );
};

export default Home;
