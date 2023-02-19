import https from "../http-common";
//import axios from 'axios';
import authHeader from './auth-header';
//const API_URL = 'https://localhost:8080';

class RequestDataService {

    getAll() {
        return https.get("/requests",{ headers: authHeader() });
    }

    get(id) {    
        return https.get(`/requests/${id}`,{ headers: authHeader() });
    }

    create(data) {
        return https.post("/requests", data,{ headers: authHeader() });
    }

    update(id, data) {
        return https.put(`/requests/${id}`, data,{ headers: authHeader() });
    }
}

export default new RequestDataService();