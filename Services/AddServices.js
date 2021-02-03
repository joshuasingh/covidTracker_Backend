var withDB = require("../MongoConnect/MongoAccess");
var express = require("express");
var Router = express.Router();

var route1 = Router.route("/addservice");

var addServicesDetails = (serviceName) => {
  return new Promise((resolve, reject) => {
    withDB(
      (collection) => {
        collection.insert({ description: description }).then((result, err) => {
          if (err) {
            res.send("got error");
          } else {
            res.send("done");
          }
        });
      },
      res,
      ServiceName
    );
  });
};

route1.post((req, res) => {
  var { service_Name, description, Service_Details } = req.body;

  // for(let i=0;i<Service_Details.length;i++)
  // {

  // }

  withDB(
    (collection) => {
      collection.insert({ description: description }).then((result, err) => {
        if (err) {
          res.send("got error");
        } else {
          res.send("done");
        }
      });
    },
    res,
    ServiceName
  );
});

// withDB(
//   (collection) => {
//     collection
//       .insert({description: description })
//       .then((result, err) => {
//         if (err) {
//           res.send("got error");
//         } else {
//           res.send("done");
//         }
//       });
//   },
//   res,
//   ServiceName
// );

module.exports = Router;
