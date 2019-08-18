import Link from "next/link";
import Router from 'next/router';
import React from "react";
import {
  Container,
  Row,
  Col,
  Button,
  Label,
  Input,
  Select,
  Option,
  Jumbotron,
  ListGroup,
  ListGroupItem
} from "reactstrap";
import Page from "../components/page";
import Layout from "../components/layout";

import { FormPageFunctions } from "../components/formPageFunctions";

class Ask extends Page {
  static async getInitialProps({ req }) {
    let props = await super.getInitialProps({ req });
    return FormPageFunctions.getInitialProps(this, req, props);
  }
  constructor(props) {
    super(props);
    FormPageFunctions.construct(this, props);
  }
  async componentDidMount() {
    FormPageFunctions.componentDidMount(this);
  }

  render() {
    if (!this.props.session || !this.props.session.user) {
      return (
        <Layout {...this.props} navmenu={false} container={false}>
          <h2>You need to be logged in in order to Ask a question.</h2>
          <h4>
            Once you enter your account, you will be able to ask your question.
          </h4>
          <Link id="loginRedirectLink" href="/auth?redirect=/ask">
            <Button className="btn btn-outline-primary">
              Click here to Login
            </Button>
          </Link>
        </Layout>
      );
    }

    return (
      <Layout {...this.props} navmenu={false} container={false}>
        <Container id="newQuestionWrapper">
          <h2>New Question</h2>

          <div id="questionAlerts" />

          <div>
            <Label for="questionTitleInput">Title of your question</Label>
            <Input
              className="ask-input"
              id="questionTitleInput"
              placeholder="title"
            />
          </div>
          <div>
            <Label for="questionDetailsInput">Describe the question</Label>
            <textarea
              className="ask-input col-12"
              id="questionDetailsInput"
              placeholder="Details"
              rows="10"
            />
            <Label id="questionTagsInDetailInput" />
          </div>
          <div>
            <Label for="questionPromiseReward">Promise Reward</Label>
            <Input
              className="ask-input col-5"
              type="number"
              min="0"
              id="questionPromiseReward"
              placeholder="reward in satoshies"
            />
          </div>

          <div>
            <Label for="questionExpiration">Reward Expiration:</Label>
            <div>
              <select className="col-5" id="questionExpiration">
                <option value="12">12 hours</option>
                <option value="24">1 day</option>
                <option value={"" + 24 * 3}>3 days</option>
                <option value={"" + 24 * 7}>1 week</option>
                <option value={"" + 24 * 30}>1 month</option>
                <option value={"" + 24 * 365}>1 year</option>
                <option value={"" + 24 * 365 * 10}>10 years</option>
              </select>
            </div>
          </div>

          <div style={{ textAlign: "center" }}>
            <Input
              className="ask-input"
              type="checkbox"
              value="8000000"
              id="questionRewardLock"
              placeholder="title"
            />
            <Label for="questionRewardLock">
              Lock the Reward <br />
              (to prove that you have the money available)
            </Label>
          </div>
          <Button id="newQuestionSubmit" className="btn-success col-12">
            ASK
          </Button>
        </Container>
      </Layout>
    );
  }

  getTagsFromText = text => {
    var regex = /\B#\w*[a-zA-Z1-90]+\w*/g;
    var tags = text.match(regex) || [];
    return tags;
  };

  updateTags = e => {
    var text = window.questionDetailsInput.value;
    var tags = this.getTagsFromText(text);
    if (tags.length > 0) {
      window.questionTagsInDetailInput.innerText = "Tags: " + tags.join(", ");
    } else {
      window.questionTagsInDetailInput.innerText = "No tags detected";
    }
  };

  componentDidMount() {
    if (!this.props.session || !this.props.session.user) {
      return;
    }

    window.questionDetailsInput.onkeyup = this.updateTags;
    this.updateTags();
    window.newQuestionSubmit.onclick = this.submitQuestion;
    // this.setMockValues();
  }

  setMockValues = () => {
    window.questionTitleInput.value =
      "What is the answer to life, the universe and everything?";
    window.questionDetailsInput.value =
      "Don't tell me it's #42!!! I don't believe that nonsense! Give me the #real #answer!!!";
    this.updateTags();
    window.questionPromiseReward.value = 99999999999999;
  };

  showInputError = errorText => {
    $(window.questionAlerts)
      .empty()
      .append(
        $("<div>")
          .addClass("alert")
          .addClass("alert-danger")
          .append($("<span>").append(errorText))
      );
  };

  submitQuestion = () => {
    var question = {};

    // "title": "What does the fromRandom() method do?",
    question.title = window.questionTitleInput.value;
    if (question.title.length < 10)
      return this.showInputError("The title is too short");

    // "text": "What does the method bsv.HDPrivateKey.fromRandom() do?",
    question.text = window.questionDetailsInput.value;
    if (question.text.length < 20)
      return this.showInputError("The text is too short");

    // "tags": "[ '#bsv', '#javascript' ]",
    question.tags = this.getTagsFromText(question.text);

    // "timestamp": "1566199188637",
    question.timestamp = new Date().getTime();

    // "expiry": "1566209298637",
    question.expiry =
      question.timestamp +
      parseInt(window.questionExpiration.value) * 60 * 60 * 1000;

    question.proofs = [
      //   { "type": "inquestion", "amount": "800000" },
      // NOT SUPPORTED YET

      //   { "type": "promise", "amount": "8000000" }
      {
        type: "promise",
        amount: Math.max(0, parseInt(window.questionPromiseReward.value))
      }
    ];
    if (question.proofs[0].amount < 0)
      this.showInputError("Reward cannot be smaller than 0");

    this.postQuestion(question);
  };

  postQuestion = questionObject => {
    console.log(this.props.session.csrfToken);
    fetch("/ask", {
      method: "POST",
      body: JSON.stringify(questionObject),
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        "x-csrf-token": this.props.session.csrfToken
      }
    })
      .then(res => res.json())
      .then(data => Router.push("/question?id=" + data._id))
      .catch(err => this.showInputError(err));
  };
}

export default Ask;
