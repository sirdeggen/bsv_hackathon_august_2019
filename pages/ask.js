import Link from 'next/link'
import React from 'react'
import { Container, Row, Col, Button, Jumbotron, ListGroup, ListGroupItem } from 'reactstrap'
import Page from '../components/page'
import Layout from '../components/layout'
import NewQuestion from '../components/newQuestion'

class Ask extends Page {
  render () {
    return (
      <Layout {...this.props} navmenu={false} container={false}>
        <NewQuestion />
      </Layout>
    )
  }
}

export default Ask
