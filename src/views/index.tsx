import React, { Component } from "react";
import { Route } from "react-router-dom";
import { Layout } from "antd";
import Aside from "@/components/Aside";
import Main from "@/components/Main";
const { Content } = Layout;
class App extends Component {
  render() {
    return (

      <Layout>
        <Aside />
        <Main />
      </Layout>


    );
  }
}

export default App;