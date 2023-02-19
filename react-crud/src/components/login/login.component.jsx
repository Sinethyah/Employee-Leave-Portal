import React, { Component } from "react";
import Form from "react-validation/build/form";
import Input from "react-validation/build/input";
import CheckButton from "react-validation/build/button";
import AuthService from "../../services/auth.service";
import GoogleLogin from 'react-google-login';
//import FacebookLogin from 'react-facebook-login';
import FacebookLogin from 'react-facebook-login/dist/facebook-login-render-props'
import { gapi } from "gapi-script";
import sb2 from './../../css/sb-admin-2.css'
import fontawesome from "./../../vendor/fontawesome-free/css/all.min.css"






let timeout=null;

const required = value => {
  if (!value) {
    return (
      <div className="alert alert-danger" role="alert">
        This field is required!
      </div>
    );
  }
};



export default class Login extends Component {
    constructor(props) {
            super(props);
            this.handleLogin = this.handleLogin.bind(this);
            this.onChangeUsername = this.onChangeUsername.bind(this);
            this.onChangePassword = this.onChangePassword.bind(this);
            this.state = {
                currentUser:AuthService.getCurrentUser(),
                username: "",
                password: "",
                loading: false,
                message: ""
        };
    }

    //sets the state of the username changed
    onChangeUsername(e) {
        this.setState({
            username: e.target.value
        });
    }

    //sets the state of the password changed
    onChangePassword(e) {
        this.setState({
            password: e.target.value
        });
    }

    //handles login
    //sends information about the user to verify
    handleLogin(e) {
        e.preventDefault();
            this.setState({
            message: "",
            loading: true
        });
        this.form.validateAll();
        if (this.checkBtn.context._errors.length === 0) {
            AuthService.login(this.state.username, this.state.password).then(
                () => {
                    window.location.href = "/profile";
                },
                error => {
                const resMessage =
                    (error.response &&
                    error.response.data &&
                    error.response.data.message) ||
                    error.message ||
                    error.toString();
                this.setState({
                    loading: false,
                    message: resMessage
                });
            }
        );
        } 
        else {
            this.setState({
                loading: false
            });
        }
    }

