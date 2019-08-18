import Link from 'next/link'
import React from 'react'
import { Container, Row, Col, Button, Jumbotron, ListGroup, ListGroupItem } from 'reactstrap'
import Page from '../components/page'
import Layout from '../components/layout'
import QuestionFull from '../components/questionFull'
import fetch from 'isomorphic-fetch'

class Question extends Page {
  componentDidMount () {
    var urlParams = new URLSearchParams(window.location.search)
    var questionId = urlParams.get('id')
    fetch(`/questions/question/${questionId}`)
      .then(res => res.json())
      .then(data => this.displayQuestion(data))
      .catch(err => console.log("Error getting Question", err))
  }

  displayQuestion (data) {
    console.log(data)
  }

  render () {
    return (
      <Layout {...this.props} navmenu={false} container={false}>
        <QuestionFull />
      </Layout>
    )
  }
}

export default Question
