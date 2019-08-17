import Link from 'next/link'
import React from 'react'
import { Container, Row, Col, Button, Jumbotron, ListGroup, ListGroupItem } from 'reactstrap'
import Page from '../components/page'
import Layout from '../components/layout'
import QuestionItem from '../components/questionItem'

class Questions extends Page {
  render () {
    return (
      <Layout {...this.props} navmenu={false} container={false}>
        <QuestionItem />
      </Layout>
    )
  }
}

export default Questions
