import React, { FC, useState, useEffect, useRef } from "react";
import { Icon, message, Dropdown, Menu, Modal } from "antd";
import HModel from "@/components/HModel/HModel";
import "./index.scss";

import HideScroll from "@/components/base/HideScroll";
import http from "@/assets/js/http";

const { confirm } = Modal;

const editUrl = "article.operate";

const editFilters = [
  {
    key: "title",
    title: "标题",
    rules: [{ required: true, message: "请埴写该字段" }]
  }
];

type AddArticle = {
  articleType?: number;
  onChange: (activeArticle: obj) => void;
};

const AddArticle: FC<AddArticle> = ({ articleType, onChange }) => {
  const [articles, setarticles]: [article[], dispatch] = useState([]);
  const setApiArtciles = () => {
    http("article.get", { type: articleType }).then(res => {
      setarticles(res.data || []);
    });
  };
  useEffect(() => {
    setApiArtciles();
  }, [articleType]);

  const [activeArticleId, setactiveArticleId] = useState();

  const handleClickArticle = async (activeArticle: obj) => {
    setactiveArticleId(activeArticle.id);

    const _articles = await http("article.get", { id: activeArticle.id });
    onChange && onChange(_articles.data && _articles.data[0]);
  };

  // 新增编辑数据
  const [editData, seteditData]: [any, any] = useState({
    show: false,
    loading: false,
    isEdit: false,
    row: {}
  });

  // 新增
  const add = () => {
    if (!articleType) {
      message.warning("请先选择文章类型");
      return;
    }
    seteditData({
      ...editData,
      show: true,
      isEdit: false,
      row: {}
    });
  };

  // 编辑
  const edit = (row: obj) => {
    seteditData({
      ...editData,
      show: true,
      isEdit: true,
      row: row
    });
  };

  // 确定之后的回调
  const commitCallback = (data: obj) => {
    setApiArtciles();
  };

  const delArticle = (id: number) => {
    confirm({
      title: "是否确定删除文章?",
      async onOk() {
        await http("article.del", { id });
        setApiArtciles();
      },
      onCancel() {}
    });
  };

  // 文章列表
  const articleList = articles.map((article, i) => (
    <li
      key={i}
      className={`${activeArticleId === article.id ? "active" : ""}`}
      onClick={() => handleClickArticle(article)}
    >
      <Icon type="snippets" className="article-icon" />
      {article.title}
      <Dropdown
        overlay={
          <Menu>
            <Menu.Item onClick={() => edit(article)}>
              <Icon type="form" />
              修改文章
            </Menu.Item>
            <Menu.Item onClick={() => delArticle(article.id)}>
              <Icon type="delete" />
              删除文章
            </Menu.Item>
          </Menu>
        }
      >
        <Icon type="setting" className="setting-icon" theme="filled" />
      </Dropdown>
    </li>
  ));
  return (
    <>
      <HideScroll maxHeight="100vh">
        <div className="add-article">
          <div className="add-btn" onClick={add}>
            <Icon type="plus-circle" theme="filled" className="add-btn-icon" />
            新建文章
          </div>
          <ul className="article-ul">{articleList}</ul>
        </div>
      </HideScroll>
      {/* 新增编辑 */}
      <HModel
        filters={editFilters}
        commitUrl={editUrl}
        commitParams={{ type: articleType }}
        commitCallback={commitCallback}
        data={editData}
        setData={seteditData}
      ></HModel>
    </>
  );
};

export default AddArticle;
