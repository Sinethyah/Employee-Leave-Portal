const config = require("../config/auth.config");
const dotenv = require('dotenv');
dotenv.config();
const db = require("../models");
const User = db.users;
const Role = db.role;
var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");
const crypto = require("crypto");
const {OAuth2Client}= require('google-auth-library');
const fetch = require('node-fetch')
const client = new OAuth2Client(`${process.env.OAUTH_CLIENT_ID}`);
let nodemailer = require("nodemailer");


//default registration, checks if user has an 'employer' role. If yes, assign 'Employer' or else 
//assign 'Employee'
exports.signup = (req, res) => {
    const user = new User({
        username: req.body.username,
        password: bcrypt.hashSync(req.body.password,8),
        email: req.body.email,
        firstName: req.body.firstName,
        middleName: req.body.middleName,
        lastName: req.body.lastName,
        department: req.body.department,
        daysAllocated: req.body.daysAllocated,
        daysUsed:0,
        daysLeft:Number(req.body.daysAllocated - req.body.daysUsed),
    });
    user.save((err, user) => {
        if (err) {
        res.status(500).send({ message: err });
        return;
        }
        if (req.body.role=="Employer" || req.body.role=="employer") {
            Role.findOne({ name: "Employer" }, (err, role) => {
                if (err) {
                    res.status(500).send({ message: err });
                    return;
                }

                user.role = [role._id];
                user.save(err => {
                    if (err) {
                    res.status(500).send({ message: err });
                    return;
                    }
                    res.status(200).send({ message: "User was registered successfully!" });
                });
                }
            );
        } else {
        Role.findOne({ name: "Employee" }, (err, role) => {
            if (err) {
            res.status(500).send({ message: err });
            return;
            }

            user.role = [role._id];
            user.save(err => {
            if (err) {
                res.status(500).send({ message: err });
                return;
            }
            res.status(200).send({ message: "User was registered successfully!" });
            });
        });
        }
    });
};

//default signin
exports.signin = (req, res) => {
    User.findOne({
        username: req.body.username
        })
        .populate("role", "-__v")
        .exec((err, user) => {
        if (err) {
            res.status(500).send({ message: err });
            return;
        }
        if (!user) {
            return res.status(404).send({ message: "User Not found." });
        }

        if (user.googleId || user.facebookId){
            res.status(401).send({
                accessToken:null,
                message: "User exists in database. Try via Google or Facebook login!"
            })
        }

        else {

            var passwordIsValid = bcrypt.compareSync(
                req.body.password,
                user.password
            );
            //console.log(bcrypt.hashSync(req.body.password));
            //console.log(bcrypt.hashSync(user.password));
    
            if (!passwordIsValid) {
                return res.status(401).send({
                    accessToken: null,
                    message: "Invalid password!"
                });
            }
            var token = jwt.sign({ id: user.id }, config.secret, {
                expiresIn: 86400 // 24 hours
            });
    
            //console.log("user sign in:")
            //console.log(user);
            //console.log("role: "+user.role);
            //console.log(user.role.name);
    
            var authorities = [];
            authorities.push("ROLE_" + user.role.name.toUpperCase());
            
            res.status(200).send({
                id: user._id,
                username: user.username,
                email: user.email,
                firstName: user.firstName,
                middleName: user.middleName,
                lastName: user.lastName,
                age: user.age,
                department: user.department,
                gender: user.gender,
                daysAllocated: user.daysAllocated,
                daysUsed: user.daysUsed,
                daysLeft: user.daysLeft,
                role: authorities,
                accessToken: token
            });
            
        }

        
        
    });
};

