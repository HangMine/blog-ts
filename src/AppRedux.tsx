import React, { Component, useState, useEffect, useReducer, createContext } from "react";
import { Router, Route } from "react-router-dom";
import Index from "@/views";
import Login from "@/views/Login";
import history from "@/router/history";

import { connect } from "react-redux";

export function App(props: any) {
  const { counter, increment, decrement } = props;
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


const mapStateToProps = (state: any) => ({
  counter: state.counter
});

const mapDispatchToProps = (dispatch: any) => ({
  increment: () => dispatch({ type: "INCREMENT" }),
  decrement: () => dispatch({ type: "DECREMENT" })
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App);



