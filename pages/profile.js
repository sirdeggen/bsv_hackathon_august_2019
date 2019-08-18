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
    var userID = this.props.session.user.id
    fetch("/questions/user/" + userID, { headers: { l: 10 } })
      .then(res => res.json())
      .then(data => this.displayQuestions(data))
      .catch(err => console.log("Error getting Questions", err));
  }

  displayQuestions = data => {
    console.log("Questions", data);
    var ul = window.profileQuestionsOverview;

    $("<h2>").append("Recent Questions").appendTo(ul);

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

export default Profile;
