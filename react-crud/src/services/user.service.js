import https from "../http-common";
//import axios from 'axios';
import authHeader from './auth-header';
//const API_URL = 'https://localhost:8080/api/';

class UserDataService {

    
    getAll() {
        return https.get("/users",{ headers: authHeader() });
    }
    
    get(id) {
        return https.get(`/users/${id}`,{ headers: authHeader() });
    }

    create(data) {
        return https.post("/users", data,{ headers: authHeader() });
    }

    update(id, data) {
        return https.put(`/users/${id}`, data,{ headers: authHeader() });
    }

    findByUserName(username) {
        return https.get(`/users?username=${username}`,{ headers: authHeader() });
    }
}
export default new UserDataService();