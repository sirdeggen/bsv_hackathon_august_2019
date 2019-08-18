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

async function getQuestions(q, l, callback) {
  await questionsCollection
    .find(q)
    .limit(parseInt(l))
    .toArray(callback);
}

module.exports = (expressApp, functions) => {
  if (expressApp === null) {
    throw new Error("expressApp option must be an express server instance");
  }

  // Expose a route to return list of questions for this user
  expressApp.get("/questions/all", (req, res) => {
    getQuestions(null, req.headers.l || 100, (err, data) => {
      if (err) {
        res.status(500).json(err);
      } else {
        res.status(200).json(data);
      }
    });
  });

  // Expose a route to return list of questions for this user
  expressApp.get("/questions/user/:user", (req, res) => {
    getQuestions(
      { userId: ObjectId(req.params.user) },
      req.headers.l || 100,
      (err, data) => {
        if (err) {
          res.status(500).json(err);
        } else {
          res.status(200).json(data);
        }
      }
    );
  });

  // Expose a route to return list of questions for this user
  expressApp.post("/questions/question/:id/answer", (req, res) => {
    if (req.user) {
      if (!req.body.text || req.body.text.toString().length === 0) {
        return res.status(500).json({message:"Invalid answer text"});
      }
      var text = req.body.text.toString();

      questionsCollection
        .findOne({ _id: ObjectId(req.params.id) })
        .then(question => {
          var answer = { text: text };
          answer.timestamp = new Date().getTime();
          answer.userId = req.user.id;
          answer.ontime = question.expiry > answer.timestamp;

          questionsCollection
            .updateOne(
              { _id: ObjectId(req.params.id) },
              { $push: { answers: answer } }
            )
            .then(res => res.status(200).json(res))
            .catch(err => res.status(500).json(err));
        })
        .catch(err => {
          res.status(500).json(err);
        });
    } else {
      console.log("not logged in");
      return res.status(403).json({ error: "Must be signed in do that" });
    }
  });

  // Expose a route to return list of questions for this user
  expressApp.get("/questions/question/:id", (req, res) => {
    if (req.params.id) {
      questionsCollection
        .findOne({ _id: ObjectId(req.params.id) })
        .then(data => {
          res.status(200).json(data);
        })
        .catch(err => {
          res.status(500).json(err);
        });
    } else {
      return res.status(403).json({ error: "Must pass a valid question ID" });
    }
  });

  // Expose a route to return list of questions for this user
  expressApp.get("/questions/answered/:user", (req, res) => {
    getQuestions(
      {
        answers: {
          $elemMatch: { userId: ObjectId(req.params.user) }
        }
      },
      req.headers.l || 100,
      (err, data) => {
        if (err) {
          res.status(500).json(err);
        } else {
          res.status(200).json(data);
        }
      }
    );
  });
};
