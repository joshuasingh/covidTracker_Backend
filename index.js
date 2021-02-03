var http = require("http");
var app = require("express")();
var cors = require("cors");
var bodyParser = require("body-parser");
var addService = require("./Services/AddServices");
var updateDataBase = require("./UpdateDatabase/updateDatabase1");
var AddLogs = require("./SetError/AddLogs");
var updateFunction = require("./UpdateDatabase/updateDatabase1");
var cron = require("node-cron");
var getStateData = require("./RetrieveData/GetStateData");
var getNationData = require("./RetrieveData/GetNationData");

//middleware layer
app.use(cors());
app.use(bodyParser.json({ limit: "10mb", extended: false }));
app.use(bodyParser.urlencoded({ limit: "100mb", extended: true }));
app.use("/services", addService);
app.use("/uploadData", updateDataBase);
app.use("/retrieveState", getStateData);
app.use("/retrieveNation", getNationData);
var port = process.env.PORT || 8081;

var server = http.createServer(app);

//function to update data to database for the day
app.get("/updateValues", (req, res) => {
  updateFunction();
  res.send("done");
});

// schedule tasks to be run on the server
cron.schedule(
  "30 2 * * *",
  function () {
    console.log("schedule call");
    AddLogs("National and State data updated");
    updateFunction();
  },
  {
    scheduled: true,
    timezone: "Asia/Kolkata",
  }
);

//server is listening
server.listen(port, () => {
  console.log(`Covid Data server is up and running ${port}`);
});

module.exports = server;
