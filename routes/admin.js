const express = require("express");
const { body } = require("express-validator");

const admin = require("../controllers/admin");
const isAuth = require("../middleware/isAuth");

const routes = express.Router();

routes.get("/get-states", admin.getStates);

routes.post(
  "/update-hospital-data",
  body("formData.contactBox")
    .not()
    .isEmpty()
    .withMessage("Please fill the contact field!")
    .isLength({ min: 9 })
    .withMessage("Please enter a valid password!"),
  body("formData.stateBox").notEmpty().withMessage("Please fill the state!"),
  body("formData.districtBox")
    .notEmpty()
    .withMessage("Please fill the district!"),
  body("formData.addressBox")
    .notEmpty()
    .withMessage("Please fill the address!")
    .isLength({ min: 3 })
    .withMessage("Please enter a valid address!"),
  body("formData.typeBox").notEmpty().withMessage("Please fill the type!"),
  isAuth,
  admin.updateHospitalData
);

module.exports = routes;
