import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { map } from "rxjs/operators";
import { environment } from "../../environments/environment";
import { storedObjectName, loginTokenExpiryTime } from "../common/constants";
import { UserStoreService } from "./user-store.service";
import { INITIAL_USER_STATE } from "./user-store.service";

@Injectable({ providedIn: "root" })
export class AuthenticationService {
    constructor(public http: HttpClient, private userStore: UserStoreService) {
        this.userStore.setState(INITIAL_USER_STATE);

        let cu = localStorage.getItem(storedObjectName);
        if (cu === null) {
            cu = JSON.stringify({});
        } else {
            //console.log("cu is:", cu);
        }
    }

    login(u: string, p: string, isFlaskServer = true) {
        let url;
        if (isFlaskServer) {
            url = `${environment.baseApiBackendUrl}/auth/login`;
        } else {
            url = `${environment.baseApiBackendUrl}/post/authenticate`;
        }

        return this.http
            .post<any>(url, {
                username: u,
                password: p
            })
            .pipe(
                map(user => {
                    console.log("user from pipe map is:", user);
                    if (user.authenticated && user.token) {
                        localStorage.setItem(storedObjectName, JSON.stringify(user));
                    }

                    this.userStore.updateUsername(u);

                    return user;
                })
            );
    }

    logout() {
        // remove user from local storage to log user out
        localStorage.removeItem(storedObjectName);
        //this.userStore.updateUsername(null);
        this.userStore.resetUserState();
    }

    // Validate the token exists, and the iat is recent enough, in order to enable
    // the client to make API call
    validateLoginToken() {
        const tok: string = localStorage.getItem(storedObjectName) || "";

        let storedObject: any;
        try {
            storedObject = JSON.parse(tok);
        } catch (e) {
            return false;
        }

        if (storedObject && storedObject.token && storedObject.iat) {
            const nowTime: number = new Date().getTime();
            const now: number = Math.floor(nowTime / 1000);
            const iat: number = storedObject.iat;

            let minutesPassedSinceLogin = (now - iat) / 60;

            //console.log("passed time (in minutes) since login is:");
            //console.log(minutesPassedSinceLogin);

            if (storedObject.role === "admin" || minutesPassedSinceLogin <= loginTokenExpiryTime) {
                this.userStore.updateUsername(storedObject.username);
                this.userStore.updateIsLoggedIn(true);
                return true;
            } else {
                return false;
            }
        } else {
            return false;
        }
    }
}
