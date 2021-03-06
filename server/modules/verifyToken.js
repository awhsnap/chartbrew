const jwt = require("jsonwebtoken");

const db = require("../models/models");

const settings = process.env.NODE_ENV === "production" ? require("../settings") : require("../settings-dev");

module.exports = (req, res, next) => {
  const token = req.headers.authorization ? req.headers.authorization.replace("Bearer ", "") : "";

  if (token) {
    return jwt.verify(token, settings.secret, (err, decoded) => {
      if (err) return res.status(401).send("Unauthorized access.");
      return db.User.findByPk(decoded.id).then((user) => {
        if (!user) return res.status(400).send("Could not process the request. Please try again.");

        const userObj = {
          "id": user.id,
          "name": user.name,
          "email": user.email,
          "token": token,
          "admin": user.admin,
        };
        req.user = userObj;
        return next();
      }).catch((error) => { return res.status(400).send(error); });
    });
  } else {
    return res.status(400).send("Token is missing.");
  }
};
