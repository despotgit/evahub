import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { map } from "rxjs/operators";
import { environment } from "../../environments/environment";
import { storedObjectName, loginTokenExpiryTime } from "../common/constants";
import { Router } from "@angular/router";
import { ApplicationStateStoreService } from "../store/application-state-store.service";
import { INITIAL_APPLICATION_STATE } from "../store/application.state";

@Injectable({ providedIn: "root" })
export class AuthenticationService {
    constructor(
        public http: HttpClient,
        private store: ApplicationStateStoreService,
        private router: Router
    ) {
        this.store.setState(INITIAL_APPLICATION_STATE);

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
                    //console.log("user from pipe map is:", user);
                    if (user.authenticated && user.token) {
                        localStorage.setItem(storedObjectName, JSON.stringify(user));

                        this.store.updateUsername(u);
                        this.store.updateIsSidenavOpened(true);
                    }

                    return user;
                })
            );
    }

    logOut() {
        // remove user from local storage to log user out
        localStorage.removeItem(storedObjectName);
        this.store.resetApplicationState();
        this.router.navigate(["login"]);
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

            //console.log("minutesPassedSinceLogin is: ", minutesPassedSinceLogin);
            //console.log("loginTokenExpiryTime is: ", loginTokenExpiryTime);
            //console.log("storedObject.role is: ", storedObject.role);

            if (storedObject.role === "admin" || minutesPassedSinceLogin <= loginTokenExpiryTime) {
                this.store.updateUsername(storedObject.username);
                this.store.updateIsLoggedIn(true);

                return true;
            } else {
                this.logOut();
                return false;
            }
        } else {
            return false;
        }
    }
}
