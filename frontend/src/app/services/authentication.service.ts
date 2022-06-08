import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { BehaviorSubject, Observable } from "rxjs";
import { map } from "rxjs/operators";
import { environment } from "../../environments/environment";


import { storedObjectName, loginTokenExpiryTime } from "../common/constants";
import { Router } from "@angular/router";
import { User } from '../models/user';
import { UserToken } from '../models/UserToken';
import { isNull } from '@angular/compiler/src/output/output_ast';
import { UserStoreService } from './user-store.service';

@Injectable({ providedIn: "root" })
export class AuthenticationService {

  constructor(public http: HttpClient,
    private userStore: UserStoreService) {

    this.userStore.setState({
      username: '',
      isLoggedIn: false

    });

    let cu = localStorage.getItem(storedObjectName);
    if (cu === null) {
      cu = JSON.stringify({});
    } else {
      console.log('cu is:', cu);
    }

    console.log('do something with the JSON.parse(cu)');

  }

  login(u: string, p: string) {
    return this.http
      .post<any>(`${environment.baseApiBackendUrl}/post/authenticate`, {
        username: u,
        password: p
      })
      .pipe(
        map(user => {
          console.log('user from pipe map is:', user);
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

  }

  // Validate the token exists, and the iat is recent enough, in order to enable
  // the client to make API call
  validateLoginToken() {

    const tok: string = localStorage.getItem(storedObjectName) || '';
    let storedObject: any;
    try {
      storedObject = JSON.parse(tok);
    } catch (e) {
      return false;

    }

    console.log('storedObject is:', storedObject);

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

