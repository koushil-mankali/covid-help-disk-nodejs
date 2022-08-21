const express = require("express");
const { body } = require("express-validator");

const hospital = require("../controllers/hospital");
const isAuth = require("../middleware/isAuth");

const routes = express.Router();

routes.use("/get-data", hospital.getData);

routes.post(
  "/hospital-details",
  body("hospitalName").notEmpty().withMessage("Please select a hospital."),
  hospital.getHospitalData
);

routes.get("/get-state", hospital.getState);

routes.post("/get-districts", hospital.getDistricts);

routes.post("/get-hospital-data", hospital.getHospitalDetails);

routes.post("/filter-data", hospital.filterData);

routes.post(
  "/update-medicine-data",
  body("formData.medName")
    .notEmpty()
    .isLength({ min: 2 })
    .withMessage("Please enter a valid medicine name!"),
  body("formData.price")
    .notEmpty()
    .isNumeric()
    .isLength({ min: 2 })
    .withMessage("Please enter a valid price!"),
  isAuth,
  hospital.updateMedicineData
);

routes.post("/get-medicine-data", isAuth, hospital.getMedicineData);

routes.post("/get-med-details", isAuth, hospital.getMedDetails);

routes.post("/get-hospital-stock-data", isAuth, hospital.getHospitalStockData);

routes.post(
  "/update-hospital-stock-data",
  body("formData.totalBeds")
    .notEmpty()
    .isNumeric()
    .withMessage("Please enter a valid total beds data!"),
  body("formData.avaliableBeds")
    .notEmpty()
    .isNumeric()
    .withMessage("Please enter a valid avalible beds data!"),
  body("formData.occupiedBeds")
    .notEmpty()
    .isNumeric()
    .withMessage("Please enter a valid occupied beds data!"),
  body("formData.oxy")
    .notEmpty()
    .isNumeric()
    .withMessage("Please enter a valid oxygen avalibility!"),
  body("formData.oxygen")
    .notEmpty()
    .withMessage("Please select oxygen avalibility!"),
  isAuth,
  hospital.updateHospitalStockData
);

routes.post(
  "/register-hospital-data",
  body("formData.contactBox")
    .notEmpty()
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
  hospital.registerHospitalData
);

module.exports = routes;
