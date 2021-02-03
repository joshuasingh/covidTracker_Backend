var fs = require("fs");

var AddErrorLog = (msg) => {
  var date = new Date();
  var currentTimeStamp =
    date.getDay() +
    "/" +
    date.getMonth() +
    "/" +
    date.getFullYear() +
    "  " +
    date.getHours() +
    ":" +
    date.getMinutes() +
    ":" +
    date.getSeconds();

  var fileRef = fs.createWriteStream(__dirname + "./../Logs/error.txt", {
    flags: "a",
  });
  fileRef.write(currentTimeStamp + " :: " + msg + "\n");
  fileRef.end();
};

module.exports = AddErrorLog;
