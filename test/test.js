#!/usr/bin/env node
"use strict";
const chai = require("chai");
const chaiHttp = require("chai-http");
const nock = require("nock");
const server = require("../src/server");
const data = require("./mock_data/mock_data");
const should = chai.should();
const userController = require("../src/controllers/users");
chai.use(chaiHttp);
function nockError() {
  nock("https://bpdts-test-app.herokuapp.com")
    .get("/")
    .reply(400, { errorMessage: "test error" });
}
function nockAllUsers() {
  nock("https://bpdts-test-app.herokuapp.com")
    .get("/users")
    .reply(200, data.allUsers);
}
function nockLondonUsers() {
  nock("https://bpdts-test-app.herokuapp.com")
    .get("/city/London/users")
    .reply(200, data.londonUsers);
}
function nockNoUsers() {
  nock("https://bpdts-test-app.herokuapp.com")
    .get("/city/Random/users")
    .reply(200, []);
}

describe("DWP Users APIs", () => {
  afterEach(() => {
    nock.cleanAll();
  });
  describe("/GET users", () => {
    it("it should get all users from external api", done => {
      nockAllUsers();
      chai
        .request(server)
        .get("/api/v1/users")
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have
            .property("result")
            .that.is.an("array")
            .of.length(7);
          done();
        });
    });
    it("should fail with status 500", done => {
      nockError();
      chai
        .request(server)
        .get("/api/v1/users")
        .end((err, res) => {
          res.should.have.status(500);
          res.body.should.have
            .property("errorMessage")
            .that.equals("API not reachable");
          done();
        });
    });
  });

  describe("/GET users in  London", () => {
    it("it should get all users in London", done => {
      nockLondonUsers();
      chai
        .request(server)
        .get("/api/v1/city/London/users")
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have
            .property("result")
            .that.is.an("array")
            .of.length(6);
          done();
        });
    });

    it("it should return no users from random city", done => {
      nockNoUsers();
      chai
        .request(server)
        .get("/api/v1/city/random/users")
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have
            .property("result")
            .that.is.an("array")
            .of.length(0);
          done();
        });
    });
    it("should fail with status 500", done => {
      nockError();
      chai
        .request(server)
        .get("/api/v1/city/London/users")
        .end((err, res) => {
          res.should.have.status(500);
          res.body.should.have
            .property("errorMessage")
            .that.equals("API not reachable");
          done();
        });
    });
  });
  describe("/GET users close to London", () => {
    it("it should get all users close to London", done => {
      nockAllUsers();
      chai
        .request(server)
        .get("/api/v1/near/distance/50/city/London/users")
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have
            .property("result")
            .that.is.an("array")
            .of.length(3);
          done();
        });
    });
    it("it should fail for non-numeric distance", done => {
      nockAllUsers();
      chai
        .request(server)
        .get("/api/v1/near/distance/xyz/city/london/users")
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.have
            .property("errorMessage")
            .that.equals("Distance cannot be non-numeric");
          done();
        });
    });
    it("it should fail for city not in records", done => {
      nockAllUsers();
      chai
        .request(server)
        .get("/api/v1/near/distance/50/city/tokyo/users")
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.have
            .property("errorMessage")
            .that.equals("City not in Database");
          done();
        });
    });
    it("should fail with status 500", done => {
      nockError();
      chai
        .request(server)
        .get("/api/v1/near/distance/50/city/London/users")
        .end((err, res) => {
          res.should.have.status(500);
          res.body.should.have
            .property("errorMessage")
            .that.equals("API not reachable");
          done();
        });
    });
  });
  describe("/GET users in and close to London", () => {
    it("it should get all users in and close to London", done => {
      nockAllUsers();
      nockLondonUsers();
      chai
        .request(server)
        .get("/api/v1/distance/50/city/London/users")
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have
            .property("result")
            .that.is.an("array")
            .of.length(9);
          done();
        });
    });

    it("it should get all users in and close to London [case insensitive]", done => {
      nockAllUsers();
      nockLondonUsers();
      chai
        .request(server)
        .get("/api/v1/distance/50/city/london/users")
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have
            .property("result")
            .that.is.an("array")
            .of.length(9);
          done();
        });
    });
    it("it should fail for non-numeric distance", done => {
      nockAllUsers();
      nockLondonUsers();
      chai
        .request(server)
        .get("/api/v1/distance/xyz/city/london/users")
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.have
            .property("errorMessage")
            .that.equals("Distance cannot be non-numeric");
          done();
        });
    });
    it("should fail with status 500", done => {
      nockError();
      chai
        .request(server)
        .get("/api/v1/distance/50/city/London/users")
        .end((err, res) => {
          res.should.have.status(500);
          res.body.should.have
            .property("errorMessage")
            .that.equals("API not reachable");
          done();
        });
    });
  });
});
describe("Utility functions", () => {
  describe("Function distanceLessThanX", () => {
    it("should return True for user within 50 miles of city", () => {
      const location1 = { lat: 51.51, lon: -0.118092 };
      const location2 = { lat: 51.509865, lon: -0.118092 };
      const withinRange = userController.distanceLessThanX(
        location1,
        location2,
        50
      );
      withinRange.should.equal(true);
    });
    it("should return False for user outside 50 miles of city", () => {
      const location1 = { lat: 52.51, lon: -0.118092 };
      const location2 = { lat: 51.509865, lon: -0.118092 };
      const withinRange = userController.distanceLessThanX(
        location1,
        location2,
        50
      );
      withinRange.should.equal(false);
    });
  });
});
describe("/GET Page not found", () => {
  it("it should return 404 error", done => {
    chai
      .request(server)
      .get("/random")
      .end((err, res) => {
        res.should.have.status(404);
        res.body.should.have
          .property("errorMessage")
          .that.equals("Page Not Found");
        done();
      });
  });
});
describe("/GET Test external API", () => {
  it("it should return success response", done => {
    chai
      .request(server)
      .get("/api/v1/city/London/users")
      .end((err, res) => {
        res.should.have.status(200);
        done();
      });
  });
});
