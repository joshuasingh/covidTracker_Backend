let chai = require("chai");
let chaiHttp = require("chai-http");
let expect = chai.expect;
chai.use(chaiHttp);
let server = require("../index");
chai.should();

describe("task API", () => {
  //   get route or national data

  describe("GET /retrieveNation", () => {
    it("it should get all the national level covid details", (done) => {
      chai
        .request(server)
        .get("/retrieveNation")
        .end((err, response) => {
          if (err) {
            done(err);
          }

          response.should.have.status(200);
          response.body.should.have.property("result");
          expect(response.body.result).to.be.an.instanceof(Array);

          expect(response.body.result[0].Data).that.includes.all.keys([
            "confirmed",
            "dayWise_confirmed",
            "recovered",
            "dayWise_recoverd",
            "active",
            "deaths",
            "dayWise_deaths",
          ]);
          done();
        });
    });

    // it("if the national details are not present for the day", (done) => {
    //   chai
    //     .request(server)
    //     .get("/retrieveNation")
    //     .then((response, err) => {
    //       if (err) {
    //         done(err);
    //       }
    //       response.should.have.status(200);
    //       response.body.should.have.property("result");
    //       expect(response.body.result).to.be.an.instanceof(Array);

    //       expect(response.body.result).to.have.length(0);
    //       done();
    //     });
    // });
  });

  //get our state data
  describe("GET /retrieveState", () => {
    it("it should get all state level covid details", (done) => {
      chai
        .request(server)
        .get("/retrieveState")
        .end((err, response) => {
          if (err) {
            done(err);
          }
          response.should.have.status(200);
          response.body.should.have.property("result");
          expect(response.body.result).to.be.an.instanceof(Array);
          expect(response.body.result[0].Data).to.have.length(36);
          done();
        });
    });

    // it("if the State details are not present for the day", (done) => {
    //   chai
    //     .request(server)
    //     .get("/retrieveState")
    //     .then((response, err) => {
    //       if (err) {
    //         done(err);
    //       }
    //       response.should.have.status(200);
    //       response.body.should.have.property("result");
    //       expect(response.body.result).to.be.an.instanceof(Array);

    //       expect(response.body.result).to.have.length(0);
    //       done();
    //     });
    // });
  });
});
