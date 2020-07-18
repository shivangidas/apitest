#!/usr/bin/env node
"use strict";
const chai = require("chai");
const chaiHttp = require("chai-http");
const nock = require("nock");
const server = require("../src/server");

const should = chai.should();
const userController = require("../src/controllers/users");
chai.use(chaiHttp);

describe("DWP Users APIs", () => {
  afterEach(() => {
    nock.cleanAll();
  });
  describe("/GET users", () => {
    it("it should get all users from external api", done => {
      chai
        .request(server)
        .get("/api/v1/users")
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have.property("result").that.is.an("array");
          done();
        });
    });
    it("should fail with status 500", done => {
      nock("https://bpdts-test-app.herokuapp.com")
        .get("/")
        .reply(400, { errorMessage: "test error" });

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
      chai
        .request(server)
        .get("/api/v1/city/London/users")
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have.property("result").that.is.an("array");
          done();
        });
    });

    it("it should return no users from random city", done => {
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
      nock("https://bpdts-test-app.herokuapp.com")
        .get("/")
        .reply(400, { errorMessage: "test error" });

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
      chai
        .request(server)
        .get("/api/v1/near/distance/50/city/London/users")
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have.property("result").that.is.an("array");
          done();
        });
    });
    it("it should fail for non-numeric distance", done => {
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
    it("should fail with status 500", done => {
      nock("https://bpdts-test-app.herokuapp.com")
        .get("/")
        .reply(400, { errorMessage: "test error" });

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
      chai
        .request(server)
        .get("/api/v1/distance/50/city/London/users")
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have.property("result").that.is.an("array");
          done();
        });
    });

    it("it should get all users in and close to London [case insensitive]", done => {
      chai
        .request(server)
        .get("/api/v1/distance/50/city/london/users")
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have.property("result").that.is.an("array");
          done();
        });
    });
    it("it should fail for non-numeric distance", done => {
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
      nock("https://bpdts-test-app.herokuapp.com")
        .get("/")
        .reply(400, { errorMessage: "test error" });

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
