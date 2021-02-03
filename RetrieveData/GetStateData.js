var express = require("express");
var router = express.Router();
var withDB = require("../MongoConnect/MongoAccess");
var errorlogs = require("../SetError/AddErrorLog");

var route1 = router.route("/");

var getStateData = (res) => {
  return new Promise((resolve, reject) => {
    var currentDate = new Date();
    var dateStr =
      currentDate.getDate() +
      "," +
      currentDate.getMonth() +
      "," +
      currentDate.getFullYear();

    withDB(
      (collection) => {
        collection.find({ updateDate: dateStr }).toArray((err, res) => {
          if (err) {
            reject(err);
          } else {
            resolve(res);
          }
        });
      },
      res,
      "stateWise_data"
    );
  });
};

route1.get(async (req, res) => {
  console.log("getting state data");
  try {
    var result = await getStateData(res);
    res.status(200).json({ result: result });
  } catch (e) {
    console.log("err is", e);
    errorlogs("error in get District Data," + e.toString());
    res.status(401).json({ err: e.toString() });
  }
});

module.exports = router;
