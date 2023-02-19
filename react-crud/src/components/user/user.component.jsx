import React, { Component } from "react";
import { NavLink, useParams} from "react-router-dom";
import authService from "../../services/auth.service";
import UserDataService from "../../services/user.service";
import AuthService from "../../services/auth.service";
import {Form, Row, Col, Button} from 'react-bootstrap'

import {Link} from 'react-router-dom'
import authservice from './../../services/auth.service'

import { GoogleLogout } from 'react-google-login';


let timeout=null;


class User extends Component {
  constructor(props) {
        super(props);

        this.onChangeUserName = this.onChangeUserName.bind(this);
        this.onChangeEmail = this.onChangeEmail.bind(this);
        this.onChangeRole = this.onChangeRole.bind(this);
        this.onChangeFirstName = this.onChangeFirstName.bind(this);
        this.onChangeMiddleName = this.onChangeMiddleName.bind(this);
        this.onChangeLastName = this.onChangeLastName.bind(this);
        this.onChangeDepartment = this.onChangeDepartment.bind(this);
        this.onChangeDaysAllocated = this.onChangeDaysAllocated.bind(this);
        this.onChangeDaysUsed = this.onChangeDaysUsed.bind(this);
        this.onChangeDaysLeft = this.onChangeDaysLeft.bind(this);

        this.getUser = this.getUser.bind(this);
        this.updateUser = this.updateUser.bind(this);
        this.state = {
            currentUser:authService.getCurrentUser(),
            userselected: {
                id: null,
                googleId:"",
                facebookId:"",
                username: "",
                email:"",
                role:"",
                firstName: "", 
                middleName:"",
                lastName:"",
                department:"",
                daysAllocated:"",
                daysUsed:"",
                daysLeft:"",
            },
        message: "",
        successful:""
        };
    }
    componentDidMount() {
        const {id} = this.props.params;
        //console.log(id);
        this.getUser(id);
    }
    onChangeUserName(e) {
        const username = e.target.value;
        this.setState(function(prevState) {
        return {
            userselected: {
            ...prevState.userselected,
            username: username
            }
        };
        });
    }


    onChangeEmail(e) {
        const email = e.target.value;
        this.setState(function(prevState) {
        return {
            userselected: {
            ...prevState.userselected,
            email: email
            }
        };
        });
    }

    onChangeRole(e) {
        const role = e.target.value;
        this.setState(function(prevState) {
        return {
            userselected: {
            ...prevState.userselected,
            role: role
            }
        };
        });
    }

    onChangeFirstName(e) {
        const firstName = e.target.value;
        this.setState(function(prevState) {
        return {
            userselected: {
            ...prevState.userselected,
            firstName: firstName
            }
        };
        });
    }
    onChangeMiddleName(e) {
        const middleName = e.target.value;
        this.setState(function(prevState) {
        return {
            userselected: {
            ...prevState.userselected,
            middleName: middleName
            }
        };
        });
    }
    onChangeLastName(e) {
        const lastName = e.target.value;
        this.setState(function(prevState) {
        return {
            userselected: {
            ...prevState.userselected,
            lastName: lastName
            }
        };
        });
    }

    
    onChangeDepartment(e) {
        const department = e.target.value;
        this.setState(function(prevState) {
        return {
            userselected: {
            ...prevState.userselected,
            department: department
            }
        };
        });
    }
    
    
    onChangeDaysAllocated(e) {
        const daysAllocated = e.target.value;
        this.setState(function(prevState) {
        return {
            userselected: {
            ...prevState.userselected,
            daysAllocated: daysAllocated
            }
        };
        });
    }
    onChangeDaysUsed(e) {
        const daysUsed = e.target.value;
        this.setState(function(prevState) {
        return {
            userselected: {
            ...prevState.userselected,
            daysUsed: daysUsed
            }
        };
        });
    }
    onChangeDaysLeft(e) {
        const daysLeft = e.target.value;
        this.setState(function(prevState) {
        return {
            userselected: {
            ...prevState.userselected,
            daysLeft: daysLeft
            }
        };
        });
    }
    getUser(id) {
        UserDataService.get(id)
        .then(response => {
            this.setState({
                userselected: response.data.accountInfo
            });
            //console.log(response.data);
        })
        .catch(e => {
            console.log(e);
        });
    }
    

