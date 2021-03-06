import Link from 'next/link'
import Router from 'next/router'
import React from 'react'
import {
  Container,
  Row,
  Col,
  Button,
  Jumbotron,
  ListGroup,
  ListGroupItem
} from 'reactstrap'
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
      .then(data => {
        this.displayQuestion(data)
        this.displayAnswerInput(data)
      })
      .catch(err => console.log('Error getting Question', err))

      var closebox = document.querySelectorAll('.close')
      closebox.forEach( (x) => {
        x.addEventListener('click', function (event) {
          x.parentElement.style.display = "none"
        })
      })
  }

  displayQuestion (data) {
    console.log(data)
    var allAnswers = ''
    var paid = 0
    var authors = []
    data.answers = data.answers || []

    var badAnswers = data.answers.filter(
      a => a.response && !a.response.approval
    )
    var paidAnswers = data.answers.filter(
      a => a.response && a.response.approval
    )
    var uncheckedAnswers = data.answers.filter(a => !a.response)

    function addAnswer (a, partAnswers) {
      var ans = partAnswers[a]
      var apprcolor = ''
      var apprtitle = ''
      var earned = ''
      authors.push(ans.userId)
      var cardActions = `<i class="fas fa-check-square cardApprove" author="${ans.userId}"></i><i class="fas fa-ban cardDisapprove"></i>`
      // style depends on response types
      if (ans.response) {
        apprcolor = ans.response.approval
          ? 'border-success'
          : 'bg-secondary border-danger faded'
        apprtitle = ans.response.approval ? 'Approved' : 'Invalid'
        earned = ans.response.approval
          ? `<span class="badge badge-success approvedBSV">Earned &#8383;SV</span>`
          : ''
      } else {
        apprcolor = 'bg-light'
        apprtitle = 'Not Yet Approved'
      }
      // progress bar percentage calculation
      var payamount = ''
      try {
        payamount = ans.response.payment.amount
        paid += parseInt(payamount)
      } catch (er) {}
      apprtitle += ans.ontime ? ' - On Time' : ' - Late'
      allAnswers += `<div class='answer card mb-3 ${apprcolor}'>
      <div class="card-header">${earned}${apprtitle}${cardActions}</div><div class="card-body">${ans.text}</div></div>`
    }

    for (let a = 0; a < paidAnswers.length; a++) {
      addAnswer(a, paidAnswers)
    }
    for (let a = 0; a < uncheckedAnswers.length; a++) {
      addAnswer(a, uncheckedAnswers)
    }
    for (let a = 0; a < badAnswers.length; a++) {
      addAnswer(a, badAnswers)
    }

    window.singleQuestionFull.innerHTML += `
      <h3>${data.title}</h3>
      <p class='lead'>${data.text}</p>
    `
    var promised = 0
    for (let p = 0; p < data.proofs.length; p++) {
      promised += parseInt(data.proofs[p].amount)
    }
    var completion = String(Math.floor((paid / promised) * 100))
    var completionBar = `
    <i class="fas fa-hand-holding-usd moneyBar"></i>
    <div class='progress'>
      <div class='progress-bar bg-success' role='progressbar' style='width: ${completion}%' aria-valuenow='${completion}' aria-valuemin='0' aria-valuemax='100'></div>
    </div>
    <div id="questionPostAnswerWrapper"></div>`
    window.singleQuestionFull.innerHTML += completionBar
    window.singleQuestionFull.innerHTML += allAnswers

    var idlist = authors.filter((v, i, a) => a.indexOf(v) === i).join(',')

    var authorsAddresses = []
    fetch('/account/many', { headers: { idlist: idlist } })
      .then(res => res.json())
      .then(users => {
        authorsAddresses.push(users)
      })
      .catch(err => {
        console.log(err)
      })

    var answerApproves = document.querySelectorAll('.cardApprove')
    answerApproves.forEach(a => {
      var targetMBid =
        'target' +
        bsv.PrivateKey.fromRandom()
          .toString()
          .substr(0, 10)
      var targetHTML = `<div class='mbTarget' id='${targetMBid}'></div>`
      console.log(targetMBid)
      document.getElementById('target').innerHTML += targetHTML
      a.addEventListener('click', function (event) {
        document.querySelector('.alert-dismissible').style.display = 'block'
        var authorId = String(a.attributes.author.value)
        var authorDetails = authorsAddresses[0].filter(
          item => String(item._id) === authorId
        )
        var authorAddress = authorDetails[0].bsvAddress
        document.querySelector('.authorMoneyButton').innerText = authorDetails[0].name
        // moneybutton to that address
        var amountToOffer = (promised - paid) / 100000000.0
        if (amountToOffer <= 0) {
          amountToOffer = 0.01
        }
        console.log('Pay ' + authorAddress + ' ' + amountToOffer + ' BSV')
        const divil = document.getElementById(`${targetMBid}`)
        console.log(divil)
        var dataSend = {
          "answerId": [ data._id, authorId ],
          "ontime": ( Date.now() <= data.expirey ),
          "approval": true,
          "message": "Thanks! This was a very helpful answer."
        }
        // future release you can customise this thank you message above
        moneyButton.render(divil, {
          to: authorAddress,
          amount: (amountToOffer >= 0.00001000) ? amountToOffer : 0.00001000,
          editable: false,
          currency: 'BSV',
          type: 'buy',
          buttonData: JSON.stringify(dataSend),
          onPayment: paidForAnswer
        })
      })
    })
    function paidForAnswer (payment) {
    //  document.querySelectorAll('.close').click()
      console.log(payment)

    }
  }

  displayAnswerInput (data) {
    $('#questionPostAnswerWrapper')
      .append(
        $('<textarea>')
          .addClass('col-12')
          .attr('id', 'questionAnswerTextInput')
          .attr('rows', 4)
          .attr(
            'placeholder',
            'Write your answer. ' +
              (data.expiry > new Date().getTime()
                ? 'The reward period has not expired yet.'
                : 'The reward expired, but you could still be helpful')
          )
      )
      .append(
        $('<button>')
          .append('Submit')
          .addClass('btn btn-success col-4')
          .on('click', () => this.submitAnswerToQuestion(data))
      )
  };

  submitAnswerToQuestion (data) {
    var text = window.questionAnswerTextInput.value.toString()
    if (text.length === 0) return alert('Cannot Submit an empty reply.')

    fetch('/questions/question/' + data._id + '/answer', {
      method: 'POST',
      body: JSON.stringify({ text: text }),
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        'x-csrf-token': this.props.session.csrfToken
      }
    })
      .then(res => res.text())
      .then(data => {
        location.reload()
      })
      .catch(err => this.showInputError(err))
  };

  render () {
    return (
      <Layout {...this.props} navmenu={false} container={false}>
        <QuestionFull />
        <div className="alert alert-dismissible alert-primary moneybuttonContainer">
          <button type="button" className="close" data-dismiss="alert" >&times;
          </button>
          <strong>Great!</strong> We're so pleased you've found one of the answers you were looking for. Please swipe the moneybutton to send your promised reward to this responder.
          <br />
          <p>Payment to: <span class='authorMoneyButton'></span></p>
          <div id='target' />
        </div>
      </Layout>
    )
  }
}

export default Question
