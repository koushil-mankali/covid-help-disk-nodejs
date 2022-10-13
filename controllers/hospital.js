const Hospital = require("../models/Hospital");
const mongoose = require("mongoose");
const { validationResult } = require("express-validator");

mongoose.set("useFindAndModify", false);

exports.getData = (req, res) => {
  Hospital.find()
    .select("hospitalName")
    .then((result) => {
      return res.status(200).json(result);
    });
};

exports.getHospitalData = (req, res) => {
  let validate = validationResult(req);

  if (!validate.isEmpty()) {
    return res
      .status(422)
      .json({ result: "valfail", errors: validate.array() });
  }

  let hospitalName = req.body.hospitalName;

  Hospital.find({ hospitalName: hospitalName }).then((result) => {
    return res.status(200).json(result);
  });
};

exports.getState = (req, res) => {
  Hospital.find()
    .distinct("address.state")
    .then((result) => {
      return res.status(200).json(result);
    });
};

exports.getDistricts = (req, res) => {
  let validate = validationResult(req);

  if (!validate.isEmpty()) {
    return res
      .status(422)
      .json({ result: "valfail", errors: validate.array() });
  }
  let stateName = req.body.state;

  Hospital.find({ "address.state": stateName })
    .distinct("address.district")
    .then((result) => {
      return res.status(200).json(result);
    });
};

exports.getHospitalDetails = (req, res) => {
  let state = req.body.state;
  let district = req.body.district;

  Hospital.find({
    $and: [{ "address.state": state }, { "address.district": district }],
  })
    .select("hospitalName totalBeds oxygen occupiedBeds avaliableBeds")
    .then((result) => {
      return res.status(200).json(result);
    })
    .catch((err) => console.log(err));
};

exports.filterData = (req, res) => {
  let data = req.body.data;
  let state = req.body.state;
  let district = req.body.district;

  Hospital.find({
    $and: [
      { "address.state": state },
      { "address.district": district },
      { type: data },
    ],
  })
    .select("hospitalName totalBeds oxygen occupiedBeds avaliableBeds")
    .then((result) => {
      return res.status(200).json(result);
    });
};

exports.updateMedicineData = (req, res) => {
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

  let name = formData.medName;
  let price = formData.price;

  Hospital.findOne({ hospitalName: hospitalName })
    .then((result) => {
      let isNew = result?.medicineDetails?.find((val) => {
        return val.name === name;
      });

      if (isNew) {
        return Hospital.findOneAndUpdate(
          {
            hospitalName: hospitalName,
            "medicineDetails.name": name,
          },
          { $set: { "medicineDetails.$.price": price } },
          { new: true }
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

      Hospital.findOneAndUpdate(
        { hospitalName: hospitalName },
        { $push: { medicineDetails: { name: name, price: price } } },
        (err, doc) => {
          if (!err) {
            return res.status(200).json({
              result: true,
              mess: "Data Added Succesfully!",
            });
          }
          return res
            .status(500)
            .json({ result: false, mess: "Something went wrong!" });
        }
      );
    })
    .catch((err) => {
      console.log("errrr", err);
      return res
        .status(500)
        .json({ result: false, mess: "Something went wrong!", err: err?.message, error: err });
    });
};

exports.getMedicineData = (req, res) => {
  let hospitalName = req.body.hospitalName;

  Hospital.findOne({ hospitalName: hospitalName }).then((result) => {
    let data = result?.medicineDetails;
    if (!data) {
      return res.status(500).json({ data: null, mess: "No Data Found!" });
    }
    return res
      .status(200)
      .json({ data: data, mess: "Succesfully Retrived Data" });
  });
};

exports.getMedDetails = (req, res) => {
  let hospitalName = req.body.hospitalName;
  let medName = req.body.medicineName;

  Hospital.findOne({ hospitalName: hospitalName }).then((result) => {
    let data = result.medicineDetails.filter((val) => val.name === medName);
    return res.status(200).json(data);
  });
};

exports.getHospitalStockData = (req, res) => {
  let hospitalName = req.body.hospitalName;

  Hospital.findOne({ hospitalName: hospitalName })
    .select("totalBeds occupiedBeds avaliableBeds oxy oxygen")
    .then((result) => {
      return res.status(200).json(result);
    })
    .catch((err) => {
      return res.status(500).json({
        result: "false",
        mess: "Failed to Fetch Data!",
        err: err?.message,
        error: err,
      });
    });
};

exports.updateHospitalStockData = (req, res) => {
  let validate = validationResult(req);

  if (!validate.isEmpty()) {
    return res
      .status(422)
      .json({ result: "valfail", errors: validate.array() });
  }
  let hospitalName = req.body.hospitalName;
  let data = req.body.formData;

  let { totalBeds, avaliableBeds, oxy, occupiedBeds, oxygen } = data;

  Hospital.findOneAndUpdate(
    { hospitalName: hospitalName },
    {
      $set: {
        totalBeds: totalBeds,
        avaliableBeds: avaliableBeds,
        oxy: oxy,
        occupiedBeds: occupiedBeds,
        oxygen: oxygen,
      },
    },
    { new: true }
  )
    .then((result) => {
      return res
        .status(200)
        .json({ result: true, mess: "Successfully updated data!" });
    })
    .catch((err) => {
      return res
        .status(500)
        .json({
          result: false,
          mess: "Unable to updat data!",
          err: err?.message,
          error: err,
        });
    });
};

exports.registerHospitalData = (req, res) => {
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

  Hospital.findOneAndUpdate({ hospitalName: hospitalName })
    .then((result) => {
      const insertHosData = new Hospital({
        hospitalName: hospitalName,
        address: {
          state: formData.stateBox,
          district: formData.districtBox,
          street: formData.addressBox,
        },
        contacts: formData.contactBox,
        totalBeds: 0,
        avaliableBeds: 0,
        occupiedBeds: 0,
        oxy: 0,
        oxygen: "avaliable",
        type: formData.typeBox,
      });

      return insertHosData.save().then((result) => {
        console.log(result);
        return res
          .status(200)
          .json({ result: true, mess: "Added Details Succesfully!" });
      });
    })
    .catch((err) => {
      return res
        .status(500)
        .json({
          result: false,
          mess: "Unable to add you'r details!",
          err: err?.message,
          error: err,
        });
    });
};
