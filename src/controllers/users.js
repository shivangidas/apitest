"use strict";
const axios = require("axios");
const geodist = require("geodist");

const config = require("../config/config");
const cityCoord = require("../data/city");
const externalURL = config.externalURL;

// Functions for calling APIs
const getUsersFunc = () => axios.get(externalURL + "/users");
const getCityUsersFunc = city => {
  city = city.charAt(0).toUpperCase() + city.slice(1);
  return axios.get(externalURL + `/city/${city}/users`);
};

// Controller for getting all users
const getAllUsers = async (req, res) => {
  try {
    const users = await getUsersFunc();
    res
      .status(200)
      .send({ code: "200", url: req.originalUrl, result: users.data });
  } catch (error) {
    //console.error(error);
    res.status(500).send({
      errorCode: "500",
      url: req.originalUrl,
      errorMessage: "API not reachable"
    });
  }
};

// Controller for getting users in city
const getCityUsers = async (req, res) => {
  try {
    const city = req.params.city;
    const users = await getCityUsersFunc(city);
    res
      .status(200)
      .send({ code: "200", url: req.originalUrl, result: users.data });
  } catch (error) {
    //console.error(error);
    res.status(500).send({
      errorCode: "500",
      url: req.originalUrl,
      errorMessage: "API not reachable"
    });
  }
};

// Function to call geodist module that tells when two locations are within given limit in miles
const distanceLessThanX = (location1, location2, distance) => {
  return geodist(location1, location2, { limit: distance });
};

// Function for finding users with coordinates within a given limit to a city
const getUsersNearCityFunc = async (distance, city) => {
  try {
    const users = await getUsersFunc();
    city = city.toLowerCase();
    const location = cityCoord[city];
    if (location === undefined) {
      throw "City not in Database";
    }
    const usersCloseToCity = users.data.filter(user =>
      distanceLessThanX(
        location,
        { lat: user.latitude, lon: user.longitude },
        distance
      )
    );
    return usersCloseToCity;
  } catch (error) {
    //console.error(error);
    throw error;
  }
};

// Controller to get users close to a city (within distance)
const getUsersNearCity = async (req, res) => {
  try {
    const distance = req.params.distance;
    const city = req.params.city;
    if (isNaN(distance)) {
      res.status(400).send({
        errorCode: "400",
        url: req.originalUrl,
        errorMessage: "Distance cannot be non-numeric"
      });
      return;
    }
    const usersCloseToCity = await getUsersNearCityFunc(distance, city);
    res
      .status(200)
      .send({ code: "200", url: req.originalUrl, result: usersCloseToCity });
  } catch (error) {
    if (error === "City not in Database") {
      res.status(400).send({
        errorCode: "400",
        url: req.originalUrl,
        errorMessage: error
      });
      return;
    }
    res.status(500).send({
      errorCode: "500",
      url: req.originalUrl,
      errorMessage: "API not reachable"
    });
  }
};

//Controller for getting users in and near a city (within distance)
const getUsersInAndNearCity = async (req, res) => {
  try {
    const city = req.params.city;
    const distance = req.params.distance;
    if (isNaN(distance)) {
      res.status(400).send({
        errorCode: "400",
        url: req.originalUrl,
        errorMessage: "Distance cannot be non-numeric"
      });
      return;
    }
    const usersCloseToCity = await getUsersNearCityFunc(distance, city);
    const usersInCity = await getCityUsersFunc(city);
    const totalUsers = usersCloseToCity.concat(usersInCity.data);
    const filteredArr = totalUsers.reduce((acc, current) => {
      const x = acc.find(item => item.id === current.id);
      if (!x) {
        return acc.concat([current]);
      } else {
        return acc;
      }
    }, []);
    res
      .status(200)
      .send({ code: "200", url: req.originalUrl, result: filteredArr });
  } catch (error) {
    if (error === "City not in Database") {
      res.status(400).send({
        errorCode: "400",
        url: req.originalUrl,
        errorMessage: error
      });
      return;
    }
    res.status(500).send({
      errorCode: "500",
      url: req.originalUrl,
      errorMessage: "API not reachable"
    });
  }
};
module.exports = {
  getAllUsers,
  getCityUsers,
  getUsersNearCity,
  getUsersInAndNearCity,
  distanceLessThanX
};
