import React, { useState, useEffect } from "react";
import "./index.scss";
import { Icon, Button, Input, Popover } from "antd";

import Collapse from "@/components/base/Collapse";
import http from "@/assets/js/http"
import { useMappedState, useDispatch } from "redux-react-hook"
import { fetchArtcileType } from "@/redux/actions"

import gql from 'graphql-tag';
import graph from '@/assets/js/graph'

function M_Aside() {
  const types: articleType[] = useMappedState(state => state.articleType.list);
  const dispatch = useDispatch();
  const [type, setType] = useState("");

  const addType = () => {
    const gql_addType = gql`
      mutation operateArticleType($articleType:articleTypeInput){
        operateArticleType(articleType:$articleType){
          code
          msg
        }
      }
    `
    graph.mutate(gql_addType, { articleType: { name: type } }).then(() => {
      setType('');
      dispatch(fetchArtcileType());
    })
    // http('/addArticleType', { name: type }).then(() => {
    //   setType('');
    //   dispatch(fetchArtcileType());
    // })
  }

  const operateList = (
    <ul>
      <li>
        <Icon type="form" />
        修改文集
      </li>
      <li>
        <Icon type="delete" />
        删除文集
      </li>
    </ul>
  );
  const typeList = types.map((menu, id) => (
    <li key={id}>
      {menu.name}
      <div className="icon-wrap">
        <Popover
          overlayClassName="operate-pop"
          arrowPointAtCenter
          placement="bottomRight"
          content={operateList}
          trigger="click"
        >
          <Icon type="setting" theme="filled" />
        </Popover>
      </div>
    </li>
  ));

  return (
    <div className="M_Aside">
      <Collapse
        header={
          <h4>
            <Icon type="plus" />
            <span>新建类型</span>
          </h4>
        }
      >
        {/* 取消需要调用collapse里面的setIsCollapse函数,通过setIsCollapse来改变isCollapse */}
        {(setIsCollapse: any) => (
          <div className="maside-collapse">
            <Input className="rm-antd-border" value={type} allowClear onChange={e => setType(e.target.value)} />
            <div className="btn-group">
              <Button className="btn-commit" ghost shape="round" onClick={addType}>
                提交
              </Button>
              <Button className="btn-cancel" ghost shape="round" onClick={() => setIsCollapse(false)}>
                取消
              </Button>
            </div>
          </div>
        )}
      </Collapse>

      <ul>{typeList}</ul>
    </div>
  );
}

export default M_Aside;
