import React, { Component, PureComponent } from "react";
import { Layout } from "antd";
import { Route, Switch } from "react-router-dom";
import Home from "@/views/Home";
import Manage from "@/views/Manage";

const { Content } = Layout;
//必须使用PureComponent，否则由于layout的sider影响，导致更新
class Main extends PureComponent {
  render() {
    return (
      <Content>
        <Switch>
          <Route path="/app/home" component={Home} />
          <Route path="/app/manage" component={Manage} />
        </Switch>
      </Content>
    );
  }
}

export default Main;
