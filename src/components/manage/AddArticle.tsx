import React, { useState, useEffect } from 'react';
import { Icon, Button, Input, Popover } from "antd";
import "@css/manage/AddArticle.scss";
import http from '@/assets/js/http';
import { useMappedState, useDispatch } from 'redux-react-hook';
import { fetchArtcile } from '@/redux/actions';

function AddArticle() {
  const articles: article[] = useMappedState(state => state.article.list);
  const dispatch = useDispatch();

  const addArticle = () => {
    http.post('/operateArticle', { title: '新建2', type: '2', content: '内容1', user: '7' });
    dispatch(fetchArtcile())
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
    <div className="add-article">
      <div className="add-btn" onClick={addArticle} ><Icon type="plus-circle" theme="filled" className="add-btn-icon" />新建文章</div>
      <ul className="article-ul">{articleList}</ul>
    </div>
  )
}

export default AddArticle;