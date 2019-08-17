import React, { Component } from 'react'
import { Nav, NavItem, NavLink } from 'reactstrap'
import { NextAuth } from 'next-auth/client'
import Router from 'next/router'
import Cookies from 'universal-cookie'

class UserMenu extends Component {
  constructor (props) {
    super(props)
    this.handleSignoutSubmit = this.handleSignoutSubmit.bind(this)
  }

  async handleSignoutSubmit (event) {
    event.preventDefault()

    // Save current URL so user is redirected back here after signing out
    const cookies = new Cookies()
    cookies.set('redirect_url', window.location.pathname, { path: '/' })

    await NextAuth.signout()
    Router.push('/')
  }

  render () {
    if (this.props.session && this.props.session.user) {
      // If signed in display user dropdown menu
      const session = this.props.session
      return (
        <Nav className='ml-auto navbar'>
          <NavLink className='dropdownitem' href='/ask'>
            Ask
          </NavLink>
          <NavLink className='dropdownitem' href='/questions'>
            Questions
          </NavLink>
          <NavLink className='dropdownitem' href='/profile'>
            Profile
          </NavLink>
          {/* <!-- Uses .nojs-dropdown CSS to for a dropdown that works without client side JavaScript -> */}
          <div tabIndex='2' className='dropdown nojs-dropdown'>
            <div className='nav-item'>
              <span className='dropdown-toggle nav-link d-none d-md-block'>
                <span className='icon ion-md-contact' style={{ fontSize: '2em', position: 'absolute', top: -5, left: -25 }} />
              </span>
              <span className='dropdown-toggle nav-link d-block d-md-none'>
                <span className='icon ion-md-contact mr-2' />
                {session.user.name || session.user.email}
              </span>
            </div>
          </div>
        </Nav>
      )
    } if (this.props.signinBtn === false) {
      // If not signed in, don't display sign in button if disabled
      return null
    } else {
      // If not signed in, display sign in button
      return (
        <Nav className='ml-auto' navbar>
          <NavItem>
            <NavLink className='dropdownitem' href='/ask'>
              Ask
            </NavLink>
            <NavLink className='dropdownitem' href='/questions'>
              Questions
            </NavLink>
            {/**
              * @TODO Add support for passing current URL path as redirect URL
              * so that users without JavaScript are also redirected to the page
              * they were on before they signed in.
              **/}
            <a href='/auth?redirect=/' className='btn btn-outline-primary' onClick={this.props.toggleModal}><span className='icon ion-md-log-in mr-1' /> Sign up / Sign in</a>
          </NavItem>
        </Nav>
      )
    }
  }
}

export default UserMenu
