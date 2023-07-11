const { Router } = require("express");
const activitiesRouter = require("./activitiesRouter");
const countriesRouter = require("./countriesRouter");

const router = Router();

router.use("/activities", activitiesRouter);
router.use("/countries", countriesRouter);

module.exports = router;
