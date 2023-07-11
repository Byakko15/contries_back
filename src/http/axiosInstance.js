const axios = require("axios");

const countriesAPI = axios.create({
  baseURL: "http://localhost:5000/countries",
});

module.exports = { countriesAPI };
