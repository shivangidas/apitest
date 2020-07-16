#!/usr/bin/env node
let chai = require("chai");
let chaiHttp = require("chai-http");
let server = require("../src/server");

let should = chai.should();

chai.use(chaiHttp);

describe("DWP Users", () => {
  describe("/GET users", () => {
    it("it should get all users from external api", done => {
      chai
        .request(server)
        .get("/api/v1/users")
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.an("array");
          done();
        });
    });
  });
  describe("/GET users in and close to London", () => {
    it("it should get all users in and close to London", done => {
      chai
        .request(server)
        .get("/api/v1/city/London/users")
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.an("array");
          done();
        });
    });
  });
  describe("/GET API not found", () => {
    it("it should return 404 error", done => {
      chai
        .request(server)
        .get("/random")
        .end((err, res) => {
          res.should.have.status(404);
          res.body.errorMessage.should.equal("Page Not Found");
          done();
        });
    });
  });
});
