import React, { Component } from "react";
import AuthService from "../../services/auth.service";
import UserService from "../../services/user.service";
import {NavLink, Link } from "react-router-dom";

import authservice  from "../../services/auth.service";
import { GoogleLogout } from 'react-google-login';



let timeout=null;


export default class RequestsList extends Component {

      constructor(props) {
            super(props);
            this.state = {
                requests: [],
                currentUser: AuthService.getCurrentUser(),
            };
        }

        componentDidMount(){

            const id = AuthService.getCurrentUser().id;
            this.getUser(id);
            
        }

        getUser(id){
            UserService.get(id)
            .then(response => {
                this.setState({
                    requests: response.data.requestSummary
                });
                //console.log(response.data);
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
          const { requests, currentUser} = this.state;

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

            {(currentUser && currentUser.role=="ROLE_EMPLOYEE") && (
              <div>
              <div>
              <meta charSet="utf-8" />
              <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
              <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
              <meta name="description" content="" />
              <meta name="author" content="" />
              <title>Dashboard - SB Admin</title>

              <link href="https://cdn.jsdelivr.net/npm/simple-datatables@latest/dist/style.css" rel="stylesheet" />
              <link href="./../../css/styles.css" rel="stylesheet" />
              <script src="https://use.fontawesome.com/releases/v6.1.0/js/all.js" crossOrigin="anonymous"></script>
          </div>

          <div className="sb-nav-fixed" id="navbar-fixed">
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
                              <h1 className="mt-4">Requests</h1>
                              <div className="card shadow mb-4">
                              <div className="card-header py-3">
                                  <h6 className="m-0 font-weight-bold text-primary">Requests List</h6>
                              </div>
                              <div className="card-body">
                                  <div className="table-responsive">
                                      <table className="table table-striped" id="datatablesSimple" width="100%" cellSpacing="0">
                                          <thead>
                                              <tr>
                                                  <th></th>
                                                  <th>Title</th>
                                                  <th>Description</th>
                                                  <th>Status</th>
                                              </tr>
                                          </thead>
                                          
                                          <tbody>
                                          {requests &&
                                          requests.map((request, index) => (
                                            <tr key={index}>
                                            <th scope="row">{index+1}</th>
                                            <td>{<NavLink to={"/requests/" + request.id }>{request.title}</NavLink>}</td>
                                            <td>{request.description}</td>
                                            <td>{request.status}</td>
                                            </tr>
                                          ))}
                                          </tbody>
                                      </table>
                                  
                                  </div>
                              </div>
                      </div>
                      </div>
                      </main>
                      <footer className="py-4 bg-light mt-auto">
                          <div className="container-fluid px-4">
                              <div className="d-flex align-items-center justify-content-between small">
                                  <div className="text-muted">Copyright &copy; Your Website 2022</div>
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
          
              <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.bundle.min.js" crossOrigin="anonymous"></script>
              <script src="./../../js/scripts.js"></script>
              <script src="https://cdn.jsdelivr.net/npm/simple-datatables@latest" crossOrigin="anonymous"></script>
              <script src="./../../js/datatables-simple-demo.js"></script>
              
          </div>
          </div>              
          )}

          {!currentUser && (
            
            <main>
            <h2>Unauthorized! Access Denied!</h2>
            </main>


          )}
          </div>

            
          );
      }
}
