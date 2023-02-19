import React, { Component } from "react";
import AuthService from "../../services/auth.service";
import UserService from "../../services/user.service"
import Employer from './../employer/employer'
import Employee from './../employee/employee'
import Login from './../login/login.component'

export default class Profile extends Component {
    constructor(props) {
        super(props);

        this.state = {
            currentUser: AuthService.getCurrentUser(),
            userselected:{}
        };
    }

    componentDidMount(){

        let id = this.state.currentUser.id;
        this.getUser(id);
        
    }

    getUser(id){

        UserService.get(id)
        .then (response => {
            this.setState({
                userselected: response.data.accountInfo
            })
        })
        .catch(err => console.log(err));
    }


    render() {
        const { currentUser, userselected } = this.state;
        return (
        <div className="container">
            {currentUser && currentUser.role=="ROLE_EMPLOYER" && (
                <Employer/>
            )}

            {currentUser && currentUser.role=="ROLE_EMPLOYEE" && (
                <Employee/>
            )}

            {!currentUser && (
                <Login/>
            )}
            
        </div>
        );
    }
}