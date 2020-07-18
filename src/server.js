#!/usr/bin/env node
"use strict";
const express = require("express");
const app = express();
const path = require("path");
const bodyParser = require("body-parser");
const route = require("./routes/routes");
const config = require("./config/config");
const secureRoutes = express.Router();
app.use(bodyParser.json()); // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // to support URL-encoded bodies

route(app, secureRoutes); //API routes
const server = app.listen(config.server.port, config.server.host, function() {
  var host = server.address().address;
  var serverPort = server.address().port;

  console.log("Live at http://%s:%s", host, serverPort);
  console.log(
    "Use http://localhost:%s or http://<ipaddress>:%s if 0.0.0.0 doesn't work",
    serverPort,
    serverPort
  );
});
module.exports = server;
