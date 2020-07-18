"use strict";
const axios = require("axios");
const geodist = require("geodist");

const config = require("../config/config");
const cityCoord = require("../data/city");
const externalURL = config.externalURL;
const getUsersFunc = () => axios.get(externalURL + "/users");
const getCityUsersFunc = city => {
  city = city.charAt(0).toUpperCase() + city.slice(1);
  return axios.get(externalURL + `/city/${city}/users`);
};
const getAllUsers = async (req, res) => {
  try {
    let users = await getUsersFunc();
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
const getCityUsers = async (req, res) => {
  try {
    let city = req.params.city;
    let users = await getCityUsersFunc(city);
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

const distanceLessThanX = (location1, location2, distance) => {
  return geodist(location1, location2, { limit: distance });
};
const getUsersNearCityFunc = async (distance, city) => {
  try {
    let users = await getUsersFunc();
    city = city.toLowerCase();
    const location1 = cityCoord[0][city];
    if (location1 === undefined) {
      throw "City not in Database";
    }
    let usersCloseToCity = users.data.filter(user =>
      distanceLessThanX(
        location1,
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
const getUsersNearCity = async (req, res) => {
  try {
    let distance = req.params.distance;
    let city = req.params.city;
    if (isNaN(distance)) {
      res.status(400).send({
        errorCode: "400",
        url: req.originalUrl,
        errorMessage: "Distance cannot be non-numeric"
      });
      return;
    }
    let usersCloseToCity = await getUsersNearCityFunc(distance, city);
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

const getUsersInAndNearCity = async (req, res) => {
  try {
    let city = req.params.city;
    let distance = req.params.distance;
    if (isNaN(distance)) {
      res.status(400).send({
        errorCode: "400",
        url: req.originalUrl,
        errorMessage: "Distance cannot be non-numeric"
      });
      return;
    }
    let usersCloseToCity = await getUsersNearCityFunc(distance, city);
    let usersInCity = await getCityUsersFunc(city);
    let totalUsers = usersCloseToCity.concat(usersInCity.data);
    res
      .status(200)
      .send({ code: "200", url: req.originalUrl, result: totalUsers });
  } catch (error) {
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