//login with google
exports.googlelogin = (req,res) => {
    const {tokenId} = req.body;
    const {googleId} = req.body;

    client.verifyIdToken({idToken:tokenId, audience:`${process.env.OAUTH_CLIENT_ID}`})
    .then(response => {
        const {email_verified, email} = response.payload;
        //console.log(response.payload);
        if (email_verified){

            let firstName = response.payload.given_name;
            let lastName = response.payload.family_name;

            User.findOne({email})
                .populate("role","-__v")
                .exec((err,user)=>{
                if (err){
                    return res.status(400).send("Error...")
                }
                else{
                    if (user){

                        if (user.googleId){

                            var token = jwt.sign({ id: user.id }, config.secret, {
                                expiresIn: 86400 // 24 hours
                            });
    
                            //console.log(user);
    
                            var authorities = [];
                            authorities.push("ROLE_" + user.role.name.toUpperCase());
                            
                            res.status(200).send({
                                id: user._id,
                                googleId: user.googleId,
                                username: user.username,
                                email: user.email,
                                firstName: user.firstName,
                                middleName: user.middleName,
                                lastName: user.lastName,
                                age: user.age,
                                department: user.department,
                                gender: user.gender,
                                daysAllocated: user.daysAllocated,
                                daysUsed: user.daysUsed,
                                daysLeft: user.daysLeft,
                                role: authorities,
                                accessToken: token
                            });

                        }
                        else {
                            return res.status(401).send({
                                accessToken:null,
                                message:"User exists in database but not via Google login! Try Facebook or Default login."
                            })
                        }
                        
                    }
                    else {
                        
                        //console.log("Creating new User");
                        //console.log("google id: "+googleId);

                        const user = new User({
                            username: firstName,
                            email: email,
                            firstName: firstName,
                            lastName: lastName,
                            googleId:googleId
                        });                        

                        user.save((err, user) => {
                            if (err) {
                            res.status(500).send({ message: err });
                            return;
                            }

                            var token = jwt.sign({ id: user.id }, config.secret, {
                                expiresIn: 86400 // 24 hours
                            });
                            
                            Role.findOne({ name: "Employee" }, (err, role) => {
                                if (err) {
                                    res.status(500).send({ message: err });
                                    return;
                                }
                                user.role = [role._id];

                                var authorities = [];
                                authorities.push("ROLE_" + role.name.toUpperCase());

                                user.save(err => {
                                    if (err) {
                                        res.status(500).send({ message: err });
                                        return;
                                    }
                                    res.status(200).send({
                                        id: user._id,
                                        googleId:googleId,
                                        username: user.username,
                                        email: user.email,
                                        firstName: user.firstName,
                                        middleName: "",
                                        lastName: user.lastName,
                                        age: "",
                                        department: "",
                                        gender: "",
                                        daysAllocated: "",
                                        daysUsed: "",
                                        daysLeft: "",
                                        role: authorities,
                                        accessToken : token,
                                        googleId : googleId
                                    });
                                });
                            });
                                
                        });
                    }
                }
            })
        }
    }).catch(err => {
        console.log(err);
    })

};


//login with facebook
exports.facebooklogin = (req,res) => {

    let {accessToken, userID} = req.body;

    let urlGraphFacebook = `https://graph.facebook.com/v2.11/${userID}/?fields=id,name,email&access_token=${accessToken}`

    fetch(urlGraphFacebook, {
        method:'GET'
    })
    .then(response => response.json())
    .then(response => {
        const {email,name} =response;
        //console.log("Fb response "+JSON.stringify(response));

        User.findOne({email})
                .populate("role","-__v")
                .exec((err,user)=>{
                if (err){
                    return res.status(400).send("Error...")
                }
                else{
                    //if user already exists in the database
                    if (user){

                        //if the user has an associated facebook login
                        if (user.facebookId){

                            var token = jwt.sign({ id: user.id }, config.secret, {
                                expiresIn: 86400 // 24 hours
                            });
    
                            //console.log(user);
    
                            var authorities = [];
                            authorities.push("ROLE_" + user.role.name.toUpperCase());
                            
                            res.status(200).send({
                                id: user._id,
                                facebookId: user.facebookId,
                                username: user.username,
                                email: user.email,
                                firstName: user.firstName,
                                middleName: user.middleName,
                                lastName: user.lastName,
                                age: user.age,
                                department: user.department,
                                gender: user.gender,
                                daysAllocated: user.daysAllocated,
                                daysUsed: user.daysUsed,
                                daysLeft: user.daysLeft,
                                role: authorities,
                                accessToken: token
                            });
                        }
                        else {
                            return res.status(401).send({
                                accessToken:null,
                                message:"User exists in database but not via Facebook login not via Default login! Try Google or Default login"
                            })
                        }

                        
                    }
                    else {
                        

                        //"Creating new User")

                        //console.log("facebook res: "+response.name);
                        //console.log("fb email: "+response.email);

                        if (response){
                            let names = response.name.split(" ");
                            let firstName = names[0];
                            let lastName = names[1];
                            let email = response.email;

                            const user = new User({
                                username: firstName,
                                email: email,
                                firstName: firstName,
                                lastName: lastName,
                                facebookId : userID
                            });

                        
                            user.save((err, user) => {
                                if (err) {
                                res.status(500).send({ message: err });
                                return;
                                }

                                var token = jwt.sign({ id: user.id }, config.secret, {
                                    expiresIn: 86400 // 24 hours
                                });
                                
                                Role.findOne({ name: "Employee" }, (err, role) => {
                                    if (err) {
                                        res.status(500).send({ message: err });
                                        return;
                                    }
                        
                                    user.role = [role._id];

                                    var authorities = [];
                                    authorities.push("ROLE_" + role.name.toUpperCase());

                                    user.save(err => {
                                        if (err) {
                                            res.status(500).send({ message: err });
                                            return;
                                        }
                                        res.status(200).send({
                                            id: user._id,
                                            facebookId: userID,
                                            username: user.username,
                                            email: user.email,
                                            firstName: user.firstName,
                                            middleName: "",
                                            lastName: user.lastName,
                                            age: "",
                                            department: "",
                                            gender: "",
                                            daysAllocated: "",
                                            daysUsed: "",
                                            daysLeft: "",
                                            role: authorities,
                                            accessToken: token
                                        });
                                    });
                                });
                                    
                            });
                        }
                        else{
                            res.status(200).send("");
                        }
                        
                    }
                }
            })

    });

}


