import React, { useState, useEffect } from "react";
import Card from "./Card";
import "./index.scss";
import gql from 'graphql-tag';
import { useQuery, useMutation } from '@/assets/js/graph'

interface card {
  img: string;
  title: string;
  typeLogo: string;
  typeName: string;
};

const GET_ARTICLES = gql`
{
  articles{
      id
      type
      img 
      title
  }
}
  `

const GET_ARTICLETYPES = gql`
{
  articleTypes{
      id
      name
      icon
  }
}
  `

function Home() {
  const [cardList, setCardList]: [card[], any] = useState([]);
  const articles = useQuery(GET_ARTICLES).articles || [];
  const articleTypes: articleType[] = useQuery(GET_ARTICLETYPES).articleTypes || [];

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
