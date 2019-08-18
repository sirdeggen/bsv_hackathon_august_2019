import Link from 'next/link'
import React from 'react'
import fetch from 'isomorphic-fetch'
import { NextAuth } from 'next-auth/client'
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
} from 'reactstrap'
import Page from './page'
import Layout from './layout'
import QuestionItem from './questionItem'
import Cookies from 'universal-cookie'

class FormPageFunctions {
  static async getInitialProps (self, { req }, props) {
    props.linkedAccounts = await NextAuth.linked({ req })
    return props
  }

  static construct (self, props) {
    self.state = {
      session: props.session,
      isSignedIn: !!props.session.user,
      name: '',
      email: '',
      emailVerified: false,
      alertText: null,
      alertStyle: null
    }
    if (props.session.user) {
      self.state.name = props.session.user.name
      self.state.email = props.session.user.email
    }
  }

  static async componentDidMount (self) {
    const session = await NextAuth.init({ force: true })
    self.setState({
      session: session,
      isSignedIn: !!session.user
    })

    // If the user bounces off to link/unlink their account we want them to
    // land back here after signing in with the other service / unlinking.
    const cookies = new Cookies()
    cookies.set('redirect_url', window.location.pathname, { path: '/' })

    fetch('/account/user', {
      credentials: 'include'
    })
      .then(r => r.json())
      .then(user => {
        if (!user.name || !user.email) return
        self.setState({
          name: user.name,
          email: user.email,
          emailVerified: user.emailVerified
        })
      })
  }
}

export { FormPageFunctions }