    updateUser() {
        let data={
            id:this.state.userselected.id,
            username: this.state.userselected.username,
            email:this.state.userselected.email,
            role:this.state.userselected.role,
            firstName: this.state.userselected.firstName, 
            middleName:this.state.userselected.middleName,
            lastName:this.state.userselected.lastName,
            age:this.state.userselected.age,
            gender:this.state.userselected.gender,
            department:this.state.userselected.department,
            daysAllocated:this.state.userselected.daysAllocated,
            daysUsed:this.state.userselected.daysUsed,
            daysLeft:this.state.userselected.daysLeft
        }
        UserDataService.update(this.state.userselected.id,data)
        .then(response => {
            //console.log(response.data);
            this.setState({
                message: "The User was updated successfully!",
                successful:true
            });
        })
        .catch(e => {
            console.log(e);
        });
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
        const { userselected, currentUser } = this.state;

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

            {currentUser && currentUser.role=="ROLE_EMPLOYER" && (
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

                                    <nav className="sb-sidenav-menu-nested nav">
                                        <a className="nav-link" href="/register">Register User</a>
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
                        {currentUser.id!=userselected.id && (

                            <div>
                            <div className="card">
                            <Form>
                            <Row>
                            <Form.Group as={Col} controlId="formGridUsername">
                            <Form.Label>Username</Form.Label>
                            <Form.Control type="username" value={userselected.username==null ? "": userselected.username}
                            onChange={this.onChangeUserName} />
                            </Form.Group>

                            <Form.Group as={Col} controlId="formGridEmail">
                            <Form.Label>Email</Form.Label>
                            <Form.Control type="email" value={userselected.email==null ? "" : userselected.email}
                            onChange={this.onChangeEmail} />

                            </Form.Group>
                            </Row>


                            <Row>
                            <Form.Group as={Col} controlId="formGridFirstName">
                            <Form.Label>First Name</Form.Label>
                            <Form.Control type="firstName" value={userselected.firstName==null ? "" : userselected.firstName}
                            onChange={this.onChangeFirstName} />

                            </Form.Group>

                            <Form.Group as={Col} controlId="formGridMiddleName">
                            <Form.Label>Middle Name</Form.Label>
                            <Form.Control type="middleName"  value={userselected.middleName==null ? "" : userselected.middleName}
                            onChange={this.onChangeMiddleName} />
                            </Form.Group>

                            <Form.Group as={Col} controlId="formGridMiddleName">
                            <Form.Label>Last Name</Form.Label>
                            <Form.Control type="lastName" value={userselected.lastName==null ? "" : userselected.lastName}
                            onChange={this.onChangeLastName} />
                            </Form.Group>

                            </Row>

                            <Row>

                            <Form.Group as={Col} controlId="formGridDepartment">
                            <Form.Label>Department</Form.Label>
                            <Form.Control type="department" value={userselected.department==null ? "" : userselected.department}
                            onChange={this.onChangeDepartment}/>

                            </Form.Group>

                            </Row>

                            <Row>
                            <Form.Group as={Col} controlId="formGridDaysAllocated">
                            <Form.Label>Days Allocated</Form.Label>
                            <Form.Control type="daysAllocated"  value={userselected.daysAllocated==null ? "" : userselected.daysAllocated}
                            onChange={this.onChangeDaysAllocated}/>

                            </Form.Group>

                            <Form.Group as={Col} controlId="formGridDaysUsed">
                            <Form.Label>Days Used</Form.Label>
                            <Form.Control type="daysUsed" value={userselected.daysUsed==null ? "" : userselected.daysUsed}
                            onChange={this.onChangeDaysUsed}/>
                            </Form.Group>


                            <Form.Group as={Col} controlId="formGridDaysLeft">
                            <Form.Label>Days Left</Form.Label>
                            <Form.Control type="daysLeft" value={userselected.daysLeft==null ? "" : userselected.daysLeft}
                            onChange={this.onChangeDaysLeft}/>
                            </Form.Group>

                            </Row>

                            </Form>

                            <Button variant="primary" type="submit" className="btn btn-primary m-3" onClick={this.updateUser}>
                            Update
                            </Button>

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
                            )}
                            
                            </div>

                            <div className="card shadow mb-4">
                                <div className="card-header py-3">
                                    <h6 className="m-0 font-weight-bold text-primary">View Requests</h6>
                                </div>
                                <div className="card-body">
                                <div className="text-left">
                                    <Link to={`/requestSummary/${userselected.id}`} className="small">View Requests</Link>
                                </div>
                                </div>
                            </div>
                            </div>
                            
                            ) }

                            {(currentUser.id==userselected.id) && (
                            <div className="card">

                            <Form>
                                <Row>
                                <Form.Group as={Col} controlId="formGridUsername">
                                    <Form.Label>Username</Form.Label>
                                    <Form.Control type="username" value={userselected.username==null ? "": userselected.username}
                                    onChange={this.onChangeUserName} />
                                </Form.Group>

                                <Form.Group as={Col} controlId="formGridEmail">
                                    <Form.Label>Email</Form.Label>
                                    <Form.Control type="email" value={userselected.email==null ? "" : userselected.email}
                                    onChange={this.onChangeEmail} />
                                    
                                </Form.Group>
                                </Row>


                                <Row>
                                <Form.Group as={Col} controlId="formGridFirstName">
                                    <Form.Label>First Name</Form.Label>
                                    <Form.Control type="firstName" value={userselected.firstName==null ? "" : userselected.firstName}
                                    onChange={this.onChangeFirstName} />
                                    
                                </Form.Group>

                                <Form.Group as={Col} controlId="formGridMiddleName">
                                    <Form.Label>Middle Name</Form.Label>
                                    <Form.Control type="middleName"  value={userselected.middleName==null ? "" : userselected.middleName}
                                    onChange={this.onChangeMiddleName} />
                                </Form.Group>

                                <Form.Group as={Col} controlId="formGridMiddleName">
                                    <Form.Label>Last Name</Form.Label>
                                    <Form.Control type="lastName" value={userselected.lastName==null ? "" : userselected.lastName}
                                    onChange={this.onChangeLastName} />
                                </Form.Group>

                                </Row>


                            </Form>


                            <Button variant="primary" type="submit" id="button" onClick={this.updateUser}>
                                Update
                            </Button>

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
                                )}
                            </div>


                            )}
                        
                        </div>
                    </main>
                </div>

                

                
                </div>
                </div>
                </div>
            )}

            {currentUser && currentUser.role=="ROLE_EMPLOYEE" && (

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
                        {currentUser.id == userselected.id && (
                        
                            <div className="card">
                                <Form>
                                    <Row>
                                    <Form.Group as={Col} controlId="formGridUsername">
                                        <Form.Label>Username</Form.Label>
                                        <Form.Control type="username" value={userselected.username==null ? "": userselected.username}
                                        onChange={this.onChangeUserName} />
                                    </Form.Group>
    
                                    <Form.Group as={Col} controlId="formGridEmail">
                                        <Form.Label>Email</Form.Label>
                                        <Form.Control type="email" value={userselected.email==null ? "" : userselected.email}
                                        onChange={this.onChangeEmail} />
                                        
                                    </Form.Group>
                                    </Row>
    
    
                                    <Row>
                                    <Form.Group as={Col} controlId="formGridFirstName">
                                        <Form.Label>First Name</Form.Label>
                                        <Form.Control type="firstName" value={userselected.firstName==null ? "" : userselected.firstName}
                                        onChange={this.onChangeFirstName} />
                                        
                                    </Form.Group>
    
                                    <Form.Group as={Col} controlId="formGridMiddleName">
                                        <Form.Label>Middle Name</Form.Label>
                                        <Form.Control type="middleName"  value={userselected.middleName==null ? "" : userselected.middleName}
                                        onChange={this.onChangeMiddleName} />
                                    </Form.Group>
    
                                    <Form.Group as={Col} controlId="formGridMiddleName">
                                        <Form.Label>Last Name</Form.Label>
                                        <Form.Control type="lastName" value={userselected.lastName==null ? "" : userselected.lastName}
                                        onChange={this.onChangeLastName} />
                                    </Form.Group>
    
                                    </Row>
    
                                    <Row>
    
                                    <Form.Group as={Col} controlId="formGridDepartment">
                                        <Form.Label>Department</Form.Label>
                                        <Form.Control type="department" value={userselected.department==null ? "" : userselected.department}
                                        onChange={this.onChangeDepartment} disabled/>
                                        
                                    </Form.Group>
    
                                    </Row>
                                    
                                    <Row>
                                    <Form.Group as={Col} controlId="formGridDaysAllocated">
                                        <Form.Label>Days Allocated</Form.Label>
                                        <Form.Control type="daysAllocated"  value={userselected.daysAllocated==null ? "" : userselected.daysAllocated}
                                        onChange={this.onChangeDaysAllocated} disabled/>
                                        
                                    </Form.Group>
    
                                    <Form.Group as={Col} controlId="formGridDaysUsed">
                                        <Form.Label>Days Used</Form.Label>
                                        <Form.Control type="daysUsed" value={userselected.daysUsed==null ? "" : userselected.daysUsed}
                                        onChange={this.onChangeDaysUsed} disabled/>
                                    </Form.Group>
    
    
                                    <Form.Group as={Col} controlId="formGridDaysLeft">
                                        <Form.Label>Days Left</Form.Label>
                                        <Form.Control type="daysLeft" value={userselected.daysLeft==null ? "" : userselected.daysLeft}
                                        onChange={this.onChangeDaysLeft} disabled/>
                                    </Form.Group>
    
                                    </Row>
    
                                </Form>
    
    
                                <Button variant="primary" type="submit" id="button" onClick={this.updateUser}>
                                    Update
                                </Button>
    
    
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
                                )}
                            </div>
                            )}

                            {(currentUser.id!=userselected.id) && (
                                <div>
                                <br />
                                <h3>Unauthorized! Access denied!</h3>
                                </div>
                            )}
                    </div>
                    </main>
                    </div>

                    
                    </div>
                    </div>
                    </div>

            )}

            {!currentUser && (
                <h3>
                    Unauthorized! Access Denied!
                </h3>
            )}


            </div>
        )

}
}

export default (props) => (
    <User
        {...props}
        params={useParams()}
    />
); 



