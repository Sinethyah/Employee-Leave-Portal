import React, { Component } from "react";
import Input from "react-validation/build/input";
import CheckButton from "react-validation/build/button";
import { isday } from "validator";
import AuthService from "../../services/auth.service";
import RequestService from "../../services/request.service";
import UserService from "../../services/user.service";
import {Form, Row, Col, Button} from 'react-bootstrap'

import {Link} from 'react-router-dom'
import authservice from './../../services/auth.service'

import { GoogleLogout } from 'react-google-login';

import ReactLoading from 'react-loading';


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

export default class NewRequest extends Component {
    constructor(props) {
        super(props);
        this.handleRegister = this.handleRegister.bind(this);
        this.onChangeTitle = this.onChangeTitle.bind(this);
        this.onChangeDescription = this.onChangeDescription.bind(this);
        this.onChangeStartDateRequested = this.onChangeStartDateRequested.bind(this);
        this.onChangeEndDateRequested = this.onChangeEndDateRequested.bind(this);
        this.onChangestartTimeRequested = this.onChangestartTimeRequested.bind(this);
        this.onChangeendTimeRequested = this.onChangeendTimeRequested.bind(this);
        this.onChangeReason = this.onChangeReason.bind(this);
    
        this.state = {
            currentUser:AuthService.getCurrentUser(),
            userselected:{},
            title: "",
            reason:"",
            description: "",
            startDateRequested:"",
            endDateRequested:"",
            startTimeRequested:"",
            endTimeRequested:"",
            diffDatesRequested:"",
            successful: false,
            message: ""
        };
        }

        componentDidMount(){
            let id = this.state.currentUser.id;
            this.getUser(id);
        }

        //access the user who will be making the request using the id
        getUser(id){

            UserService.get(id)
            .then(response => {
                this.setState({
                    userselected: response.data.accountInfo
                })
            
            })
            .catch(err => console.log(err));

        }

        onChangeReason(e){
            this.setState({
                reason: e.target.value
            }); 
            if (e.target.value=="Half day off"){
                this.setState({
                    title: "Half day off"
                });
            }
            else{
                this.setState({
                    title: ""
                });
            }
        }
        onChangeTitle(e) {
            this.setState({
                title: e.target.value
            });
        }

