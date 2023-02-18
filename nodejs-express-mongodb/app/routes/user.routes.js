const { authJwt } = require("../middlewares");
const controller = require("../controllers/user.controller");
const users = require("../controllers/user.controller.js");
var router = require("express").Router();

module.exports = app => {

    // Retrieve all users with username specified
    router.get("/", [authJwt.verifyToken], users.findAll);

    // Retrieve a single user with id
    router.get("/:id", [authJwt.verifyToken],users.findOne);

    // Update a user with id
    router.put("/:id", [authJwt.verifyToken], users.update);

    
    app.use('/api/users', router);

    app.use(function(req, res, next) {
      res.header(
        "Access-Control-Allow-Headers",
        "x-access-token, Origin, Content-Type, Accept"
      );
      next();
    });

  };