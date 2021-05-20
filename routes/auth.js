const express = require("express");
const { body } = require("express-validator");

const auth = require("../controllers/auth");

const routes = express.Router();

const isAuth = require("../middleware/isAuth");

routes.post("/islogin", isAuth, auth.islogin);

routes.post(
  "/signup",
  body("hospitalName").notEmpty().withMessage("Please fill the Hospital Name!"),
  body("userName").trim().notEmpty().withMessage("Please fill the User Name!"),
  body("userEmail")
    .trim()
    .notEmpty()
    .withMessage("Please fill the Email!")
    .isEmail()
    .withMessage("Please enter a valid email address.")
    .normalizeEmail(),
  body("userPassword")
    .trim()
    .notEmpty()
    .withMessage("Please fill password!")
    .isLength({ min: 5 })
    .withMessage("Password must be long enough!"),
  body("userPhone")
    .trim()
    .notEmpty()
    .withMessage("Please fill the phone number.")
    .isLength({ min: 10 })
    .withMessage("Plese enter a valid phone number!"),
  auth.signup
);

routes.post(
  "/login",
  body("userEmail")
    .trim()
    .notEmpty()
    .withMessage("Please fill the Email!")
    .isEmail()
    .withMessage("Please enter a valid email address.")
    .normalizeEmail(),
  body("userPassword")
    .trim()
    .notEmpty()
    .withMessage("Please fill password!")
    .isLength({ min: 5 })
    .withMessage("Password must be long enough!"),
  auth.login
);

routes.get("/activate-account/:token", auth.accActivation);

routes.post("/get-hospital-name", isAuth, auth.getHospitalName);

module.exports = routes;
