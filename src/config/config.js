"use strict";
const env = process.env.NODE_ENV || "dev"; // 'dev' or 'production'

const dev = {
  server: {
    host: process.env.HOST || "0.0.0.0",
    port: process.env.PORT || 4040
  },
  london: {
    lat: 51.509865,
    lon: -0.118092
  }
};

const production = {
  server: {
    host: process.env.HOST || "0.0.0.0",
    port: process.env.PORT || 4040
  },
  london: {
    lat: 51.509865,
    lon: -0.118092
  }
};

const config = { dev, production };

module.exports = config[env];
