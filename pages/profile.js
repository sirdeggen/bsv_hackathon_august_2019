// Profile Page
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

class Profile extends Page {
  render() {
    return (
      <Layout {...this.props} navmenu={false} container={false}>
        <Container>
          {this.getGreeting()}
          <ListGroup id="profileQuestionsOverview" />
          <ListGroup id="profileAnswersOverview" />
        </Container>
      </Layout>
    );
  }

  getGreeting = () => {
    if (this.props.session && this.props.session.user) {
      return (
        <div id="profileGreeting">
          <div> Hello {this.props.session.user.name}</div>
          <Link href="/account">
            <Button className="btn btn-outline-primary">
              Go to Settings...
            </Button>
          </Link>
        </div>
      );
    } else {
      return null;
    }
  };

  componentDidMount = () => {
    var userID = this.props.session.user.id;
    fetch("/questions/user/" + userID, { headers: { l: 10 } })
      .then(res => res.json())
      .then(data => this.displayQuestions(data))
      .catch(err => console.log("Error getting Questions", err));

    fetch("/questions/answered/" + userID, { headers: { l: 10 } })
      .then(res => res.json())
      .then(data => this.displayAnswers(data))
      .catch(err => console.log("Error getting Questions", err));
  };

  displayQuestions = data => {
    console.log("Questions", data);
    var ul = window.profileQuestionsOverview;

    $("<h2>")
      .append("Recent Questions")
      .appendTo(ul);

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
  };

  displayAnswers = data => {
    console.log("Answers", data);
    var ul = window.profileAnswersOverview;

    $("<h2>")
      .append("Recent Answers")
      .appendTo(ul);

    var answers = data
      .map(q =>
        q.answers.map(a => {
          a.qId = q._id;
          a.qTitle = q.title;
          return a;
        })
      )
      .reduce((a, b) => a.concat(b), [])
      .filter(a => a.userId === this.props.session.user.id);

    for (let i = 0; i < answers.length; i++) {
      const a = answers[i];

      var answerResponse = "Unchecked";
      var answerResponseClass = "answer-unchecked";
      if (a.response && a.response.approval == false) {
        answerResponse = "Bad Answer";
        answerResponseClass = "answer-bad";
      }
      if (a.response && a.response.approval) {
        answerResponse =
          "<a href='https://whatsonchain.com/tx/" +
          a.response.payment.txId +
          "'><button class='btn btn-outline-success'>Received " +
          a.response.payment.amount +
          " Sat</button></a>";
        answerResponseClass = "answer-good";
      }

      $("<a>")
        .attr("href", "/question?id=" + a.qId)
        .addClass("answerListItem")
        .append(
          $("<div>")
            .addClass("row")
            .append(
              $("<div>")
                .addClass("col col-8")
                .append(
                  $("<div>")
                  .append("Q: ").append(
                    $("<span>")
                      .addClass("answer-questionTitle")
                      .append(a.qTitle)
                  )
                )
                .append(
                  $("<div>")
                    .addClass("answerText")
                    .append("A: ")
                    .append($("<span>").append(a.text))
                )
            )
            .append(
              $("<span>")
                .append(answerResponse)
                .addClass("col-2")
                .addClass("answerResponse")
                .addClass(answerResponseClass)
            )
            .append(
              $("<span>")
                .addClass("questionPromised")
                .addClass("col-2")
                .append(a.ontime ? "Answered on time" : "Answer was late")
            )
        )
        .appendTo(ul);
    }
  };
}

export default Profile;
