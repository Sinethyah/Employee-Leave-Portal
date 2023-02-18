const { authJwt } = require("../middlewares");
const requests = require("../controllers/request.controller.js");
var router = require("express").Router();

module.exports = app => {

    // Retrieve all pending requests
    router.get("/", [authJwt.verifyToken], requests.findAllPending);

    router.post("/", requests.postNewRequest);

    // Retrieve a single request with id
    router.get("/:id", [authJwt.verifyToken],requests.findOne);

    // Update a request with id
    router.put("/:id", [authJwt.verifyToken], requests.update);

    app.use('/api/requests', router);

    app.use(function(req, res, next) {
      res.header(
        "Access-Control-Allow-Headers",
        "x-access-token, Origin, Content-Type, Accept"
      );
      next();
    });

  };