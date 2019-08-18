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

  componentDidMount() {
    fetch("/questions/all", { headers: { q: null, l: 25 } })
      .then(res => res.json())
      .then(data => this.displayQuestions(data))
      .catch(err => console.log("Error getting Questions", err));
  }

  displayQuestions = data => {
    console.log(data);
  };
}

export default Profile;
