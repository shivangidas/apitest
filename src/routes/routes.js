"use strict";
const userController = require("../controllers/users");
module.exports = function(app, secureRoutes) {
  /* 
  / If there was a login functionality, could use a middleware to check logged in status and attach secureRoutes to it
  / secureRoutes(use, checkLogin)
  */
  app.use("/api/v1", secureRoutes); // version 1 of the APIs
  secureRoutes.get("/users", userController.getAllUsers);
  secureRoutes.get("/city/:city/users", userController.getCityUsers);
  secureRoutes.get("/near/city/:city/users", userController.getUsersNearCity);
  secureRoutes.get(
    "/distance/:distance/city/:city/users",
    userController.getUsersInAndNearCity
  );

  // Handle 404
  app.use(function(req, res) {
    res.status(404).send({
      errorCode: "404",
      errorMessage: "Page Not Found"
    });
  });

  // Handle 500
  app.use(function(error, req, res, next) {
    res.status(500).send({
      errorCode: "500",
      errorMessage: "Internal Server Error",
      error: error
    });
  });
};
