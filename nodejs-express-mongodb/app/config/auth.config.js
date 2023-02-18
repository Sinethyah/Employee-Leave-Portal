const dotenv = require('dotenv');
dotenv.config();

//secret to generate token
module.exports = {
    secret: `${process.env.SECRET}`,
    sign_in_key:`${process.env.SIGN_IN_KEY}`
};
