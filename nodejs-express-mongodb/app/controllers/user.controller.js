const db = require("../models");

const dotenv = require('dotenv');
dotenv.config();

const User = db.users;
const Request = db.requests;
const bcrypt = require("bcryptjs");
ObjectID = require('mongodb').ObjectID;


// Retrieve all users from the database with the specific username
exports.findAll = (req, res) => {

    let query={};

    let userName=req.query.username;
	if (userName.length == 0){
        let data="";
        res.status(200).send(data);
    }
    else{

        let username={'$regex':userName, '$options':'i'};
        query.username=username;
        
    
        if (query.username.length!=0 ){
            User.find(query)
            .then(data => {
            res.send(data);
            })
            .catch(err => {
            res.status(500).send({
                message:
                err.message || "Some error occurred while retrieving users."
            });
            });
        }
        else{
            res.status(200).send("");
        }

    }
};



// Find a single user with an id
exports.findOne = (req, res) => {

    const id = req.params.id;
    let info ={};
    User.findById(id)
        .then(data => {
            if (!data)
                res.status(404).send({ message: "Not found User with id " + id });
            else {
                info.accountInfo = data;

                Request.find({userID:id})
                .then(data => {
                    if (!data)
                        res.status(404).send({ message: "Not found User with id " + id });
                    else {
                        info.requestSummary = data;
                        res.send(info);
                    }
                })
                .catch(err =>{
                    res.status(500).send({
                        message:err.message || "Some error occured while retrieving requests"
                    })
                })
            }
        })
        .catch(err => {
            res.status(500).send({ message: "Error retrieving User with id=" + id });
    });

    
  
};


// Update a user by the id in the request
exports.update = (req, res) => {

    if (!req.body) {
        return res.status(400).send({
          message: "Data to update can not be empty!"
        });
    }

    let id = req.params.id;
    if (id=="" || null){
        id = req.body.id
    }
    //console.log("Info ");
    //console.log(req.body);


    //password change if exists
    if (req.body.password){
        let encryptPassword = bcrypt.hashSync(req.body.newpassword,8);
        req.body.password = encryptPassword;
            
    }

    //if days allocated changed
    if (req.body.daysAllocated){
        req.body.daysLeft = Number(req.body.daysAllocated) - Number(req.body.daysUsed);
    }
    
    //modify the changes on the database
    User.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
    .then(data => {
        if (!data) {
        res.status(404).send({
            message: `Cannot update User with id=${id}. Maybe User was not found!`
        });
        } else {

            let requests=[];

            //updating associated information in requests
            if (!(req.body.daysUsed && req.body.daysLeft)){
                Request.find({userID:id})
                .then (data => {
                    if (!data){
                        //console.log("Could not get request!")
                    }
                    //console.log(data);
                    for (let i=0; i < data.length; ++i){
                        requests.push(data[i].id);
                    }

                    //console.log("Requests:");
                    //console.log(requests);

                    for (let i=0; i< requests.length; ++i){
                        Request.findByIdAndUpdate(requests[i], req.body, {useFindAndModify:false})
                        .then(
                            //console.log(`Requests ${id} was updated successfully!`)
                        )
                        .catch(err => {
                            console.log(err);
                        })
                    }
                    res.send({ 
                        message: "User was updated successfully." 
                    })                
                })
                .catch(err => console.log(err))    
            }
            else{
                res.send({message:"Updated successfully!"})
            }
                    
        };
    })
    .catch(err => {
        res.status(500).send({
        message: "Error updating User with id=" + id
        });
    });
  
};

