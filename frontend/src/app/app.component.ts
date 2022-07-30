import { AfterViewInit, ChangeDetectionStrategy, Component, OnInit, ViewChild } from "@angular/core";
import { Router } from "@angular/router";
import { map, Observable, of, shareReplay, Subscription, withLatestFrom, tap, share } from "rxjs";
import { PageIndex, PageIndexDictionary } from "./common/constants";
import {
    ApplicationStateStoreService,
    Check,
    EvahubSidenavMenuOption,
    Log,
    Report
} from "./services/application-state-store.service";
import { AuthenticationService } from "./services/authentication.service";

@Component({
    selector: "app-root",
    templateUrl: "./app.component.html",
    styleUrls: ["./app.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent implements OnInit, AfterViewInit {
    username$: Observable<string> = this.store.username$;
    isLoggedIn$: Observable<boolean> = this.store.isloggedIn$;
    isSidenavOpened$: Observable<boolean> = this.store.isSidenavOpened$;
    sidenavMenuOptions$: Observable<EvahubSidenavMenuOption[]> = this.store.sidenavMenuOptions$;
    currentPageIndex$: Observable<PageIndex> = this.store.currentPageIndex$;
    currentPageIndexChanges$ = this.currentPageIndex$
        .pipe(
            tap(a => {
                console.log("catching a, a is:", a);
                this.currentPageIndex = a;
            })
        )
        .subscribe();
    userReports$: Observable<Report[]> = this.store.userReports$;
    userChecks$: Observable<Check[]> = this.store.userChecks$;
    userLogs$: Observable<Log[]> = this.store.userLogs$;

    docSelectedSub: Subscription;

    currentPageIndex: number = PageIndex.NONE_PAGE;

    @ViewChild("sidenav") sidenav;

    title = "EVAHUB";

    constructor(
        private router: Router,
        private store: ApplicationStateStoreService,
        private authenticationService: AuthenticationService
    ) {
        //
    }

    ngOnInit(): void {}

    ngAfterViewInit(): void {}

    goTo(page) {
        this.router.navigate(["/" + page]);
    }

    logOut() {
        this.authenticationService.logOut();
    }

    menuItemClicked($event) {
        console.log("in app in menuItemClicked");
        let documentId$ = of($event);

        let docs$: Observable<any[]>;
        console.log("this.currentPageIndex is:", this.currentPageIndex);
        switch (this.currentPageIndex) {
            case PageIndex.REPORTS_PAGE:
                docs$ = this.userReports$;
                break;
            case PageIndex.LOGS_PAGE:
                docs$ = this.userLogs$;
                break;
            case PageIndex.CHECKS_PAGE:
                docs$ = this.userChecks$;
                break;
        }

        this.docSelectedSub = this.currentPageIndex$
            .pipe(
                withLatestFrom(documentId$, docs$),
                map(([cpi, documentId, docs]) => {
                    //console.log("we are in docselected sub...");
                    //console.log("cpi, documentId, docs are:", cpi, documentId, docs);

                    let selectedDoc;
                    switch (cpi) {
                        case PageIndex.REPORTS_PAGE:
                            selectedDoc = docs.filter(d => d.reportId == documentId);
                            this.store.updateSelectedUserReport(selectedDoc[0]);
                            break;
                        case PageIndex.LOGS_PAGE:
                            selectedDoc = docs.filter(d => d.logId == documentId);
                            this.store.updateSelectedUserLog(selectedDoc[0]);
                            break;
                        case PageIndex.CHECKS_PAGE:
                            selectedDoc = docs.filter(d => d.checkId == documentId);
                            this.store.updateSelectedUserCheck(selectedDoc[0]);

                            break;
                        //selectedDoc = docs.filter(d => d.checkId == documentId);
                        //this.store.updateSelectedUserCheck(selectedDoc[0]);
                    }
                })
            )
            .subscribe();

        this.docSelectedSub.unsubscribe();
    }

    updateCurrentPageIndex(cpi: number) {
        this.currentPageIndex = cpi;
        this.store.updateCurrentPageIndex(cpi);
    }

    ngOnDestroy() {
        this.docSelectedSub.unsubscribe();
        this.currentPageIndexChanges$.unsubscribe();
    }
}
