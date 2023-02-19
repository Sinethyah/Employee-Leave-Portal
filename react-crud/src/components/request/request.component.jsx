import React, { Component } from "react";
import AuthService from "../../services/auth.service";
import UserService from "../../services/user.service"
import RequestDataService from "../../services/request.service"
import { useParams} from "react-router-dom";
import {DropdownButton, Dropdown, Form, Container, Row, Col} from 'react-bootstrap'
import css from './../../css/request.css'

import { Link, NavLink } from "react-router-dom";

import authservice  from "../../services/auth.service";
import { GoogleLogout } from 'react-google-login';



const required = value => {
    if (!value) {
      return (
        <div className="alert alert-danger" role="alert">
          This field is required!
        </div>
      );
    }
};

let timeout=null;


class Request extends Component {
    constructor(props) {
        super(props);

        this.onChangeStatus = this.onChangeStatus.bind(this);
        this.updateRequest = this.updateRequest.bind(this);
        this.onChangeStartDateApproved = this.onChangeStartDateApproved.bind(this);
        this.onChangeEndDateApproved = this.onChangeEndDateApproved.bind(this);
        this.onChangestartTimeApproved = this.onChangestartTimeApproved.bind(this);
        this.onChangeendTimeApproved = this.onChangeendTimeApproved.bind(this);

        this.state = {
            currentUser: AuthService.getCurrentUser(),
            userselected:{
                id:"",
                daysAllocated:"",
                daysUsed:"",
                daysLeft:""
                
            },
            request:{
                status:"",
                userID:"",

                startDateApproved:"",
                endDateApproved:"",
                startTimeApproved:"",
                endTimeApproved:"",
                startTimeApproved12Hour1:"",
                startTimeApproved12Hour2:"",
                endTimeApproved12Hour1:"",
                endTimeApproved12Hour2:"",
                startTimeApprovedFormat:"",
                endTimeApprovedFormat:"",

                startTimeRequested12Hour1:"",
                startTimeRequested12Hour2:"",
                endTimeRequested12Hour1:"",
                endTimeRequested12Hour2:"",
                startTimeRequestedFormat:"",
                endTimeRequestedFormat:"",
                diffDatesApproved:"",

                successfulRequest:""

            },
            count:0,
            message:"",
            successful:false,
        };
    }

    componentDidMount() {
        const {id} = this.props.params;
        this.getRequest(id);
        
    }

    //gets the specific user using the id
    getUser(id){
        UserService.get(id)
        .then(response => {
            this.setState({
                userselected: response.data.accountInfo
            })

        })
        .catch(err => console.log(err));
    }

    //gets the specific request using the id
    getRequest(id) {
        RequestDataService.get(id)
        .then(response => {
            this.setState({
                request: response.data,
            });

            console.log(response);

            //setting time to 12 hour format
            console.log(response.data.startTimeRequested)
            let startTimeRequestedSplit = response.data.startTimeRequested.split(":");
            let endTimeRequestedSplit = response.data.endTimeRequested.split(":");

            if (startTimeRequestedSplit){
                let splitStartTime= Number(startTimeRequestedSplit[0])
                let splitEndTime = Number(endTimeRequestedSplit[0]);
                let timeFormatStartTime="";
                let timeFormatEndTime="";


                if (splitStartTime >= 12){
                    timeFormatStartTime="pm"
                }
                else{
                    timeFormatStartTime="am";
                }

                if (splitStartTime > 12){
                    splitStartTime -=12

                }

                if (splitEndTime >= 12){
                    timeFormatEndTime="pm"
                }
                else{
                    timeFormatEndTime="am";
                }

                if (splitEndTime > 12){
                    splitEndTime -=12
                }

                this.setState(function(prevState) {
                    return {
                        request: {
                        ...prevState.request,
                        startTimeRequested12Hour1 : splitStartTime,
                        startTimeRequested12Hour2 : startTimeRequestedSplit[1],
                        startTimeRequestedFormat:timeFormatStartTime,
                        endTimeRequested12Hour1 : splitEndTime,
                        endTimeRequested12Hour2 : endTimeRequestedSplit[1],
                        endTimeRequestedFormat:timeFormatEndTime
                        }
                    }
                });
            }   

            //For approved times, convert to 12-hour format
            if (response.data.startTimeApproved && response.data.endTimeApproved){
                let startApprovedTime = response.data.startTimeApproved.split(":");
                let endApprovedTime = response.data.endTimeApproved.split(":");
                let startApprovedTime_1 = startApprovedTime[0];
                let endApprovedTime_1 = endApprovedTime[0]
                let starttimeApprovedFormat ="";
                let endtimeApprovedFormat="";

                if (startApprovedTime_1 >= 12){
                    starttimeApprovedFormat="pm";
                }
                else{
                    starttimeApprovedFormat="am";
                }

                if (startApprovedTime_1 > 12){
                    startApprovedTime_1 -=12
                }

                if (endApprovedTime_1 >= 12){
                    endtimeApprovedFormat="pm";
                }
                else{
                    endtimeApprovedFormat="am";
                }

                if (endApprovedTime_1 > 12){
                    endApprovedTime_1 -=12

                }

                this.setState(function(prevState) {
                    return {
                        request: {
                        ...prevState.request,
                        startTimeApproved12Hour1 : startApprovedTime_1,
                        startTimeApproved12Hour2 : startApprovedTime[1],
                        startTimeApprovedFormat:  starttimeApprovedFormat,
                        endTimeApproved12Hour1 : endApprovedTime_1,
                        endTimeApproved12Hour2 : endApprovedTime[1],
                        endTimeApprovedFormat:  endtimeApprovedFormat
                        }
                    }
                });
            }
        
            this.getUser(response.data.userID);
        })
        .catch(e => {
            console.log(e);
        });
    }

