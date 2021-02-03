var mongo = require("mongodb").MongoClient;
var MongoKey = require("../AccessFiles/MongoKeys");
var addErrorLogs = require("../SetError/AddErrorLog");

//mongo connection
const withDB = async (operations, res, collectionName) => {
  try {
    const client = await mongo.connect(MongoKey.DBUrl, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    const db = client.db("CovidTracker");

    const collection = db.collection(collectionName);

    await operations(collection, client);
  } catch (err) {
    //console.log("error is in mongo ", res, err);
    addErrorLogs("mongo error " + err.toString());
    res.status(400).json({
      status: "failed",
      message: "unable to insert Data",
      report: err.toString(),
    });
  }
};

module.exports = withDB;
