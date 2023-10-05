const jwt = require("jsonwebtoken"); 
const router = require("./auth"); 
require("dotenv").config();
const config=process.env;


function isUserLoggedIn(req, res, next) {
  const authorizationHeader = req.headers.authorization;

  if (!req.headers.authorization) {
    res.status(403).send("no-authorization-header");
    return;
  }

  const val = authorizationHeader.split(" ");

  const tokentype = val[0];

  const tokenValue = val[1];

  if (!tokenValue) {
    return res.status(403).send("A token is required for authentication");
  }

  try {
    const decoded = jwt.verify(tokenValue, config.jwt_secret);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).send("Invalid token");
  }
}

function adminsOnly(req, res, next) {
  if (req.decoded.role == admin) {
    next();
  } else {
    res.status(401).send("you are not an admin");
  }
}

module.exports = {isUserLoggedIn, adminsOnly};