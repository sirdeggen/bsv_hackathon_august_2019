/**
 * Defines an endpoint that returns a list of users. You must be signed in and
 * have "admin": true set in your profile to be able to call the /admin/users
 * end point (you will need to configure persistant Mongo database to do that).
 *
 * Note: These routes only work if you have actually configured a MONGO_URI!
 * They do not work if you are using the fallback in-memory database.
 **/
"use strict";

const MongoClient = require("mongodb").MongoClient;
const ObjectId = require("mongodb").ObjectId;

let usersCollection;
let questionsCollection;

if (process.env.MONGO_URI) {
  // Connect to MongoDB Database and return user connection
  MongoClient.connect(process.env.MONGO_URI, (err, mongoClient) => {
    if (err) throw new Error(err);
    const dbName = process.env.MONGO_URI.split("/")
      .pop()
      .split("?")
      .shift();
    const db = mongoClient.db(dbName);
    usersCollection = db.collection("users");
    questionsCollection = db.collection("questions");
  });
}

module.exports = (expressApp, functions) => {
  if (expressApp === null) {
    throw new Error("expressApp option must be an express server instance");
  }

  expressApp.post("/ask", (req, res) => {
    if (req.user) {
      var question = req.body;
      question.userId = req.user.id;
      console.log(req.user);
      console.log(question);

      questionsCollection
        .insertOne(question)
        .then(data => res.status(200).json(data))
        .catch(err => res.status(500).json(err));
    } else {
      console.log("not logged in");
      return res.status(403).json({ error: "Must be signed in do that" });
    }
  });
};
