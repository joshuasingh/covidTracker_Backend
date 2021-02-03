1.) How long did you spend on the coding test?

- For the last 3 days I have spent around 3 hours to complete this assignments, So roughly around 10 - 11 hours. As these were office working days and i had to complete this assignment after
  my office work.

  2.) What would you add to your solution if you had more time? If you didn't spend much time on the coding test then use this as an opportunity to explain what you would add.

- If i had more time i would have spent that to make the UI of the solution better, So as to make the element responsive to the screen size.
  Functionality wise i would have added a way to show data for any particular date wherein now i am only displaying data for the current date.
  on the backend i would have written some more test cases to fully test the solution and also would have added a way to give caching of data to boost performance.

  3.)What was the most useful feature that was added to the latest version of your chosen language/framework? Please include a snippet of code that shows how you've used it.

- The most useful feature that i find very useful that was lately added to javascript is the Promises. Where in before we had to use callback which in cases of large module would
  result in callback nesting. Promises with combination of async/await gives a very easy way to handle asynchronous code and is also cleaner to write.
  The Code snippet below shows the use of promises in this solution.

--------------------code Example to show use of promise---------------------------
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
}

---

4.)How would you track down a performance issue in production? Have you ever had to do this?

- As i have managed a log file, I can refer to it to see the performance of system for each api.
  I'll also make use of deployment server dashboards to check to users hitting the api's and if it increase than would increase the resources.
- Personally i have not managed so many production issues on company projects but i work on my personal project and there have some experience doing this.

  5.)List of all the libraries and packages used to complete the assignment.

- Following are the libraries used in the frontend (ReactJS):
  "axios"
  - "bootstrap"
  - "canvasjs"
  - "react"
  - "react-bootstrap"
  - "react-dropdown-select"
  - "react-icons"
  - "react-loader-spinner"
  - "react-redux"
  - "react-router-dom"
  - "react-scripts"
  - "redux"
  - "semantic-ui-react"
- Following are the libraries used in the backend(nodeJS):
  -"axios"
  -"body-parser",
  -"chai",
  -"chai-http",
  -"cheerio",
  -"cors",
  -"express",
  -"fs",
  -"http",
  -"mocha",
  -"mongodb",
  -"node-cron",
  -"save",
  -"supertest"
