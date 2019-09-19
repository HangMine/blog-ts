import React, { Component } from "react";
import AddType from "./AddType";
import AddArticle from "./AddArticle";
import { Row, Col } from "antd";
class Manage extends Component {
  render() {
    return (
      <div>
        <Row>
          <Col span={4}>
            <AddType />
          </Col>
          <Col span={6}>
            <AddArticle />
          </Col>
        </Row>
      </div>
    );
  }
}

export default Manage;
