import { Injectable } from "@angular/core";
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from "@angular/router";
import { AuthenticationService } from "../services/authentication.service";
import { loginTokenExpiryTime } from "../common/constants";

/*
The auth guard is used to prevent unauthenticated users from accessing restricted routes.
The auth guard will return:
TRUE: If the user is logged in and is authenticated to access the route
FALSE: If the user is logged out, thus not authenticated to access the route

Here the route access condition is to be logged in (it works on the presence of a valid JWT token)
There can be other conditions too, like role based authentication
*/

@Injectable({ providedIn: "root" })
export class AuthGuard implements CanActivate {
    constructor(private router: Router, public authenticationService: AuthenticationService) {}

    canActivate(router: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        if (this.authenticationService.validateLoginToken()) {
            return true;
        } else {
            console.log("in false branch");
            this.router.navigate(["/login"], {
                queryParams: { returnUrl: state.url }
            });

            return false;
        }
    }
}
