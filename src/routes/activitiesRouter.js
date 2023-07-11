const { Router } = require("express");
const { handleError } = require("../helpers/errors");
const { Country, Activity } = require("../db.js");

const route = Router();

const validate = (req, res, next) => {
  const { name, difficult, duration, season, countries } = req.body;

  const errors = {};
  if (!name || !difficult || !duration || !season || !countries) {
    return res.status(400).json({ errors: { error: "Datos incompletos" } });
  }

  if (!(typeof name === "string")) {
    errors.name = "El formato del nombre no es correcto";
  }
  if (!(typeof difficult === "number")) {
    errors.difficult = "El tipo de dato de la dificultad no es correcto";
  }
  if (difficult < 1 || difficult > 5) {
    errors.difficult =
      "El rango del nivel de dificultad debe estar entre 1 y 5";
  }
  if (!(typeof duration === "number")) {
    errors.duration = "El formato del resumen de receta no es correcto";
  }
  if (!(typeof season === "string")) {
    errors.season = "El formato del nivel de comida saludable no es correcto";
  }

  if (!Array.isArray(countries)) {
    errors.countries = "El formato de la dieta no es correcto";
  } else {
    const countriesContent = countries.some(
      (country) => typeof country !== "string"
    );
    if (countriesContent) {
      errors.countries = "Se ha detectado un pais con formato incorrecto";
    }
  }
  if (Object.keys(errors).length > 0) {
    return res.status(400).json({ errors });
  }

  next();
};

route.post("/", validate, async (req, res) => {
  try {
    const { name, difficult, duration, season, countries } = req.body;
    const activitiesArray = await Activity.findAll();

    const existActivity = activitiesArray.filter(
      (act) => act.name.toLowerCase() === name.toLowerCase()
    );

    if (existActivity.length > 0) throw `La actividad ${name} ya existe`;

    const activitiesInstancesArrayPromise = countries.map(
      async (countryId) => await Country.findByPk(countryId)
    );
    const activitiesInstances = await Promise.all(
      activitiesInstancesArrayPromise
    );

    const newActivityInstance = await Activity.create({
      name,
      difficult,
      duration,
      season,
    });

    await newActivityInstance.addCountries(activitiesInstances);

    res.send(true);
  } catch (error) {
    const msg = handleError(error);
    res.status(400).send(msg);
  }
});

route.get("/", async (req, res) => {
  try {
    const allActivities = await Activity.findAll({
      order: ["name"],
    });

    res.status(200).send(allActivities);
  } catch (error) {
    const msg = handleError(error);
    res.status(500).send(msg);
  }
});

module.exports = route;
