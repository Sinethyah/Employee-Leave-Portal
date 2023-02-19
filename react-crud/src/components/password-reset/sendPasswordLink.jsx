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
import './../../App.css'





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



export default class sendPasswordLink extends Component {
    constructor(props) {
            super(props);
            this.sendResetLink = this.sendResetLink.bind(this);
            this.onChangeEmail= this.onChangeEmail.bind(this);
            this.state = {
                currentUser: AuthService.getCurrentUser(),
                email:'',
                message:'',
                successful:false
        };
    }

    //sets the state of the username changed
    onChangeEmail(e) {
        this.setState({
            email: e.target.value
        });
    }

    //handles sending reset link
    sendResetLink(e) {
        
        AuthService.forgetPasswordResetLink(this.state.email).then(
            response => {
                this.setState({
                    message: response.data.message,
                    successful:true
                })
            },
            error => {
            const resMessage =
                (error.response &&
                error.response.data &&
                error.response.data.message) ||
                error.message ||
                error.toString();
                console.log(error);
            this.setState({
                loading: false,
                message: error.response.data
            });
        }
    );
        
    }

    
    render() {

        const {currentUser} = this.state;

    
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
                <div className="container" style={{'paddingTop':'10%'}}>
            
                <div className="row justify-content-center">
        
                    <div className="col-xl-10 col-lg-12 col-md-9">
        
                        <div className="card o-hidden border-0 shadow-lg my-5">
                            <div class="card-header py-3">
                                <h6 class="m-0 font-weight-bold text-primary">Password Reset</h6>
                            </div> 
                            <div className="card-body p-0">                     
                            <br/>
                            <input type="email" className="form-control form-control-user"
                            id="exampleInputEmaik" aria-describedby="emailHelp"
                            placeholder="Enter Email..."
                            value={this.state.email}
                            onChange={this.onChangeEmail}
                            validations={[required]}/>

                            <br/>
                            <button className="btn btn-primary btn-md active" onClick={this.sendResetLink}>
                                <span>Submit</span>
                            </button>

                            <br/>
                            <br/>
                            <div className="text-left">
                                <a className="small" href="/login">Login Page</a>
                            </div>

                            <br/>

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
                                </div>)}
                                                                                             
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

