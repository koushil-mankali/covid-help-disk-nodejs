const jwt = require("jsonwebtoken");
require("dotenv").config();

module.exports = (req, res, next) => {
  const reqBdy = req.get("Authorization");
  if (reqBdy) {
    const token = reqBdy.split(" ")[1];
    let decodeToken;

    try {
      decodeToken = jwt.verify(token, process.env.JWT_SECRET_KEY);
    } catch (err) {
      return res.status(500).json({ result: "failed" });
    }

    if (!decodeToken) {
      return res.status(500).json({ result: "failed" });
    }
    req.user_id = decodeToken.userName;
    req.isAuth = true;
    next();
  } else {
    return res.status(500).json({ result: "failed" });
  }
};
