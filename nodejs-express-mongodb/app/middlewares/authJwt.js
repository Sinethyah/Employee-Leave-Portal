const jwt = require("jsonwebtoken");
const config = require("../config/auth.config.js");
const db = require("../models");

//verify the access token
verifyToken = (req, res, next) => {
    let token = req.headers["x-access-token"];
    //console.log("token "+token)
    if (!token) {
        return res.status(403).send({ message: "No token provided! Unauthorized!" });
    }
    jwt.verify(token, config.secret, (err, decoded) => {
        if (err) {
        return res.status(401).send({ message: "Unauthorized!" });
        }
        req.userId = decoded.id;
        next();
    });
};



const authJwt = {
    verifyToken
};

module.exports = authJwt;