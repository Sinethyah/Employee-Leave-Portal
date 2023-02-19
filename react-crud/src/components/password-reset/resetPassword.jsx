import React, { Component } from "react";
import AuthService from "../../services/auth.service";
import sb2 from './../../css/sb-admin-2.css'
import fontawesome from "./../../vendor/fontawesome-free/css/all.min.css"
import './../../App.css'
import {useParams} from 'react-router-dom'
import authService from "../../services/auth.service";





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



class ResetPassword extends Component {
    constructor(props) {
        super(props);
        console.log(props);
        this.resetPassword = this.resetPassword.bind(this);
        this.onChangeNewPassword= this.onChangeNewPassword.bind(this);
        this.onChangeConfirmNewPassword = this.onChangeConfirmNewPassword.bind(this);
        this.state = {
            currentUser: AuthService.getCurrentUser(),
            id:'',
            token:'',
            newpassword:'',
            confirmnewpassword:'',
            message:'',
            successful:false
        };
    }


    componentDidMount(){
        
        const {id, token} = this.props.params;
        console.log(id,token)
        this.setState({
            id:id,
            token:token
        })
        this.getResetPasswordUserInfo(id,token)
        
    }

    //sets the state of the new password changed
    onChangeNewPassword(e) {
        this.setState({
            newpassword: e.target.value
        });
    }

    //confirm new password
    onChangeConfirmNewPassword(e) {
        this.setState({
            confirmnewpassword: e.target.value
        });
    }

    //handles sending reset link
    resetPassword(e) {

        let data={
            password: this.state.newpassword
        }
        
        AuthService.updatePassword(this.state.id, this.state.token, data ).then(
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
            this.setState({
                loading: false,
                message: error.response.data || resMessage
            });
        }
    );
        
    }

    //get information if the password was already set using the link, if yes, the link is invalid
    //since it is a one-time use only
    getResetPasswordUserInfo(id, token){
        authService.getResetPasswordUserInfo(id, token)
        .then (response => {
            this.setState({
                message: "",
                successful:true
            })
        })
        .catch(err => {
            this.setState({
                message:"err",
                successful:false
            })
        })

    }

    showPassword(){
        var x = document.getElementById("exampleInputPassword");
        let y = document.getElementById("exampleInputConfirmPassword");
        if ((x.type && y.type)=== "password") {
            x.type = "text";
            y.type = "text";
        } else {
            x.type = "password";
            y.type = "password";
        }
    }

    
    render() {

        const {message,successful, currentUser} = this.state;

    
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
                <div>
                {successful==false ? (
                    <div>
                        <p>You have already used the link once!</p>
                    </div>

                ) : (
                <div className="container" style={{'paddingTop':'10%'}}>

                <div className="row justify-content-center">

                    <div className="col-xl-10 col-lg-12 col-md-9">

                    <div className="card o-hidden border-0 shadow-lg my-5">
                    <div class="card-header py-3">
                        <h6 class="m-0 font-weight-bold text-primary">Password Reset</h6>
                    </div> 
                    <div className="card-body p-0">                     
                    <br/>
                    <input type="password" className="form-control form-control-user"
                    id="exampleInputPassword" aria-describedby="passwordHelp"
                    placeholder="Enter New Password"
                    value={this.state.newpassword}
                    onChange={this.onChangeNewPassword}
                    validations={[required]}/>

                    <br/>

                    <input type="password" className="form-control form-control-user"
                    id="exampleInputConfirmPassword" aria-describedby="newPasswordHelp"
                    placeholder="Confirm Password"
                    value={this.state.confirmnewpassword}
                    onChange={this.onChangeConfirmNewPassword}
                    validations={[required]}/>

                    <div class="custom-control custom-checkbox small">
                        <input type="checkbox" class="custom-control-input" id="customCheck" onClick={this.showPassword}/>
                        <label class="custom-control-label" for="customCheck">Show Password</label>
                    </div>

                    <br/>
                    <button className="btn btn-primary btn-md active" onClick={this.resetPassword}>
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

            )}

             
                
            
            </div>
        );
    }
}

export default (props) => (
    <ResetPassword
        {...props}
        params={useParams()}
    />
); 