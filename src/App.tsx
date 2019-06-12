import React, { Component } from "react";
import { Layout } from "antd";
import Aside from "./components/Aside";
import Main from "./components/Main";

class App extends Component {
  render() {
    return (
      <div className="App">
        <Layout>
          <Aside />
          <Main />
        </Layout>
      </div>
    );
  }
}

export default App;
