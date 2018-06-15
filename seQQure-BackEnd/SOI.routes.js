const router = require("express").Router();
const soiController = require("../controllers/SOI.controller");
const validateBody = require("../filters/validate.body");
const SOI = require("../models/soi");

module.exports = router;

router.post("/", validateBody(SOI), soiController.create);
router.get("/", soiController.readAll);
router.get("/:id([0-9a-fA-F]{24})", soiController.readById);
router.get(
  "/escrows/:id([0-9a-fA-F]{24})",
  soiController.escrowIdMatchPeopleId
);
router.put("/:id([0-9a-fA-F]{24})", validateBody(SOI), soiController.update);
