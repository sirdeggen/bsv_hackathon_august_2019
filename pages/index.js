import Link from "next/link";
import React from "react";
import {
  Container,
  Row,
  Col,
  Image,
  NavLink,
  Button,
  Jumbotron,
  ListGroup,
  ListGroupItem
} from "reactstrap";
import Page from "../components/page";
import Layout from "../components/layout";

export default class extends Page {
  render() {
    return (
      <Layout {...this.props} navmenu={false} container={false}>
        <Container id="frontPageWrapper" style={{ textAlign: "center" }}>
          <br />
          <div id="frontPageMainCard" style={{ width: "60%", margin: "auto" }}>
            <img
              className="card-img-top"
              src="../static/images/sqaure.jpg"
              alt="Card image cap"
              style={{ maxWidth: "50%", margin: "auto" }}
            />
            <div className="card-body">
              <h2 className="card-title">Information is Value</h2>
              <p className="card-text">
                Asking is free, but if you offer a reward, <br />
                the quality of the answers is likely to improve.
              </p>
              <NavLink href="/ask">
                <button className="btn btn-primary">
                  <h3> Ask A Question </h3>
                </button>
              </NavLink>
            </div>
          </div>

          <hr />
          <div className="row">
            <div className="col-4">
              <h3>Questions Asked:</h3>
              <h5>452</h5>
              <span className="faded">(hardcoded value)</span>
            </div>
            <div className="col-4">
              <h3>Answers Given</h3>
              <h5>3242</h5>
              <span className="faded">(hardcoded value)</span>
            </div>
            <div className="col-4">
              <h3>Bitcoins Earned</h3>
              <h5>4.3214 BSV</h5>
              <span className="faded">(hardcoded value)</span>
            </div>
          </div>
          <hr />
        </Container>
      </Layout>
    );
  }
}
