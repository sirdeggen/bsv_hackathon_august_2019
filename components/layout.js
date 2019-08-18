import React from 'react'
import Router from 'next/router'
import Head from 'next/head'
import Link from 'next/link'
import { Container, Row, Col, Nav, NavItem, Button, Form, NavLink, Collapse,
  Navbar, NavbarToggler, NavbarBrand, Modal, ModalHeader, ModalBody,
  ModalFooter, ListGroup, ListGroupItem } from 'reactstrap'
import Signin from './signin'
import { NextAuth } from 'next-auth/client'
import Cookies from 'universal-cookie'
import Package from '../package'
import Footer from '../components/footer'
import UserMenu from '../components/userMenu'

export default class extends React.Component {
  static propTypes () {
    return {
      session: React.PropTypes.object.isRequired,
      providers: React.PropTypes.object.isRequired,
      children: React.PropTypes.object.isRequired,
      fluid: React.PropTypes.boolean,
      navmenu: React.PropTypes.boolean,
      signinBtn: React.PropTypes.boolean
    }
  }

  constructor (props) {
    super(props)
    this.state = {
      navOpen: false,
      modal: false,
      providers: null
    }
    this.toggleModal = this.toggleModal.bind(this)
  }

  async toggleModal (e) {
    if (e) e.preventDefault()

    // Save current URL so user is redirected back here after signing in
    if (this.state.modal !== true) {
      const cookies = new Cookies()
      cookies.set('redirect_url', window.location.pathname, { path: '/' })
    }

    this.setState({
      providers: this.state.providers || await NextAuth.providers(),
      modal: !this.state.modal
    })
  }

  render () {
    return (
      <React.Fragment>
        <Head>
          <meta charSet='UTF-8' />
          <meta name='viewport' content='width=device-width, initial-scale=1' />
          <title>{this.props.title || 'Ask The World'}</title>
          <script src='https://cdn.polyfill.io/v2/polyfill.min.js' />
          <link href='../static/css/bootstrap.min.css' rel='stylesheet' />
          <link href='../static/css/base.css' rel='stylesheet' />
        </Head>
        <MainBody navmenu={this.props.navmenu} fluid={this.props.fluid} container={this.props.container}>
          <header id="layoutHeader">
            <img id="mainLogo" src="../static/images/lockup.jpg" />
            <UserMenu />
          </header>
          {this.props.children}
        </MainBody>
        <Container fluid={this.props.fluid}>
          <Footer />
        </Container>
        <SigninModal modal={this.state.modal} toggleModal={this.toggleModal} session={this.props.session} providers={this.state.providers} />
      </React.Fragment>
    )
  }
}

export class MainBody extends React.Component {
  render () {
    if (this.props.container === false) {
      return (
        <React.Fragment>
          {this.props.children}
        </React.Fragment>
      )
    } else if (this.props.navmenu === false) {
      return (
        <Container fluid={this.props.fluid} style={{ marginTop: '1em' }}>
          {this.props.children}
        </Container>
      )
    } else {
      return (
        <Container fluid={this.props.fluid} style={{ marginTop: '1em' }} />
      )
    }
  }
}

export class SigninModal extends React.Component {
  render () {
    if (this.props.providers === null) return null

    return (
      <Modal isOpen={this.props.modal} toggle={this.props.toggleModal} style={{ maxWidth: 700 }}>
        <ModalHeader>Sign up / Sign in</ModalHeader>
        <ModalBody style={{ padding: '1em 2em' }}>
          <Signin session={this.props.session} providers={this.props.providers} />
        </ModalBody>
      </Modal>
    )
  }
}