    //updates the specific request
    updateRequest(){

        RequestDataService.update(this.state.request.id, this.state.request)
        .then(response => {
            let userData={}
            if (this.state.request.status=="Approved"){
                //this.state.request.diffDatesApproved!="" && this.state.request.diffDatesApproved!=null
                if (this.state.request.diffDatesApproved >= 1){
                    userData ={
                        daysUsed:Number(this.state.userselected.daysUsed)+Number(this.state.request.diffDatesApproved),
                        daysLeft: Number(this.state.userselected.daysAllocated) - (Number(this.state.userselected.daysUsed)+Number(this.state.request.diffDatesApproved))
                    }
                }
                else if (this.state.request.diffDatesApproved == 0){
                    userData ={
                        daysUsed:Number(this.state.userselected.daysUsed)+Number(0.5),
                        daysLeft: Number(this.state.userselected.daysAllocated) - (Number(this.state.userselected.daysUsed)+Number(0.5))
                    }
                }
            }
            
            UserService.update(this.state.userselected.id, userData)
            .then(response => {
                this.setState({
                    successful:true,
                    message: "The request was updated successfully! You will be redirected in a few seconds..."
                })
                window.setTimeout(function(){

                    // Move to a request history
                    window.location.href = "/pendingrequests";
            
                }, 4000);
            })
            .catch(e => {
                console.log(e);
            })
            
        })
        .catch(e => {
            console.log(e);
        })
    }

    onChangeStatus(e){
        const status = e.target.value;
        this.setState(function(prevState) {
        return {
            request: {
            ...prevState.request,
            status: status,
            }
        };
        });
    }

