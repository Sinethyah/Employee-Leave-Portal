import https from "../http-common";

class AuthService {
    login(username, password) {
        return https
        .post("/auth/"+ "signin", {
            username,
            password
        })
        .then(response => {
            if (response.data.accessToken) {
                localStorage.setItem("user", JSON.stringify(response.data));
            }
            return response.data;
        });
    }

    
    googlelogin(tokenId,googleId) {
        return https
        .post("/auth/"+ "googlelogin", {
            tokenId,googleId
        })
        .then(response => {
            localStorage.setItem("user", JSON.stringify(response.data));
            return response.data;
        
        });
    }

    facebooklogin(accessToken, userID){
        return https
        .post("/auth/"+ "facebooklogin", {
            accessToken,userID
        })
        .then(response => {
            localStorage.setItem("user", JSON.stringify(response.data));
            return response.data;
        })
    }
    
    
    logout() {
        localStorage.removeItem("user");
    }

    register(username, password, email,  roles, firstName, middleName, lastName, department,
        daysAllocated, daysUsed) {
        return https.post("/auth/"+ "signup", {
            username,
            password,
            email,
            roles, 
            firstName, 
            middleName,
            lastName,
            department,
            daysAllocated,
            daysUsed,
        });
    }
    getCurrentUser() {
        return JSON.parse(localStorage.getItem('user'));
    }

    forgetPasswordResetLink(email){
        return https.post("/auth/"+ "forgetPasswordResetLink", {
            email
        });
    }

    getResetPasswordUserInfo(id,token){
        return https.get("/auth/"+"password-reset/"+`${id}/${token}`);
    }


    updatePassword(id, token,data){
        return https.put("/auth/"+"password-reset/"+`${id}/${token}`,data);
    }
}
export default new AuthService();