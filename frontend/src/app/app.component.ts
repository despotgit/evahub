import { Component, OnInit, ViewChild } from "@angular/core";
import { Router } from "@angular/router";
import { Observable } from "rxjs";
import { PageIndex } from "./common/constants";
import { ApplicationStateStoreService } from "./services/application-state-store.service";
import { AuthenticationService } from "./services/authentication.service";

@Component({
    selector: "app-root",
    templateUrl: "./app.component.html",
    styleUrls: ["./app.component.scss"]
})
export class AppComponent implements OnInit {
    username$: Observable<string> = this.store.username$;
    isLoggedIn$: Observable<boolean> = this.store.isloggedIn$;
    isSidenavOpened$: Observable<boolean> = this.store.isSidenavOpened$;

    @ViewChild("sidenav") sidenav;

    title = "EVAHUB";

    menuOptions = [{ id: 1 }, { id: 3 }, { id: 5 }];

    currentPageIndex = PageIndex.NONE_PAGE;

    constructor(
        private router: Router,
        private store: ApplicationStateStoreService,
        private authenticationService: AuthenticationService
    ) {
        //
    }

    ngOnInit(): void {}

    gotoLogs() {
        this.router.navigate(["/logs"]);
    }

    gotoReports() {
        this.router.navigate(["/reports"]);
    }

    gotoChecks() {
        this.router.navigate(["/checks"]);
    }

    gotoHome() {
        this.router.navigate(["/home"]);
    }

    logOut() {
        this.authenticationService.logOut();
    }
}
