"use strict";
const env = process.env.NODE_ENV || "dev"; // 'dev' or 'production'

const dev = {
  server: {
    host: process.env.HOST || "0.0.0.0",
    port: process.env.PORT || 4040
  },
  externalURL: "https://bpdts-test-app.herokuapp.com1"
};

const production = {
  server: {
    host: process.env.HOST || "0.0.0.0",
    port: process.env.PORT || 4040
  },
  externalURL: "https://bpdts-test-app.herokuapp.com"
};

const config = { dev, production };

module.exports = config[env];
