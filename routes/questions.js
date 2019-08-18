/**
 * Defines an endpoint that returns a list of users. You must be signed in and
 * have "admin": true set in your profile to be able to call the /admin/users
 * end point (you will need to configure persistant Mongo database to do that).
 *
 * Note: These routes only work if you have actually configured a MONGO_URI!
 * They do not work if you are using the fallback in-memory database.
 **/
'use strict'

const MongoClient = require('mongodb').MongoClient

let usersCollection
let questionsCollection

if (process.env.MONGO_URI) {
  // Connect to MongoDB Database and return user connection
  MongoClient.connect(process.env.MONGO_URI, (err, mongoClient) => {
    if (err) throw new Error(err)
    const dbName = process.env.MONGO_URI.split('/')
      .pop()
      .split('?')
      .shift()
    const db = mongoClient.db(dbName)
    usersCollection = db.collection('users')
    questionsCollection = db.collection('questions')
  })
}

async function getQuestions (body, callback) {
  await questionsCollection.find(body.q).limit(parseInt(body.l)).toArray(callback)
}

module.exports = (expressApp, functions) => {
  if (expressApp === null) {
    throw new Error('expressApp option must be an express server instance')
  }

  // Expose a route to return list of questions for this user
  expressApp.get('/questions/all', (req, res) => {
    getQuestions(req.body, (err, data) => {
      if (err) {
        res.status(500).json(err)
      } else {
        res.status(200).json(data)
      }
    })
  })

  // Expose a route to return list of questions for this user
  expressApp.get('/questions/user/:user', (req, res) => {
    if (req.params.user) {
      // questionsCollection.find()
      console.log(`get request for userid ${req.params.user}'s questions'`)
    } else {
      return res
        .status(403)
        .json({ error: 'Must be signed in to get profile' })
    }
  })

  // Expose a route to return list of questions for this user
  expressApp.get('/questions/question/:id', (req, res) => {
    if (req.params.id) {
      questionsCollection.find()
      console.log(`get request for question id ${req.params.user}`)
    } else {
      return res
        .status(403)
        .json({ error: 'Must be signed in to get profile' })
    }
  })
}
