const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();
const helmet = require("helmet");
const compression = require("compression");

const route = require("./routes/route");
const authRoute = require("./routes/auth");
const adminRoute = require("./routes/admin");

let app = express();

app.use(helmet());
app.use(cpmpression());

app.use(express.json());

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Method", "POST, GET, PUT, PATCH, DELETE");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Content-Type, Origin, Authorization"
  );
  next();
});

app.use(route);
app.use(authRoute);
app.use(adminRoute);

mongoose
  .connect(process.env.URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then((result) => {
    app.listen(process.env.PORT || 3000);
  })
  .catch((err) => {
    console.log("Error Connecting = ", err);
  });
