import Link from "next/link";
import React from "react";
import fetch from "isomorphic-fetch";
import { NextAuth } from "next-auth/client";
import {
  Row,
  Col,
  Form,
  FormGroup,
  Label,
  Input,
  Button,
  Jumbotron,
  ListGroup,
  Session,
  ListGroupItem
} from "reactstrap";
import Page from "../components/page";
import Layout from "../components/layout";
import QuestionItem from "../components/questionItem";
import Cookies from "universal-cookie";
import { FormPageFunctions } from "../components/formPageFunctions";

class Secret extends Page {
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

  generate = () => {
    console.log(this.props.session.csrfToken);
    fetch("/secret/generateData", {
      method: "POST",
      body: JSON.stringify({}),
      credentials: "include",
      headers: {
        "Content-Type": "x-www-form-urlencoded",
        "x-csrf-token": this.props.session.csrfToken
      }
    });
  };

  // delete specificquestion for now some random one
  deleteData(value) {
    fetch(`/secret/delete/${value}`, {
      method: "DELETE",
      body: JSON.stringify({}),
      credentials: "include",
      headers: {
        "Content-Type": "x-www-form-urlencoded",
        "x-csrf-token": this.props.session.csrfToken
      }
    });
  };

  render() {
    return (
      <Layout {...this.props} navmenu={false} container={false}>
        <Button onClick={this.generate}>GENERATE</Button>
        <Button onClick={this.deleteData('5d59307df80e928842ac9405')}>DELETE</Button>
      </Layout>
    );
  }
}

export default Secret;
