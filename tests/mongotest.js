// Connect using a MongoClient instance
const MongoClient = require('mongodb').MongoClient
const test = require('assert')
// Connection url
const url = 'mongodb://asktheworld-ln1zu.mongodb.net:27017'
// Database Name
const dbName = 'test'
// Connect using MongoClient
const mongoClient = new MongoClient(url)
mongoClient.connect(function (err, client) {
  const db = client.db(dbName)
  client.close()
})
