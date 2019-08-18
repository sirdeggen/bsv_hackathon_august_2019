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
import QuestionFull from "../components/questionFull";
import fetch from "isomorphic-fetch";

class Question extends Page {
  componentDidMount() {
    var urlParams = new URLSearchParams(window.location.search);
    var questionId = urlParams.get("id");
    console.log(questionId);
    fetch(`/questions/question/${questionId}`)
      .then(res => res.json())
      .then(data => this.displayQuestion(data))
      .catch(err => console.log("Error getting Question", err));
  }

  displayQuestion(data) {
    console.log(data);
    window.singleQuestionFull.innerHTML += `
      <h3>${data.title}</h3>
      <p class='lead'>${data.text}</p>
      <hr>
    `;
    for (let a = 0; a < data.answers.length; a++) {
      const ans = data.answers[a];
      let approval = ans.response ? ans.response.approval : "";
      window.singleQuestionFull.innerHTML += `<div class='answer card border-dark mb-3 ${approval}'>${ans.text}</div>`;
    }
  }

  render() {
    return (
      <Layout {...this.props} navmenu={false} container={false}>
        <Row className="mb-1">
          <Col xs="12">
            <QuestionFull />
          </Col>
        </Row>
      </Layout>
    );
  }
}

export default Question;
