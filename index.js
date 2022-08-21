const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();
const helmet = require("helmet");
const compression = require("compression");
const cors = require('cors');

const route = require("./routes/route");
const authRoute = require("./routes/auth");
const adminRoute = require("./routes/admin");

let app = express();

app.use(helmet());
app.use(compression());
app.use(cors());

app.use(express.json());

app.use(route);
app.use(authRoute);
app.use(adminRoute);

app.use('/', (req, res) => {
  return res.json({ success: true, message: "Welcome to Covid Help Desk!" });
})

mongoose
  .connect(process.env.URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then((result) => {
    app.listen(process.env.PORT || 3000);
    console.log("DB Connected!");
  })
  .catch((err) => {
    console.log("Error Connecting = ", err);
  });
