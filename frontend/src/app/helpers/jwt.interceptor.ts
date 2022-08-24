import { Injectable } from "@angular/core";
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from "@angular/common/http";
import { Observable } from "rxjs";
import { Router } from "@angular/router";
import { AuthenticationService } from "../services/authentication.service";
import { storedObjectName } from "../common/constants";

/*
The JWT interceptor intercepts the incoming requests from the application/user and adds JWT token to the request's Authorization header,
only if the user is logged in. This JWT token in the request header is required to access the SECURE API END POINTS on the server
*/

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
    constructor(private authenticationService: AuthenticationService, private router: Router) {}

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        // check if the current user is logged in
        // if the user making the request is logged in, he will have JWT token in it's local storage, which is set by Authorization
        // Service during login process

        //console.log("in intercept in jwt interceptor");
        const currentUser = JSON.parse(localStorage.getItem(storedObjectName));

        if (this.authenticationService.validateLoginToken()) {
            //console.log("While intercepting, the currentUser is found and also the currentUser.token is found! Attaching it in header");
            // clone the incoming request and add JWT token in the cloned request's Authorization Header

            //console.log("request before is:");
            //console.log(request);

            request = request.clone({
                setHeaders: {
                    Authorization: `Bearer ${currentUser.token}`
                }
            });

            //console.log("request after is:");
            //console.log(request);
        } else {
            console.log("in when false validateLoginToken in jwt interceptor");

            console.log("request is:", request);

            if (request.url == "http://127.0.0.1:5000/register/user") {
                console.log("Interceptor: that's fine");
            } else {
                let state = this.router.routerState;
                let snapshot = state.snapshot;
                let activatedRouteSnapshot = snapshot.root;

                this.router.navigate(["/login"], {
                    queryParams: activatedRouteSnapshot.queryParams
                    //queryParams: { returnUrl: "country-fiches" }
                });
            }
        }

        //console.log("in intercept of JwtInterceptor, next is:");
        //console.log(next);

        // handle any other requests which went unhandled
        return next.handle(request);
    }
}