        onChangeDescription(e) {
            this.setState({
                description: e.target.value
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

        //sets the state for the start date selected 
        onChangeStartDateRequested(e) {

            let currentDate = new Date();
            currentDate.setHours(0,0,0,0);
            //console.log(currentDate);
            let startDate = new Date(e.target.value);
            startDate.setHours(24,0,0,0);
            //console.log(startDate);

            //first checks if the start date is greater than current date
            if (startDate>=currentDate){
                console.log("e "+ e.target.value);
                //sets the state of the start date requested
                this.setState({
                    startDateRequested: e.target.value
                });
                document.getElementById("sd").innerHTML = "";
                document.getElementById("ed").innerHTML = "";

                console.log(this.state.endDateRequested);
        
                if (this.state.endDateRequested){
                    if (e.target.value >= this.state.endDateRequested){
                        document.getElementById("sd").innerHTML = "Start date cannot be greater than End Date!";
                    }
                }

                //then, if it's a half-day off, start date and end date are the same. End date gets prefilled   
                //diff of days get updated to 0             
                if (this.state.reason=="Half day off"){
                    this.setState({
                        endDateRequested: e.target.value,
                        diffDatesRequested:0
                    })
                    document.getElementById("endDate").value = e.target.value;

                }
                else {
                    //else, check if the end date exists, calculate the difference, update the number of
                    //days difference
                    if (this.state.endDateRequested!=""){
                        let endDate = new Date(this.state.endDateRequested)
                        endDate.setHours(24,0,0,0);
        
                        const diff = this.dateDiffInDays(startDate,endDate);

        
                        if (diff > this.state.userselected.daysLeft){
                            document.getElementById("error").innerText="Error! Date range is greater than days allocated. Choose different dates"
                            document.getElementById("button").disabled = true;
                        }
                        else{
                            document.getElementById("error").innerText=""
                            this.setState({
                                diffDatesRequested:Number(diff)
                            })
        
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

        //sets the state for end date selected
        onChangeEndDateRequested(e) {

            let startDate = new Date(this.state.startDateRequested)
            startDate.setHours(24,0,0,0);
            let endDate = new Date(e.target.value)
            endDate.setHours(24,0,0,0);

            //checks if end date is greater than the start date
            if (endDate >= startDate){

                //sets the state of the end date if not
                this.setState({
                    endDateRequested: e.target.value
                });
                document.getElementById("ed").innerHTML = "";
                document.getElementById("sd").innerHTML = "";

                const diff = this.dateDiffInDays(startDate,endDate);
                console.log(diff);


                //calculates the diff between start date and end date
                if (diff > this.state.userselected.daysLeft){
                    document.getElementById("button").disabled = true;
                    document.getElementById("error").innerText="Error! Date range is greater than days allocated. Choose different dates"
                }
                else{
                    document.getElementById("error").innerText="";
                    let submitButton = document.getElementById("button");
                    submitButton.disabled=false;
                    

                    this.setState({
                        diffDatesRequested:Number(diff)
                    })
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

        //handles the different test cass for start time requested
        onChangestartTimeRequested(e) {
            //console.log(e.target.value);

            let startTimeRequested = e.target.value;

            let startDate = new Date(this.state.startDateRequested);
            if (startDate!=""){
                startDate.setHours(24,0,0,0);
            }

            let endDate = new Date(this.state.endDateRequested);
            if (endDate!=""){
                endDate.setHours(24,0,0,0);
            }

            let diffDates = this.dateDiffInDays(startDate,endDate);

            //if it is a half-day off
            if (startDate && endDate && (diffDates==0)){
                let endTimeRequested = this.state.endTimeRequested;
                if (endTimeRequested!="" && endTimeRequested!=null){
                    let diffTime = this.diffTime(startTimeRequested,endTimeRequested);
                    if ((this.diffTime(startTimeRequested, endTimeRequested) > 4) || (this.diffTime(startTimeRequested, endTimeRequested) < 0)){
                        document.getElementById("errorTime").innerHTML="Time range should be 4 hours. Please check your start and end time."
                        document.getElementById("button").disbaled = true;
                    }
                    else{
                        this.setState({
                            startTimeRequested: startTimeRequested
                        });
                        document.getElementById("errorTime").innerHTML=""
                        document.getElementById("button").disbaled = false;
                    }
                }
                else{
                    this.setState({
                        startTimeRequested: startTimeRequested
                    });
                    document.getElementById("errorTime").innerHTML=""


                }        
            }
            else{
                this.setState({
                    startTimeRequested: startTimeRequested
                }); 
                document.getElementById("errorTime").innerHTML=""

            }
        
        }

        //handles the different test cases for end time requested
        onChangeendTimeRequested(e) {

            //console.log(e.target.value);

            let endTimeRequested = e.target.value;

            let startDate = new Date(this.state.startDateRequested);
            if (startDate!=""){
                startDate.setHours(24,0,0,0);
            }
            //console.log(startDate);

            let endDate = new Date(this.state.endDateRequested);
            if (endDate!=""){
                endDate.setHours(24,0,0,0);
            }
            //console.log(endDate);

            let diffDates = this.dateDiffInDays(startDate,endDate);

            //if it is a half-day off
            if (startDate && endDate && (diffDates==0)){
                let startTimeRequested = this.state.startTimeRequested;

                if (startTimeRequested!="" && startTimeRequested!=null){

                    let diffTime = this.diffTime(startTimeRequested,endTimeRequested);
                    if ((this.diffTime(startTimeRequested, endTimeRequested) > 4) || (this.diffTime(startTimeRequested, endTimeRequested) < 0)){
                        document.getElementById("errorTime").innerHTML="Time range should be 4 hours. Please check your start and end time."
                        document.getElementById("button").disbaled = true;
                    }
                    else{
                        this.setState({
                            endTimeRequested: endTimeRequested,
                        });
                        document.getElementById("errorTime").innerHTML=""
                        document.getElementById("button").disbaled = false;
                    }
                }
                else{
                    this.setState({
                        endTimeRequested: endTimeRequested
                    });
                    document.getElementById("errorTime").innerHTML=""
                }
                
            }
            else{
                this.setState({
                    endTimeRequested: endTimeRequested
                });
                document.getElementById("errorTime").innerHTML=""
            }

        }

        //handles the registration of a new request
        handleRegister(e) {
            e.preventDefault();
            this.setState({
                message: "",
                successful: false
            });
            let data={
                title:this.state.title,
                description:this.state.description,
                startDateRequested:this.state.startDateRequested,
                endDateRequested: this.state.endDateRequested,
                startTimeRequested: this.state.startTimeRequested,
                endTimeRequested: this.state.endTimeRequested,
                diffDatesRequested: this.state.diffDatesRequested,
                id: this.state.currentUser.id,
                username: this.state.userselected.username,
                email: this.state.userselected.email
            }
            RequestService.create(data)
            .then(
                response => {
                this.setState({
                    message: response.data.message,
                    successful: true
                });
                },
                error => {
                    console.log(error);
                    this.setState({
                        successful: false,
                        message: "Error"
                });
                }
            );
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

            const {currentUser, title, description, startDateRequested, endDateRequested, userselected} = this.state;

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


                {currentUser && currentUser.role=="ROLE_EMPLOYEE"&& userselected.daysLeft>=1 && (

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
                                                    <a className="nav-link" href="/newrequest">Make Request</a>
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

                                <div class="card shadow mb-4">
                                    <div class="card-header py-3">
                                        <h6 class="m-0 font-weight-bold text-primary">New Request</h6>
                                    </div>

                                    <div class="card-body">
                                    <Form onSubmit={this.handleRegister}
                                        ref={c => {
                                        this.form = c;
                                    }}>

                                    {!this.state.successful && (
                                        <div>
                                        
                                        <Row>
                                        <label htmlFor="reason">Enter Reason<span style={{'color':'red'}}>*</span></label>
                                        <div className="col-lg-3 col-sm-6">
                                        <Form.Select size="md" onChange={this.onChangeReason}>
                                            <option></option>
                                            <option>Half day off</option>
                                            <option>Other</option>
                                        </Form.Select>
                                        </div>
                                        </Row>


                                        <Row>
                                        {this.state.reason=="Half day off" ? (
                                            <div className="col-lg-3 col-sm-6">
                                            <label htmlFor="title">Enter Title<span style={{'color':'red'}}>*</span></label>
                                            <input id="title" className="form-control" type="title" value={this.state.title || "Half day off"} disabled/>
                                            </div>
                                        ) :(
                                            <div className="col-lg-3 col-sm-6">
                                                <label htmlFor="title">Enter Title<span style={{'color':'red'}}>*</span></label>
                                                <input id="title" className="form-control" type="title" value={this.state.title} onChange={this.onChangeTitle} validations={[required]}/>
                                            </div>
                                        )}
                                        </Row>
                                        
                                    
                                        <Row>
                                        <div className="col-lg-3 col-sm-6">
                                            <label htmlFor="description">Enter Description<span style={{'color':'red'}}>*</span></label>
                                            <input id="description" className="form-control" type="description" onChange={this.onChangeDescription} validations={[required]}/>
                                        </div>
                                        </Row>


                                        <Row>
                                        <div className="col-lg-3 col-sm-6">
                                            <label htmlFor="startDate">Enter Start Date<span style={{'color':'red'}}>*</span></label>
                                            <input id="startDate" className="form-control" type="date" onChange={this.onChangeStartDateRequested} validations={[required]}/>
                                            <span id="sd" style={{color:'red'}}></span>
                                        </div>
                                        
                                        <div className="col-lg-3 col-sm-6">
                                            <label htmlFor="startTime">Enter Start Time</label>
                                            <input id="startTime" className="form-control" type="time" onChange={this.onChangestartTimeRequested} validations={[required]}/>
                                        </div>
                                        </Row>

                                        <Row>
                                        <div className="col-lg-3 col-sm-6">
                                            <label htmlFor="endDate">Enter End Date<span style={{'color':'red'}}>*</span></label>
                                            <input id="endDate" className="form-control" type="date" onChange={this.onChangeEndDateRequested} validations={[required]}/>
                                            <span id="ed" style={{color:'red'}}></span>
                                        </div>

                                        <div className="col-lg-3 col-sm-6">
                                            <label htmlFor="endTime">Enter End Time</label>
                                            <input id="endTime" className="form-control" type="time" onChange={this.onChangeendTimeRequested} validations={[required]}/>
                                        </div>

                                        </Row>

                                        <br/>
                                        <span id="error" style={{'color':'red'}}></span>
                                        <span id="errorTime" style={{'color':'red'}}></span>

                                        <div>
                                            {(title && description && startDateRequested && endDateRequested) == "" ? (
                                                <div>
                                                <button id="button" className="btn btn-primary btn-block" disabled>Submit</button>
                                                </div>
                                            ) : (
                                                <div>
                                                <button id="button" className="btn btn-primary btn-block">Submit</button>
                                                </div>
                                            )}
                                        </div>

                                        
                                        </div>
                                    )}

                                    
                                    {this.state.message && (
                                    <div className="form-group">
                                        <div
                                        className={
                                            this.state.successful
                                            ? "alert alert-success"
                                            : "alert alert-danger"
                                        }
                                        role="alert"
                                        >
                                        {this.state.message}
                                        </div>
                                    </div>
                                    )}

                                </Form>

                                </div>
                                </div>

                                


                                
                                <footer className="py-4 bg-light mt-auto">
                                    <div className="container-fluid px-4">
                                        <div className="d-flex align-items-center justify-content-between small">
                                            <div className="text-muted">Copyright &copy; Arcturus 2022</div>
                                            <div>
                                                <a href="#">Privacy Policy</a>
                                                &middot;
                                                <a href="#">Terms &amp; Conditions</a>
                                            </div>
                                        </div>
                                    </div>
                                </footer>

                                </div>
                                </main>
                            </div>
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
                
                { !(currentUser && currentUser.role=="ROLE_EMPLOYEE"&& userselected.daysLeft>=1) && (
                    <div>
                        
                        <h3>Unauthorized! You have exceeded the number of days you can request for.</h3>
                    </div>
                )}
                </div>
                
            );
        }
    }