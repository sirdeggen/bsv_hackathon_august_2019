import Link from "next/link";
import Router from "next/router";
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

    function createPaymentButton(div, address, amount) {
      console.log("Moneybutton Activated");
      moneyButton.render(div, {
        to: "d@moneybutton.com",
        amount: "0.01",
        currency: "GBP"
      });
    }
    fetch(`/questions/question/${questionId}`)
      .then(res => res.json())
      .then(data => {
        this.displayQuestion(data);
        this.displayAnswerInput(data);
      })
      .catch(err => console.log("Error getting Question", err));
  }

  displayQuestion(data) {
    console.log(data);
    var allAnswers = "";
    var paid = 0;
    var authors = [];
    data.answers = data.answers || [];

    var badAnswers = data.answers.filter(
      a => a.response && !a.response.approval
    );
    var paidAnswers = data.answers.filter(
      a => a.response && a.response.approval
    );
    var uncheckedAnswers = data.answers.filter(a => !a.response);

    function addAnswer(a, partAnswers) {
      var ans = partAnswers[a];
      var apprcolor = "";
      var apprtitle = "";
      var earned = "";
      authors.push(ans.userId);
      var cardActions = `<i class="fas fa-check-square cardApprove" author="${ans.userId}"></i><i class="fas fa-ban cardDisapprove"></i>`;
      // style depends on response types
      if (ans.response) {
        apprcolor = ans.response.approval
          ? "border-success"
          : "bg-secondary border-danger faded";
        apprtitle = ans.response.approval ? "Approved" : "Invalid";
        earned = ans.response.approval
          ? `<span class="badge badge-success approvedBSV">Earned &#8383;SV</span>`
          : "";
      } else {
        apprcolor = "bg-light";
        apprtitle = "Not Yet Approved";
      }
      // progress bar percentage calculation
      var payamount = "";
      try {
        payamount = ans.response.payment.amount;
        paid += parseInt(payamount);
      } catch (er) {}
      apprtitle += ans.ontime ? " - On Time" : " - Late";
      allAnswers += `<div class='answer card mb-3 ${apprcolor}'>
      <div class="card-header">${earned}${apprtitle}${cardActions}</div><div class="card-body">${ans.text}</div></div>`;
    }

    for (let a = 0; a < paidAnswers.length; a++) {
      addAnswer(a, paidAnswers);
    }
    for (let a = 0; a < uncheckedAnswers.length; a++) {
      addAnswer(a, uncheckedAnswers);
    }
    for (let a = 0; a < badAnswers.length; a++) {
      addAnswer(a, badAnswers);
    }

    window.singleQuestionFull.innerHTML += `
      <h3>${data.title}</h3>
      <p class='lead'>${data.text}</p>
    `;
    var promised = 0;
    for (let p = 0; p < data.proofs.length; p++) {
      promised += parseInt(data.proofs[p].amount);
    }
    var completion = String(Math.floor((paid / promised) * 100));
    var completionBar = `
    <i class="fas fa-hand-holding-usd moneyBar"></i>
    <div class='progress'>
      <div class='progress-bar bg-success' role='progressbar' style='width: ${completion}%' aria-valuenow='${completion}' aria-valuemin='0' aria-valuemax='100'></div>
    </div>
    <div id="questionPostAnswerWrapper"></div>`;
    window.singleQuestionFull.innerHTML += completionBar;
    window.singleQuestionFull.innerHTML += allAnswers;

    var idlist = authors.filter((v, i, a) => a.indexOf(v) === i).join(",");

    var authorsAddresses = [];
    fetch("/account/many", { headers: { idlist: idlist } })
      .then(res => res.json())
      .then(users => {
        authorsAddresses.push(users);
      })
      .catch(err => {
        console.log(err);
      });

    var answerApproves = document.querySelectorAll(".cardApprove");
    answerApproves.forEach(a => {
      var targetMBid = "target-" + bsv.PrivateKey.fromRandom().toString().substr(0,10);
      a.parentElement.parentElement.appendChild("<div class='mbTarget' id='" + targetMBid + "'></div>");
      a.addEventListener("click", function(event) {
        var authorId = String(a.attributes.author.value);
        var authorDetails = authorsAddresses[0].filter(
          item => String(item._id) === authorId
        );
        var authorAddress = authorDetails[0].bsvAddress;
        var amountToOffer = promised - paid;
        if (amountToOffer <= 0) {
          amountToOffer = 1000000;
        }
        console.log("Pay " + authorAddress + amountToOffer + " satsoshis");

      });
    });
  }

  displayAnswerInput = data => {
    $("#questionPostAnswerWrapper")
      .append(
        $("<textarea>")
          .addClass("col-12")
          .attr("id", "questionAnswerTextInput")
          .attr("rows", 4)
          .attr(
            "placeholder",
            "Write your answer. " +
              (data.expiry > new Date().getTime()
                ? "The reward period has not expired yet."
                : "The reward expired, but you could still be helpful")
          )
      )
      .append(
        $("<button>")
          .append("Submit")
          .addClass("btn btn-success col-4")
          .on("click", () => this.submitAnswerToQuestion(data._id))
      );
  };

  submitAnswerToQuestion = qid => {
    var text = window.questionAnswerTextInput.value.toString();
    if (text.length === 0) return alert("Cannot Submit an empty reply.");

    fetch("/questions/question/" + qid + "/answer", {
      method: "POST",
      body: JSON.stringify({ text: text }),
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        "x-csrf-token": this.props.session.csrfToken
      }
    })
      .then(res => res.text())
      .then(data => {
        location.reload();
      })
      .catch(err => this.showInputError(err));
  };

  render() {
    return (
      <Layout {...this.props} navmenu={false} container={false}>
        <QuestionFull />
      </Layout>
    );
  }
}

export default Question;
