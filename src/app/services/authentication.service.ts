import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { BehaviorSubject, Observable } from "rxjs";
import { map } from "rxjs/operators";
import { environment } from "../../environments/environment";


import { jwtName, loginTokenExpiryTime } from "../common/constants";
import { Router } from "@angular/router";
import { User } from '../models/user';
import { UserToken } from '../models/UserToken';
import { isNull } from '@angular/compiler/src/output/output_ast';
import { UserStoreService } from './user-store.service';

@Injectable({ providedIn: "root" })
export class AuthenticationService {

    constructor(public http: HttpClient,
      private userStore: UserStoreService) {
        let cu = localStorage.getItem("powerJwt");
        if(cu === null) {
          cu = JSON.stringify({});
        }

        console.log('do something with the JSON.parse(cu)');

        this.userStore.setState({
          username: '',
          isLoggedIn: false
          
        }); 

        
    }


    login(u: string, p: string) {
        return this.http
            .post<any>(`${environment.baseApiBackendUrl}/post/authenticate`, {
                username: u,
                password: p
            })
            .pipe(
                map(user => {
                    // login is successful if there's a jwt token in the response
                    if (user.authenticated && user.token) {
                        // store user details and jwt token in local storage to keep user logged in between page refreshes
                        localStorage.setItem(jwtName, JSON.stringify(user));
                        
                    } 
                    
                    this.userStore.updateUsername(u);

                    return user;
                })
            );
    }

    logout() {
        // remove user from local storage to log user out
        localStorage.removeItem("powerJwt");
        
    }

    // Validate the token exists, and the iat is recent enough, in order to enable
    // the client to make API call
    validateLoginToken() {
        //const currentUser = JSON.parse(localStorage.getItem(jwtName));
        const currentUser = new User();

        if (currentUser && currentUser.token && currentUser.iat) {
            const nowTime: number = new Date().getTime();
            const now: number = Math.floor(nowTime / 1000);
            const iat: number = currentUser.iat;

            let minutesPassedSinceLogin = (now - iat) / 60;

            //console.log("passed time (in minutes) since login is:");
            //console.log(minutesPassedSinceLogin);

            if (currentUser.role === "admin" || minutesPassedSinceLogin <= loginTokenExpiryTime) {
                return true;
            } else {
                //this.logout();
                return false;
            }
        } else {
            return false;
        }
    }
}

