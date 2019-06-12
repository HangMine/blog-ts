import React, { PureComponent } from "react";
import { Layout } from "antd";
import { BrowserRouter as Router, Route } from "react-router-dom";
import Home from "@/views/Home";
import Manage from "@/views/Manage";

const { Content } = Layout;
//必须使用PureComponent，否则由于layout的sider影响，导致更新
class Main extends PureComponent {
  render() {
    return (
      <Router>
        <Content>
          <Route exact path="/" component={Home} />
          <Route path="/manage" component={Manage} />
        </Content>
      </Router>
    );
  }
}

export default Main;
