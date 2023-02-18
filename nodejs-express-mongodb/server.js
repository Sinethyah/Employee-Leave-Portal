const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const fs = require("fs");
const https = require("https");

const app = express();
const dotenv = require('dotenv')
dotenv.config()

//allows information from client (frontend 8081) while server is at 8080
var corsOptions = {
  origin: "https://localhost:8081"
};

app.use(cors(corsOptions));
// parse requests of content-type - application/json
app.use(bodyParser.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

const db = require("./app/models");
const Role = db.role;

db.mongoose
  .connect(db.url, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => {
    console.log("Connected to the database!");
    initial();
  })
  .catch(err => {
    console.log("Cannot connect to the database!", err);
    process.exit();
});

function initial() {
  Role.estimatedDocumentCount((err, count) => {
    if (!err && count === 0) {
      new Role({
        name: "Employee"
      }).save(err => {
        if (err) {
          console.log("error", err);
        }
        console.log("added 'Employee' to roles collection");
      });
      new Role({
        name: "Employer"
      }).save(err => {
        if (err) {
          console.log("error", err);
        }
        console.log("added 'Employer' to roles collection");
      });
    }
  });
}

// simple route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to leave request application." });
});


require("./app/routes/user.routes")(app);
require('./app/routes/auth.routes')(app);
require('./app/routes/request.routes')(app);



const httpsOptions = {
    key: fs.readFileSync('security/cert.key'),
    cert: fs.readFileSync('security/cert.pem')
}

const server = https.createServer(httpsOptions, app)
  .listen(process.env.SERVER_PORT, () => {
      console.log('server running at ' + `${process.env.SERVER_PORT}`)
})