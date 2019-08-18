import Link from "next/link";
import React from "react";
import {
  Container,
  Row,
  Col,
  Button,
  Jumbotron,
  ListGroup,
  ListGroupItem
} from "reactstrap";
import Page from "../components/page";
import Layout from "../components/layout";
import QuestionItem from "../components/questionItem";

class Questions extends Page {
  render() {
    return (
      <Layout {...this.props} navmenu={false} container={false}>
        <ListGroup id="questionsList" />
      </Layout>
    );
  }

  componentDidMount() {
    fetch("/questions/all", { headers: {q:null, l:25} })
      .then(res => res.json())
      .then(data => this.displayQuestions(data))
      .catch(err => console.log("Error getting Questions", err));
  }

  displayQuestions(data) {
    console.log("Questions", data);
    var ul = window.questionsList;

    for (let i = 0; i < data.length; i++) {
      const q = data[i];

      $("<a>")
        .attr("href", "/question?id=" + q._id)
        .addClass("questionsListItem")
        .append(
          $("<div>")
            .addClass("row")
            .append(
              $("<span>")
                .addClass("col-8")
                .append(q.title)
                .addClass("questionTitle")
            )
            .append(
              $("<span>")
                .append(q.answers.length + " answers")
                .addClass("col-2")
                .addClass("questionAnswerCount")
            )
            .append(
              $("<span>")
                .addClass("questionPromised")
                .addClass("col-2")
                .append(
                  q.proofs
                    .filter(p => p.type == "promise")
                    .map(p => parseInt(p.amount))
                    .reduce((a, b) => a + b, 0) + " satoshis"
                )
            )
        )
        .appendTo(ul);
    }
  }
}

export default Questions;
