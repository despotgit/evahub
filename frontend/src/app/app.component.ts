import { AfterViewInit, Component, OnInit, ViewChild } from "@angular/core";
import { Router } from "@angular/router";
import { Observable, of, tap } from "rxjs";
import { PageIndex } from "./common/constants";
import {
    ApplicationStateStoreService,
    EvahubSidenavMenuOption
} from "./services/application-state-store.service";
import { AuthenticationService } from "./services/authentication.service";

@Component({
    selector: "app-root",
    templateUrl: "./app.component.html",
    styleUrls: ["./app.component.scss"]
})
export class AppComponent implements OnInit, AfterViewInit {
    username$: Observable<string> = this.store.username$;
    isLoggedIn$: Observable<boolean> = this.store.isloggedIn$;
    isSidenavOpened$: Observable<boolean> = this.store.isSidenavOpened$;
    //menuOptions$ = of([{ id: 1 }, { id: 3 }, { id: 5 }]);
    sidenavMenuOptions$: Observable<EvahubSidenavMenuOption[]> = this.store.sidenavMenuOptions$;

    @ViewChild("sidenav") sidenav;

    title = "EVAHUB";

    currentPageIndex = PageIndex.NONE_PAGE;

    constructor(
        private router: Router,
        private store: ApplicationStateStoreService,
        private authenticationService: AuthenticationService
    ) {
        //
    }

    ngOnInit(): void {}

    ngAfterViewInit(): void {
        //this.sidenav.close();
    }

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