exports.forgetPasswordResetLink = (req,res) => {

    let {email} = req.body;

    User.findOne({email})
    .populate("role","-__v")
    .exec((err,user)=>{
        if (err){
            return res.status(400).send("Error...")
        }
        else{
            if (!user){
                res.status(500).send("Error! User with email not found!")
            }
            else if (user.googleId || user.facebookId){
                res.status(500).send("Error! User logged in via Google or Facebook!")
            }
            else{
                //let token = crypto.randomBytes(32).toString("hex");

                let secret = config.secret + user.password
                //console.log("old secret "+secret)

                var token = jwt.sign({ id: user.id }, secret, {
                    expiresIn: 86400 // 24 hours
                });

                //console.log("token "+token)


                const link = `${process.env.DOMAIN}/password-reset/${user._id}/${token}`;

                let transporter = nodemailer.createTransport({
                    service: 'gmail',
                    auth: {
                    user: `${process.env.EMAIL_MEDIATOR}`,
                    pass: `${process.env.EMAIL_MEDIATOR_PASSWORD}`
                }
                });

                let htmlData ='<div><p>Hello '
                htmlData+= user.username+', <br></br>'
                htmlData+='<div>Here is your reset link:</div><br></br>'
                htmlData+=link+'<br></br>'
                htmlData+='<br></br>Thank you'

                
                var mailOptions = {
                    from: `${process.env.EMAIL_MEDIATOR}`,
                    to: req.body.email,
                    subject: 'Password Reset Link for Leave Management Application',
                    html: htmlData
                };
                
                transporter.sendMail(mailOptions, function(error, info){
                    if (error) {
                        console.log(error);
                    }
                    /* 
                    else {
                        //console.log('Email sent: ' + info.response);
                    }
                    */
                });
                res.status(200).send({ message: "Password Reset Link sent successfully." })

            }

        }
    })

}

//verify if the user has resetted password or not, if not, the reset link is valid or else it is not valid 
exports.getResetPassword = (req,res) => {

    let {id, token}= req.params;

    User.findById(id)
    .then (userData => {

    
        let userPassword = userData.password

        let secret = config.secret + userPassword;
        //console.log("new secret: "+secret)

        try{
            let payload = jwt.verify(token,secret);
            //console.log("payload "+payload);
            res.status(200).send("Password not updated yet")
        }
        catch{
            res.status(500).send("Link was already used")

        }

    })


}

exports.passwordReset = (req,res) => {

    let id = req.params.id;
    let token = req.params.token;
    
    if (req.body.password){
        let encryptPassword = bcrypt.hashSync(req.body.password,8);
        req.body.password = encryptPassword;
            
    }

    if ((id && token)){
        User.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
        .then(data => {
            if (!data){
                res.status(404).send({message:"Error"})
            }
            else{
                res.status(200).send({message:"Password resetted successfully!"})
            }
        })
        .catch(err=>{
            res.status(500).send({message:"Error"})
        })
    }
    else{
        res.status(500).send({message:"Link is invalid!"})
    }


}
