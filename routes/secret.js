const MongoClient = require("mongodb").MongoClient;
const mockData = require("../static/mockData/question.json");
const mockData2 = require("../static/mockData/question2.json");

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

module.exports = expressApp => {
  expressApp.post("/secret/generateData", (req, res) => {
    console.log("generate test data");
    if (req.user) {
      console.log("logged in");
      var result = questionsCollection
        .insertMany([JSON.parse(JSON.stringify(mockData)), JSON.parse(JSON.stringify(mockData2))])
        .then(data => res.status(200).json(result))
        .catch(err => res.status(500).json(err));
    } else {
      console.log("not logged in");
      return res
        .status(403)
        .json({ error: "Must be signed in do that" });
    }
  });

  expressApp.delete("/secret/delete/", (req, res) => {
    if (req.user) {
      console.log("logged in");
      var result = questionsCollection
        .deleteMany({ mock: true })
        .then(data => res.status(200).json(result))
        .catch(err => res.status(500).json(err));
    } else {
      console.log("not logged in");
      return res
        .status(403)
        .json({ error: "Must be signed in to do that" });
    }
  });

  expressApp.delete("/secret/deleteAll/", (req, res) => {
    if (req.user) {
      console.log("logged in");
      var result = questionsCollection
        .deleteMany()
        .then(data => res.status(200).json(result))
        .catch(err => res.status(500).json(err));
    } else {
      console.log("not logged in");
      return res
        .status(403)
        .json({ error: "Must be signed in to do that" });
    }
  });
};
