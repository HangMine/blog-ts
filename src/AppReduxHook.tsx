import React, { Component, useState, useEffect, useReducer, createContext } from "react";
import { Router, Route } from "react-router-dom";
import Index from "@/views";
import Login from "@/views/Login";
import history from "@/router/history";

import { useMappedState, useDispatch } from "redux-react-hook";

export function App() {
  const counter = useMappedState(state => state.counter);
  const dispatch = useDispatch();
  console.log(counter);
  return (
    <Router history={history}>
      <div className="app">
        <Route exact path="/" component={Login}></Route>
        <Route path="/app" component={Index}></Route>
        <Route path="/login" component={Login}></Route>
      </div>
    </Router>
  );
}

export default App;



