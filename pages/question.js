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
    var allAnswers;
    var paid = 0;
    for (let a = 0; a < data.answers.length; a++) {
      const ans = data.answers[a];
      var apprcolor;
      var apprtitle;
      // style depends on response types
      if (ans.response) {
        apprcolor = ans.response.approval
          ? "bg-success text-white"
          : "bg-secondary border-danger faded";
        apprtitle = ans.response.approval ? "Approved" : "Invalid";
      } else {
        apprcolor = "bg-light";
        apprtitle = "Not Yet Approved";
      }
      // progress bar percentage calculation
      try {
        paid += ans.response.payment.amount;
      } catch (er) {
        console.log(er);
      }
      apprtitle += ans.ontime ? " - On Time" : " - Late";
      allAnswers += `<div class='answer card mb-3 ${apprcolor}'>
      <div class="card-header">${apprtitle}</div><div class="card-body">${ans.text}</div></div>`;
    }
    window.singleQuestionFull.innerHTML += `
      <h3>${data.title}</h3>
      <p class='lead'>${data.text}</p>
    `;
    var promised = 0;
    for (let p = 0; p < data.proofs.length; p++) {
      promised += data.proofs[p].amount;
    }
    var completion = Math.floor(paid / promised);
    var completionBar = `
    <h6>Payout: </h6>
    <div class='progress'>
      <div class='progress-bar bg-info' role='progressbar' style='width: ${completion}%' aria-valuenow='${completion}' aria-valuemin='0' aria-valuemax='100'></div>
    </div>
    <hr>`;
    window.singleQuestionFull.innerHTML += completionBar;
    window.singleQuestionFull.innerHTML += allAnswers;
  }

  render() {
    return (
      <Layout {...this.props} navmenu={false} container={false}>
        <QuestionFull />
      </Layout>
    );
  }
}

export default Question;
