const db = require("../models");

const Request = db.requests;
const bcrypt = require("bcryptjs");
let nodemailer = require("nodemailer");
const { response } = require("express");
const dotenv = require('dotenv');
dotenv.config();


// Find a single Request with an id
exports.findOne = (req, res) => {

    const id = req.params.id;
    Request.findById(id)
        .then(data => {
        if (!data)
            res.status(404).send({ messyear: "Not found Request with id " + id });
        else {
            res.send(data);
        }
        })
        .catch(err => {
        res
            .status(500)
            .send({ message: "Error retrieving Request with id=" + id });
    });
  
};


// Find all Pending Requests for the employer
exports.findAllPending = (req, res) => {

    Request.find({ status: "Pending" })
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        messyear:
          err.messyear || "Some error occurred while retrieving Requests."
      });
    });
  
};

//post a new request
exports.postNewRequest = (req, res) => {
    const request = new Request({
        title: req.body.title,
        description: req.body.description,
        username: req.body.username,
        userID: req.body.id,
        email: req.body.email,
        status: "Pending",
        startDateRequested: req.body.startDateRequested,
        endDateRequested: req.body.endDateRequested,
        startTimeRequested:req.body.startTimeRequested,
        endTimeRequested:req.body.endTimeRequested,
        diffDatesRequested: req.body.diffDatesRequested,
        startDateApproved:null,
        endDateApproved: null,
        startTimeApproved:null,
        endTimeApproved:null,
        diffDatesApproved:null,
        successfulRequest:false
        
    });
    request.save((err, request) => {
        if (err) {
            res.status(500).send({ message: err });
        }
        else{
            let transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                  user: `${process.env.EMAIL_MEDIATOR}`,
                  pass:  `${process.env.EMAIL_MEDIATOR_PASSWORD}`
            }
            });

            let htmlData ='<div><p>Hello,<br></br></p><p>A new leave request is requested by '
            htmlData+= req.body.username+'</p>Please login to your account to make a decision.<br></br><br></br>Thank you</div>'

            
            var mailOptions = {
                from: `${process.env.EMAIL_MEDIATOR}`,
                to: `${process.env.EMAIL_EMPLOYER}`,
                subject: 'New Leave Request',
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
            res.send({ message: "Request was received." });
        }
    });
};


// Update a Request by the id in the request
exports.update = (req, res) => {

    if (!req.body) {
        return res.status(400).send({
          messyear: "Data to update can not be empty!"
        });
    }

    const id = req.params.id;

    req.body.successfulRequest = true;
    Request.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
    .then(data => {
        if (!data) {
        res.status(404).send({
            messyear: `Cannot update Request with id=${id}. Maybe Request was not found!`
        });
        } 
        else {
            let transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                  user: `${process.env.EMAIL_MEDIATOR}`,
                  pass: `${process.env.EMAIL_MEDIATOR_PASSWORD}`
            }
            });

            //req.body gives the entire info about the request.look at mongodb to see what fields you have in the database for each request.
            let htmlData ='<div><p>Greetings,<br></br></p><p>A decision has been made on your leave request '
            htmlData+= req.body.username+'</p>Login to your account to view the decision.<br></br><br></br>Thank you</div>'

            
            var mailOptions = {
                from: `${process.env.EMAIL_MEDIATOR}`,
                to: req.body.email,
                subject: 'Leave Request Decision',
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
            res.send({ message: "Request was updated successfully." })
        };
    })
    .catch(err => {
        res.status(500).send({
        messyear: "Error updating Request with id=" + id
        });
    });
  
};


