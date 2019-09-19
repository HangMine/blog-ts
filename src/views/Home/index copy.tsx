import React, { useState, useEffect } from "react";
import Card from "./Card";
import "./index.scss";
import { useMappedState } from 'redux-react-hook';

interface card {
  img: string;
  title: string;
  typeLogo: string;
  typeName: string;
};

function Home() {
  const [cardList, setCardList]: [card[], any] = useState([]);
  const articles: article[] = useMappedState(state => state.article.list);
  const articleTypes: articleType[] = useMappedState(state => state.articleType.list);
  useEffect(() => {
    if (!articles.length || !articleTypes.length) return;
    const cardList: card[] = articles.map((article: article) => {
      const type: articleType = articleTypes.find(type => type.id === article.type) || { id: 0, name: '', icon: '' };
      const typeInfo = {
        typeLogo: type.icon,
        typeName: type.name
      }
      const card: card = { ...article, ...typeInfo }
      return card
    })
    setCardList(cardList);
  }, [articles, articleTypes])

  return (
    <div className="home">
      <Card> {cardList.map((card: card, i) => <Card.Item key={i} data={card} />)} </Card>
    </div>

  )
}

export default Home;
