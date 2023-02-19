import React, { Component } from "react";
import { Routes, Route, Link} from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";


import User from "./components/user/user.component";
import UsersList from "./components/user/users-list.component";

import AuthService from "./services/auth.service";
import Login from "./components/login/login.component";
import Register from "./components/register/register.component";
import Home from "./components/home/home.component";
import Profile from "./components/user/profile.component";
import NewRequest from "./components/request/newrequest";
import RequestSummaryUser from "./components/request/requests-list-eachUser";
import RequestSummaryUserForEmployer from './components/request/requests-list-ForEmployer'
import Request from "./components/request/request.component";
import PendingRequests from "./components/request/pendingreq-list.component";
import ForgetPasswordLink from './components/password-reset/sendPasswordLink'
import PasswordReset from './components/password-reset/resetPassword'




class App extends Component {


    
    render() {
      
      return (

      <div>
          <Routes>
            <Route exact path="/" element={<Home/>}/>
            <Route exact path="/users/:id" element={<User/>} />
            <Route exact path="/users" element={<UsersList/>} />
            <Route exact path="/login" element={<Login/>} />
            <Route exact path="/register" element={<Register/>} />
            <Route exact path="/profile" element={<Profile/>} />
            <Route exact path="/newrequest" element={<NewRequest/>} />
            <Route exact path="/requestSummary" element={<RequestSummaryUser/>} />
            <Route exact path="/requestSummary/:id" element={<RequestSummaryUserForEmployer/>} />
            <Route exact path="/requests/:id" element={<Request/>} />
            <Route exact path ="/pendingrequests" element = {<PendingRequests/>} />
            <Route exact path ="/forgetPasswordResetLink" element={<ForgetPasswordLink/>} />
            <Route exact path ="/password-reset/:id/:token" element={<PasswordReset/>} />

          </Routes>
      </div>


        
            
          
          
      );
    }
}
export default App;

/*

<li className="nav-item">
              <Link to={"/add"} className="nav-link">
                Register User
              </Link>
            </li>




*/