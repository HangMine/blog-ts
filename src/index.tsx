import React from "react";
import ReactDOM from "react-dom";
import "./assets/css/index.scss";
import App from "./App";
import * as serviceWorker from "./serviceWorker";

// redux
import { StoreContext } from "redux-react-hook";
import { store } from "@/redux/store";

// 中文化
import { ConfigProvider } from "antd";
import zhCN from "antd/es/locale/zh_CN";

// graph
import ApolloClient from "apollo-boost";
import { ApolloProvider } from "@apollo/react-hooks";
import { SERVER } from "@/assets/js/http";
const client = new ApolloClient({
  uri: `${SERVER}/graphql`
});

ReactDOM.render(
  <StoreContext.Provider value={store}>
    <ApolloProvider client={client}>
      <ConfigProvider locale={zhCN}>
        <App />
      </ConfigProvider>
    </ApolloProvider>
  </StoreContext.Provider>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