    showPassword(){
        var x = document.getElementById("exampleInputPassword");
        if (x.type === "password") {
            x.type = "text";
        } else {
            x.type = "password";
        }
    }

    
    render() {

        const {currentUser} = this.state;

        //google initialization
        gapi.load("client:auth2", () => {
            gapi.client.init({
              clientId:
                `${process.env.REACT_APP_OAUTH_CLIENT}`,
                scope:"email",
                plugin_name: "leaveapp",
            });
        });

        //when successfully logged in, redirect to the profile
        const responseSuccessGoogle = (response) => {
            
            //console.log("Google response: "+JSON.stringify(response));


            AuthService.googlelogin(response.tokenId, response.googleId).then(
                () => {
                    window.location.href = "/profile";
                },
                error => {
                    const resMessage =
                        (error.response &&
                        error.response.data &&
                        error.response.data.message) ||
                        error.message ||
                        error.toString();
                    this.setState({
                        loading: false,
                        message: resMessage
                    });
                }
        );
        }
  
        //when not logged in successfully, console.log the error
        const responseErrorGoogle = (response) => {
            //console.log(response);
  
        }

        //response by facebook
        const responseFacebook = (response) => {
            
            //console.log("Facebook response: "+JSON.stringify(response));
            
            AuthService.facebooklogin(response.accessToken, response.userID).then(
                () => {
                    window.location.href = "/profile";
                },
                error => {
                const resMessage =
                    (error.response &&
                    error.response.data &&
                    error.response.data.message) ||
                    error.message ||
                    error.toString();
                this.setState({
                    loading: false,
                    message: resMessage
                });
                }
            );
        }



        return (
            <div>
            
            <div >
            
                <meta charSet="utf-8"/>
                <meta httpEquiv="X-UA-Compatible" content="IE=edge"/>
                <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no"/>
                <meta name="description" content=""/>
                <meta name="author" content=""/>
            
                <title>SB Admin 2 - Login</title>
            
                <link href={fontawesome} rel="stylesheet" type="text/css"></link>
                <link
                    href="https://fonts.googleapis.com/css?family=Nunito:200,200i,300,300i,400,400i,600,600i,700,700i,800,800i,900,900i"
                    rel="stylesheet"></link>
            
                <link href={sb2} rel="stylesheet" type="text/css"></link>
            
            </div>

            {!currentUser && (
                <div className="bg-gradient-primary">
            
                <div className="container">
            
                    <div className="row justify-content-center">
            
                        <div className="col-xl-10 col-lg-12 col-md-9">
            
                            <div className="card o-hidden border-0 shadow-lg my-5">
                                <div className="card-body p-0">
                                    <div className="row">
                                        <div className="col-lg-6 d-none d-lg-block bg-login-image"></div>
                                        <div className="col-lg-6">
                                            <div className="p-5">
                                                <div className="text-center">
                                                    <h1 className="h4 text-gray-900 mb-4">Welcome to</h1><h1 className="h4 text-gray-900 mb-4">Arcturus Leave Portal</h1>
                                                </div>
                                                <Form className="user"
                                                onSubmit={this.handleLogin}
                                                ref={c => {
                                                    this.form = c;
                                                }}>
                                                    <div className="form-group">
                                                        <input type="username" className="form-control form-control-user"
                                                            id="exampleInputUsername" aria-describedby="usernameHelp"
                                                            placeholder="Enter Username..."
                                                            value={this.state.username}
                                                            onChange={this.onChangeUsername}
                                                            validations={[required]}/>
                                                    </div>
                                                    <div className="form-group">
                                                        <input type="password" className="form-control form-control-user"
                                                            id="exampleInputPassword" placeholder="Password"
                                                            value={this.state.password}
                                                            onChange={this.onChangePassword}
                                                            validations={[required]}/>
                                                    </div>

                                                    <div className="form-group">
                                                    <div className="custom-control custom-checkbox small">
                                                        <input type="checkbox" className="custom-control-input" id="customCheck" onClick={this.showPassword}/>
                                                        <label className="custom-control-label" htmlFor="customCheck">Show Password</label>
                                                    </div>
                                                    </div>
                                                    
                                                    <button className="btn btn-primary btn-user btn-block" disabled={this.state.loading}>
                                                    {this.state.loading && (
                                                    <span className="spinner-border spinner-border-sm"></span>
                                                    )}
                                                        <span>Login</span>
                                                    </button>


                                                    <hr/>
                                                    <GoogleLogin
                                                    clientId="1040969823585-d5cguq0891f5hdgf59jk46a1infpb1qp.apps.googleusercontent.com"
                                                    render={renderProps => (
                                                          <div className="btn btn-google btn-user btn-block" onClick={renderProps.onClick} disabled={renderProps.disabled} style={{'backgroundColor':'#ea4335', 'color':'white'}}>
                                                            <i className="fab fa-google" >
                                                            </i>
                                                            <span style={{'color':'white'}}>&nbsp;Login with Google</span>
                                                            </div>
                                                    )}
                                                    onSuccess={responseSuccessGoogle}
                                                    onFailure={responseErrorGoogle}
                                                    cookiePolicy={'single_host_origin'}
                                                    />

                                                    <FacebookLogin
                                                        appId="1041140176521157"
                                                        render={renderProps => (
                                                            <div className="btn btn-facebook btn-user btn-block" onClick={renderProps.onClick} disabled={renderProps.isDisabled} style={{'backgroundColor':'#3b5998'}}>
                                                                <li className="fab fa-facebook-f" style={{'color':'white'}}></li>
                                                                <span style={{'color':'white'}}>&nbsp; Login with facebook</span>
                                                                </div>
                                                            
                                                        )}
                                                        autoLoad={false}
                                                        callback={responseFacebook} 
                                                        icon="fa-facebook"

                                                    />

                                                    <hr/>

                                                    <div class="text-center">
                                                        <a class="small" href="/forgetPasswordResetLink">Forgot Password?</a>
                                                    </div>

                                                    {this.state.message && (
                                                        <div className="form-group">
                                                            <div className="alert alert-danger" role="alert">
                                                            {this.state.message}
                                                            </div>
                                                        </div>
                                                        )}
                                                        <CheckButton
                                                        style={{ display: "none" }}
                                                        ref={c => {
                                                            this.checkBtn = c;
                                                        }}
                                                    />

                                                
                                                </Form>
                                                
                                                <br/>
                                                
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
            
                        </div>
            
                    </div>
            
                </div>
            
                <script defer src="./../../vendor/jquery/jquery.min.js"></script>
                <script defer src="./../../vendor/bootstrap/js/bootstrap.bundle.min.js"></script>
            
                <script defer src="./../../vendor/jquery-easing/jquery.easing.min.js"></script>
            
                <script defer src="./../../js/sb-admin-2.min.js"></script>
            
            </div>

            )}
            
            
            
            </div>
        );
    }
}

