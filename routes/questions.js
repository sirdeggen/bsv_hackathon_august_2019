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
    const dbName = process.env.MONGO_URI.split('/').pop().split('?').shift()
    const db = mongoClient.db(dbName)
    usersCollection = db.collection('users')
    questionsCollection = db.collection('questions')
  })
}

module.exports = (expressApp, functions) => {
  if (expressApp === null) {
    throw new Error('expressApp option must be an express server instance')
  }

  // Expose a route to return list of questions for this user
  expressApp.get('/questions/user/:user', (req, res) => {
    if (req.params.user) {
      // questionsCollection.find()
      console.log(`get request for userid ${req.params.user}'s questions'`)
    } else {
      return res.status(403).json({ error: 'Must be signed in to get profile' })
    }
  })

  // Expose a route to return list of questions for this user
  expressApp.get('/questions/question/:id', (req, res) => {
    if (req.params.id) {
    // questionsCollection.find()
      console.log(`get request for question id ${req.params.user}`)
    } else {
      return res.status(403).json({ error: 'Must be signed in to get profile' })
    }
  })

  // Add new question to db
  expressApp.post('/questions/new', (req, res) => {
    if (req.user) {
      functions.find({ id: req.user.id })
        .then(user => {
          if (!user) return res.status(500).json({ error: 'Unable to fetch profile' })

          if (req.body.name) { user.name = req.body.name }

          if (req.body.email) {
          // Reset email verification field if email address has changed
            if (req.body.email && req.body.email !== user.email) { user.emailVerified = false }

            user.email = req.body.email
          }
          return functions.update(user)
        })
        .then(user => {
          return res.status(204).redirect('/account')
        })
        .catch(err => {
          return res.status(500).json({ error: 'Unable to fetch profile' })
        })
    } else {
      return res.status(403).json({ error: 'Must be signed in to update profile' })
    }
  })

  // Expose a route to allow users to delete their profile.
  expressApp.post('/questions/delete', (req, res) => {
    if (req.user) {
      functions.remove(req.user.id)
        .then(() => {
        // Destroy local session after deleting account
          req.logout()
          req.session.destroy(() => {
          // When the account has been deleted, redirect client to
          // /auth/callback to ensure the client has it's local session state
          // updated to reflect that the user is no longer logged in.
            return res.redirect(`/auth/callback?action=signout`)
          })
        })
        .catch(err => {
          return res.status(500).json({ error: 'Unable to delete profile' })
        })
    } else {
      return res.status(403).json({ error: 'Must be signed in to delete profile' })
    }
  })
}
