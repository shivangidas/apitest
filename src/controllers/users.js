"use strict";
const axios = require("axios");
const geodist = require("geodist");

const config = require("../config/config");

const externalURL = "https://bpdts-test-app.herokuapp.com";

const getUsersFunc = () => axios.get(externalURL + "/users");
const getCityUsersFunc = city => {
  city = city.charAt(0).toUpperCase() + city.slice(1);
  return axios.get(externalURL + `/city/${city}/users`);
};
const getAllUsers = async (req, res) => {
  try {
    let users = await getUsersFunc();
    res.status(200).send(users.data);
  } catch (error) {
    console.log(error);
    res.status(404).send([]);
  }
};
const getCityUsers = async (req, res) => {
  try {
    let city = req.params.city || "London";
    let users = await getCityUsersFunc(city);
    res.status(200).send(users.data);
  } catch (error) {
    console.log(error);
    res.status(404).send([]);
  }
};

const distanceLessThanX = (location1, location2, distance) => {
  return geodist(location1, location2, { limit: distance });
};
const getUsersNearCityFunc = async (distance, city) => {
  try {
    let users = await getUsersFunc();
    city = city.toLowerCase();
    const location1 = config[city] || { lat: 0, lon: 0 };
    let usersCloseToCity = users.data.filter(user =>
      distanceLessThanX(
        location1,
        { lat: user.latitude, lon: user.longitude },
        distance
      )
    );
    return usersCloseToCity;
  } catch (error) {
    return [];
  }
};
const getUsersNearCity = async (req, res) => {
  try {
    let distance = req.params.distance || 50;
    let city = req.params.city || "London";
    let usersCloseToCity = await getUsersNearCityFunc(distance, city);
    if (usersCloseToCity.length === 0) {
      res.status(404).send([]);
    } else {
      res.status(200).send(usersCloseToCity);
    }
  } catch (error) {
    res.status(500).send({ errorMessage: "Error accessing API" });
  }
};

const getUsersInAndNearCity = async (req, res) => {
  try {
    let city = req.params.city || "London";
    let distance = req.params.distance || 50;
    let usersCloseToCity = await getUsersNearCityFunc(distance, city);
    let usersInCity = await getCityUsersFunc(city);
    let totalUsers = usersCloseToCity.concat(usersInCity.data);
    if (totalUsers.length === 0) {
      res.status(404).send([]);
    } else {
      res.status(200).send(totalUsers);
    }
  } catch (error) {
    res.status(500).send({ errorMessage: "Internal Server Error" });
  }
};
module.exports = {
  getAllUsers,
  getCityUsers,
  getUsersNearCity,
  getUsersInAndNearCity,
  distanceLessThanX
};
