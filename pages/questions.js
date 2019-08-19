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
        <div id="questionsList" />
      </Layout>
    );
  }

  componentDidMount() {
    fetch("/questions/all", { headers: { q: null, l: 25 } })
      .then(res => res.json())
      .then(data => {
        var idlist = data
          .map(q => q.userId)
          .filter((v, i, a) => a.indexOf(v) === i)
          .join(",");

        fetch("/account/many", { headers: { idlist: idlist } })
          .then(res => res.json())
          .then(users => this.displayQuestions(data, users))
          .catch(err => console.log(err));
      })
      .catch(err => console.log("Error getting Questions", err));
  }

  displayQuestions(data, users) {
    console.log(users)

    var table = window.questionsList;

    data = data.map(q => {
      var u = users.filter(u => u._id === q.userId);
      if (u && u.length === 1) {
        q.user = u[0];
      } else {
        q.user = { name: "Deleted User", _id: null };
      }
      return q;
    });

    $("<div>")
      .addClass("table")
      .append(
        $("<div>").addClass("row bg-primary text-white").css("padding", "10px")
    
        .append($("<div>").addClass("col-md-6 col-sm-12").append("Questions"))
        .append($("<div>").addClass("col-md-2 col-sm-4").append("Answers"))
        .append($("<div>").addClass("col-md-2 col-sm-4").append("Author"))
        .append($("<div>").addClass("col-md-2 col-sm-4").append("Value"))

      )
      .append($("<div id='tbody'>"))
      .appendTo(table);
    var tbody = window.tbody;
    for (let i = 0; i < data.length; i++) {
      const q = data[i];
      $("<a>")
        .attr("href", "/question?id=" + q._id)
        .addClass("row border table-light table-hover")
        .css("cursor", "pointer")
        .append(
          $("<div>").addClass("col-md-6 col-sm-12")
          .css("background-color", "#00000006")
          .css("overflow-x", "hidden")
            .append(q.title)
            .append(
              $("<span>")
                .append(q.text)
                .addClass("text-muted")
                .css("overflow", "hidden")
                .css("padding-left", "10px")
                .css("text-overflow", "elipsis")
                .css("overflow", "hidden")
                .css("white-space", "nowrap")
            )
        )
        .append($("<div>").addClass("col-md-2 col-sm-4").append((q.answers || []).length + " answers"))
        .append(
          $("<div>").addClass("col-md-2 col-sm-4").append(
            $("<a>")
              .attr("href", "/profile?id=" + q.userId)
              .addClass(!q.user._id ? "faded" : "btn btn-outline-primary")
              .append(q.user.name.substr(0, 100))
          )
        )
        .append(
          $("<div>").addClass("col-md-2 col-sm-4")
            .css("text-align", "right")
            .append(
              q.proofs
                .filter(p => p.type == "promise")
                .map(p => parseInt(p.amount))
                .reduce((a, b) => a + b, 0) + " satoshis"
            )
        )

        .appendTo(tbody);
    }
  }
}

export default Questions;
