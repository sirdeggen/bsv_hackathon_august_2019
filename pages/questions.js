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
      .then(data => this.displayQuestions(data))
      .catch(err => console.log("Error getting Questions", err));
  }

  displayQuestions(data) {
    console.log("Questions", data);
    var table = window.questionsList;

    $("<table>")
      .addClass("table")
      .append(
        `<thead>
          <tr class='table-primary'>
            <th scope="col">Questions</th>
            <th scope="col">Answers</th>
            <th scope="col" style="text-align: right;">Value</th>
          </tr>
        </thead>`
      )
      .append(
        $("<tbody id='tbody'>")
      )
      .appendTo(table);
    var tbody = window.tbody;
    for (let i = 0; i < data.length; i++) {
      const q = data[i];
      $("<tr>")
        .attr("onClick", "window.location.href='/question?id=" + q._id + "'")
        .addClass("table-light table-hover")
        .css("cursor", "pointer")
        .append(
          $("<td>")
            .append(q.title)
            .append(
              $("<span>")
                .append(q.text)
                .addClass('text-muted')
                .css("overflow", "hidden")
                .css("padding-left", "10px")
                .css("text-overflow", "elipsis")
                .css("overflow", "hidden")
                .css("white-space", "nowrap")
            )
          )
        .append(
          $("<td>")
            .append(q.answers.length + " answers")
        )
        .append(
          $("<td>")
            .css('text-align', 'right')
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
