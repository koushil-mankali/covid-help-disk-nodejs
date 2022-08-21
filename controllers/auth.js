const Auth = require("../models/Auth");

const crypto = require("crypto");

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const sendGrid = require("nodemailer-sendgrid-transport");
const { validationResult } = require("express-validator");
require("dotenv").config();

let RedURL = "http://localhost:3000/activate-account";

let transport = nodemailer.createTransport(
  sendGrid({
    auth: {
      api_key: process.env.API_KEY,
    },
  })
);

exports.islogin = (req, res) => {
  return res.status(200).json({ isCred: true });
};

exports.signup = (req, res) => {
  let validation = validationResult(req);

  if (!validation.isEmpty()) {
    return res.status(422).json({
      result: "valfail",
      message: "Data Validation Failed!",
      errors: validation.array(),
    });
  }

  const hospitalName = req.body.hospitalName;
  const userName = req.body.userName;
  const userEmail = req.body.userEmail;
  const userPassword = req.body.userPassword;
  const userPhone = req.body.userPhone;

  const randomCode = crypto.randomBytes(20).toString("hex");
  let URL = `http://localhost:4000/activate-account/${randomCode}`;

  bcrypt.hash(userPassword, 12).then((hashedPass) => {
    Auth.findOne({ userEmail }).then((result) => {
      if (result) {
        return res
          .status(200)
          .json({ result: false, message: "Email already exists!" });
      }

      let auth = new Auth({
        hospitalName: hospitalName,
        userName: userName,
        userEmail: userEmail,
        userPassword: hashedPass,
        userPhone: userPhone,
        token: randomCode,
        active: false,
      });

      auth
        .save()
        .then((result) => {
          let css = {
            heading: {
              "font-family": `"Recursive", "sans-serif"`,
              "font-size": "1.4rem",
              margin: "10px 0px",
            },
            p: {
              "font-family": `"Recursive", "sans-serif"`,
              "font-size": "1.1rem",
            },
          };

          transport.sendMail(
            {
              to: userEmail,
              from: "admin@koushilmankali.com",
              subject: "Account Activation!",
              html: `<div>
                    <h1 >Thank you for creating account at Covid Help Disk.</h1>
                    <br />
                    <br />
                    <p >You'r account hasbeen succesfully created. To activate you'r account <a href=${URL}>Click Here</a>.</p>
                </div>`,
            },
            function (err, info) {
              if (err) {
                return res.status(201).json({
                  result: false,
                  message: "Failed Sending Verification Mail!",
                });
              } else {
                return res.status(201).json({
                  result: true,
                  message:
                    "Account Created Succesfully please check you'r mail for account Activation.",
                });
              }
            }
          );
        })
        .catch((err) => {
          return res.status(500).json({
            result: false,
            message: "Something went wrong please try again.",
            anmess: err,
          });
        });
    });
  });
};

exports.login = (req, res) => {
  let validation = validationResult(req);

  if (!validation.isEmpty()) {
    return res.status(422).json({
      result: "valfail",
      message: "Data Validation Failed!",
      errors: validation.array(),
    });
  }

  let userEmail = req.body.userEmail;
  let userPassword = req.body.userPassword;

  Auth.findOne({ userEmail }).then((result) => {
    if (!result) {
      return res
        .status(404)
        .json({ result: false, message: "User not found!" });
    }

    if (!result.active) {
      return res.status(200).json({
        result: false,
        message: "Please Activate You'r Account to Login",
      });
    }

    bcrypt
      .compare(userPassword, result.userPassword)
      .then((val) => {
        if (!val) {
          return res
            .status(422)
            .json({ result: false, message: "Email or Password wrong!" });
        }
        const token = jwt.sign(
          {
            userName: result.userName,
            userEmail: userEmail,
          },
          process.env.JWT_SECRET_KEY,
          { expiresIn: "1h" }
        );
        return res.status(200).json({
          result: true,
          message: "login success",
          token: token,
          isLogin: true,
          email: userEmail,
        });
      })
      .catch((err) => {
        console.log(err);
        return res
          .status(401)
          .json({ result: false, message: "User name or password is wrong!" });
      });
  });
};

exports.accActivation = (req, res) => {
  let token = req.params.token;

  Auth.findOneAndUpdate({ token: token }, { active: true })
    .then((result) => {
      if (!result) {
        return res.status(308).redirect(`${RedURL}/error`);
      }

      if (result.active) {
        return res.status(308).redirect(`${RedURL}/error`);
      }

      return res.status(308).redirect(`http://localhost:3000/login`);
    })
    .catch((err) => {
      console.log(err);
      return res.status(308).redirect(`${RedURL}/error`);
    });
};

exports.getHospitalName = (req, res) => {
  let userEmail = req.body.userEmail;

  Auth.findOne({ userEmail: userEmail })
    .select("hospitalName")
    .then((result) => {
      return res.status(200).json(result);
    })
    .catch((err) => {
      console.log(err);
      return res.status(308).redirect(`${RedURL}/error`);
    });
};
