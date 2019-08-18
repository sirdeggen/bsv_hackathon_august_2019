
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

async function newQuestion (data) {
  var res = await questionsCollection.insertMany(data)
  console.log(res)
  return res
}

async function deleteQuestion (ids) {
  var res = await questionsCollection.deleteOne({ '_id': ids })
  console.log(res)
  return res
}

module.exports = (expressApp) => {
  expressApp.post('/secret/generateData', (req, res) => {
    console.log('generate test data')
    if (req.user) {
      console.log('logged in')
      var result = newQuestion([JSON.parse(JSON.stringify(mockData))])
      return res.status(200).json(result)
    } else {
      console.log('not logged in')
      return res.status(403).json({ error: 'Must be signed in to get profile' })
    }
  })

  expressApp.delete('/secret/delete/:id', (req, res) => {
    console.log(`delete question ${req.params.id}`)
    if (req.user) {
      console.log('logged in')
      var result = deleteQuestion(req.params.id)
      return res.status(200).json(result)
    } else {
      console.log('not logged in')
      return res.status(403).json({ error: 'Must be signed in to get profile' })
    }
  })
}
