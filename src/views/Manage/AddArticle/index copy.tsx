import React, { useState, useEffect, useRef } from 'react';
import { Icon, Button, Input, Popover } from "antd";
import "./index.scss";
import http from '@/assets/js/http';
import { useMappedState, useDispatch } from 'redux-react-hook';
import { fetchArtcile } from '@/redux/actions';

import gql from 'graphql-tag';
import graph from '@/assets/js/graph'

import HideScroll from "@/components/base/HideScroll";

function AddArticle() {
  const articles: article[] = useMappedState(state => state.article.list);
  const dispatch = useDispatch();

  const gql_operateArticle = gql`
      mutation operateArticle($article:articleInput) {
        operateArticle(article:$article){
          code
          msg
        }
      }
    `

  const addArticle = () => {
    graph.mutate(gql_operateArticle, { article: { title: "新建6", type: "2", content: "内容1", user: "7" } }).then(() => {
      dispatch(fetchArtcile())
    })
  }

  // 编辑列表
  const operates = [{ name: '删除文章', icon: 'delete' }]
  const operateList = operates.map((item, i) => (<li key={i}><Icon type={item.icon} />{item.name}</li>));
  // 文章列表
  const articleList = articles.map((article, i) => (
    <li key={i}>
      <Icon type="snippets" className="article-icon" />
      {article.title}
      <Popover
        overlayClassName="operate-pop"
        arrowPointAtCenter
        placement="bottomRight"
        content={<ul className="article-operate-ul">{operateList}</ul>}
        trigger="click"
      >
        <Icon type="setting" className="setting-icon" theme="filled" />
      </Popover>

    </li>
  ));
  return (
    <HideScroll maxHeight="100vh">
      <div className="add-article">
        <div className="add-btn" onClick={addArticle} ><Icon type="plus-circle" theme="filled" className="add-btn-icon" />新建文章</div>
        <ul className="article-ul">{articleList}</ul>
      </div>
    </HideScroll>
  )
}

export default AddArticle;