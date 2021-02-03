var dbConnect = require("../MongoConnect/MongoAccess");
var axios = require("axios");
var cheerio = require("cheerio");
var express = require("express");
var router = express.Router();
var addLogs = require("../SetError/AddLogs");
var addErrorLogs = require("../SetError/AddErrorLog");
const AddErrorLog = require("../SetError/AddErrorLog");

var route1 = router.route("/");

var getTotalData = ($, totalCases) => {
  console.log("" + totalCases.children().length);
  var total = {};

  totalCases.children().each(function (index) {
    var val = parseInt($(this).children().first().text());
    //adding the string because first part will give sign second will give value
    let perDay_Val = parseInt($(this).children().last().text());

    switch (index) {
      case 1:
        total.confirmed = val;
        total.dayWise_confirmed = perDay_Val;
        break;
      case 2:
        total.recovered = val;
        total.dayWise_recoverd = perDay_Val;
        break;
      case 3:
        total.active = val;
        break;
      case 4:
        total.deaths = val;
        total.dayWise_deaths = perDay_Val;
        break;
    }
  });

  return total;
};

var getStateData = ($, stateData) => {
  var result = {};
  stateData.each(function (index) {
    var valueCount = $(this).children().first().text();
    var valueCount1 = parseInt(valueCount);
    let perDay_Val = parseInt($(this).children().last().text());

    switch (index) {
      case 0:
        result.state = valueCount;
        break;
      case 1:
        result.confirmed = valueCount1;
        result.dayWise_confirmed = perDay_Val;
        break;
      case 2:
        result.recovered = valueCount1;
        result.dayWise_recoverd = perDay_Val;
        break;
      case 3:
        result.active = valueCount1;
        break;
      case 4:
        result.deaths = valueCount1;
        result.dayWise_deaths = perDay_Val;
        break;
    }
  });

  return result;
};

var getDistrictData = ($, districtData) => {
  var result = [];
  districtData.each(function (index) {
    var subData = $(this).children();
    var res = {};
    subData.each(function (ind) {
      let subData_1 = $(this);

      var caseData = parseInt(subData_1.children().first().text());
      let perDay_Val = parseInt(subData_1.children().last().text());

      switch (ind) {
        case 0:
          res.name = subData_1.text();
          res.id = subData_1.text();
          break;
        case 1:
          res.confirmed = caseData;
          res.dayWise_confirmed = perDay_Val;
          break;
        case 2:
          res.recovered = caseData;
          res.dayWise_recoverd = perDay_Val;
          break;
        case 3:
          res.active = caseData;
          break;
        case 4:
          res.deaths = caseData;
          res.dayWise_deaths = perDay_Val;
          break;
      }
    });

    result.push(res);
  });

  return result;
};

var covid_Data_Parse = () => {
  return new Promise((resolve, reject) => {
    var url =
      "https://www.grainmart.in/news/covid-19-coronavirus-india-state-and-district-wise-tally/";

    axios.get(url).then((response, err) => {
      if (err) {
        console.log("error is::", err);
        addErrorLogs("axios error " + err);
        reject("Got Error::" + err);
      } else {
        var $ = cheerio.load(response.data);

        var totalCases = $("#covid-19-table>.skgm-th.total-cases");

        var total_Cases_Count = getTotalData($, totalCases);

        var stateData = $("#covid-19-table").children().filter(".skgm-states");
        var allStateResult = [];
        stateData.each(function (index) {
          //district wise data
          var stateWiseData = $(this).children().first().children();

          var tempResult = getStateData($, stateWiseData);

          //district wise data
          var districtData = $(this)
            .children()
            .last()
            .children()
            .filter(".skgm-tr");

          tempResult.districtData = getDistrictData($, districtData);

          allStateResult.push(tempResult);
        });

        resolve({ total: total_Cases_Count, state: allStateResult });
      }
    });
  });
};

var updateDatabase1 = async () => {
  //we are using webscrapping to get covid updates from grainmart.in
  try {
    var { total, state } = await covid_Data_Parse();
  } catch (e) {
    addErrorLogs("unable to update data " + e);
  }

  var currentDate = new Date();
  var dateStr =
    currentDate.getDate() +
    "," +
    currentDate.getMonth() +
    "," +
    currentDate.getFullYear();

  //set the current date
  var finalTotal = { updateDate: dateStr, Data: total };
  var finalState = { updateDate: dateStr, Data: state };

  dbConnect(
    (conn) => {
      conn.insert(finalState, (err, result) => {
        if (err) {
          console.log("unable to insert data", err);
        } else {
          console.log("data inserted success", result);
        }
      });
    },
    null,
    "stateWise_data"
  );

  dbConnect(
    (conn) => {
      conn.insert(finalTotal, (err, result) => {
        if (err) {
          console.log("unable to insert data", err);
        } else {
          console.log("data inserted success", result);
        }
      });
    },
    null,
    "NationalData"
  );
};

// route1.post(async (req, res) => {
//   try {
//     var { total, state } = await covid_Data_Parse();
//   } catch (e) {
//     res.status(401).send("unable to update data because", e);
//   }

//   var currentDate = new Date();
//   var dateStr =
//     currentDate.getDate() +
//     "," +
//     currentDate.getMonth() +
//     "," +
//     currentDate.getFullYear();

//   //set the current date
//   var finalTotal = { updateDate: dateStr, Data: total };
//   var finalState = { updateDate: dateStr, Data: state };

//   dbConnect(
//     (conn) => {
//       conn.insert(finalState, (err, result) => {
//         if (err) {
//           console.log("unable to insert data", err);
//         } else {
//           console.log("data inserted success", result);
//         }
//       });
//     },
//     res,
//     "stateWise_data"
//   );

//   dbConnect(
//     (conn) => {
//       conn.insert(finalTotal, (err, result) => {
//         if (err) {
//           console.log("unable to insert data", err);
//         } else {
//           console.log("data inserted success", result);
//         }
//       });
//     },
//     res,
//     "NationalData"
//   );

//   res.status(200).send("updation done");
// });

module.exports = updateDatabase1;
