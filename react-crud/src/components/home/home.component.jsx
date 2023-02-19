import React, { Component } from "react";
import UserService from "../../services/user.service";
import './home.css'
import authService from "../../services/auth.service";
import Employer from "../employer/employer";
import Employee from '../employee/employee'
import Login from "../login/login.component";

export default class Home extends Component {

    
    constructor(props) {
        super(props);
        this.state = {
            currentUser: authService.getCurrentUser()
        };
    }
    
    
    render() {

        const {currentUser} = this.state;
        
        return (
            <div>
                {!currentUser && (
                    <Login/>
                )}

                {currentUser &&currentUser.role=="ROLE_EMPLOYER" && (
                    <Employer/>
                )}

                {currentUser && currentUser.role=="ROLE_EMPLOYEE" && (
                    <Employee/>
                )}
                
            </div>
        );
    }
}