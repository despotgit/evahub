import { HttpClient } from "@angular/common/http";
import {
    AfterViewInit,
    ChangeDetectionStrategy,
    Component,
    OnInit,
    ViewChild
} from "@angular/core";
import { Router } from "@angular/router";

import { map, Observable, of, shareReplay, Subscription, withLatestFrom, tap, share } from "rxjs";
import { environment } from "src/environments/environment";
import { PageIndex, PageIndexDictionary } from "./common/constants";
import {
    ApplicationStateStoreService,
    Check,
    EvahubDocument,
    EvahubDocumentType,
    EvahubDocumentTypeDictionary,
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
    currentDocumentId$: Observable<number> = this.store.currentDocumentId$;
    userReports$: Observable<Report[]> = this.store.userReports$;
    userChecks$: Observable<Check[]> = this.store.userChecks$;
    userLogs$: Observable<Log[]> = this.store.userLogs$;

    docSelectedSub: Subscription;

    currentPageIndex: number = PageIndex.NONE_PAGE;

    @ViewChild("sidenav") sidenav;

    title = "EVAHUB";
    httpDocsCall: any;

    constructor(
        private router: Router,
        private store: ApplicationStateStoreService,
        private authenticationService: AuthenticationService,
        private httpClient: HttpClient
    ) {
        //
        this.initUserDocsList();
    }

    ngOnInit(): void {}

    ngAfterViewInit(): void {}

    goTo(isDocumentsPage, page) {
        console.log("in goto, page is:", page);
        const pageToLower: string = page.toLowerCase();

        let singularDocumentName = page.substring(0, page.length - 1);
        console.log("singularDocumentname is:", singularDocumentName);

        let newPageIndex;
        if (isDocumentsPage) {
            this.router.navigate([
                "/documents/" + pageToLower.substring(0, pageToLower.length - 1)
            ]);
            newPageIndex = PageIndexDictionary[pageToLower];
        } else {
            this.router.navigate(["/" + pageToLower]);
            newPageIndex = PageIndexDictionary[pageToLower];
        }

        this.updateSelectedDocumentsStateFromApiCall(singularDocumentName);
        this.store.updateCurrentPageIndex(newPageIndex);
    }

    logOut() {
        this.authenticationService.logOut();
    }

    menuItemClicked($event) {
        console.log("in app in menuItemClicked");

        this.store.updateCurrentDocumentId($event);

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
                withLatestFrom(this.currentDocumentId$, docs$),
                map(([cpi, documentId, docs]) => {
                    //console.log("we are in docselected sub...");
                    //console.log("cpi, documentId, docs are:", cpi, documentId, docs);

                    let selectedDoc;
                    switch (cpi) {
                        case PageIndex.REPORTS_PAGE:
                            selectedDoc = docs.filter(d => d.reportId == documentId);
                            this.store.updateSelectedUserDocument("Report", selectedDoc[0]);
                            break;
                        case PageIndex.LOGS_PAGE:
                            selectedDoc = docs.filter(d => d.logId == documentId);
                            this.store.updateSelectedUserDocument("Log", selectedDoc[0]);
                            break;
                        case PageIndex.CHECKS_PAGE:
                            selectedDoc = docs.filter(d => d.checkId == documentId);
                            this.store.updateSelectedUserDocument("Check", selectedDoc[0]);

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

    initUserDocsList() {
        const docTypes = ["Log", "Report", "Check"];

        for (let i = 0; i < docTypes.length; i++) {
            let docType = docTypes[i];
            this.updateSelectedDocumentsStateFromApiCall(docType);
        }
    }

    // docType is document name as string, singular form
    updateSelectedDocumentsStateFromApiCall(docType: string) {
        console.log("in main function, docType is", docType);
        let docTypeToLower = docType.toLowerCase();
        //console.log("docType is:", docType);
        let username = "test2";

        let url = `${environment.baseApiBackendUrl}/rest/${docTypeToLower}s/get/${username}`;

        this.httpDocsCall = this.httpClient
            .get(url)
            .pipe(
                map(ud => {
                    console.log("in map, ud is:", ud);
                    let ds = ud["user" + docType + "s"];

                    this.store.updateUserDocuments(docType, ds);
                    this.processDocuments(ds, docType);

                    return ud;
                }),
                tap()
            )
            .subscribe();

        //setTimeout(() => this.httpDocsCall.unsubscribe(), 1000);
    }

    processDocuments(ds: EvahubDocument[], dt: string) {
        console.log("ds is:", ds);
        console.log("dt is:", dt);

        const dtToLower = dt.toLowerCase();
        const menuOptions = ds.map(d => {
            let doc;
            switch (dtToLower) {
                case "log":
                    doc = new Log();

                    //console.log("is a log");
                    break;
                case "report":
                    doc = new Report();
                    //console.log("is a report");
                    break;
                case "check":
                    doc = new Check();
                    //console.log("is a check");
                    break;
            }

            Object.keys(d).forEach(p => {
                //
                doc[p] = d[p];
            });

            doc.documentType = EvahubDocumentTypeDictionary[dt];

            console.log("doc is:", doc);
            console.log("getDocumentId() is:", doc.getDocumentId());
            console.log("getDocumentName() is:", doc.getDocumentName());

            let mo: EvahubSidenavMenuOption = {
                id: doc.getDocumentId(),
                label: doc.getDocumentName()
            };
            return mo;
        });

        console.log("menuOptions are:", menuOptions);

        this.store.updateSidenavMenuOptions(menuOptions);

        this.store.updateSelectedUserDocument(dt, ds[0]);
    }

    ngOnDestroy() {
        this.docSelectedSub.unsubscribe();
        this.currentPageIndexChanges$.unsubscribe();
    }
}
