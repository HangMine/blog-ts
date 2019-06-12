import React, { useState } from "react";
import "@css/Maside.scss";
import { Icon, Button, Input, Popover } from "antd";

import Collapse from "@/components/base/Collapse";

const menuData = ["日记本", "随笔"];

const operateList = (
  <ul className="M_Aside_opreate">
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

const menuList = menuData.map((item, id) => (
  <li key={id}>
    {item}
    <div className="icon-wrap">
      <Popover
        overlayClassName="M_Aside_pop"
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

function M_Aside() {
  const [type, setType] = useState("");

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
              <Button className="btn-commit" ghost shape="round">
                提交
              </Button>
              <Button className="btn-cancel" ghost shape="round" onClick={() => setIsCollapse(false)}>
                取消
              </Button>
            </div>
          </div>
        )}
      </Collapse>

      <ul>{menuList}</ul>
    </div>
  );
}

export default M_Aside;
