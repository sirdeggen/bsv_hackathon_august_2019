
const MongoClient = require('mongodb').MongoClient
const mockData = require('../static/mockData/question.json')

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
module.exports = (expressApp) => {
  expressApp.post('/secret/generateData', (req, res) => {
    console.log('generate test data')
    if (req.user) {
      console.log('logged in')
      var result = questionsCollection.insertMany([JSON.parse(JSON.stringify(mockData))])
      console.log(result)
      return res.status(200).json(result)
    } else {
      console.log('not logged in')
      return res.status(403).json({ error: 'Must be signed in to get profile' })
    }
  })
  expressApp.delete('/secret/deleteData', (req, res) => {
    console.log('delete test data')

    if (req.user) {
      console.log('logged in')
      return res.status(200).json({ success: 'this is a mockup' })
    } else {
      console.log('not logged in')
      return res.status(403).json({ error: 'Must be signed in to get profile' })
    }
  })
}
