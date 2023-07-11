const { Router } = require("express");
const { Op } = require("sequelize");
const route = Router();
const { handleError } = require("../helpers/errors");
const { Country, Activity } = require("../db.js");

route.get("/", async (req, res) => {
  try {
    const search = req.query.name;
    const name = search && search.trim().toLowerCase();

    const allCountriesDB = name
      ? await Country.findAll({
          order: ["name"],
          where: {
            name: {
              [Op.iLike]: `%${name}%`,
            },
          },
          include: { model: Activity, through: { attributes: [] } },
        })
      : await Country.findAll({
          order: ["name"],
          include: { model: Activity, through: { attributes: [] } },
        });

    const allCountries = allCountriesDB.map((country) => {
      const countryJSON = country.toJSON();
      countryJSON.activities = countryJSON.activities.map((act) => act.name);
      countryJSON.orderName = countryJSON.name.toLowerCase();
      return countryJSON;
    });
    res.status(200).send(allCountries);
  } catch (error) {
    const msg = handleError(error);
    res.status(500).send(msg);
  }
});

route.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const countryId = await Country.findByPk(id, {
      include: { model: Activity, through: { attributes: [] } },
    });

    if (!countryId) return res.status(404).send("No existe el pais");
    return res.send(countryId);
  } catch (error) {
    const msg = handleError(error);
    res.status(400).send(msg);
  }
});

module.exports = route;
