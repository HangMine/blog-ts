import React, { Component } from "react";
import Maside from "@/components/Maside";
import { Row, Col } from "antd";
class Manage extends Component {
  render() {
    return (
      <div>
        <Row>
          <Col span={4}>
            <Maside />
          </Col>
        </Row>
      </div>
    );
  }
}

export default Manage;
