import React from "react";
import ReactDOM from "react-dom";
import "./assets/css/index.scss";
import App from "./App";
import * as serviceWorker from "./serviceWorker";

// redux
import { StoreContext } from "redux-react-hook";
import { store } from "@/redux/store";

// graph
import ApolloClient from 'apollo-boost';
import { ApolloProvider } from '@apollo/react-hooks';
const client = new ApolloClient({
  uri: 'http://localhost:8888/graphql',
});



ReactDOM.render(
  <StoreContext.Provider value={store}>
    <ApolloProvider client={client}>
      <App />
    </ApolloProvider>
  </StoreContext.Provider>, document.getElementById("root"));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
