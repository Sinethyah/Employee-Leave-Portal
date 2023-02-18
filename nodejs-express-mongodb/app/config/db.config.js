const dotenv = require('dotenv')
dotenv.config();

//database connection
module.exports = {
    url: `${process.env.DATABASE_URL_CLOUD}`
};

//in case you want to connect with mongo cloud database
//username: jelly
//password: jelly
//url: `${process.env.DATABASE_URL_CLOUD}`