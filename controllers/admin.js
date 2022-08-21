const { validationResult } = require("express-validator");

const States = require("../models/States");
const Admin = require("../models/Admin");

exports.getStates = (req, res) => {
  States.find().then((result) => {
    return res.status(200).json(result);
  });
};

exports.updateHospitalData = (req, res) => {
  let validation = validationResult(req);

  if (!validation.isEmpty()) {
    return res.status(422).json({
      result: "valfail",
      message: "Data Validation Failed!",
      errors: validation.array(),
    });
  }

  let hospitalName = req.body.hospitalName;
  let formData = req.body.formData;

  Admin.findOne({ hospitalName: hospitalName })
    .then((result) => {
      if (result) {
        let datatoUpdate = {
          contact: formData.contactBox,
          stateName: formData.stateBox,
          districtName: formData.districtBox,
          address: formData.addressBox,
          type: formData.typeBox,
        };

        return Admin.findOneAndUpdate(
          {
            hospitalName: hospitalName,
          },
          datatoUpdate
        )
          .then((result) => {
            return res.status(200).json({
              result: true,
              mess: "Data Updated Succesfully!",
            });
          })
          .catch((err) => {
            return res
              .status(500)
              .json({ result: false, mess: "Something went wrong!" });
          });
      }

      const insertData = new Admin({
        hospitalName: hospitalName,
        contact: formData.contactBox,
        stateName: formData.stateBox,
        districtName: formData.districtBox,
        address: formData.addressBox,
        type: formData.typeBox,
      });

      return insertData
        .save()
        .then((result) => {
          return res.status(200).json({
            result: true,
            mess: "Data Added Succesfully!",
          });
        })
        .catch((err) => {
          return res
            .status(500)
            .json({ result: false, mess: "Something went wrong!" });
        });
    })
    .catch((err) => {
      return res
        .status(500)
        .json({ result: false, mess: "Something went wrong!" });
    });
};