    // a and b are javascript Date objects
    dateDiffInDays(a, b) {

        const _MS_PER_DAY = 1000 * 60 * 60 * 24;

        // Discard the time and time-zone information.
        const utc1 = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate());
        const utc2 = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate());

        return Math.floor((utc2 - utc1) / _MS_PER_DAY);
    }

    onChangeStartDateApproved(e) {

        let currentDate = new Date();
        currentDate.setHours(0,0,0,0);
        let startDate = new Date(e.target.value);
        startDate.setHours(24,0,0,0);

        if (startDate>=currentDate){
            this.setState(function(prevState) {
                return {
                    request: {
                    ...prevState.request,
                    startDateApproved : e.target.value
                    }
                }
            });
            document.getElementById("sd").innerHTML = "";
            document.getElementById("ed").innerHTML = "";

            if (this.state.request.endDateApproved){
                if (e.target.value >= this.state.request.endDateApproved){
                    document.getElementById("sd").innerHTML = "Start date cannot be greater than End Date!";
                }
            }

            //if it's a half-day off, start date and end date are the same. End date gets prefilled   
            if (this.state.request.title=="Half day off"){
                this.setState(function(prevState) {
                    return {
                        request: {
                        ...prevState.request,
                        endDateApproved : e.target.value,
                        diffDatesApproved:0
                        }
                    }
                });
                document.getElementById("endDate").value = e.target.value;
            }
            else {
                if (this.state.request.endDateApproved!=""){
                    let endDate = new Date(this.state.request.endDateApproved)
                    endDate.setHours(24,0,0,0);
        
                    const diff = this.dateDiffInDays(startDate,endDate);
        
                    if (diff > this.state.userselected.daysLeft){
                        document.getElementById("error").innerText="Error! Date range is greater than days allocated. Choose different dates"
                        document.getElementById("button").disabled = true;
                    }
                    else{
                        document.getElementById("error").innerText=""
                        this.setState(function(prevState) {
                            return {
                                request: {
                                ...prevState.request,
                                diffDatesApproved : Number(diff)
                                }
                            };
                        });
        
                        let submitButton = document.getElementById("button")
                        submitButton.disabled=false;
                    }
                }

            }
        }
        else{
            document.getElementById("sd").innerHTML = "Incorrect Start date! Should be equal to or greater than today's date.";
            document.getElementById("button").disabled= true;
        }

    
    }

    onChangeEndDateApproved(e) {

        let startDate = new Date(this.state.request.startDateApproved)
        startDate.setHours(24,0,0,0);
        let endDate = new Date(e.target.value)
        endDate.setHours(24,0,0,0);

        if (endDate >= startDate){
            this.setState(function(prevState) {
                return {
                    request: {
                    ...prevState.request,
                    endDateApproved : e.target.value
                    }
                };
            });
            document.getElementById("ed").innerHTML = "";
            document.getElementById("sd").innerHTML = "";

            const diff = this.dateDiffInDays(startDate,endDate);

            if (diff > this.state.userselected.daysLeft){
                document.getElementById("button").disabled = true;
                document.getElementById("error").innerText="Error! Date range is greater than days allocated. Choose different dates"
            }
            else{
                document.getElementById("error").innerText="";
                let submitButton = document.getElementById("button");
                submitButton.disabled=false;
                

                this.setState(function(prevState) {
                    return {
                        request: {
                        ...prevState.request,
                        diffDatesApproved : Number(diff)
                        }
                    };
                });
            }

        }
        else{
            document.getElementById("ed").innerHTML="Incorrect End date! End date cannot be less than Start date.";
            document.getElementById("button").disabled = true;
        }
        
        
        
    }

    diffTime(a,b){

        let a_time_split = a.split(":"); 

        let a_hours = a_time_split[0];
        let a_min = a_time_split[1];

        let b_time_split = b.split(":");

        let b_hours = b_time_split[0];
        let b_min = b_time_split[1];

        let a_time = Number(a_hours) + (Number(a_min)/60);
        let b_time = Number(b_hours) + Number((b_min)/60);

        let hoursDiff = b_time - a_time;

        return hoursDiff;

    }

    onChangestartTimeApproved(e) {
        
        let startTimeApproved = e.target.value;
        //console.log(startTimeApproved);


        let startDate = new Date(this.state.request.startDateApproved);
        if (startDate!=""){
            startDate.setHours(24,0,0,0);
        }

        let endDate = new Date(this.state.request.endDateApproved);
        if (endDate!=""){
            endDate.setHours(24,0,0,0);
        }

        let diffDates = this.dateDiffInDays(startDate,endDate);


        if (startDate && endDate && (diffDates==0)){
            let endTimeApproved = this.state.request.endTimeApproved;
            if (endTimeApproved!="" && endTimeApproved!=null){
                //let diffTime = this.diffTime(startTimeApproved,endTimeApproved);
                if ((this.diffTime(startTimeApproved, endTimeApproved)) > 4 || (this.diffTime(startTimeApproved, endTimeApproved) < 0)){
                    document.getElementById("errorTime").innerHTML="Time range should be 4 hours. Please check your start and end time."
                    document.getElementById("button").disbaled = true;
                }
                else{
                    


                    this.setState(function(prevState) {
                        return {
                            request: {
                            ...prevState.request,
                            startTimeApproved : e.target.value,

                            }
                        };
                    });
                    document.getElementById("errorTime").innerHTML=""
                    document.getElementById("button").disbaled = false;
                }
            }
            else{



                this.setState(function(prevState) {
                    return {
                        request: {
                        ...prevState.request,
                        startTimeApproved : e.target.value,
                        }
                    };
                });
                
                document.getElementById("errorTime").innerHTML=""

            }
            
        }
        else{



            this.setState(function(prevState) {
                return {
                    request: {
                    ...prevState.request,
                    startTimeApproved : e.target.value,
                    }
                };
            });
            
            document.getElementById("errorTime").innerHTML=""

        }

    }

    onChangeendTimeApproved(e) {
        
        let endTimeApproved = e.target.value;
        //console.log(endTimeApproved);

        let startDate = new Date(this.state.request.startDateApproved);
        if (startDate!=""){
            startDate.setHours(24,0,0,0);
        }
        //console.log(startDate);

        let endDate = new Date(this.state.request.endDateApproved);
        if (endDate!=""){
            endDate.setHours(24,0,0,0);
        }
        //console.log(endDate);


        let diffDates = this.dateDiffInDays(startDate,endDate);
        //console.log(diffDates);

        if (startDate && endDate && (diffDates==0)){
            let startTimeApproved = this.state.request.startTimeApproved;
            if (startTimeApproved!="" && startTimeApproved!=null){
                let diffTime = this.diffTime(startTimeApproved,endTimeApproved);
                if ((this.diffTime(startTimeApproved, endTimeApproved) > 4) || (this.diffTime(startTimeApproved, endTimeApproved) < 0)){
                    document.getElementById("errorTime").innerHTML="Time range should be 4 hours. Please check your start and end time."
                    document.getElementById("button").disbaled = true;
                }
                else{


                    this.setState(function(prevState) {
                        return{
                            request:{
                                ...prevState.request,
                                endTimeApproved:e.target.value,

                            }
                        } 
                    })
                    document.getElementById("errorTime").innerHTML=""
                    document.getElementById("button").disbaled = false;
                }
            }
            else{

                this.setState(function(prevState) {
                    return{
                        request:{
                        ...prevState.request,
                        endTimeApproved:e.target.value,
                        }
                    } 
                })
                document.getElementById("errorTime").innerHTML=""
            }
            
        }
        else{

            this.setState(function(prevState) {
                return{
                    request:{
                    ...prevState.request,
                    endTimeApproved:e.target.value,
                    }
                } 
            })
            document.getElementById("errorTime").innerHTML=""
        }
    }

    navBarToggle(){

        //class="sb-nav-fixed sb-sidenav-toggled"
        let navbarfixed= document.getElementById("navbar-fixed");

        if (!navbarfixed.classList.contains("sb-sidenav-toggled")){
            document.getElementById("navbar-fixed").classList.add("sb-sidenav-toggled");
        }
        else{
            document.getElementById("navbar-fixed").classList.remove("sb-sidenav-toggled");
        }
            
    }

    navLinkCollapse1(){

        let navLinkCollapse = document.getElementById("nav-link-collapse-1");

        if (navLinkCollapse.classList.contains("collapsed")){
            navLinkCollapse.classList.remove("collapsed");
            document.getElementById("collapseLayouts").classList.add("show");
        }
        else{
            navLinkCollapse.classList.add("collapsed");
            document.getElementById("collapseLayouts").classList.remove("show");

        }



    }

    navLinkCollapse2(){

        let navLinkCollapse = document.getElementById("nav-link-collapse-2");

        if (navLinkCollapse.classList.contains("collapsed")){
            navLinkCollapse.classList.remove("collapsed");
            document.getElementById("collapseUsers").classList.add("show");
        }
        else{
            navLinkCollapse.classList.add("collapsed");
            document.getElementById("collapseUsers").classList.remove("show");

        }

    }

    navLinkCollapse3(){

        let navLinkCollapse = document.getElementById("nav-link-collapse-3");

        if (navLinkCollapse.classList.contains("collapsed")){
            navLinkCollapse.classList.remove("collapsed");
            document.getElementById("collapseAccount").classList.add("show");
        }
        else{
            navLinkCollapse.classList.add("collapsed");
            document.getElementById("collapseAccount").classList.remove("show");

        }



    }

    render() {
        const { currentUser, request } = this.state;

        const logoutGoogle = (response) => {
            console.log(response);
            this.setState({
                currentUser:undefined
            })
            authservice.logout();
            
            window.location.href="/login"
        }

        
        return (
            <div>
        <div>
            <meta charSet="utf-8" />
            <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
            <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
            <meta name="description" content="" />
            <meta name="author" content="" />
            <title>Dashboard - SB Admin</title>
            <link href="https://cdn.jsdelivr.net/npm/simple-datatables@latest/dist/style.css" rel="stylesheet" type='text/css'/>
            <link href='./../../css/styles.css' rel="stylesheet" type='text/css'/>
            <script src='https://use.fontawesome.com/releases/v6.1.0/js/all.js' crossOrigin="anonymous"></script>
        </div>

        

            { currentUser && currentUser.role=="ROLE_EMPLOYER" && (

            <div className="sb-nav-fixed" id="navbar-fixed" >
            <nav className="sb-topnav navbar navbar-expand navbar-dark bg-dark">
                
                <a className="navbar-brand ps-3" href="/profile">Arcturus Leave Portal</a>
                
                <button className="btn btn-link btn-sm order-1 order-lg-0 me-4 me-lg-0" id="sidebarToggle" onClick={this.navBarToggle}><i className="fas fa-bars"></i></button>

            </nav>

            <div id="layoutSidenav">
                <div id="layoutSidenav_nav">
                    <nav className="sb-sidenav accordion sb-sidenav-dark" id="sidenavAccordion">
                        <div className="sb-sidenav-menu">
                            <div className="nav">
                                <div className="sb-sidenav-menu-heading">Core</div>
                                <a className="nav-link" href="/profile">
                                    <div className="sb-nav-link-icon"><i className="fas fa-tachometer-alt"></i></div>
                                    Dashboard
                                </a>
                                <div className="sb-sidenav-menu-heading">Pages</div>
                                <a className="nav-link collapsed" id="nav-link-collapse-1" onClick={this.navLinkCollapse1} data-bs-toggle="collapse" data-bs-target="#collapseLayouts" aria-expanded="false" aria-controls="collapseLayouts">
                                    <div className="sb-nav-link-icon"><i className="fas fa-columns"></i></div>
                                    Requests
                                    <div className="sb-sidenav-collapse-arrow"><i className="fas fa-angle-down"></i></div>
                                </a>
                                <div className="collapse" id="collapseLayouts" aria-labelledby="headingOne" data-bs-parent="#sidenavAccordion">
                                    <nav className="sb-sidenav-menu-nested nav">
                                        <a className="nav-link" href="/pendingrequests">View Requests</a>
                                    </nav>
                                </div>
                                <a className="nav-link collapsed" id="nav-link-collapse-2" onClick={this.navLinkCollapse2} data-bs-toggle="collapse" data-bs-target="#collapsePages" aria-expanded="false" aria-controls="collapsePages">
                                    <div className="sb-nav-link-icon"><i className="fas fa-book-open"></i></div>
                                    Users
                                    <div className="sb-sidenav-collapse-arrow"><i className="fas fa-angle-down"></i></div>
                                </a>
                                <div className="collapse" id="collapseUsers" aria-labelledby="headingOne" data-bs-parent="#sidenavAccordion">
                                    <nav className="sb-sidenav-menu-nested nav">
                                        <a className="nav-link" href="/users">View Users</a>
                                    </nav>
                                </div>
                                <a className="nav-link collapsed" id="nav-link-collapse-3" onClick={this.navLinkCollapse3} data-bs-toggle="collapse" data-bs-target="#collapsePages" aria-expanded="false" aria-controls="collapsePages">
                                    <div className="sb-nav-link-icon"><i className="fas fa-book-open"></i></div>
                                    My Account
                                    <div className="sb-sidenav-collapse-arrow"><i className="fas fa-angle-down"></i></div>
                                </a>
                                <div className="collapse" id="collapseAccount" aria-labelledby="headingOne" data-bs-parent="#sidenavAccordion">
                                    <nav className="sb-sidenav-menu-nested nav">
                                        <Link to={`/users/${currentUser.id}`} className="nav-link" >User Profile</Link>
                                    </nav>

                                    <nav>
                                        <GoogleLogout 
                                        clientId="1040969823585-d5cguq0891f5hdgf59jk46a1infpb1qp.apps.googleusercontent.com"
                                        render={renderProps => (
                                            <li className="sb-sidenav-menu-nested nav">
                                            <div className="nav-link" onClick={renderProps.onClick} disabled={renderProps.disabled}>Logout</div>
                                            </li>
                                        )}
                                        buttonText="Logout"
                                        onLogoutSuccess={logoutGoogle}
                                        >
                                        </GoogleLogout>
                                    </nav>
                                </div>

                                      
                            </div>
                        </div>
                        
                    </nav>
                </div>

                <div id="layoutSidenav_content">

                <main>
                    <div className="container-fluid px-4">

                            <div class="row">

                            <div class="col-lg-13">
    
                                
                                <div class="card shadow mb-4">
                                    <div class="card-header py-3">
                                        <h6 class="m-0 font-weight-bold text-primary">Details</h6>
                                    </div>
                                    <div class="card-body">

                                        <div className="row">
                                        <div class="col-lg-6">

                                        <b>REQUEST ID </b>
                                        <span>{request.id}</span>
                                        <p></p>
                                        <b>ORIGINATOR </b> 
                                        <span>{request.username}</span>
                                        <p></p>
                                        <b>ORIGINATOR EMAIL </b> 
                                        {request.email}
                                        <p></p>
                                        <b>TITLE </b> {request.title}
                                        <p></p>
                                        <b>DESCRIPTION </b> {request.description}
                                        <p></p>

                                        </div>

                                        <div class="col-lg-6">

                                        <b>START DATE REQUESTED </b>
                                        {request.startDateRequested}
                                        <p></p>
                                        <b>END DATE REQUESTED </b>
                                        {request.endDateRequested}
                                        <p></p>
                                        <b>START TIME REQUESTED </b>
                                        {request.startTimeRequested && (<p>{request.startTimeRequested} ({request.startTimeRequested12Hour1}:{request.startTimeRequested12Hour2} {request.startTimeRequestedFormat})</p>)}
                                        <p></p>
                                        <b>END TIME REQUESTED </b>
                                        {request.endTimeRequested && (<p>{request.endTimeRequested} ({request.endTimeRequested12Hour1}:{request.endTimeRequested12Hour2} {request.endTimeRequestedFormat})</p>)}
                                        <p></p>
                                        <b>STATUS </b>
                                        {request.status}
                                        <p></p>
                                        
                                        </div>
                                        </div>
                                    </div>
                                </div>
    
                                
                                <div class="card shadow mb-4">
                                    <div class="card-header py-3">
                                        <h6 class="m-0 font-weight-bold text-primary">Decision</h6>
                                    </div>
                                    <div class="card-body">
                            
                                {(request.successfulRequest==true) ? (
                                    <div>
                                        {request.status=="Approved" && (
                                            <div>
                                                <span>
                                                Request has been Approved
                                                </span>
                                                <p></p>
                                                <b>APPROVED START DATE </b>
                                                {request.startDateApproved} 
                                                <p></p>
                                                <b>APPROVED END DATE </b>
                                                {request.endDateApproved}
                                                <p></p>
                                                <b>APPROVED START TIME </b>
                                                {request.startTimeApproved && (<p>{request.startTimeApproved} ({request.startTimeApproved12Hour1}:{request.startTimeApproved12Hour2} {request.startTimeApprovedFormat}) </p>)}
                                                <p></p>
                                                <b>APPROVED END TIME </b>
                                                {request.endTimeApproved && (<p>{request.endTimeApproved} ({request.endTimeApproved12Hour1}:{request.endTimeApproved12Hour2} {request.endTimeApprovedFormat})</p>)}
                                                <p></p>
                                                <b>STATUS </b>
                                                {request.status}
                                                <p></p>
                                            </div>

                                        )}

                                        {request.status=="Pending" && (
                                        <span>
                                            Decision is Pending
                                        </span>
                                        )}

                                        {request.status=="Declined" && (
                                            <span>
                                                Request has been Declined
                                            </span>
                                        )}
                                        
                                    </div>

                                ) : (
                                        <div>
                                            <b>Select an option:</b>
                                            <div>
                                            <Form.Select size="md" onChange={this.onChangeStatus}>
                                                <option></option>
                                                <option>Approved</option>
                                                <option>Declined</option>
                                            </Form.Select>
                                            </div>


                                        {this.state.request.status== "Approved" && (
                                            <div>
                                            <Row>
                                            <div className="col-lg-3 col-sm-6">
                                            <label htmlFor="startDate"><b>Enter Start Date<span style={{'color':'red'}}>*</span></b></label>
                                            <input id="startDate" className="form-control" type="date" onChange={this.onChangeStartDateApproved} validations={[required]}/>
                                            <span id="sd" style={{color:'red'}}></span>
                                            </div>


                                            <div className="col-lg-3 col-sm-6">
                                                <label htmlFor="startTime">Enter Start Time</label>
                                                <input id="startTime" className="form-control" type="time" onChange={this.onChangestartTimeApproved} validations={[required]}/>
                                            </div>
                                                
                                            </Row>

                                            <Row>

                                            <div className="col-lg-3 col-sm-6">
                                                <label htmlFor="endDate"><b>Enter End Date<span style={{'color':'red'}}>*</span></b></label>
                                                <input id="endDate" className="form-control" type="date" onChange={this.onChangeEndDateApproved} validations={[required]}/>
                                                <span id="ed" style={{color:'red'}}></span>
                                            </div>

                                            <div className="col-lg-3 col-sm-6">
                                                <label htmlFor="endTime">Enter End Time</label>
                                                <input id="endTime" className="form-control" type="time" onChange={this.onChangeendTimeApproved} validations={[required]}/>
                                            </div>


                                            </Row>

                                            <Row>
                                            <br/>
                                            <span id="error" style={{'color':'red'}}></span>
                                            <span id="errorTime" style={{'color':'red'}}></span>
                                            </Row>
                                            </div>
                                        )}
                                        



                                        {(this.state.request.status=="Approved" || this.state.request.status=="Declined") ? (
                                            <div className="form-group">
                                                <button id="button" type="submit" className="btn btn-primary btn-block m-2" onClick={this.updateRequest}>Submit</button>
                                            </div>
                                        ): (
                                            <div className="form-group">
                                                <button id="button" type="submit" className="btn btn-primary btn-block m-2" onClick={this.updateRequest} disabled>Submit</button>
                                            </div>
                                        )}

                                        {this.state.message && (
                                        <div className="form-group">
                                            <div
                                            className={
                                                (this.state.successful==true)
                                                ? "alert alert-success"
                                                : "alert alert-danger"
                                            }
                                            role="alert"
                                            >
                                            {this.state.message}
                                            </div>
                                        </div>
                                        )
                                }
                                </div>
                            )} 
                                        
                                                                        
                                    </div>
                                </div>
    
                            </div>
    
                            
    
                            </div>


                    

                        </div>

                        </main>


                </div>
                <script defer src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.bundle.min.js" crossOrigin="anonymous"></script>
                <script defer src="./../../js/scripts.js"></script>
                <script defer src="https://cdnjs.cloudflare.com/ajax/libs/Chart.js/2.8.0/Chart.min.js" crossOrigin="anonymous"></script>
                <script defer src="./../../assets/demo/chart-area-demo.js"></script>
                <script defer src="./../../assets/demo/chart-bar-demo.js"></script>
                <script defer src="https://cdn.jsdelivr.net/npm/simple-datatables@latest" crossOrigin="anonymous"></script>
                <script defer src="./../../js/datatables-simple-demo.js"></script>
                
            </div>

            </div>
                    
            )}


            {currentUser && currentUser.role=="ROLE_EMPLOYEE" && (

                <div className="sb-nav-fixed" id="navbar-fixed" >
                <nav className="sb-topnav navbar navbar-expand navbar-dark bg-dark">
                    
                    <a className="navbar-brand ps-3" href="/profile">Arcturus</a>
                    
                    <button className="btn btn-link btn-sm order-1 order-lg-0 me-4 me-lg-0" id="sidebarToggle" onClick={this.navBarToggle}><i className="fas fa-bars"></i></button>

                </nav>

                <div id="layoutSidenav">
                <div id="layoutSidenav_nav">
                    <nav className="sb-sidenav accordion sb-sidenav-dark" id="sidenavAccordion">
                        <div className="sb-sidenav-menu">
                            <div className="nav">
                                <div className="sb-sidenav-menu-heading">Core</div>
                                <a className="nav-link" href="/profile">
                                    <div className="sb-nav-link-icon"><i className="fas fa-tachometer-alt"></i></div>
                                    Dashboard
                                </a>
                                <div className="sb-sidenav-menu-heading">Pages</div>
                                <a className="nav-link collapsed" id="nav-link-collapse-1" onClick={this.navLinkCollapse1} data-bs-toggle="collapse" data-bs-target="#collapseLayouts" aria-expanded="false" aria-controls="collapseLayouts">
                                    <div className="sb-nav-link-icon"><i className="fas fa-columns"></i></div>
                                    Requests
                                    <div className="sb-sidenav-collapse-arrow"><i className="fas fa-angle-down"></i></div>
                                </a>
                                <div className="collapse" id="collapseLayouts" aria-labelledby="headingOne" data-bs-parent="#sidenavAccordion">
                                    <nav className="sb-sidenav-menu-nested nav">
                                        <a className="nav-link" href="/newrequest">New Request</a>
                                    </nav>

                                    <nav className="sb-sidenav-menu-nested nav">
                                        <a className="nav-link" href="/requestSummary">View Requests</a>
                                    </nav>
                                </div>
                                
                                <a className="nav-link collapsed" id="nav-link-collapse-3" onClick={this.navLinkCollapse3} data-bs-toggle="collapse" data-bs-target="#collapsePages" aria-expanded="false" aria-controls="collapsePages">
                                    <div className="sb-nav-link-icon"><i className="fas fa-book-open"></i></div>
                                    My Account
                                    <div className="sb-sidenav-collapse-arrow"><i className="fas fa-angle-down"></i></div>
                                </a>
                                <div className="collapse" id="collapseAccount" aria-labelledby="headingOne" data-bs-parent="#sidenavAccordion">
                                    <nav className="sb-sidenav-menu-nested nav">
                                        <Link to={`/users/${currentUser.id}`} className="nav-link" >User Profile</Link>
                                    </nav>

                                    <nav>
                                        <GoogleLogout 
                                        clientId="1040969823585-d5cguq0891f5hdgf59jk46a1infpb1qp.apps.googleusercontent.com"
                                        render={renderProps => (
                                            <li className="sb-sidenav-menu-nested nav">
                                            <div className="nav-link" onClick={renderProps.onClick} disabled={renderProps.disabled}>Logout</div>
                                            </li>
                                        )}
                                        buttonText="Logout"
                                        onLogoutSuccess={logoutGoogle}
                                        >
                                        </GoogleLogout>
                                    </nav>
                                </div>

                                    
                            </div>
                        </div>
                        
                    </nav>
                </div>

                <div id="layoutSidenav_content">

                <main>
                    <div className="container-fluid px-4">

                            <div class="row">

                            <div class="col-lg-13">

                                
                                <div class="card shadow mb-4">
                                    <div class="card-header py-3">
                                        <h6 class="m-0 font-weight-bold text-primary">Details</h6>
                                    </div>
                                    <div class="card-body">

                                        <div className="row">
                                        <div class="col-lg-6">

                                        <b>REQUEST ID </b>
                                        <span>{request.id}</span>
                                        <p></p>
                                        <b>ORIGINATOR </b> 
                                        <span>{request.username}</span>
                                        <p></p>
                                        <b>ORIGINATOR EMAIL </b> 
                                        {request.email}
                                        <p></p>
                                        <b>TITLE </b> {request.title}
                                        <p></p>
                                        <b>DESCRIPTION </b> {request.description}
                                        <p></p>

                                        </div>

                                        <div class="col-lg-6">

                                        <b>START DATE REQUESTED </b>
                                        {request.startDateRequested}
                                        <p></p>
                                        <b>END DATE REQUESTED </b>
                                        {request.endDateRequested}
                                        <p></p>
                                        <b>START TIME REQUESTED </b>
                                        {request.startTimeRequested && (<p>{request.startTimeRequested} ({request.startTimeRequested12Hour1}:{request.startTimeRequested12Hour2} {request.startTimeRequestedFormat})</p>)}
                                        <p></p>
                                        <b>END TIME REQUESTED </b>
                                        {request.endTimeRequested && (<p>{request.endTimeRequested} ({request.endTimeRequested12Hour1}:{request.endTimeRequested12Hour2} {request.endTimeRequestedFormat})</p>)}
                                        <p></p>
                                        <b>STATUS </b>
                                        {request.status}
                                        <p></p>
                                        
                                        </div>
                                        </div>
                                    </div>
                                </div>

                                
                                <div class="card shadow mb-4">
                                    <div class="card-header py-3">
                                        <h6 class="m-0 font-weight-bold text-primary">Decision</h6>
                                    </div>
                                    <div class="card-body">
                                    <div class="col-lg-6">

                                        {request.status=="Approved" && (
                                            <div>
                                                <span>
                                                    Request has been Approved
                                                </span>
                                                <p></p>
                                                <b>APPROVED START DATE </b>
                                                {request.startDateApproved} 
                                                <p></p>
                                                <b>APPROVED END DATE </b>
                                                {request.endDateApproved}
                                                <p></p>
                                                <b>APPROVED START TIME </b>
                                                {request.startTimeApproved && (<p>{request.startTimeApproved} ({request.startTimeApproved12Hour1}:{request.startTimeApproved12Hour2} {request.startTimeApprovedFormat}) </p>)}
                                                <p></p>
                                                <b>APPROVED END TIME </b>
                                                {request.endTimeApproved && (<p>{request.endTimeApproved} ({request.endTimeApproved12Hour1}:{request.endTimeApproved12Hour2} {request.endTimeApprovedFormat})</p>)}
                                                <p></p>
                                                <b>STATUS </b>
                                                {request.status}
                                                <p></p>
                                            </div>
                                        )}

                                    


                                    {request.status=="Pending" && (
                                        <span>
                                            Decision is Pending
                                        </span>
                                    )}

                                    {request.status=="Declined" && (
                                        <span>
                                            Request has been Declined
                                        </span>
                                    )}

                                    </div>

                                    </div>

                                </div>

                            </div>

                            

                            </div>


                    

                        </div>

                        </main>


                </div>
                <script defer src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.bundle.min.js" crossOrigin="anonymous"></script>
                <script defer src="./../../js/scripts.js"></script>
                <script defer src="https://cdnjs.cloudflare.com/ajax/libs/Chart.js/2.8.0/Chart.min.js" crossOrigin="anonymous"></script>
                <script defer src="./../../assets/demo/chart-area-demo.js"></script>
                <script defer src="./../../assets/demo/chart-bar-demo.js"></script>
                <script defer src="https://cdn.jsdelivr.net/npm/simple-datatables@latest" crossOrigin="anonymous"></script>
                <script defer src="./../../js/datatables-simple-demo.js"></script>
                
            </div>

            </div>
                    
            )}

            {!currentUser && (
                <h3>Unauthorized! Access denied!</h3>
            )}

            </div>

            


        );
    }
}

export default (props) => (
    <Request
        {...props}
        params={useParams()}
    />
); 