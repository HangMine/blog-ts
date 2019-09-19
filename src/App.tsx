import React, { Component, useState, useEffect, useReducer, createContext } from "react";
import { Router, Route } from "react-router-dom";
import Index from "@/views";
import Login from "@/views/Login";
import history from "@/router/history";

import { useDispatch } from "redux-react-hook";
import { fetchArtcile, fetchArtcileType } from '@/redux/actions';

const init = () => {
  const dispatch = useDispatch();
  dispatch(fetchArtcile());
  dispatch(fetchArtcileType());

}

export const App = () => {
  init();
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



