
import React, { Component } from 'react';
import stylecss from './../../css/sb-admin-2.min.css'
import fontawesome from 'https://use.fontawesome.com/releases/v6.1.0/js/all.js'
import styles from './../../css/styles.css'


import {Link} from 'react-router-dom'
import authservice from './../../services/auth.service'

import { GoogleLogout } from 'react-google-login';

let timeout=null;

export default class Employer extends Component{

    constructor(props){
        super(props);
        this.navBarToggle = this.navBarToggle.bind(this);
        this.navLinkCollapse1 = this.navLinkCollapse1.bind(this);
        this.navLinkCollapse2 = this.navLinkCollapse2.bind(this);
        this.navLinkCollapse3 = this.navLinkCollapse3.bind(this);

        this.state={
            currentUser: authservice.getCurrentUser()

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


    render(){


        const {currentUser} = this.state;

        const logoutGoogle = (response) => {
            console.log(response);
            this.setState({
              currentUser:undefined
            })
            authservice.logout();
            
            window.location.href="/login"
        }

        

        return(
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

            {currentUser && currentUser.role=="ROLE_EMPLOYER" ? (
                <div className="sb-nav-fixed" id="navbar-fixed">
                <nav className="sb-topnav navbar navbar-expand navbar-dark bg-dark">
                    
                    <a className="navbar-brand ps-3" href="/profile">Arcturus Leave Portal</a>
                    
                    <button className="btn btn-link btn-sm order-1 order-lg-0 me-4 me-lg-0" id="sidebarToggle" onClick={this.navBarToggle}><i className="fas fa-bars"></i></button>
                
                </nav>
                <div id="layoutSidenav" >
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
                                <h1 className="mt-4">Dashboard</h1>
                                
                                <div className="row">
                                    <div className="col-xl-13 col-md-10">
                                        <div className="card bg-primary text-white mb-4">
                                            <div className="card-body">Requests</div>
                                            <div className="card-footer d-flex align-items-center justify-content-between">
                                                <a className="small text-white stretched-link" href="/pendingrequests">View Details</a>
                                                <div className="small text-white"><i className="fas fa-angle-right"></i></div>
                                            </div>
                                        </div>
                                    </div>
                                       
                                </div>
    
                                <div className="row">
                                    <div className="col-xl-13 col-md-10">
                                        <div className="card bg-warning text-white mb-4">
                                            <div className="card-body">Users</div>
                                            <div className="card-footer d-flex align-items-center justify-content-between">
                                                <a className="small text-white stretched-link" href="/users">View Details</a>
                                                <div className="small text-white"><i className="fas fa-angle-right"></i></div>
                                            </div>
                                        </div>
                                    </div>
                                       
                                </div>
                            </div>
                        </main>
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
                </div>
                <script defer src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.bundle.min.js" crossOrigin="anonymous"></script>
                <script defer src="./../../js/scripts.js"></script>
                <script defer src="https://cdnjs.cloudflare.com/ajax/libs/Chart.js/2.8.0/Chart.min.js" crossOrigin="anonymous"></script>
                <script defer src="./../../assets/demo/chart-area-demo.js"></script>
                <script defer src="./../../assets/demo/chart-bar-demo.js"></script>
                <script defer src="https://cdn.jsdelivr.net/npm/simple-datatables@latest" crossOrigin="anonymous"></script>
                <script defer src="./../../js/datatables-simple-demo.js"></script>
            </div>

            ) : (
                <div>
                    <h3>Unauthorized! Access Denied!</h3>
                </div> 
            )}
        
            

        </div>


            


        )
    }
}