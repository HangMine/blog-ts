import React, { FC, useState, useEffect, useCallback } from "react";
import "./index.scss";
import { Icon, Button, Input, Menu, Dropdown, Modal } from "antd";
import HModel from "@/components/HModel/HModel";
import Collapse from "@/components/base/Collapse";

import http from "@/assets/js/http";

const { confirm } = Modal;

const editUrl = "articleType.operate";

const editFilters = [
  {
    key: "name",
    title: "文章类型",
    rules: [{ required: true, message: "请埴写该字段" }]
  }
];

type AddType = {
  onChange: (activeTypeId: number) => void;
};

const AddType: FC<AddType> = ({ onChange }) => {
  const [isCollapse, setisCollapse] = useState(false);
  const [types, settypes]: [articleType[], dispatch] = useState([]);
  const [addTypeName, setaddTypeName] = useState("");

  useEffect(() => {
    setApiTypes();
  }, []);

  const setApiTypes = useCallback(() => {
    return http("articleType.get").then(res => {
      settypes(res.data || []);
    });
  }, []);

  const handleAddType = async () => {
    await http("articleType.operate", { name: addTypeName });
    setaddTypeName("");
    setisCollapse(false);
    setApiTypes();
  };

  const [activeTypeId, setactiveTypeId] = useState();

  // 新增编辑数据
  const [editData, seteditData]: [any, any] = useState({
    show: false,
    loading: false,
    isEdit: false,
    row: {}
  });

  const handleTypeClick = (activeTypeId: number) => {
    setactiveTypeId(activeTypeId);
    onChange && onChange(activeTypeId);
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
    setApiTypes();
  };

  const delArticleType = (id: number) => {
    confirm({
      title: "是否确定删除文章类型?",
      async onOk() {
        await http("articleType.del", { id });

        setApiTypes();
      },
      onCancel() {}
    });
  };

  const typeList = types.map((menu, id) => (
    <li
      key={id}
      className={`${activeTypeId === menu.id ? "active" : ""}`}
      onClick={() => handleTypeClick(menu.id)}
    >
      {menu.name}
      <div className="icon-wrap">
        <Dropdown
          overlay={
            <Menu>
              <Menu.Item onClick={() => edit(menu)}>
                <Icon type="form" />
                修改文章类型
              </Menu.Item>
              <Menu.Item onClick={() => delArticleType(menu.id)}>
                <Icon type="delete" />
                删除文章类型
              </Menu.Item>
            </Menu>
          }
        >
          <Icon type="setting" className="setting-icon" theme="filled" />
        </Dropdown>
      </div>
    </li>
  ));

  return (
    <div className="add-article-type">
      <Collapse
        header={
          <h4>
            <Icon type="plus" />
            <span>新建类型</span>
          </h4>
        }
        value={isCollapse}
        onChange={value => setisCollapse(value)}
      >
        {/* 取消需要调用collapse里面的setIsCollapse函数,通过setIsCollapse来改变isCollapse */}
        {
          <div className="maside-collapse">
            <Input
              className="rm-antd-border"
              value={addTypeName}
              allowClear
              onChange={e => setaddTypeName(e.target.value)}
            />
            <div className="btn-group">
              <Button
                className="btn-commit"
                ghost
                shape="round"
                onClick={handleAddType}
              >
                提交
              </Button>
              <Button
                className="btn-cancel"
                ghost
                shape="round"
                onClick={() => setisCollapse(false)}
              >
                取消
              </Button>
            </div>
          </div>
        }
      </Collapse>

      <ul>{typeList}</ul>
      {/* 新增编辑 */}
      <HModel
        filters={editFilters}
        commitUrl={editUrl}
        commitCallback={commitCallback}
        data={editData}
        setData={seteditData}
      ></HModel>
    </div>
  );
};

export default AddType;
