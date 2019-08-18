import React, { Component } from "react";
import { Nav, Button, NavItem, NavLink } from "reactstrap";
import { NextAuth } from "next-auth/client";
import Router from "next/router";
import Cookies from "universal-cookie";
import { FormPageFunctions } from "../components/formPageFunctions";

class UserMenu extends Component {
  static async getInitialProps({ req }) {
    let props = await super.getInitialProps({ req });
    return FormPageFunctions.getInitialProps(this, req, props);
  }
  constructor(props) {
    super(props);
    FormPageFunctions.construct(this, props);
    this.handleSignoutSubmit = this.handleSignoutSubmit.bind(this);
  }
  async componentDidMount() {
    FormPageFunctions.componentDidMount(this);
  }

  async handleSignoutSubmit(event) {
    event.preventDefault();

    // Save current URL so user is redirected back here after signing out
    const cookies = new Cookies();
    cookies.set("redirect_url", window.location.pathname, { path: "/" });

    await NextAuth.signout();
    Router.push("/");
  }

  render() {
    if (this.props.session && this.props.session.user) {
      // If signed in display user dropdown menu
      const session = this.props.session;
      return (
        <Nav id="topNavigation" navbar>
          <NavLink href="/ask" className="topNavItem btn btn-outline-primary">
            Ask
          </NavLink>
          <NavLink
            href="/questions"
            className="topNavItem btn btn-outline-primary"
          >
            Questions
          </NavLink>
          <NavLink
            href={"/profile?id=" + this.props.session.user.id}
            className="topNavItem btn btn-outline-primary"
          >
            Profile
          </NavLink>
          <NavLink
            href="/account/logout"
            className="topNavItem topNavItem-logout btn btn-outline-primary"
          >
            Logout
          </NavLink>
        </Nav>
      );
    } else {
      // If not signed in, display sign in button
      return (
        <Nav id="topNavigation" navbar>
          <NavLink href="/ask" className="topNavItem btn btn-outline-primary">
            Ask
          </NavLink>
          <NavLink
            href="/questions"
            className="topNavItem btn btn-outline-primary"
          >
            Questions
          </NavLink>
          <NavLink
            href="/auth?redirect=/"
            className="topNavItem btn btn-outline-primary"
          >
            {/**
             * @TODO Add support for passing current URL path as redirect URL
             * so that users without JavaScript are also redirected to the page
             * they were on before they signed in.
             **/}
            <span onClick={this.props.toggleModal}>Sign up / Sign in</span>
          </NavLink>
        </Nav>
      );
    }
  }
}

export default UserMenu;
