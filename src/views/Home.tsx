import React, { Component } from "react";
import Card from "@/components/Card";
let cardData = [
  {
    img: require("@img/random_1.jpg"),
    title: "JavaScript的线程与进程的一些了解",
    type: 1,
  },
  {
    img: require("@img/random_1.jpg"),
    title: "JavaScript的线程与进程的一些了解",
    type: 2,
  },
  {
    img: require("@img/random_1.jpg"),
    title: "JavaScript的线程与进程的一些了解",
    type: 3,
  },
  {
    img: require("@img/random_1.jpg"),
    title: "JavaScript的线程与进程的一些了解",
  },
];

let cardItems = cardData.map((card, i) => <Card.Item key={i} data={card} />);

class Home extends Component {
  render() {
    return <Card> {cardItems} </Card>;
  }
}

export default Home;
