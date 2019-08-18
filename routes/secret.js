
const MongoClient = require("mongodb").MongoClient;

module.exports = (expressApp) => {

  expressApp.post("/secret/generateData", (req, res) => {
    console.log("generate test data")

    if (req.user) {
      console.log("logged in");
      return res.status(200).json({ success: 'this is a mockup' })
    } else {
      console.log("not logged in");
      return res.status(403).json({ error: 'Must be signed in to get profile' })
    }
    
  });
  expressApp.delete("/secret/deleteData", (req, res) => {
    console.log("delete test data")

    if (req.user) {
      console.log("logged in");
      return res.status(200).json({ success: 'this is a mockup' })
    } else {
      console.log("not logged in");
      return res.status(403).json({ error: 'Must be signed in to get profile' })
    }
    
  });

};